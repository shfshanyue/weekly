#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing and other participating engines).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs <url> [url ...]
 *   node scripts/submit-indexnow.mjs --sitemap
 *   pnpm indexnow -- https://weekly.shanyue.tech/weekly-62
 *
 * Env:
 *   INDEXNOW_KEY   optional override (default: key from public/{key}.txt)
 *   INDEXNOW_HOST  default weekly.shanyue.tech
 */

import { readFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const HOST = process.env.INDEXNOW_HOST || "weekly.shanyue.tech"
const ENDPOINT = "https://api.indexnow.org/indexnow"

function resolveKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim()
  const publicDir = join(root, "public")
  const files = readdirSync(publicDir).filter((f) =>
    /^[a-zA-Z0-9-]{8,128}\.txt$/.test(f)
  )
  for (const f of files) {
    const body = readFileSync(join(publicDir, f), "utf8").trim()
    const stem = f.slice(0, -4)
    if (body === stem) return stem
  }
  throw new Error(
    "No IndexNow key found. Put {key}.txt in public/ with the key as contents, or set INDEXNOW_KEY."
  )
}

function normalizeUrl(input) {
  const u = new URL(input, `https://${HOST}`)
  if (u.hostname !== HOST && u.hostname !== `www.${HOST}`) {
    throw new Error(`URL host must be ${HOST}: ${input}`)
  }
  u.protocol = "https:"
  u.hostname = HOST
  u.hash = ""
  // Keep trailing slash only for the homepage
  if (u.pathname !== "/" && u.pathname.endsWith("/")) {
    u.pathname = u.pathname.slice(0, -1)
  }
  return u.toString()
}

async function urlsFromSitemap() {
  const candidates = [
    join(root, "public", "sitemap-0.xml"),
    join(root, "public", "sitemap.xml")
  ]
  let xml = ""
  for (const p of candidates) {
    try {
      const text = readFileSync(p, "utf8")
      if (text.includes("<loc>")) {
        xml = text
        break
      }
    } catch {
      /* try next */
    }
  }
  if (!xml) {
    const res = await fetch(`https://${HOST}/sitemap-0.xml`)
    if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`)
    xml = await res.text()
  }
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) =>
    m[1].trim()
  )
  return [...new Set(locs.map(normalizeUrl))]
}

async function submit(urlList, key) {
  const keyLocation = `https://${HOST}/${key}.txt`
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation,
      urlList
    })
  })
  const text = await res.text()
  return { status: res.status, text, count: urlList.length, keyLocation }
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--")
  const useSitemap = args.includes("--sitemap")
  const rawUrls = args.filter((a) => a !== "--sitemap")
  const key = resolveKey()

  let urlList
  if (useSitemap) {
    urlList = await urlsFromSitemap()
  } else if (rawUrls.length) {
    urlList = [...new Set(rawUrls.map(normalizeUrl))]
  } else {
    console.error(
      "Pass one or more URLs, or --sitemap.\nExample: node scripts/submit-indexnow.mjs https://weekly.shanyue.tech/weekly-62"
    )
    process.exit(1)
  }

  if (!urlList.length) {
    console.error("No URLs to submit.")
    process.exit(1)
  }

  console.log(`Submitting ${urlList.length} URL(s) via IndexNow…`)
  const result = await submit(urlList, key)
  console.log(
    JSON.stringify({ ...result, sample: urlList.slice(0, 8) }, null, 2)
  )
  if (result.status !== 200 && result.status !== 202) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
