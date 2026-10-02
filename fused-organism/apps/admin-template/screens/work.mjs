import { actionButton, avatar, emptyState, escapeHtml, pageHeading, panel, progress, tag } from "../shared.mjs";

export function renderTasks({ tasks, taskFilter }) {
  const visible = tasks.filter((task) => taskFilter === "all" || (taskFilter === "open" && !task.done) || (taskFilter === "done" && task.done));
  const rows = visible.map((task) => `<div class="task-row ${task.done ? "task-done" : ""}"><label class="task-check"><input type="checkbox" data-action="toggle-task" data-id="${escapeHtml(task.id)}" ${task.done ? "checked" : ""}/><span class="checkmark"></span><span class="task-text"><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.project)} · ${escapeHtml(task.due)}</small></span></label>${tag(task.priority, task.priority === "High" ? "clay" : "neutral")}${avatar(task.owner, "sand")}</div>`).join("");
  return `${pageHeading("Tasks", "A focused list of the work that needs your attention.", actionButton("Add task", "new-task", { iconName: "plus", variant: "primary" }))}<div class="sample-banner">${tag("LOCAL PREVIEW", "sand")} Changes stay in this browser preview.</div><div class="filter-row"><button class="filter-chip ${taskFilter === "all" ? "is-selected" : ""}" data-action="task-filter" data-value="all">All <span>${tasks.length}</span></button><button class="filter-chip ${taskFilter === "open" ? "is-selected" : ""}" data-action="task-filter" data-value="open">To do</button><button class="filter-chip ${taskFilter === "done" ? "is-selected" : ""}" data-action="task-filter" data-value="done">Completed</button><span class="filter-spacer"></span><button class="button button-quiet" data-action="sort-tasks">Due date ${"↓"}</button></div><div class="panel task-list">${rows || emptyState("All clear", "Nothing is waiting on you right now.")}</div>`;
}

export function renderScrumboard({ lanes }) {
  return `${pageHeading("Scrumboard", "Move cards across the sprint as work progresses.", actionButton("Add card", "new-card", { iconName: "plus", variant: "primary" }))}<div class="sample-banner">${tag("PREVIEW SPRINT", "sand")} Sprint 14 · Oct 1–14 · 6 example cards</div><div class="kanban-board">${lanes.map((lane, index) => `<section class="kanban-lane"><header><h2>${escapeHtml(lane.label)}</h2>${tag(String(lane.items.length), "neutral")}<button class="panel-menu" aria-label="More ${escapeHtml(lane.label)} options" data-action="lane-menu">···</button></header><div class="kanban-cards">${lane.items.map((item) => `<article class="kanban-card"><div class="kanban-card-top">${tag(item.type, item.tone)}<button class="panel-menu" aria-label="More actions for ${escapeHtml(item.title)}" data-action="item-menu">···</button></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><div class="kanban-card-foot"><small>${escapeHtml(item.code)} · ${escapeHtml(item.due)}</small>${avatar(item.owner, item.tone)}</div><button class="move-card" data-action="move-card" data-id="${escapeHtml(item.id)}" aria-label="Move ${escapeHtml(item.title)} to next lane">${index < 2 ? "Move to next lane" : "Complete"} ${"→"}</button></article>`).join("")}</div><button class="lane-add" data-action="new-card">+ Add a card</button></section>`).join("")}</div>`;
}

export function renderActivities() {
  const events = [
    ["Maya Chen", "completed", "the onboarding checklist", "10:42 AM", "clay"],
    ["Leo Park", "shared", "a new project brief in Product refresh", "9:18 AM", "blue"],
    ["Ari Bell", "commented on", "the release plan · “Ready for a quick review.”", "Yesterday", "sage"],
    ["Sam Rivera", "joined", "the Operations handbook project", "Yesterday", "gold"],
    ["Maya Chen", "scheduled", "the weekly planning session", "Oct 1", "sand"],
  ];
  return `${pageHeading("Activities", "A shared record of the work happening across your teams.", `<button class="button button-secondary" data-action="activity-filter">${"Filter"}</button>`)}<div class="sample-banner">${tag("PREVIEW ACTIVITY", "sand")} Example activity is local and illustrative.</div>${panel("Recent activity", `<div class="activity-feed">${events.map(([name, verb, item, date, tone]) => `<article class="activity-item">${avatar(name, tone)}<div class="activity-copy"><p><strong>${name}</strong> ${verb} <strong>${item}</strong></p><small>${date} · in Workspace</small></div><button class="panel-menu" aria-label="Activity options" data-action="item-menu">···</button></article>`).join("")}</div>`, `<button class="button button-quiet" data-action="activity-filter">All activity ${"⌄"}</button>`)}`;
}

export function renderCalendar({ monthOffset = 0 }) {
  const base = new Date(2026, 9 + monthOffset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthName = base.toLocaleString("en", { month: "long" });
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const dayCells = Array.from({ length: 42 }, (_, i) => {
    const date = i - offset + 1;
    const inMonth = date > 0 && date <= days;
    const actual = inMonth ? date : date <= 0 ? new Date(year, month, date).getDate() : date - days;
    const meeting = inMonth && [8, 9, 12, 16, 22, 27].includes(date);
    return `<button class="calendar-day ${inMonth ? "" : "outside"} ${year === 2026 && month === 9 && actual === 2 && inMonth ? "today" : ""}" data-action="select-day" data-value="${actual}" aria-label="${monthName} ${actual}${meeting ? ", event scheduled" : ""}"><span>${actual}</span>${meeting ? `<i class="calendar-event-dot"></i>` : ""}</button>`;
  }).join("");
  return `${pageHeading("Calendar", "Plan the moments that keep your teams in sync.", actionButton("New event", "new-event", { iconName: "plus", variant: "primary" }))}<div class="calendar-toolbar"><div class="calendar-month"><button class="icon-button" aria-label="Previous month" data-action="calendar-prev">${"‹"}</button><h2>${monthName} ${year}</h2><button class="icon-button" aria-label="Next month" data-action="calendar-next">${"›"}</button></div><div class="segmented"><button class="is-active">Month</button><button data-action="toast" data-message="Week view selected">Week</button><button data-action="toast" data-message="Day view selected">Day</button></div></div><div class="calendar panel"><div class="calendar-weekdays">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => `<span>${day}</span>`).join("")}</div><div class="calendar-grid">${dayCells}</div></div><div class="calendar-below">${panel("Selected events", `<div class="event-row"><time>10:00</time><span class="event-color"></span><div><strong>Design review</strong><small>Product refresh · Meeting room 2</small></div>${tag("45 min", "neutral")}</div><div class="event-row"><time>14:30</time><span class="event-color event-green"></span><div><strong>Weekly team planning</strong><small>Workspace · Video call</small></div>${tag("1 hour", "neutral")}</div>`)}</div>`;
}
