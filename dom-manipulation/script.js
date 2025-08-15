// ---------- State ----------
const STORAGE_KEY = "dqg_quotes_v1";

// Seed quotes (used only if nothing in localStorage yet)
const seedQuotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Faith is taking the first step even when you don’t see the whole staircase.", category: "Faith" },
  { text: "Wisdom begins in wonder.", category: "Wisdom" },
  { text: "Quality is not an act, it is a habit.", category: "Excellence" },
  { text: "In the middle of difficulty lies opportunity.", category: "Resilience" },
];

let quotes = loadQuotes();

// Derived set of categories from quotes
const categories = new Set(quotes.map(q => q.category));

// ---------- DOM refs (existing placeholders) ----------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Will be created dynamically:
let categorySelect;     // <select> to filter quotes
let addQuoteForm;       // <form> for adding quotes

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  // Build the dynamic UI
  buildControls();
  createAddQuoteForm();

  // First render
  showRandomQuote();

  // Hook up Show New Quote button
  newQuoteBtn.addEventListener("click", () => showRandomQuote(getSelectedCategory()));
});

// ---------- Persistence ----------
function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...seedQuotes];
    const parsed = JSON.parse(raw);
    // Very light validation
    if (!Array.isArray(parsed)) return [...seedQuotes];
    return parsed.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
  } catch {
    return [...seedQuotes];
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// ---------- UI Builders ----------
function buildControls() {
  // Build a controls panel above the quoteDisplay
  const controls = document.createElement("section");
  controls.className = "stack";

  // Filter row
  const filterRow = document.createElement("div");
  filterRow.className = "row";

  const filterLabel = document.createElement("label");
  filterLabel.textContent = "Filter by category:";

  categorySelect = document.createElement("select");
  categorySelect.id = "categoryFilter";
  populateCategoryOptions(); // fill options
  categorySelect.addEventListener("change", () => showRandomQuote(getSelectedCategory()));

  // Optional category “pills” (example of event delegation)
  const pillsContainer = document.createElement("div");
  pillsContainer.className = "row";
  pillsContainer.setAttribute("id", "categoryPills");
  rebuildCategoryPills(pillsContainer);

  // One listener handles all pill clicks (advanced: event delegation)
  pillsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    const cat = btn.dataset.category;
    setSelectedCategory(cat === "__ALL__" ? "All" : cat);
    showRandomQuote(getSelectedCategory());
  });

  filterRow.append(filterLabel, categorySelect);
  controls.append(filterRow, pillsContainer, hr());

  // Insert before quote block so controls appear on top
  document.body.insertBefore(controls, quoteDisplay);
}

function populateCategoryOptions() {
  // Use a DocumentFragment for performance (advanced DOM technique)
  const frag = document.createDocumentFragment();

  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "All";
  frag.appendChild(allOption);

  Array.from(categories).sort().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    frag.appendChild(opt);
  });

  categorySelect.innerHTML = ""; // clear
  categorySelect.appendChild(frag);
}

function rebuildCategoryPills(container) {
  container.innerHTML = ""; // clear
  const frag = document.createDocumentFragment();

  // "All" pill
  frag.appendChild(makePill("All", "__ALL__"));

  Array.from(categories).sort().forEach(cat => {
    frag.appendChild(makePill(cat, cat));
  });

  container.appendChild(frag);

  function makePill(label, value) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill";
    btn.textContent = label;
    btn.dataset.category = value; // used by event delegation
    return btn;
  }
}

function createAddQuoteForm() {
  // Build a form dynamically (as requested)
  addQuoteForm = document.createElement("form");
  addQuoteForm.setAttribute("id", "addQuoteForm");

  const legend = document.createElement("div");
  legend.className = "muted";
  legend.textContent = "Add a new quote (type a brand-new category or pick an existing one).";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.required = true;
  quoteInput.setAttribute("id", "newQuoteText");

  // Category input uses <datalist> to suggest existing categories
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.required = true;
  categoryInput.setAttribute("id", "newQuoteCategory");
  categoryInput.setAttribute("list", "categoryChoices");

  const datalist = document.createElement("datalist");
  datalist.id = "categoryChoices";
  refreshCategoryDatalist(datalist);

  const addBtn = document.createElement("button");
  addBtn.type = "submit";
  addBtn.textContent = "Add Quote";

  addQuoteForm.append(legend, quoteInput, categoryInput, datalist, addBtn);

  // Submit handler (calls addQuote())
  addQuoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    if (!text || !category) return;

    addQuote(text, category);
    quoteInput.value = "";
    // Keep the category selected to allow quick adding of multiple quotes
  });

  // Place form under the new-quote button
  // (You can reorder if you prefer)
  newQuoteBtn.insertAdjacentElement("afterend", hr());
  newQuoteBtn.insertAdjacentElement("afterend", addQuoteForm);
}

function refreshCategoryDatalist(datalistEl) {
  datalistEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  Array.from(categories).sort().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    frag.appendChild(opt);
  });
  datalistEl.appendChild(frag);
}

function hr() {
  const d = document.createElement("div");
  d.className = "hr";
  return d;
}

// ---------- Core Features ----------
function getSelectedCategory() {
  return categorySelect?.value || "All";
}

function setSelectedCategory(value) {
  if (!categorySelect) return;
  const exists = Array.from(categorySelect.options).some(o => o.value === value);
  categorySelect.value = exists ? value : "All";
}

function showRandomQuote(category = "All") {
  // Required function #1
  const pool = category === "All"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());

  quoteDisplay.innerHTML = "";

  if (pool.length === 0) {
    quoteDisplay.innerHTML = `<p class="muted">No quotes available for the selected category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const picked = pool[randomIndex];

  const block = document.createElement("blockquote");
  block.innerHTML = `
    <p>“${escapeHTML(picked.text)}”</p>
    <footer class="muted">— ${escapeHTML(picked.category)}</footer>
  `;

  quoteDisplay.appendChild(block);
}

function addQuote(text, category) {
  // Push into state
  quotes.push({ text, category });
  saveQuotes();

  // Maintain categories list and re-render related UI
  if (!categories.has(category)) {
    categories.add(category);
    populateCategoryOptions();
    const pills = document.getElementById("categoryPills");
    if (pills) rebuildCategoryPills(pills);
    // Also refresh datalist
    const dl = document.getElementById("categoryChoices");
    if (dl) refreshCategoryDatalist(dl);
  }

  // Auto-switch filter to the newly added category to see it
  setSelectedCategory(category);
  showRandomQuote(category);
}

// ---------- Utilities ----------
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[s]));
}
