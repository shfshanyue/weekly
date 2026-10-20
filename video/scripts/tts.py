"""逐句合成周刊视频口播（本机 Qwen3-TTS），并用 Whisper 给出字级时间戳。

用法：video/.venv/bin/python video/scripts/tts.py video/episodes/weekly-N [--only <sceneId>] [--force]

产物写在 <期目录>/.work/tts/：每行一个 wav + alignment.json，按「文本 + 音色 + 参数」指纹缓存，
改一句只重合成那一句。汇总写到 <期目录>/.work/narration.json，供 build.mjs 排时间线。
"""

from __future__ import annotations

import argparse
import difflib
import hashlib
import json
import re
import shutil
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

VIDEO_DIR = Path(__file__).resolve().parent.parent
SENTENCE_GAP = 0.28
# Per-sentence trim: frames quieter than peak - TRIM_DB count as silence.
TRIM_DB = 40.0
TRIM_PAD_HEAD = 0.04
TRIM_PAD_TAIL = 0.08
EDGE_FADE = 0.008
# Normal speech is ~0.22 s per character before the speed-up; well above that means a runaway take.
MAX_SECONDS_PER_CHAR = 0.6
RUNAWAY_RETRIES = 4
MIN_MATCH_RATIO = 0.5
_SENTENCE = re.compile(r"[^。！？!?：:]+[。！？!?：:…”」』）)]*")
_CONTENT = re.compile(r"[\u3400-\u9fff0-9A-Za-z]")


def load_voice() -> dict:
    voice = json.loads((VIDEO_DIR / "voice.json").read_text(encoding="utf-8"))
    voice["speaker"] = voice.get("speaker") or ""
    voice["instruct"] = voice.get("instruct") or ""
    voice["speed"] = float(voice.get("speed") or 1.0)
    voice["top_p"] = float(voice.get("top_p") or 1.0)
    voice["clone_mode"] = voice.get("clone_mode") or "icl"
    if voice["clone_mode"] not in ("icl", "xvector"):
        sys.exit(f"voice.json clone_mode 只能是 icl 或 xvector：{voice['clone_mode']}")
    if voice["speaker"]:
        # Preset speaker: pronunciation comes from the model, not the clone reference.
        voice["ref_sha"] = ""
        voice["ref_text"] = ""
        return voice
    ref = Path(voice["ref_audio"])
    if not ref.is_file():
        sys.exit(f"参考音不存在：{ref}。先在 ai-interview-series 里跑 python -m av ref <BV号> --start --end，或改 video/voice.json")
    voice["ref_sha"] = hashlib.sha256(ref.read_bytes()).hexdigest()[:16]
    return voice


def split_sentences(text: str) -> list[str]:
    """Long inputs drift faster and thinner toward the end, so each sentence is generated on its own."""
    parts = [p.strip() for p in _SENTENCE.findall(text)]
    return [p for p in parts if p] or [text]


def fingerprint(say: str, voice: dict) -> str:
    payload = json.dumps(
        {k: voice[k] for k in ("model", "ref_sha", "ref_text", "temperature", "top_p", "clone_mode", "seed", "align_model", "speed", "speaker", "instruct")}
        | {"say": say, "gap": SENTENCE_GAP, "trim": [TRIM_DB, TRIM_PAD_HEAD, TRIM_PAD_TAIL, EDGE_FADE], "stretch": "rubberband-r3" if shutil.which("rubberband") else "atempo"},
        sort_keys=True,
        ensure_ascii=False,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


@lru_cache(maxsize=None)
def _model(path: str):
    from mlx_audio.tts.utils import load_model

    return load_model(model_path=path)


def synthesize(say: str, voice: dict, dest: Path) -> None:
    import numpy as np
    import soundfile as sf

    model = _model(voice["model"])
    sr = model.sample_rate
    gap = np.zeros(int(SENTENCE_GAP * sr), np.float32)
    pieces = []
    for k, sentence in enumerate(split_sentences(say)):
        pieces += ([gap] if k else []) + [_trim(_generate_sentence(model, sentence, voice), sr)]
    dest.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(dest), np.concatenate(pieces), sr)
    _apply_speed(dest, voice["speed"])


def _generate_sentence(model, sentence: str, voice: dict):
    """x-vector cloning sometimes never emits EOS and babbles until max_tokens; cap the length and reseed."""
    import mlx.core as mx
    import numpy as np

    chars = max(1, len(_CONTENT.findall(sentence)))
    for attempt in range(RUNAWAY_RETRIES):
        mx.random.seed(voice["seed"] + attempt)
        kwargs = {
            "text": sentence, "lang_code": "chinese", "temperature": voice["temperature"], "top_p": voice["top_p"],
            "max_tokens": 24 + 8 * chars,
        }
        if voice["speaker"]:
            kwargs["voice"] = voice["speaker"]
            if voice["instruct"]:
                kwargs["instruct"] = voice["instruct"]
        else:
            kwargs["ref_audio"] = voice["ref_audio"]
            # Without ref_text the Base model clones from the speaker embedding only (x-vector):
            # it keeps the timbre but not the reference's accent and prosody.
            if voice["clone_mode"] == "icl":
                kwargs["ref_text"] = voice["ref_text"]
        chunks = [np.array(r.audio) for r in model.generate(**kwargs)]
        if not chunks:
            continue
        audio = np.concatenate(chunks).astype(np.float32)
        if len(audio) / model.sample_rate / chars <= MAX_SECONDS_PER_CHAR:
            return audio
        print(f"[tts] 第 {attempt + 1} 次合成停不下来，换种子重试：{sentence[:30]}", file=sys.stderr, flush=True)
    raise RuntimeError(f"合成 {RUNAWAY_RETRIES} 次都失控：{sentence[:40]}")


def _trim(audio, sr: int):
    """Cut the model's uneven lead-in/tail silence (and tail breaths) so every gap is the same length, then fade the edges to avoid clicks."""
    import numpy as np

    hop = int(0.01 * sr)
    frames = len(audio) // hop
    if frames < 3:
        return audio
    rms = np.sqrt(np.mean(audio[: frames * hop].reshape(frames, hop) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    voiced = np.flatnonzero(db > db.max() - TRIM_DB)
    if not len(voiced):
        return audio
    start = max(0, voiced[0] * hop - int(TRIM_PAD_HEAD * sr))
    end = min(len(audio), (voiced[-1] + 1) * hop + int(TRIM_PAD_TAIL * sr))
    out = audio[start:end].copy()
    fade = min(int(EDGE_FADE * sr), len(out) // 4)
    if fade:
        ramp = np.linspace(0.0, 1.0, fade, dtype=np.float32)
        out[:fade] *= ramp
        out[-fade:] *= ramp[::-1]
    return out


def _apply_speed(path: Path, speed: float) -> None:
    """Pitch-preserving time stretch. Qwen3-TTS does not implement its speed argument.

    Rubber Band's R3 engine keeps consonants crisp; ffmpeg atempo (WSOLA) smears them and
    sounds robotic above ~1.3x, so it is only the fallback.
    """
    if abs(speed - 1.0) < 0.01:
        return
    if speed <= 0:
        raise RuntimeError(f"语速必须大于 0：{speed}")
    tmp = path.with_suffix(".spd.wav")
    if shutil.which("rubberband"):
        subprocess.run(["rubberband", "-q", "-3", "-T", f"{speed:.4f}", str(path), str(tmp)], check=True, stdout=subprocess.DEVNULL)
        tmp.replace(path)
        return
    filters = []
    remain = speed
    while remain > 2.0:
        filters.append("atempo=2.0")
        remain /= 2.0
    while remain < 0.5:
        filters.append("atempo=0.5")
        remain /= 0.5
    filters.append(f"atempo={remain:.4f}")
    tmp = path.with_suffix(".spd.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(path), "-filter:a", ",".join(filters), str(tmp)],
        check=True,
    )
    tmp.replace(path)


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def even_split(text: str, dur: float) -> dict:
    chars = list(text) or ["…"]
    step = dur / len(chars)
    return {"chars": chars, "start": [round(i * step, 3) for i in range(len(chars))], "end": [round((i + 1) * step, 3) for i in range(len(chars))], "ratio": 0.0}


def align(say: str, audio: Path, dur: float, model: str) -> dict:
    """Script text is canonical; Whisper only supplies the times."""
    best = None
    # The script as initial_prompt usually helps, but on short clips Whisper sometimes
    # echoes the prompt instead of transcribing; retry without it before giving up.
    for prompt in (say, None):
        result = _align_once(say, audio, dur, model, prompt)
        if best is None or result["ratio"] > best["ratio"]:
            best = result
        if best["ratio"] >= 0.8:
            break
    if best["ratio"] < MIN_MATCH_RATIO:
        print(f"[align] {audio.name} 匹配度 {best['ratio']:.2f}，退回均分；建议试听", file=sys.stderr)
        return even_split(say, dur)
    return best


def _align_once(say: str, audio: Path, dur: float, model: str, prompt: str | None) -> dict:
    import mlx_whisper

    result = mlx_whisper.transcribe(str(audio), path_or_hf_repo=model, language="zh", word_timestamps=True, initial_prompt=prompt)
    words = [w for seg in result.get("segments", []) for w in seg.get("words", [])]
    heard = []
    for w in words:
        piece = [c for c in str(w.get("word") or "") if _CONTENT.match(c)]
        if not piece:
            continue
        b, e = float(w.get("start", 0.0)), max(float(w.get("end", 0.0)), float(w.get("start", 0.0)))
        step = (e - b) / len(piece)
        heard += [(c.lower(), b + i * step, b + (i + 1) * step) for i, c in enumerate(piece)]
    chars = list(say)
    slots = [i for i, c in enumerate(chars) if _CONTENT.match(c)]
    if not slots or not heard:
        return even_split(say, dur)
    matcher = difflib.SequenceMatcher(None, [chars[i].lower() for i in slots], [h[0] for h in heard], autojunk=False)
    ratio = matcher.ratio()
    if ratio < MIN_MATCH_RATIO:
        return even_split(say, dur) | {"ratio": round(ratio, 3)}
    times: list[tuple[float, float] | None] = [None] * len(slots)
    for block in matcher.get_matching_blocks():
        for k in range(block.size):
            _, st, en = heard[block.b + k]
            times[block.a + k] = (st, en)
    k = 0
    while k < len(times):
        if times[k] is not None:
            k += 1
            continue
        run_end = k
        while run_end < len(times) and times[run_end] is None:
            run_end += 1
        left = times[k - 1][1] if k > 0 else 0.0
        right = times[run_end][0] if run_end < len(times) else max(dur, left)
        step = max(right - left, 0.0) / (run_end - k)
        for j in range(k, run_end):
            times[j] = (left + (j - k) * step, left + (j - k + 1) * step)
        k = run_end
    by_index = dict(zip(slots, times))
    starts, ends, last = [], [], 0.0
    for i in range(len(chars)):
        st, en = by_index.get(i, (last, last))
        last = en
        starts.append(round(st, 3))
        ends.append(round(en, 3))
    return {"chars": chars, "start": starts, "end": ends, "ratio": round(ratio, 3)}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("episode", type=Path)
    ap.add_argument("--only", help="只合成这个 scene id")
    ap.add_argument("--force", action="store_true", help="忽略缓存")
    args = ap.parse_args()
    ep_dir = args.episode.resolve()
    episode = json.loads((ep_dir / "episode.json").read_text(encoding="utf-8"))
    voice = load_voice()
    tts_dir = ep_dir / ".work" / "tts"
    tts_dir.mkdir(parents=True, exist_ok=True)

    summary = []
    for scene in episode["scenes"]:
        if args.only and scene["id"] != args.only:
            continue
        lines = []
        for n, line in enumerate(scene["lines"]):
            say = line.get("say") or line["text"]
            fp = fingerprint(say, voice)
            wav = tts_dir / f"{scene['id']}-{n:02d}-{fp}.wav"
            meta = wav.with_suffix(".align.json")
            if args.force or not wav.is_file() or not meta.is_file():
                print(f"[tts] {scene['id']}#{n} {say[:30]}…", file=sys.stderr, flush=True)
                synthesize(say, voice, wav)
                dur = duration(wav)
                meta.write_text(json.dumps(align(say, wav, dur, voice["align_model"]) | {"duration": dur}, ensure_ascii=False), encoding="utf-8")
            data = json.loads(meta.read_text(encoding="utf-8"))
            lines.append({"wav": str(wav.relative_to(ep_dir)), "align": str(meta.relative_to(ep_dir)), "duration": data["duration"], "ratio": data["ratio"]})
        summary.append({"id": scene["id"], "lines": lines})

    out = ep_dir / ".work" / "narration.json"
    if args.only and out.is_file():
        prev = {s["id"]: s for s in json.loads(out.read_text(encoding="utf-8"))["scenes"]}
        prev.update({s["id"]: s for s in summary})
        summary = [prev[s["id"]] for s in episode["scenes"] if s["id"] in prev]
    out.write_text(json.dumps({"scenes": summary}, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(l["duration"] for s in summary for l in s["lines"])
    low = [f"{s['id']}#{i}" for s in summary for i, l in enumerate(s["lines"]) if l["ratio"] < 0.8]
    print(f"[tts] {len(summary)} 段，口播净时长 {total:.1f}s；对齐匹配度偏低：{', '.join(low) or '无'}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
