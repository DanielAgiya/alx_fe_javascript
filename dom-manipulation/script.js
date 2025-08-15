// ----------------- Storage Keys -----------------
const LOCAL_STORAGE_KEY = "dynamicQuotes";
const SESSION_STORAGE_KEY = "lastViewedQuote";

// ----------------- Initial Data -----------------
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Faith is taking the first step even when you don’t see the whole staircase.", category: "Faith" },
  { text: "Wisdom begins in wonder.", category: "Wisdom" }
];

// ----------------- Load from Local Storage -----------------
function loadQuotes() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch {
      console.warn("Error parsing stored quotes, using defaults.");
    }
  }
}
loadQuotes();

// ----------------- DOM Elements -----------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteForm = document.getElementById("addQuoteForm");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const exportBtn = document.getElementById("exportJson");
const importFile = document.getElementById("importFile");

// ----------------- Save to Local Storage -----------------
function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// ----------------- Populate Category Filter -----------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="All">All</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// ----------------- Show Random Quote -----------------
function showRandomQuote(category = "All") {
  let filteredQuotes = category === "All" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p class="muted">No quotes in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const selectedQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>
      <p>“${selectedQuote.text}”</p>
      <footer class="muted">— ${selectedQuote.category}</footer>
    </blockquote>
  `;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(selectedQuote));
}

// ----------------- Add Quote -----------------
function addQuote(text, category) {
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
}

// ----------------- Export JSON -----------------
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  
  URL.revokeObjectURL(url);
}

// ----------------- Import JSON -----------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ----------------- Event Listeners -----------------
newQuoteBtn.addEventListener("click", () => {
  showRandomQuote(categoryFilter.value);
});

categoryFilter.addEventListener("change", () => {
  showRandomQuote(categoryFilter.value);
});

addQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();
  if (text && category) {
    addQuote(text, category);
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    showRandomQuote(categoryFilter.value);
  }
});

exportBtn.addEventListener("click", exportToJson);

importFile.addEventListener("change", importFromJsonFile);

// ----------------- Init -----------------
populateCategories();

// If a last viewed quote exists in sessionStorage, show it
const lastViewed = sessionStorage.getItem(SESSION_STORAGE_KEY);
if (lastViewed) {
  try {
    const quoteObj = JSON.parse(lastViewed);
    quoteDisplay.innerHTML = `
      <blockquote>
        <p>“${quoteObj.text}”</p>
        <footer class="muted">— ${quoteObj.category}</footer>
      </blockquote>
    `;
  } catch {
    showRandomQuote();
  }
} else {
  showRandomQuote();
}
