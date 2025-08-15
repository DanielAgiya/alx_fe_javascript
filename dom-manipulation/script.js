// -------------------------------
// Initialize Quotes from Local Storage
// -------------------------------
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", category: "Success" }
];

// Load last selected category
let lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';

// -------------------------------
// DOM Elements
// -------------------------------
const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const exportJsonBtn = document.getElementById('exportJsonBtn');

// -------------------------------
// Save quotes to Local Storage
// -------------------------------
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// -------------------------------
// Display Quotes
// -------------------------------
function displayQuotes(quotesToDisplay) {
  quoteDisplay.innerHTML = '';
  quotesToDisplay.forEach(q => {
    const quoteElement = document.createElement('p');
    quoteElement.innerHTML = `"${q.text}" <em>(${q.category})</em>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// -------------------------------
// Display Random Quote
// -------------------------------
function displayRandomQuote() {
  const filteredQuotes = lastSelectedCategory === 'all' ? quotes : quotes.filter(q => q.category === lastSelectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes in this category.</p>';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <em>(${quote.category})</em>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote)); // Optional session storage
}

// -------------------------------
// Populate Categories Dropdown
// -------------------------------
function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat =>
    `<option value="${cat}" ${cat === lastSelectedCategory ? 'selected' : ''}>${cat}</option>`
  ).join('');
}

// -------------------------------
// Filter Quotes by Category
// -------------------------------
function filterQuotes() {
  lastSelectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', lastSelectedCategory);
  displayRandomQuote();
}

// -------------------------------
// Add New Quote
// -------------------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();

    newQuoteText.value = '';
    newQuoteCategory.value = '';
  } else {
    alert('Please fill in all fields.');
  }
}

// -------------------------------
// Export Quotes as JSON
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

// -------------------------------
// Import Quotes from JSON File
// -------------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    } catch (err) {
      alert('Invalid JSON file!');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -------------------------------
// Event Listeners
// -------------------------------
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);
exportJsonBtn.addEventListener('click', exportToJson);

// -------------------------------
// Initialize App
// -------------------------------
populateCategories();
displayRandomQuote();
