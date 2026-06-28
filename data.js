const CATEGORY_META = {
    "warmup":    { color: "#f97316", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>` },
    "endurance": { color: "#06b6d4", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M4 22l5-7 3-3 2 4 5 1"/><path d="M8 12l-1-4 3-2 4 2 1 4"/></svg>` },
    "push":      { color: "#ef4444", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="6" r="2"/><path d="M3 19h18M9 19l-2-7 5-2 4 3 4-1"/><path d="M7 12v-4"/></svg>` },
    "pull":      { color: "#8b5cf6", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18M5 5v2M19 5v2"/><circle cx="12" cy="11" r="2"/><path d="M12 13v4M9 17l3 4 3-4M9 11h6"/></svg>` },
    "legs":      { color: "#10b981", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M12 6v5l-3 5v5M12 11l3 5v5M9 21h6M14 21h6"/></svg>` },
    "core":      { color: "#eab308", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="8" r="2"/><path d="M3 18h18M8 18l3-7 5 1 5 6"/></svg>` },
    "skill":     { color: "#ec4899", icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M12 6v4M8 8l4 2 4-2M6 22l6-12 6 12M9 16h6"/></svg>` }
};

const ROADMAP = [
    {
        id: "stage-0",
        title: "Этап 0 — Подготовка тела",
        period: "0–4 недели",
        description: "Подготовка суставов, связок и базовой выносливости. Если ты вообще не тренировался — начни здесь.",
        categories: [
            {
                title: "Разминка и мобильность",
                kind: "warmup",
                exercises: [
                    { id: "s0-1", name: "Суставная разминка", target: "5–10 минут каждый день", tip: "Шея → плечи → локти → запястья → корпус → таз → колени → стопы" },
                    { id: "s0-2", name: "Кошка-корова", target: "2×10 повторений", tip: "Для подвижности позвоночника" },
                    { id: "s0-4", name: "Глубокий сед (Asian squat)", target: "3×30 секунд", tip: "Подвижность тазобедренных и голеностопов" },
                    { id: "s0-3", name: "Вис на турнике", target: "3×20 секунд", tip: "Растяжка плеч и хват" }
                ]
            },
            {
                title: "Базовая выносливость",
                kind: "endurance",
                exercises: [
                    { id: "s0-5", name: "Ходьба / лёгкий бег", target: "20–30 минут, 3 раза в неделю", tip: "Кардио-база" },
                    { id: "s0-6", name: "Планка", target: "3×20 секунд", tip: "Тело прямой линией от пяток до головы" },
                    { id: "s0-7", name: "Отжимания от стены", target: "3×15", tip: "Если обычные отжимания пока трудно" },
                    { id: "s0-8", name: "Приседания без веса", target: "3×15", tip: "Колени не сводить, пятки на полу" }
                ]
            }
        ]
    },
    {
        id: "stage-1",
        title: "Этап 1 — Новичок",
        period: "1–3 месяца",
        description: "Освоение базовых движений. Цель — научиться отжиматься, подтягиваться и приседать.",
        categories: [
            {
                title: "Грудь / Трицепс (отжимания)",
                kind: "push",
                exercises: [
                    { id: "s1-2", name: "Отжимания на возвышенности", target: "3×15", tip: "Руки на скамье/столе" },
                    { id: "s1-1", name: "Отжимания с колен", target: "3×12", tip: "Прямая линия от колен до головы" },
                    { id: "s1-3", name: "Классические отжимания", target: "3×10", tip: "Грудь касается пола, локти ~45°" },
                    { id: "s1-4", name: "Отжимания на брусьях (negatives)", target: "3×5", tip: "Медленный спуск 3–5 секунд" }
                ]
            },
            {
                title: "Спина (подтягивания)",
                kind: "pull",
                exercises: [
                    { id: "s1-6", name: "Вис на турнике", target: "3×30 секунд", tip: "Цель — 45 секунд" },
                    { id: "s1-7", name: "Скапулярные подтягивания", target: "3×10", tip: "Только лопатками без сгибания рук" },
                    { id: "s1-5", name: "Австралийские подтягивания", target: "3×10", tip: "Тело под низким турником/перекладиной" },
                    { id: "s1-8", name: "Негативные подтягивания", target: "3×5", tip: "Спуск 3–5 секунд из верхней точки" },
                    { id: "s1-9", name: "Подтягивания (1 повторение)", target: "1 чистое подтягивание", tip: "Подбородок выше перекладины" }
                ]
            },
            {
                title: "Ноги",
                kind: "legs",
                exercises: [
                    { id: "s1-13", name: "Ягодичный мост", target: "3×15", tip: "Сжимай ягодицы в верхней точке" },
                    { id: "s1-12", name: "Подъёмы на носки", target: "3×20", tip: "Икры" },
                    { id: "s1-10", name: "Приседания", target: "3×20", tip: "Грудь раскрыта, спина прямая" },
                    { id: "s1-11", name: "Выпады назад", target: "3×10 на ногу", tip: "Колено почти касается пола" }
                ]
            },
            {
                title: "Корпус",
                kind: "core",
                exercises: [
                    { id: "s1-17", name: "Скручивания", target: "3×15", tip: "Не тянуть шею руками" },
                    { id: "s1-14", name: "Планка", target: "3×45 секунд", tip: "" },
                    { id: "s1-15", name: "Боковая планка", target: "3×20 секунд на сторону", tip: "" },
                    { id: "s1-16", name: "Подъём ног лёжа", target: "3×12", tip: "Поясница прижата к полу" }
                ]
            }
        ]
    },
    {
        id: "stage-2",
        title: "Этап 2 — Базовый уровень",
        period: "3–6 месяцев",
        description: "Уверенное выполнение базы и переход к более сложным вариациям.",
        categories: [
            {
                title: "Жимы",
                kind: "push",
                exercises: [
                    { id: "s2-1", name: "Отжимания", target: "3×20", tip: "" },
                    { id: "s2-3", name: "Отжимания с широкой постановкой", target: "3×15", tip: "Акцент на грудь" },
                    { id: "s2-2", name: "Алмазные отжимания", target: "3×10", tip: "Кисти образуют ромб под грудью" },
                    { id: "s2-5", name: "Pike push-ups", target: "3×8", tip: "Подготовка к жиму в стойке на руках" },
                    { id: "s2-4", name: "Отжимания на брусьях", target: "3×8", tip: "Локти прижаты к корпусу" }
                ]
            },
            {
                title: "Тяги",
                kind: "pull",
                exercises: [
                    { id: "s2-9", name: "Австралийские (ноги на возвышении)", target: "3×12", tip: "" },
                    { id: "s2-8", name: "Подтягивания нейтральным хватом", target: "3×10", tip: "Параллельные ручки" },
                    { id: "s2-7", name: "Подтягивания обратным хватом", target: "3×10", tip: "Акцент на бицепс" },
                    { id: "s2-6", name: "Подтягивания прямым хватом", target: "3×8", tip: "Чистая техника, без рывков" },
                    { id: "s2-10", name: "Подтягивания широким хватом", target: "3×6", tip: "Акцент на широчайшие" }
                ]
            },
            {
                title: "Ноги",
                kind: "legs",
                exercises: [
                    { id: "s2-12", name: "Прыжковые приседания", target: "3×10", tip: "Взрывная сила" },
                    { id: "s2-11", name: "Болгарские сплит-приседания", target: "3×10 на ногу", tip: "Задняя нога на возвышении" },
                    { id: "s2-14", name: "Подъём на одну ногу", target: "3×8 на ногу", tip: "Без помощи рук" },
                    { id: "s2-13", name: "Шримп-приседания (assisted)", target: "3×5 на ногу", tip: "Подготовка к pistol squat" }
                ]
            },
            {
                title: "Корпус",
                kind: "core",
                exercises: [
                    { id: "s2-17", name: "Супермен", target: "3×15", tip: "Низ спины" },
                    { id: "s2-16", name: "Полые качели (hollow hold)", target: "3×30 секунд", tip: "Поясница прижата" },
                    { id: "s2-15", name: "Подъём ног в висе (согнутых)", target: "3×10", tip: "Колени к груди" },
                    { id: "s2-18", name: "L-sit на полу/брусьях", target: "3×10 секунд", tip: "" }
                ]
            }
        ]
    },
    {
        id: "stage-3",
        title: "Этап 3 — Средний уровень",
        period: "6–12 месяцев",
        description: "Начало работы над сложными элементами и силовой выносливостью.",
        categories: [
            {
                title: "Жимы",
                kind: "push",
                exercises: [
                    { id: "s3-2", name: "Archer push-ups", target: "3×6 на сторону", tip: "Одна рука работает, вторая выпрямлена" },
                    { id: "s3-1", name: "Отжимания на одной руке (assisted)", target: "3×5 на руку", tip: "Вторая рука на скамье" },
                    { id: "s3-3", name: "Pseudo planche push-ups", target: "3×8", tip: "Кисти у пояса, корпус наклонён вперёд" },
                    { id: "s3-5", name: "Wall handstand hold", target: "3×30 секунд", tip: "Стойка у стены лицом или спиной" },
                    { id: "s3-4", name: "Отжимания на брусьях с весом", target: "3×8 с +10 кг", tip: "" },
                    { id: "s3-18", name: "Tuck planche hold", target: "3×15 секунд", tip: "Колени к груди, опора на руки" }
                ]
            },
            {
                title: "Тяги",
                kind: "pull",
                exercises: [
                    { id: "s3-8", name: "Подтягивания до груди", target: "3×6", tip: "Грудь касается перекладины" },
                    { id: "s3-6", name: "Подтягивания с весом", target: "3×6 с +10 кг", tip: "" },
                    { id: "s3-10", name: "Front lever tuck hold", target: "3×15 секунд", tip: "Колени к груди, тело параллельно полу" },
                    { id: "s3-7", name: "Archer pull-ups", target: "3×4 на сторону", tip: "Подготовка к подтягиванию на одной руке" },
                    { id: "s3-9", name: "Negatives one-arm pull-up", target: "3×3 на руку", tip: "Медленный спуск" }
                ]
            },
            {
                title: "Ноги",
                kind: "legs",
                exercises: [
                    { id: "s3-13", name: "Прыжки на возвышение", target: "3×8", tip: "Box jumps" },
                    { id: "s3-11", name: "Pistol squat (assisted)", target: "3×5 на ногу", tip: "Держась за опору" },
                    { id: "s3-12", name: "Pistol squat", target: "3×3 на ногу", tip: "Без опоры" },
                    { id: "s3-14", name: "Nordic curl (negative)", target: "3×5", tip: "Бицепс бедра, спуск 3–5 секунд" }
                ]
            },
            {
                title: "Корпус",
                kind: "core",
                exercises: [
                    { id: "s3-15", name: "L-sit", target: "3×20 секунд", tip: "Ноги прямые параллельно полу" },
                    { id: "s3-16", name: "Подъём прямых ног в висе", target: "3×8", tip: "Ноги до перекладины" },
                    { id: "s3-17", name: "Dragon flag (negative)", target: "3×5", tip: "Медленный спуск" }
                ]
            }
        ]
    },
    {
        id: "stage-4",
        title: "Этап 4 — Продвинутый уровень",
        period: "1–2 года",
        description: "Освоение классических элементов калистеники: muscle-up, handstand, advanced tuck.",
        categories: [
            {
                title: "Жимы",
                kind: "push",
                exercises: [
                    { id: "s4-3", name: "Freestanding handstand", target: "3×15 секунд", tip: "Без стены" },
                    { id: "s4-4", name: "Handstand push-up (у стены)", target: "3×5", tip: "" },
                    { id: "s4-5", name: "Pseudo planche push-ups (глубокие)", target: "3×8", tip: "Лопатки протрактированы" },
                    { id: "s4-6", name: "Advanced tuck planche", target: "3×15 секунд", tip: "Спина круглая, ноги подтянуты" }
                ]
            },
            {
                title: "Тяги",
                kind: "pull",
                exercises: [
                    { id: "s4-1", name: "Muscle-up (negative)", target: "3×3", tip: "Медленный спуск из верхней точки" },
                    { id: "s4-2", name: "Muscle-up", target: "3×3", tip: "Чистый, без рывка ногами" },
                    { id: "s4-11", name: "Подтягивания на одной руке (assisted)", target: "3×3 на руку", tip: "Помощь второй рукой держа за запястье" },
                    { id: "s4-12", name: "Front lever raises (tuck)", target: "3×6", tip: "" },
                    { id: "s4-13", name: "Typewriter pull-ups", target: "3×4 на сторону", tip: "Передвижение в верхней точке" },
                    { id: "s4-7", name: "Advanced tuck front lever", target: "3×15 секунд", tip: "" },
                    { id: "s4-8", name: "Back lever (tuck)", target: "3×10 секунд", tip: "" }
                ]
            },
            {
                title: "Корпус",
                kind: "core",
                exercises: [
                    { id: "s4-9", name: "L-sit на брусьях", target: "3×30 секунд", tip: "" },
                    { id: "s4-10", name: "Dragon flag", target: "3×5", tip: "Полный контроль" }
                ]
            }
        ]
    },
    {
        id: "stage-5",
        title: "Этап 5 — Элита",
        period: "2+ года",
        description: "Топ-элементы калистеники. Требуют системного и долгого подхода. Многие требуют доступа к кольцам.",
        categories: [
            {
                title: "Жимы — элита",
                kind: "push",
                exercises: [
                    { id: "s5-1", name: "Straddle planche", target: "3×10 секунд", tip: "Ноги разведены в стороны — облегчённая версия full planche" },
                    { id: "s5-15", name: "90-degree push-up hold", target: "3×5 секунд", tip: "Тело горизонтально, руки согнуты под 90°" },
                    { id: "s5-17", name: "One-arm handstand", target: "1×5 секунд", tip: "Стойка на одной руке" },
                    { id: "s5-16", name: "Press to handstand", target: "3×3", tip: "Выход в стойку на руках без прыжка, через L-sit/straddle" },
                    { id: "s5-9", name: "Handstand push-up freestanding", target: "3×3", tip: "Без стены, полная амплитуда" },
                    { id: "s5-20", name: "Tiger bend press", target: "3×3", tip: "Жим в стойку из позиции на предплечьях" },
                    { id: "s5-21", name: "Russian dip", target: "3×3", tip: "Отжимание на брусьях с переходом через предплечья" },
                    { id: "s5-22", name: "Korean dip", target: "3×3", tip: "Отжимание на брусьях лицом назад" },
                    { id: "s5-8", name: "One-arm push-up", target: "3×5 на руку", tip: "Без поворота корпуса" },
                    { id: "s5-2", name: "Full planche", target: "3×5 секунд", tip: "Тело параллельно полу, ноги вместе" },
                    { id: "s5-10", name: "Planche push-up", target: "3×3", tip: "Отжимание в планше" },
                    { id: "s5-24", name: "Inverted cross", target: "1×3 секунды", tip: "Перевёрнутый железный крест на кольцах" },
                    { id: "s5-23", name: "Victorian cross", target: "1×3 секунды", tip: "Maltese в обратном положении — лицом вниз" },
                    { id: "s5-6", name: "Maltese (assisted)", target: "3×5 секунд", tip: "Тело параллельно полу, руки в стороны, на кольцах" }
                ]
            },
            {
                title: "Тяги — элита",
                kind: "pull",
                exercises: [
                    { id: "s5-7", name: "One-arm pull-up", target: "1 чистое повторение", tip: "Король калистеники" },
                    { id: "s5-5", name: "Human flag", target: "3×8 секунд", tip: "Тело горизонтально, опора на вертикальный шест" },
                    { id: "s5-4", name: "Full back lever", target: "3×10 секунд", tip: "Лицом вниз, тело параллельно полу" },
                    { id: "s5-3", name: "Full front lever", target: "3×10 секунд", tip: "Лицом вверх, тело параллельно полу" },
                    { id: "s5-11", name: "Front lever pull-up", target: "3×3", tip: "Подтягивание из позиции front lever" },
                    { id: "s5-19", name: "Back lever pull-up", target: "3×3", tip: "Подтягивание из back lever" },
                    { id: "s5-25", name: "Reverse muscle-up", target: "1 чистое повторение", tip: "Опускание из muscle-up в полный передний рычаг" },
                    { id: "s5-18", name: "Hefesto", target: "1 чистое повторение", tip: "Обратный muscle-up — выход из back lever" },
                    { id: "s5-12", name: "Iron cross", target: "3×5 секунд", tip: "Железный крест на кольцах" }
                ]
            },
            {
                title: "Корпус — элита",
                kind: "core",
                exercises: [
                    { id: "s5-13", name: "V-sit", target: "3×5 секунд", tip: "Продвинутый L-sit — ноги выше уровня головы" },
                    { id: "s5-14", name: "Manna", target: "3×3 секунды", tip: "Из V-sit прогиб назад с опорой на руки" }
                ]
            }
        ]
    }
];

const EXERCISES_WITH_GIF = new Set(
    ROADMAP.flatMap(s => s.categories.flatMap(c => c.exercises.map(e => e.id)))
);
