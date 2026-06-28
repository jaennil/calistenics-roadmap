const STORAGE_KEY = "calisthenics-roadmap-progress";
const UI_KEY = "calisthenics-roadmap-ui";

function log(...args) {
    console.log("[roadmap]", ...args);
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            log("no saved progress, starting fresh");
            return {};
        }
        const parsed = JSON.parse(raw);
        log("loaded progress:", Object.keys(parsed).length, "completed exercises");
        return parsed;
    } catch (e) {
        log("failed to load progress:", e);
        return {};
    }
}

function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        log("progress saved:", Object.keys(progress).length, "exercises");
    } catch (e) {
        log("failed to save progress:", e);
    }
}

function loadUIState() {
    try {
        const raw = localStorage.getItem(UI_KEY);
        const saved = raw ? JSON.parse(raw) : {};
        return {
            expanded: Array.isArray(saved.expanded) ? saved.expanded : [],
            view: saved.view === "roadmap" ? "roadmap" : "current"
        };
    } catch (e) {
        return { expanded: [], view: "current" };
    }
}

function saveUIState(state) {
    try {
        localStorage.setItem(UI_KEY, JSON.stringify(state));
    } catch (e) {
        log("failed to save UI state:", e);
    }
}

let progress = loadProgress();
let uiState = loadUIState();
let activeExercise = null;

// Линейная прогрессия по `kind` категории через все этапы:
// последнее упражнение `push` этапа 1 → первое `push` этапа 2 и т.д.
const PROGRESSION = (() => {
    const map = {};
    const chainsByKind = {};

    ROADMAP.forEach(stage => {
        stage.categories.forEach(cat => {
            if (!chainsByKind[cat.kind]) chainsByKind[cat.kind] = [];
            cat.exercises.forEach(ex => {
                chainsByKind[cat.kind].push({ ex, stage, category: cat });
            });
        });
    });

    Object.entries(chainsByKind).forEach(([kind, chain]) => {
        const stageCount = new Set(chain.map(n => n.stage.id)).size;
        log(`progression chain "${kind}":`, chain.length, "exercises across", stageCount, "stages");
        chain.forEach((node, i) => {
            const prevNode = i > 0 ? chain[i - 1] : null;
            const nextNode = i < chain.length - 1 ? chain[i + 1] : null;
            map[node.ex.id] = {
                prev: prevNode ? prevNode.ex : null,
                prevStage: prevNode ? prevNode.stage : null,
                next: nextNode ? nextNode.ex : null,
                nextStage: nextNode ? nextNode.stage : null,
                stage: node.stage,
                category: node.category
            };
        });
    });

    return map;
})();

function isUnlocked(exerciseId) {
    const link = PROGRESSION[exerciseId];
    if (!link) return true;
    if (!link.prev) return true;
    return !!progress[link.prev.id];
}

function countExercises() {
    let total = 0;
    let done = 0;
    ROADMAP.forEach(stage => {
        stage.categories.forEach(cat => {
            cat.exercises.forEach(ex => {
                total += 1;
                if (progress[ex.id]) done += 1;
            });
        });
    });
    return { total, done };
}

function countStageExercises(stage) {
    let total = 0;
    let done = 0;
    stage.categories.forEach(cat => {
        cat.exercises.forEach(ex => {
            total += 1;
            if (progress[ex.id]) done += 1;
        });
    });
    return { total, done };
}

function updateGlobalProgress() {
    const { total, done } = countExercises();
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressText").textContent = `${done} из ${total} упражнений`;
    document.getElementById("progressPercent").textContent = pct + "%";
    log("global progress:", done, "/", total, `(${pct}%)`);
}

function updateStageProgress(stage) {
    const stageEl = document.getElementById(stage.id);
    if (!stageEl) return;
    const { total, done } = countStageExercises(stage);
    const progressEl = stageEl.querySelector(".stage-progress");
    if (progressEl) {
        progressEl.textContent = `${done} / ${total}`;
    }
    stageEl.classList.toggle("completed", done === total && total > 0);
}

function toggleExercise(exerciseId, stage) {
    const link = PROGRESSION[exerciseId];
    if (link && link.prev && !progress[link.prev.id] && !progress[exerciseId]) {
        log("blocked: prereq", link.prev.id, "not done");
        alert(`Сначала выполни: «${link.prev.name}»`);
        return;
    }

    if (progress[exerciseId]) {
        delete progress[exerciseId];
        log("unchecked:", exerciseId);
    } else {
        progress[exerciseId] = { completedAt: new Date().toISOString() };
        log("checked:", exerciseId);
    }
    saveProgress(progress);

    refreshExerciseStates();
    updateGlobalProgress();
    renderCurrentExercises();
    updateModalToggleBtn(exerciseId);
}

function refreshExerciseStates() {
    ROADMAP.forEach(stage => {
        stage.categories.forEach(cat => {
            cat.exercises.forEach(ex => {
                const done = !!progress[ex.id];
                const unlocked = isUnlocked(ex.id);
                document.querySelectorAll(`[data-exercise-id="${ex.id}"]`).forEach(el => {
                    el.classList.toggle("done", done);
                    el.classList.toggle("locked", !done && !unlocked);
                });
            });
        });
        updateStageProgress(stage);
    });
}

function getCurrentStage() {
    return ROADMAP.find(stage => {
        const { total, done } = countStageExercises(stage);
        return done < total;
    }) || null;
}

function renderCurrentExercises() {
    const container = document.getElementById("currentExercises");
    const stage = getCurrentStage();
    container.innerHTML = "";

    if (!stage) {
        document.getElementById("currentStageTitle").textContent = "Карта завершена";
        document.getElementById("currentStagePeriod").textContent = "Все этапы пройдены";
        document.getElementById("currentStageProgress").textContent = "100%";
        const empty = document.createElement("div");
        empty.className = "current-empty";
        empty.innerHTML = "<strong>Все упражнения выполнены</strong><span>Отметки можно изменить на вкладке «Вся карта».</span>";
        container.appendChild(empty);
        return;
    }

    const { total, done } = countStageExercises(stage);
    document.getElementById("currentStageTitle").textContent = stage.title.replace(/^Этап \d+ — /, "");
    document.getElementById("currentStagePeriod").textContent = stage.period;
    document.getElementById("currentStageProgress").textContent = `${done} / ${total}`;

    const seenKinds = new Set();
    const stageIdx = ROADMAP.indexOf(stage);

    stage.categories.forEach(category => {
        seenKinds.add(category.kind);
        renderKindSlot(container, category, stage);
    });

    ROADMAP.slice(0, stageIdx).forEach(prevStage => {
        prevStage.categories.forEach(category => {
            if (seenKinds.has(category.kind)) return;
            seenKinds.add(category.kind);
            renderKindSlot(container, category, stage);
        });
    });
}

function renderKindSlot(container, anchorCategory, currentStage) {
    const found = findActiveInChain(anchorCategory.kind, ROADMAP[0]);
    if (found) {
        appendCurrentItem(container, found.exercise, found.category, found.stage, currentStage);
        return;
    }
    appendCompleteItem(container, anchorCategory);
}

function appendCompleteItem(container, category) {
    const meta = CATEGORY_META[category.kind] || { icon: "", color: "#888" };
    const item = document.createElement("article");
    item.className = "current-item current-item--complete";

    const label = document.createElement("div");
    label.className = "current-category";
    label.style.setProperty("--cat-color", meta.color);
    label.innerHTML = `<span class="category-icon">${meta.icon}</span><span></span>`;
    label.querySelectorAll("span")[1].textContent = category.title;

    const card = document.createElement("div");
    card.className = "current-complete-card";
    card.innerHTML = `<span class="current-complete-check">✓</span><span>Все упражнения этой группы закрыты</span>`;
    item.appendChild(label);
    item.appendChild(card);
    container.appendChild(item);
}

// Когда «нативная» цепочка kind заканчивается, ищем продолжение
// в более поздних skill-категориях — там push/pull прячутся под общим skill.
const KIND_KEYWORDS = {
    push:  ["push-up", "push up", "pushup", "planche", "handstand", "hspu", "press", "dip", "tiger bend", "maltese", "iron cross", "victorian", "90-degree"],
    pull:  ["pull-up", "pullup", "lever", "muscle-up", "muscle up", "flag", "hefesto", "chin-up"],
    legs:  ["squat", "lunge", "pistol", "shrimp", "calf", "nordic", "glute"],
    core:  ["plank", "l-sit", "v-sit", "manna", "dragon", "hollow", "leg raise", "crunch", "side bridge"]
};

function findActiveInChain(kind, fromStage) {
    const fromIdx = ROADMAP.indexOf(fromStage);
    for (let i = fromIdx; i < ROADMAP.length; i++) {
        const cat = ROADMAP[i].categories.find(c => c.kind === kind);
        if (!cat) continue;
        const ex = cat.exercises.find(e => !progress[e.id] && isUnlocked(e.id));
        if (ex) return { exercise: ex, category: cat, stage: ROADMAP[i] };
    }
    const kws = KIND_KEYWORDS[kind] || [];
    if (!kws.length) return null;
    for (let i = fromIdx; i < ROADMAP.length; i++) {
        for (const cat of ROADMAP[i].categories) {
            if (cat.kind === kind) continue;
            for (const ex of cat.exercises) {
                if (progress[ex.id] || !isUnlocked(ex.id)) continue;
                const n = ex.name.toLowerCase();
                if (kws.some(k => n.includes(k))) {
                    return { exercise: ex, category: cat, stage: ROADMAP[i] };
                }
            }
        }
    }
    return null;
}

function appendCurrentItem(container, exercise, category, stage, currentStage) {
    const meta = CATEGORY_META[category.kind] || { icon: "", color: "#888" };
    const item = document.createElement("article");
    item.className = "current-item";

    const label = document.createElement("div");
    label.className = "current-category";
    label.style.setProperty("--cat-color", meta.color);
    const aheadHint = stage.id !== currentStage.id
        ? ` <span class="current-stage-hint">· Этап ${stage.id.replace("stage-", "")}</span>`
        : "";
    label.innerHTML = `<span class="category-icon">${meta.icon}</span><span></span>${aheadHint}`;
    label.querySelectorAll("span")[1].textContent = category.title;

    const card = renderExercise(exercise, category, stage);
    card.classList.add("current-exercise");
    item.appendChild(label);
    item.appendChild(card);
    container.appendChild(item);
}

function setView(view) {
    uiState.view = view === "roadmap" ? "roadmap" : "current";
    saveUIState(uiState);

    document.querySelectorAll(".view-tab").forEach(tab => {
        const active = tab.dataset.view === uiState.view;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });
    document.getElementById("currentView").hidden = uiState.view !== "current";
    document.getElementById("roadmapView").hidden = uiState.view !== "roadmap";
}

function toggleStage(stageId) {
    const stageEl = document.getElementById(stageId);
    if (!stageEl) return;
    const isExpanded = stageEl.classList.toggle("expanded");
    if (isExpanded) {
        if (!uiState.expanded.includes(stageId)) {
            uiState.expanded.push(stageId);
        }
    } else {
        uiState.expanded = uiState.expanded.filter(id => id !== stageId);
    }
    saveUIState(uiState);
    log("stage toggled:", stageId, "expanded:", isExpanded);
}

function buildFallback(meta, isLarge) {
    const fallback = document.createElement("div");
    fallback.className = isLarge ? "modal-media-fallback" : "exercise-media-fallback";
    fallback.style.setProperty("--cat-color", meta.color);
    fallback.style.color = meta.color;
    fallback.innerHTML = meta.icon;
    return fallback;
}

function buildMedia(exercise, category, isLarge) {
    const meta = CATEGORY_META[category.kind] || { icon: "", color: "#888" };
    if (EXERCISES_WITH_GIF.has(exercise.id)) {
        const img = document.createElement("img");
        img.src = `img/${exercise.id}.gif`;
        img.alt = exercise.name;
        img.loading = "lazy";
        img.onerror = () => {
            log("image failed to load:", exercise.id);
            img.replaceWith(buildFallback(meta, isLarge));
        };
        return img;
    }
    return buildFallback(meta, isLarge);
}

function openModal(exercise, category, stage) {
    activeExercise = { exercise, category, stage };
    log("modal open:", exercise.id);

    const meta = CATEGORY_META[category.kind] || { icon: "💪", color: "#888" };

    const mediaEl = document.getElementById("modalMedia");
    mediaEl.innerHTML = "";
    mediaEl.appendChild(buildMedia(exercise, category, true));

    document.getElementById("modalCategory").innerHTML = `<span class="modal-cat-icon" style="color:${meta.color}">${meta.icon}</span> ${category.title}`;
    document.getElementById("modalTitle").textContent = exercise.name;
    document.getElementById("modalTarget").textContent = exercise.target;
    document.getElementById("modalTip").textContent = exercise.tip || "";

    const link = PROGRESSION[exercise.id];
    const requiresEl = document.getElementById("modalRequires");
    const unlockEl = document.getElementById("modalUnlock");
    const stageHint = (linkStage) => linkStage && linkStage.id !== stage.id
        ? ` <span class="modal-stage-hint">(${linkStage.title.replace(/^Этап \d+ — /, "Этап " + linkStage.id.replace("stage-", "") + ", ")})</span>`
        : "";
    if (link && link.prev) {
        const prevDone = !!progress[link.prev.id];
        requiresEl.innerHTML = `<span class="modal-requires-label">Требует</span>` +
            `<span class="modal-unlock-name">${link.prev.name}</span>${stageHint(link.prevStage)} — ${prevDone ? "выполнено ✓" : "сначала закрой это"}`;
    } else {
        requiresEl.innerHTML = "";
    }
    if (link && link.next) {
        unlockEl.innerHTML = `<span class="modal-unlock-label">Откроет следующее</span>` +
            `<span class="modal-unlock-name">${link.next.name}</span>${stageHint(link.nextStage)} — ${link.next.target}`;
    } else {
        unlockEl.innerHTML = "";
    }

    const videoLink = document.getElementById("modalVideo");
    videoLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " technique calisthenics")}`;

    updateModalToggleBtn(exercise.id);

    document.getElementById("modalBackdrop").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("modalBackdrop").classList.remove("open");
    document.body.style.overflow = "";
    activeExercise = null;
    log("modal closed");
}

function updateModalToggleBtn(exerciseId) {
    if (!activeExercise || activeExercise.exercise.id !== exerciseId) return;
    const btn = document.getElementById("modalToggle");
    const isDone = !!progress[exerciseId];
    btn.textContent = isDone ? "✓ Выполнено — снять отметку" : "Отметить выполненным";
    btn.classList.toggle("done", isDone);
}

function renderExercise(exercise, category, stage) {
    const isDone = !!progress[exercise.id];
    const unlocked = isUnlocked(exercise.id);

    const el = document.createElement("button");
    el.className = "exercise";
    if (isDone) el.classList.add("done");
    if (!isDone && !unlocked) el.classList.add("locked");
    el.dataset.exerciseId = exercise.id;
    el.type = "button";

    const media = document.createElement("span");
    media.className = "exercise-media";
    const img = document.createElement("img");
    img.src = `img/thumb/${exercise.id}.jpg`;
    img.dataset.thumb = `img/thumb/${exercise.id}.jpg`;
    img.dataset.gif = `img/${exercise.id}.gif`;
    img.alt = exercise.name;
    img.loading = "lazy";
    img.draggable = false;
    media.appendChild(img);

    const check = document.createElement("span");
    check.className = "exercise-check";
    check.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleExercise(exercise.id, stage);
    });

    const body = document.createElement("span");
    body.className = "exercise-body";
    const name = document.createElement("span");
    name.className = "exercise-name";
    name.textContent = exercise.name;
    const target = document.createElement("span");
    target.className = "exercise-target";
    target.textContent = exercise.target;
    body.appendChild(name);
    body.appendChild(target);

    const row = document.createElement("span");
    row.className = "exercise-row";
    row.appendChild(check);
    row.appendChild(body);

    el.appendChild(media);
    el.appendChild(row);

    // Hover-to-play: подменяем thumb на полноценный GIF при наведении,
    // возвращаем thumb при уходе — GIF сбрасывается на начало.
    el.addEventListener("mouseenter", () => { img.src = img.dataset.gif; });
    el.addEventListener("mouseleave", () => { img.src = img.dataset.thumb; });

    el.addEventListener("click", () => openModal(exercise, category, stage));

    return el;
}

function renderStage(stage, index) {
    const { total, done } = countStageExercises(stage);
    const isCompleted = done === total && total > 0;
    const isExpanded = uiState.expanded.includes(stage.id);

    const el = document.createElement("section");
    el.className = "stage" + (isCompleted ? " completed" : "") + (isExpanded ? " expanded" : "");
    el.id = stage.id;

    const header = document.createElement("button");
    header.className = "stage-header";
    header.type = "button";
    header.innerHTML = `
        <div class="stage-title-row">
            <span class="stage-num">${index}</span>
            <span class="stage-title-text"></span>
        </div>
        <span class="stage-period"></span>
        <span class="stage-progress-pill">${done} / ${total}</span>
        <span class="toggle-hint">▾</span>
    `;
    header.querySelector(".stage-title-text").textContent = stage.title.replace(/^Этап \d+ — /, "");
    header.querySelector(".stage-period").textContent = stage.period;
    header.addEventListener("click", () => toggleStage(stage.id));

    const content = document.createElement("div");
    content.className = "stage-content";
    const inner = document.createElement("div");
    inner.className = "stage-content-inner";

    if (stage.description) {
        const desc = document.createElement("div");
        desc.className = "stage-description";
        desc.textContent = stage.description;
        inner.appendChild(desc);
    }

    const bar = document.createElement("div");
    bar.className = "categories-bar";

    stage.categories.forEach(category => {
        const meta = CATEGORY_META[category.kind] || { icon: "", color: "#888" };
        const catEl = document.createElement("div");
        catEl.className = "category";

        const catNode = document.createElement("div");
        catNode.className = "category-node";
        const catIcon = document.createElement("span");
        catIcon.className = "category-icon";
        catIcon.style.background = meta.color + "22";
        catIcon.style.color = meta.color;
        catIcon.innerHTML = meta.icon;
        const catTitle = document.createElement("h3");
        catTitle.className = "category-title";
        catTitle.textContent = category.title;
        catNode.appendChild(catIcon);
        catNode.appendChild(catTitle);
        catEl.appendChild(catNode);

        const exList = document.createElement("div");
        exList.className = "exercises-list";
        category.exercises.forEach(ex => {
            exList.appendChild(renderExercise(ex, category, stage));
        });
        catEl.appendChild(exList);
        bar.appendChild(catEl);
    });

    inner.appendChild(bar);
    content.appendChild(inner);
    el.appendChild(header);
    el.appendChild(content);

    return el;
}

function render() {
    log("rendering roadmap with", ROADMAP.length, "stages");
    const container = document.getElementById("roadmap");
    container.innerHTML = "";
    ROADMAP.forEach((stage, i) => {
        container.appendChild(renderStage(stage, i));
    });
    updateGlobalProgress();
    renderCurrentExercises();
}

function expandAll() {
    log("expanding all stages");
    uiState.expanded = ROADMAP.map(s => s.id);
    saveUIState(uiState);
    document.querySelectorAll(".stage").forEach(el => el.classList.add("expanded"));
}

function collapseAll() {
    log("collapsing all stages");
    uiState.expanded = [];
    saveUIState(uiState);
    document.querySelectorAll(".stage").forEach(el => el.classList.remove("expanded"));
}

function resetProgress() {
    if (!confirm("Точно сбросить весь прогресс? Это действие нельзя отменить.")) {
        log("reset cancelled by user");
        return;
    }
    log("resetting all progress");
    progress = {};
    saveProgress(progress);
    render();
}

document.addEventListener("DOMContentLoaded", () => {
    log("DOM ready, initializing");
    render();
    setView(uiState.view);
    document.querySelectorAll(".view-tab").forEach(tab => {
        tab.addEventListener("click", () => setView(tab.dataset.view));
    });
    document.getElementById("expandAllBtn").addEventListener("click", expandAll);
    document.getElementById("collapseAllBtn").addEventListener("click", collapseAll);
    document.getElementById("resetBtn").addEventListener("click", resetProgress);

    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("modalBackdrop").addEventListener("click", (e) => {
        if (e.target.id === "modalBackdrop") closeModal();
    });
    document.getElementById("modalToggle").addEventListener("click", () => {
        if (activeExercise) {
            toggleExercise(activeExercise.exercise.id, activeExercise.stage);
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && activeExercise) closeModal();
    });

    log("init complete");
});
