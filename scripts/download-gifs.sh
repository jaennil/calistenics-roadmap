#!/usr/bin/env bash
# Скачивает кадры из free-exercise-db и собирает анимированные GIF (start↔end)
# Запускать из корня проекта: bash scripts/download-gifs.sh

set -u
cd "$(dirname "$0")/.." || exit 1

IMG_DIR="img"
mkdir -p "$IMG_DIR"

BASE="https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises"

# Маппинг: <мой_id> <папка_в_базе>
# Для упражнений отсутствующих в базе — отдельный список ниже
MAPPING=(
    "s0-2:Cat_Stretch"
    "s0-6:Plank"
    "s0-7:Incline_Push-Up"
    "s0-8:Bodyweight_Squat"
    "s1-2:Incline_Push-Up"
    "s1-3:Pushups"
    "s1-4:Dips_-_Triceps_Version"
    "s1-5:Inverted_Row"
    "s1-7:Scapular_Pull-Up"
    "s1-8:Pullups"
    "s1-9:Pullups"
    "s1-10:Bodyweight_Squat"
    "s1-11:Bodyweight_Walking_Lunge"
    "s1-13:Butt_Lift_Bridge"
    "s1-14:Plank"
    "s1-15:Side_Bridge"
    "s1-16:Flat_Bench_Lying_Leg_Raise"
    "s1-17:Crunches"
    "s2-1:Pushups"
    "s2-2:Push-Ups_-_Close_Triceps_Position"
    "s2-3:Push-Up_Wide"
    "s2-4:Dips_-_Triceps_Version"
    "s2-5:Handstand_Push-Ups"
    "s2-6:Pullups"
    "s2-7:Chin-Up"
    "s2-8:V-Bar_Pullup"
    "s2-9:Inverted_Row"
    "s2-10:Wide-Grip_Rear_Pull-Up"
    "s2-11:Split_Squats"
    "s2-12:Freehand_Jump_Squat"
    "s2-15:Hanging_Pike"
    "s3-1:Single-Arm_Push-Up"
    "s3-4:Dips_-_Triceps_Version"
    "s3-5:Handstand_Push-Ups"
    "s3-6:Pullups"
    "s3-13:Bench_Jump"
    "s3-16:Hanging_Leg_Raise"
    "s4-4:Handstand_Push-Ups"
)

ok=0
fail=0

for entry in "${MAPPING[@]}"; do
    my_id="${entry%%:*}"
    db_id="${entry#*:}"
    out="$IMG_DIR/$my_id.gif"

    if [[ -f "$out" ]]; then
        echo "skip $my_id (already exists)"
        ok=$((ok+1))
        continue
    fi

    tmp0="/tmp/${my_id}-0.jpg"
    tmp1="/tmp/${my_id}-1.jpg"

    echo "fetch $my_id <- $db_id"
    if ! curl -sfL "$BASE/$db_id/0.jpg" -o "$tmp0"; then
        echo "  FAIL: $db_id/0.jpg"
        fail=$((fail+1))
        continue
    fi
    if ! curl -sfL "$BASE/$db_id/1.jpg" -o "$tmp1"; then
        echo "  FAIL: $db_id/1.jpg"
        fail=$((fail+1))
        continue
    fi

    # Собираем анимированный GIF из двух кадров (500мс на кадр, бесконечный цикл, ресайз до 400px)
    if magick -delay 50 -loop 0 "$tmp0" "$tmp1" -resize 400x400 "$out" 2>/dev/null; then
        rm -f "$tmp0" "$tmp1"
        ok=$((ok+1))
        echo "  OK: $out ($(du -h "$out" | cut -f1))"
    else
        echo "  FAIL: magick combine"
        fail=$((fail+1))
    fi
done

echo ""
echo "Done: $ok ok, $fail failed"
