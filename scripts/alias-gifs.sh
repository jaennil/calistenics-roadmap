#!/usr/bin/env bash
# Для упражнений, у которых нет собственного публичного GIF,
# копируем GIF родственного движения (визуально-близкая прогрессия).
# Запускать ПОСЛЕ download-gifs.sh и download-wiki-images.sh.

set -u
cd "$(dirname "$0")/.." || exit 1

declare -A ALIASES=(
    [s0-3]=s1-7      # Вис на турнике     <- Скапулярные подтягивания (старт из виса)
    [s1-6]=s1-7      # Вис на турнике     <- то же
    [s2-13]=s3-11    # Шримп-приседания  <- Pistol squat (assisted)
    [s2-16]=s1-14    # Hollow hold       <- Plank (изометрия корпуса)
    [s3-2]=s3-1      # Archer push-up    <- One-arm push-up (assisted)
    [s3-7]=s5-7      # Archer pull-up    <- One-arm pull-up
    [s3-8]=s2-6      # Chest-to-bar      <- Pull-ups
    [s3-17]=s3-16    # Dragon flag (neg) <- Hanging leg raise
    [s4-10]=s3-16    # Dragon flag       <- Hanging leg raise
    [s4-12]=s3-10    # Front lever raise <- Front lever tuck
    [s4-13]=s2-6     # Typewriter pull   <- Pull-ups
    [s5-1]=s5-2      # Straddle planche  <- Full planche
    [s5-6]=s5-2      # Maltese           <- Planche (ближайшая статика)
    [s5-8]=s3-1      # One-arm push-up   <- Single-Arm Push-Up
    [s5-9]=s4-4      # HSPU freestanding <- HSPU у стены
    [s5-10]=s5-2     # Planche push-up   <- Planche
    [s5-11]=s5-3     # Front lever pull  <- Front lever
)

ok=0
fail=0
for dest in "${!ALIASES[@]}"; do
    src="${ALIASES[$dest]}"
    if [[ ! -f "img/${src}.gif" ]]; then
        echo "FAIL $dest: источник img/${src}.gif отсутствует"
        fail=$((fail+1))
        continue
    fi
    \cp -f "img/${src}.gif" "img/${dest}.gif"
    echo "OK   $dest <- $src"
    ok=$((ok+1))
done

echo ""
echo "Done: $ok aliased, $fail failed"
