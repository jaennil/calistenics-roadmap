#!/usr/bin/env bash
# Качает статичные кадры с Wikimedia Commons и сохраняет как .gif
# Запускать из корня проекта: bash scripts/download-wiki-images.sh

set -u
cd "$(dirname "$0")/.." || exit 1

IMG_DIR="img"
mkdir -p "$IMG_DIR"

# <мой_id>:<имя_файла_на_Commons>
MAPPING=(
    "s2-17:Superman_exercise,_isometric_back_hyperextension.png"
    "s2-18:Figura_L-Sit_na_paraletkach.jpg"
    "s3-10:Front_lever_-_Serhii_Solodkyi_73379.jpg"
    "s3-15:Figura_L-Sit_na_paraletkach.jpg"
    "s3-18:Planche.jpg"
    "s4-6:Planche.jpg"
    "s4-7:Front_lever_-_Serhii_Solodkyi_73379.jpg"
    "s4-8:Back_lever_on_gymnastics_rings.jpg"
    "s4-9:West_Point_male_gymnast_L-sit.jpg"
    "s5-2:Planche.jpg"
    "s5-3:Front_lever_-_Serhii_Solodkyi_73379.jpg"
    "s5-4:Back_lever_being_performed_outdoors.png"
    "s1-12:Calf-raises-2.png"
    "s3-3:Dand_(Basic).gif"
    "s4-5:Dand_(Basic).gif"
    "s5-5:Human_Flag_by_Romans_Janovics_in_Daugavpils,_Latvia.jpg"
    "s5-12:2019-06-29_1st_FIG_Artistic_Gymnastics_JWCH_Men's_Apparatus_finals_Still_rings_(Martin_Rulsch)_140.jpg"
    "s0-1:Jumpingjacks.gif"
    "s0-4:Bodyweight_Squats.gif"
    "s0-5:High_knees.gif"
    "s1-1:Liegestuetz02_ani_fcm.gif"
    "s3-9:Onearmpullup.gif"
    "s4-11:Onearmpullup.gif"
    "s5-7:Onearmpullup.gif"
)

ok=0
fail=0

for entry in "${MAPPING[@]}"; do
    my_id="${entry%%:*}"
    fname="${entry#*:}"
    out="$IMG_DIR/$my_id.gif"

    if [[ -f "$out" ]]; then
        echo "skip $my_id (already exists)"
        ok=$((ok+1))
        continue
    fi

    # Запрашиваем реальный URL файла через Commons API
    url=$(curl -sA "calisthenics-roadmap/1.0 (https://github.com/jaennil)" "https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=File:${fname}&prop=imageinfo&iiprop=url" \
        | jq -r '.query.pages | to_entries[0].value.imageinfo[0].url')

    if [[ -z "$url" || "$url" == "null" ]]; then
        echo "FAIL $my_id: cannot resolve $fname"
        fail=$((fail+1))
        continue
    fi

    tmp="/tmp/wiki-${my_id}"
    if ! curl -sA "calisthenics-roadmap/1.0 (https://github.com/jaennil)"fL "$url" -o "$tmp"; then
        echo "FAIL $my_id: download $url"
        fail=$((fail+1))
        continue
    fi

    # Конвертим в .gif с ресайзом и кропом до квадрата (4:3 → cover)
    if magick "$tmp" -resize 500x500^ -gravity center -extent 500x500 "$out"; then
        rm -f "$tmp"
        ok=$((ok+1))
        echo "OK   $my_id <- $fname ($(du -h "$out" | cut -f1))"
    else
        echo "FAIL $my_id: magick convert"
        fail=$((fail+1))
    fi
done

echo ""
echo "Done: $ok ok, $fail failed"
