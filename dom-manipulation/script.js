// -------------------------------
// Quotes Array + Local Storage
// -------------------------------
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", category: "Success" }
];

let lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';

// -------------------------------
// DOM Elements
// -------------------------------
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importFile = document.getElementById('importFile');

// -------------------------------
// Save & Load Quotes
// -------------------------------
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat =>
    `<option value="${cat}" ${cat === lastSelectedCategory ? 'selected' : ''}>${cat}</option>`
  ).join('');
}

// -------------------------------
// Task 0: Display Random Quote
// -------------------------------
function displayRandomQuote() {
  const filteredQuotes = lastSelectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === lastSelectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes in this category.</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <em>(${quote.category})</em>`;
}

// -------------------------------
// Task 0 & 2: Add New Quote
// -------------------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert('Please fill in all fields.');
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  newQuoteText.value = '';
  newQuoteCategory.value = '';
}

// -------------------------------
// Task 2: Filter Quotes
// -------------------------------
function filterQuotes() {
  lastSelectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', lastSelectedCategory);
  displayRandomQuote();
}

// -------------------------------
// Task 1: Export/Import JSON
// -------------------------------
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      displayRandomQuote();
      alert('Quotes imported successfully!');
    } catch {
      alert('Invalid JSON file!');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -------------------------------
// Task 3: Simulate Server Sync
// -------------------------------
async function syncWithServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    serverQuotes.slice(0, 5).forEach((sq, index) => {
      quotes[index] = { text: sq.title, category: 'ServerData' };
    });
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    console.log('Server sync complete.');
  } catch (err) {
    console.error('Server sync failed:', err);
  }
}

// -------------------------------
// Event Listeners
// -------------------------------
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);
exportJsonBtn.addEventListener('click', exportToJson);
importFile.addEventListener('change', importFromJsonFile);

// -------------------------------
// Initialize App
// -------------------------------
populateCategories();
displayRandomQuote();
