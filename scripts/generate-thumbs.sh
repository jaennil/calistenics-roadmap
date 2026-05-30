#!/usr/bin/env bash
# Извлекает первый кадр каждого GIF и сохраняет как JPG-превью.
# Превью показываются по умолчанию, GIF подгружается при hover.
# Запускать из корня проекта: bash scripts/generate-thumbs.sh

set -u
cd "$(dirname "$0")/.." || exit 1

mkdir -p img/thumb

ok=0
for f in img/s*.gif; do
    id=$(basename "$f" .gif)
    out="img/thumb/${id}.jpg"
    if [[ -f "$out" ]]; then
        ok=$((ok+1))
        continue
    fi
    if magick "${f}[0]" -resize 200x200 -quality 82 "$out" 2>/dev/null; then
        ok=$((ok+1))
    else
        echo "FAIL $id"
    fi
done

echo "Generated: $ok thumbnails"
du -sh img/thumb/
