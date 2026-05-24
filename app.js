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
        return raw ? JSON.parse(raw) : { expanded: [] };
    } catch (e) {
        return { expanded: [] };
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
    document.getElementById("progressText").textContent = `${done} / ${total} упражнений`;
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
    if (progress[exerciseId]) {
        delete progress[exerciseId];
        log("unchecked:", exerciseId);
    } else {
        progress[exerciseId] = { completedAt: new Date().toISOString() };
        log("checked:", exerciseId);
    }
    saveProgress(progress);

    const exEl = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    if (exEl) {
        exEl.classList.toggle("done", !!progress[exerciseId]);
    }
    updateStageProgress(stage);
    updateGlobalProgress();
    updateModalToggleBtn(exerciseId);
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
    const meta = CATEGORY_META[category.kind] || { icon: "💪", color: "#888" };

    const el = document.createElement("div");
    el.className = "exercise" + (isDone ? " done" : "");
    el.dataset.exerciseId = exercise.id;

    const media = document.createElement("div");
    media.className = "exercise-media";
    media.appendChild(buildMedia(exercise, category, false));

    const check = document.createElement("div");
    check.className = "exercise-check";
    check.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleExercise(exercise.id, stage);
    });

    const body = document.createElement("div");
    body.className = "exercise-body";
    const name = document.createElement("div");
    name.className = "exercise-name";
    name.textContent = exercise.name;
    const target = document.createElement("div");
    target.className = "exercise-target";
    target.textContent = exercise.target;
    body.appendChild(name);
    body.appendChild(target);

    el.appendChild(media);
    el.appendChild(check);
    el.appendChild(body);

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

    const number = document.createElement("div");
    number.className = "stage-number";
    number.textContent = index;
    el.appendChild(number);

    const header = document.createElement("div");
    header.className = "stage-header";
    header.innerHTML = `
        <div class="stage-title-block">
            <div class="stage-title">
                <span class="stage-title-text"></span>
                <span class="stage-period"></span>
            </div>
            <div class="stage-description"></div>
        </div>
        <div class="stage-meta">
            <div class="stage-progress">${done} / ${total}</div>
            <div class="toggle-icon">⌄</div>
        </div>
    `;
    header.querySelector(".stage-title-text").textContent = stage.title;
    header.querySelector(".stage-period").textContent = stage.period;
    header.querySelector(".stage-description").textContent = stage.description;
    header.addEventListener("click", () => toggleStage(stage.id));

    const content = document.createElement("div");
    content.className = "stage-content";
    const inner = document.createElement("div");
    inner.className = "stage-inner";

    stage.categories.forEach(category => {
        const meta = CATEGORY_META[category.kind] || { icon: "💪", color: "#888" };
        const catEl = document.createElement("div");
        catEl.className = "category";

        const catHeader = document.createElement("div");
        catHeader.className = "category-header";
        const catIcon = document.createElement("div");
        catIcon.className = "category-icon";
        catIcon.style.background = meta.color + "22";
        catIcon.style.color = meta.color;
        catIcon.innerHTML = meta.icon;
        const catTitle = document.createElement("h3");
        catTitle.className = "category-title";
        catTitle.textContent = category.title;
        catHeader.appendChild(catIcon);
        catHeader.appendChild(catTitle);
        catEl.appendChild(catHeader);

        const exList = document.createElement("div");
        exList.className = "exercises";
        category.exercises.forEach(ex => {
            exList.appendChild(renderExercise(ex, category, stage));
        });
        catEl.appendChild(exList);
        inner.appendChild(catEl);
    });

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
