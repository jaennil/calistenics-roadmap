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
    if (done === total && total > 0) {
        stageEl.classList.add("completed");
    } else {
        stageEl.classList.remove("completed");
    }
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

function renderExercise(exercise, stage) {
    const isDone = !!progress[exercise.id];
    const el = document.createElement("div");
    el.className = "exercise" + (isDone ? " done" : "");
    el.dataset.exerciseId = exercise.id;
    el.innerHTML = `
        <div class="exercise-checkbox"></div>
        <div class="exercise-body">
            <div class="exercise-name"></div>
            <div class="exercise-target"></div>
            ${exercise.tip ? '<div class="exercise-tip"></div>' : ''}
        </div>
    `;
    el.querySelector(".exercise-name").textContent = exercise.name;
    el.querySelector(".exercise-target").textContent = exercise.target;
    if (exercise.tip) {
        el.querySelector(".exercise-tip").textContent = exercise.tip;
    }
    el.addEventListener("click", () => toggleExercise(exercise.id, stage));
    return el;
}

function renderStage(stage, index) {
    const { total, done } = countStageExercises(stage);
    const isCompleted = done === total && total > 0;
    const isExpanded = uiState.expanded.includes(stage.id);

    const el = document.createElement("section");
    el.className = "stage" + (isCompleted ? " completed" : "") + (isExpanded ? " expanded" : "");
    el.id = stage.id;

    const header = document.createElement("div");
    header.className = "stage-header";
    header.innerHTML = `
        <div class="stage-title-block">
            <div class="stage-number">${index}</div>
            <div>
                <div class="stage-title"></div>
                <div class="stage-description"></div>
            </div>
        </div>
        <div class="stage-meta">
            <div class="stage-progress">${done} / ${total}</div>
            <div class="toggle-icon">⌄</div>
        </div>
    `;
    header.querySelector(".stage-title").textContent = stage.title;
    header.querySelector(".stage-description").textContent = stage.description;
    header.addEventListener("click", () => toggleStage(stage.id));

    const content = document.createElement("div");
    content.className = "stage-content";
    const inner = document.createElement("div");
    inner.className = "stage-inner";

    stage.categories.forEach(category => {
        const catEl = document.createElement("div");
        catEl.className = "category";
        const titleEl = document.createElement("h3");
        titleEl.className = "category-title";
        titleEl.textContent = category.title;
        catEl.appendChild(titleEl);

        const exList = document.createElement("div");
        exList.className = "exercises";
        category.exercises.forEach(ex => {
            exList.appendChild(renderExercise(ex, stage));
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
    log("init complete");
});
