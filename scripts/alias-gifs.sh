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
    # Расширение Элиты — статика
    [s5-13]=s4-9     # V-sit            <- L-sit на брусьях
    [s5-14]=s4-9     # Manna            <- L-sit
    [s5-15]=s5-2     # 90-degree pushup hold <- Planche
    # Расширение Элиты — сила
    [s5-16]=s4-3     # Press to handstand <- Freestanding handstand
    [s5-17]=s4-3     # One-arm handstand  <- Handstand
    [s5-18]=s4-1     # Hefesto            <- Muscle-up (обратный)
    [s5-19]=s5-4     # Back lever pull-up <- Back lever
    [s5-20]=s4-3     # Tiger bend press   <- Handstand
    # Расширение Элиты — кольца/динамика
    [s5-21]=s2-4     # Russian dip        <- Dips
    [s5-22]=s2-4     # Korean dip         <- Dips
    [s5-23]=s5-6     # Victorian cross    <- Maltese
    [s5-24]=s5-12    # Inverted cross     <- Iron cross
    [s5-25]=s4-1     # Reverse muscle-up  <- Muscle-up
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
