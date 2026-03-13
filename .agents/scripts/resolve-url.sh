#!/usr/bin/env bash
# 获取 URL 重定向后的最终地址
# 用法: ./resolve-url.sh <url> [url2] [url3] ...

for url in "$@"; do
  final=$(curl -Ls -o /dev/null -w '%{url_effective}' "$url")
  echo "$url -> $final"
done
