#!/usr/bin/env bash
# Качает точные GIF из fitnessprogramer.com по маппингу на каждое из 99 упражнений.
# Личный pet-проект, не коммерческое использование.
# Запускать из корня проекта: bash scripts/download-fp-gifs.sh

set -u
cd "$(dirname "$0")/.." || exit 1

UA="Mozilla/5.0 (calisthenics-roadmap/1.0)"
IMG_DIR="img"
mkdir -p "$IMG_DIR"

# Полный маппинг: <мой_id>|<URL на fitnessprogramer>
MAPPING=(
    # Stage 0 — Подготовка
    "s0-1|https://fitnessprogramer.com/wp-content/uploads/2021/05/Jumping-jack.gif"
    "s0-2|https://fitnessprogramer.com/wp-content/uploads/2021/06/abdominal-stretch.gif"
    "s0-3|https://fitnessprogramer.com/wp-content/uploads/2021/02/dead-hang-360x360.png"
    "s0-4|https://fitnessprogramer.com/wp-content/uploads/2021/05/Bodyweight-Squat.gif"
    "s0-5|https://fitnessprogramer.com/wp-content/uploads/2021/08/High-Knee-Run.gif"
    "s0-6|https://fitnessprogramer.com/wp-content/uploads/2021/02/plank.gif"
    "s0-7|https://fitnessprogramer.com/wp-content/uploads/2021/04/Wall-Push-ups.gif"
    "s0-8|https://fitnessprogramer.com/wp-content/uploads/2021/05/Bodyweight-Squat.gif"

    # Stage 1 — Новичок
    "s1-1|https://fitnessprogramer.com/wp-content/uploads/2022/01/Kneeling-Push-up.gif"
    "s1-2|https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif"
    "s1-3|https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif"
    "s1-4|https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif"
    "s1-5|https://fitnessprogramer.com/wp-content/uploads/2021/06/Inverted-Row.gif"
    "s1-6|https://fitnessprogramer.com/wp-content/uploads/2021/02/dead-hang-360x360.png"
    "s1-7|https://fitnessprogramer.com/wp-content/uploads/2022/01/Scapula-Pull-up.gif"
    "s1-8|https://fitnessprogramer.com/wp-content/uploads/2021/04/Assisted-Pull-up.gif"
    "s1-9|https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif"
    "s1-10|https://fitnessprogramer.com/wp-content/uploads/2021/05/Bodyweight-Squat.gif"
    "s1-11|https://fitnessprogramer.com/wp-content/uploads/2023/07/bodyweight-lunges.gif"
    "s1-12|https://fitnessprogramer.com/wp-content/uploads/2021/06/Standing-Calf-Raise.gif"
    "s1-13|https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge-.gif"
    "s1-14|https://fitnessprogramer.com/wp-content/uploads/2021/02/plank.gif"
    "s1-15|https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank-1-360x360.png"
    "s1-16|https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif"
    "s1-17|https://fitnessprogramer.com/wp-content/uploads/2015/11/Crunch.gif"

    # Stage 2 — Базовый
    "s2-1|https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif"
    "s2-2|https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-up.gif"
    "s2-3|https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif"
    "s2-4|https://fitnessprogramer.com/wp-content/uploads/2022/01/Straight-Bar-Dip.gif"
    "s2-5|https://fitnessprogramer.com/wp-content/uploads/2021/06/Pike-Push-up.gif"
    "s2-6|https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif"
    "s2-7|https://fitnessprogramer.com/wp-content/uploads/2021/03/Chin-Up.gif"
    "s2-8|https://fitnessprogramer.com/wp-content/uploads/2021/04/Close-Grip-Chin-Up.gif"
    "s2-9|https://fitnessprogramer.com/wp-content/uploads/2021/06/Inverted-Row.gif"
    "s2-10|https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif"
    "s2-11|https://fitnessprogramer.com/wp-content/uploads/2022/02/Bodyweight-Bulgarian-Split-Squat.gif"
    "s2-12|https://fitnessprogramer.com/wp-content/uploads/2021/02/SNAP-JUMPS.gif"
    "s2-13|https://fitnessprogramer.com/wp-content/uploads/2021/02/shrimp-squats.gif"
    "s2-14|https://fitnessprogramer.com/wp-content/uploads/2021/02/Step-up.gif"
    "s2-15|https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Knee-Raises.gif"
    "s2-16|https://fitnessprogramer.com/wp-content/uploads/2021/02/HollowHold-360x360.png"
    "s2-17|https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-exercise.gif"
    "s2-18|https://fitnessprogramer.com/wp-content/uploads/2021/09/L-Sit.gif"

    # Stage 3 — Средний
    "s3-1|https://fitnessprogramer.com/wp-content/uploads/2022/01/One-Arm-Push-Ups-With-Support.gif"
    "s3-2|https://fitnessprogramer.com/wp-content/uploads/2022/07/Archer-Push-Up.gif"
    "s3-3|https://fitnessprogramer.com/wp-content/uploads/2022/07/Planche-Push-Up.gif"
    "s3-4|https://fitnessprogramer.com/wp-content/uploads/2022/01/Straight-Bar-Dip.gif"
    "s3-5|https://fitnessprogramer.com/wp-content/uploads/2022/12/wall-walk-muscles.gif"
    "s3-6|https://fitnessprogramer.com/wp-content/uploads/2021/04/Weighted-Pull-up.gif"
    "s3-7|https://fitnessprogramer.com/wp-content/uploads/2022/01/Archer-Pull-up.gif"
    "s3-8|https://fitnessprogramer.com/wp-content/uploads/2022/01/Toes-to-Bar.gif"
    "s3-9|https://fitnessprogramer.com/wp-content/uploads/2022/01/Weighted-One-Arm-Pull-up.gif"
    "s3-10|https://fitnessprogramer.com/wp-content/uploads/2023/06/Front-Lever-Pull-up.gif"
    "s3-11|https://fitnessprogramer.com/wp-content/uploads/2022/10/Supported-Pistol-Squat.gif"
    "s3-12|https://fitnessprogramer.com/wp-content/uploads/2021/02/Pistol-Squat.gif"
    "s3-13|https://fitnessprogramer.com/wp-content/uploads/2023/02/Box-Jump-1-to-2.gif"
    "s3-14|https://fitnessprogramer.com/wp-content/uploads/2021/06/Nordic-Hamstring-Curl.gif"
    "s3-15|https://fitnessprogramer.com/wp-content/uploads/2021/09/L-Sit.gif"
    "s3-16|https://fitnessprogramer.com/wp-content/uploads/2022/01/Toes-to-Bar.gif"
    "s3-17|https://fitnessprogramer.com/wp-content/uploads/2022/07/Leg-Raise-Dragon-Flag.gif"
    "s3-18|https://fitnessprogramer.com/wp-content/uploads/2023/06/Frog-Stand-1.gif"

    # Stage 4 — Продвинутый
    "s4-1|https://fitnessprogramer.com/wp-content/uploads/2021/05/Muscle-up-vertical-bar.gif"
    "s4-2|https://fitnessprogramer.com/wp-content/uploads/2021/05/Muscle-up-vertical-bar.gif"
    "s4-3|https://fitnessprogramer.com/wp-content/uploads/2021/02/handstand-holds.gif"
    "s4-4|https://fitnessprogramer.com/wp-content/uploads/2023/07/wall-supported-handstand-push-up.gif"
    "s4-5|https://fitnessprogramer.com/wp-content/uploads/2022/07/Planche-Push-Up.gif"
    "s4-6|https://fitnessprogramer.com/wp-content/uploads/2025/04/lean-planche-360x360.png"
    "s4-7|https://fitnessprogramer.com/wp-content/uploads/2023/06/Front-Lever-Pull-up.gif"
    "s4-8|https://fitnessprogramer.com/wp-content/uploads/2023/06/Back-Lever.gif"
    "s4-9|https://fitnessprogramer.com/wp-content/uploads/2021/09/L-Sit.gif"
    "s4-10|https://fitnessprogramer.com/wp-content/uploads/2022/07/Leg-Raise-Dragon-Flag.gif"
    "s4-11|https://fitnessprogramer.com/wp-content/uploads/2022/01/Weighted-One-Arm-Pull-up.gif"
    "s4-12|https://fitnessprogramer.com/wp-content/uploads/2023/06/Front-Lever-Pull-up.gif"
    "s4-13|https://fitnessprogramer.com/wp-content/uploads/2022/01/commander-pull-up.gif"

    # Stage 5 — Элита
    "s5-1|https://fitnessprogramer.com/wp-content/uploads/2022/08/Straddle-planche.gif"
    "s5-2|https://fitnessprogramer.com/wp-content/uploads/2025/04/Full-Planche.gif"
    "s5-3|https://fitnessprogramer.com/wp-content/uploads/2023/06/Front-Lever-Pull-up.gif"
    "s5-4|https://fitnessprogramer.com/wp-content/uploads/2023/06/Back-Lever.gif"
    "s5-5|https://fitnessprogramer.com/wp-content/uploads/2022/02/Human-Flag.gif"
    "s5-6|https://fitnessprogramer.com/wp-content/uploads/2022/07/Dumbbell-Iron-Cross.gif"
    "s5-7|https://fitnessprogramer.com/wp-content/uploads/2022/01/One-Arm-Chin-Up.gif"
    "s5-8|https://fitnessprogramer.com/wp-content/uploads/2021/09/Single-Arm-Push-up.gif"
    "s5-9|https://fitnessprogramer.com/wp-content/uploads/2021/06/handstand-push-up.gif"
    "s5-10|https://fitnessprogramer.com/wp-content/uploads/2022/07/Planche-Push-Up.gif"
    "s5-11|https://fitnessprogramer.com/wp-content/uploads/2023/06/Front-Lever-Pull-up.gif"
    "s5-12|https://fitnessprogramer.com/wp-content/uploads/2022/07/Dumbbell-Iron-Cross.gif"
    "s5-13|https://fitnessprogramer.com/wp-content/uploads/2021/09/L-Sit.gif"
    "s5-14|https://fitnessprogramer.com/wp-content/uploads/2021/09/L-Sit.gif"
    "s5-15|https://fitnessprogramer.com/wp-content/uploads/2022/07/Planche-Push-Up.gif"
    "s5-16|https://fitnessprogramer.com/wp-content/uploads/2021/02/handstand-holds.gif"
    "s5-17|https://fitnessprogramer.com/wp-content/uploads/2021/02/handstand-holds.gif"
    "s5-18|https://fitnessprogramer.com/wp-content/uploads/2021/05/Muscle-up-vertical-bar.gif"
    "s5-19|https://fitnessprogramer.com/wp-content/uploads/2023/06/Back-Lever.gif"
    "s5-20|https://fitnessprogramer.com/wp-content/uploads/2021/06/handstand-push-up.gif"
    "s5-21|https://fitnessprogramer.com/wp-content/uploads/2022/01/Impossible-Dips.gif"
    "s5-22|https://fitnessprogramer.com/wp-content/uploads/2022/01/Korean-Dips.gif"
    "s5-23|https://fitnessprogramer.com/wp-content/uploads/2022/07/Dumbbell-Iron-Cross.gif"
    "s5-24|https://fitnessprogramer.com/wp-content/uploads/2022/07/Dumbbell-Iron-Cross.gif"
    "s5-25|https://fitnessprogramer.com/wp-content/uploads/2021/05/Muscle-up-vertical-bar.gif"
)

ok=0
fail=0
total=${#MAPPING[@]}
echo "Total exercises: $total"

for entry in "${MAPPING[@]}"; do
    my_id="${entry%%|*}"
    url="${entry#*|}"
    out="$IMG_DIR/$my_id.gif"
    tmp="/tmp/fp-$my_id"

    if ! curl -sfLA "$UA" "$url" -o "$tmp"; then
        echo "FAIL $my_id: download $url"
        fail=$((fail+1))
        continue
    fi

    sz=$(stat -c%s "$tmp" 2>/dev/null || stat -f%z "$tmp")
    if [[ "$sz" -lt 500 ]]; then
        echo "FAIL $my_id: too small ($sz bytes) — probably 404"
        rm -f "$tmp"
        fail=$((fail+1))
        continue
    fi

    # Ресайз до 300×300 cover. PNG-стиллы и GIF-анимации одинаково.
    if magick "$tmp" -coalesce -resize 300x300^ -gravity center -extent 300x300 -layers Optimize "$out" 2>/dev/null; then
        rm -f "$tmp"
        ok=$((ok+1))
        printf "OK   %-5s -> %s\n" "$my_id" "$(du -h "$out" | cut -f1)"
    else
        echo "FAIL $my_id: magick convert"
        rm -f "$tmp"
        fail=$((fail+1))
    fi
done

echo ""
echo "Done: $ok / $total ok, $fail failed"
echo "Total size: $(du -sh "$IMG_DIR" | cut -f1)"
