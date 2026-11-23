const paths = {
  chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-6 6"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10h8"/>', calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>', chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.8L3 21l1.8-4.6A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 11h8M8 14h5"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6"/>', bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0M9 12v1M15 12v1"/>', folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 9h18"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.5 1.5c-1.1 1.1-2.1 1.3-2.1 3M12 17h.01"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>', check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
  pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>', lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>', 'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6"/>', logout: '<path d="M10 17l5-5-5-5M15 12H3M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>', key: '<circle cx="8" cy="15" r="5"/><path d="m11.5 11.5 8-8 2 2-2 2 2 2-3 3-2-2-3 3"/>',
  spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3ZM19 16l1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1z"/>', 'circle-help': '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.5 1.5c-1.1 1.1-2.1 1.3-2.1 3M12 17h.01"/>', warning: '<path d="m10.3 4.9-7.5 13A2 2 0 0 0 4.5 21h15a2 2 0 0 0 1.7-3.1l-7.5-13a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2z"/><path d="M8 8h8M8 12h8M8 16h4"/>', tool: '<path d="M14 7a5 5 0 0 0-6.8 6.8L3 18l3 3 4.2-4.2A5 5 0 0 0 17 10l-3 3-3-3z"/>', coins: '<circle cx="8" cy="8" r="5"/><path d="M8 5v6M6 7h4M13 11a5 5 0 1 0 0-1M13 16h8M15 20h6"/>', table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 10v10"/>', code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>', settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6L6 16.2 7.4 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.2 2Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', down: '<path d="m7 10 5 5 5-5"/>', more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>', star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>', archive: '<path d="M3 4h18v4H3zM5 8v12h14V8M10 12h4"/>', reply: '<path d="m9 17-5-5 5-5M4 12h10a6 6 0 0 1 6 6v2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', moon: '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/>',
  keyboard: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6 9h1m3 0h1m3 0h1m3 0h1M6 12h1m3 0h1m3 0h1m3 0h1M8 16h8"/>',
  backspace: '<path d="M9 5H20v14H9l-6-7 6-7Z"/><path d="m12 9 5 6m0-6-5 6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M10 2h4m-2 0v3"/>',
  line: '<path d="M5 19 19 5"/>',
  rectangle: '<rect x="4" y="6" width="16" height="12" rx="1"/>',
  circle: '<circle cx="12" cy="12" r="8"/>',
  play: '<path d="M8 5v14l11-7-11-7Z"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9Z"/>',
  accessibility: '<circle cx="8" cy="17" r="4"/><circle cx="14" cy="4" r="1.5"/><path d="m13 7-2 5h5l3 4m-8-4 2 4h5m-7-9 5 1 2 3"/>',
  scissors: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="m8 7 12 12M8 17l5-5m3-3 4-4"/>',
  pencil: '<path d="m4 20 4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/><path d="m14.5 6.5 3 3"/>',
  'external-link': '<path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18"/>',
  thermometer: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 11v7"/>',
  'cloud-rain': '<path d="M7 14h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 5a4.5 4.5 0 0 0 1 9Z"/><path d="m8 17-1 2m6-2-1 2m6-2-1 2"/>',
  microphone: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  headphones: '<path d="M3 13v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.4-3.4 1.7 1.7 0 0 1 1.2-2.9H18a3 3 0 0 0 3-3c0-4.8-4-8.7-9-8.7Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="8" r="1"/>',
  clapperboard: '<path d="M3 8h18v13H3zM3 8l1-5h18l-1 5M7 3l4 5m3-5 4 5"/>',
  theater: '<path d="M3 6c0-1 2-2 5-2s5 1 5 2v7a6 6 0 0 1-5 6 6 6 0 0 1-5-6V6Zm8 0c0-1 2-2 5-2s5 1 5 2v7a6 6 0 0 1-5 6 6 6 0 0 1-4-2"/><path d="M6 9h.01M10 9h.01M6 13c1.2 1 2.8 1 4 0m4-4h.01M18 9h.01m-4 4c1.2 1 2.8 1 4 0"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  landmark: '<path d="m3 9 9-6 9 6M4 10h16M5 10v9m4-9v9m6-9v9m4-9v9M3 21h18"/>',
  home: '<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2M10 21v-3h4v3"/>',
  wind: '<path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 16h7a2 2 0 1 1-2 2"/>',
  file: '<path d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h7m-7 4h7"/>',
  'bar-chart': '<path d="M4 20V11h4v9m4 0V4h4v16m4 0v-7h-4"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8 10h8m-8 4h8m-8 4h5"/>',
  pin: '<path d="m16 3 5 5-4 1-4 4-1 5-2-2-5 5 1-6-2-2 5-1 4-4z"/>',
  'map-pin': '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  inbox: '<path d="M4 4h16l2 11h-6l-2 3h-4l-2-3H2L4 4Z"/><path d="M3 15h5m8 0h5"/>',
  camera: '<path d="M4 7h4l2-3h4l2 3h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/>',
  type: '<path d="M4 6V4h16v2M12 4v16m-4 0h8"/>',
  marker: '<path d="m5 19 2-6 9-9a2.1 2.1 0 0 1 3 3l-9 9-5 3Z"/><path d="m14 6 4 4M4 21h16"/>',
  trash: '<path d="M4 7h16m-10 0V4h4v3m4 0-1 14H7L6 7m3 4v6m6-6v6"/>',
  handshake: '<path d="m3 12 4-4 4 1 2-2 4 1 4 4-7 7-3-2-2 1-6-6Z"/><path d="m7 8-2-2-3 3 2 3m7-2 3 3m-5 1 3 3m-1-8 3-3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  rupee: '<path d="M6 5h12M6 9h12M8 5c6 0 6 7 0 7H6l10 8"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/>',
};

export const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
export const icon = (name, size = 18) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.spark}</svg>`;
export const actionButton = (label, action, { iconName = "plus", variant = "quiet", aria = label } = {}) => `<button class="button button-${variant}" type="button" data-action="${escapeHtml(action)}" aria-label="${escapeHtml(aria)}">${icon(iconName, 16)}<span>${escapeHtml(label)}</span></button>`;
export const pageHeading = (title, description, actions = "") => `<div class="page-heading"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div><div class="heading-actions">${actions}</div></div>`;
export const panel = (title, content, meta = "") => `<section class="panel"><header class="panel-head"><h2>${escapeHtml(title)}</h2>${meta}</header>${content}</section>`;
export const stat = (label, value, change, trend = "up") => `<article class="metric"><span class="metric-label">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><span class="metric-change trend-${trend}">${trend === "up" ? "↑" : "↓"} ${escapeHtml(change)} <span>vs last period</span></span></article>`;
export const tag = (text, tone = "neutral") => `<span class="tag tag-${tone}">${escapeHtml(text)}</span>`;
export const table = (headers, rows) => `<div class="table-wrap"><table><thead><tr>${headers.map((item) => `<th scope="col">${escapeHtml(item)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
export const emptyState = (title, body, action = "") => `<div class="empty-state"><span class="empty-mark">${icon("spark", 22)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p>${action}</div>`;
export const avatar = (name, tone = "clay") => `<span class="avatar avatar-${tone}" aria-label="${escapeHtml(name)}">${escapeHtml(name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase())}</span>`;
export const progress = (value, label) => `<div class="progress-label"><span>${escapeHtml(label)}</span><span>${value}%</span></div><div class="progress"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>`;
