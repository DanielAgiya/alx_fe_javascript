// -------------------------------
// Initialize Quotes from Local Storage
// -------------------------------
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett", category: "Success" }
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
const newQuoteAuthor = document.getElementById('newQuoteAuthor');
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
    quoteElement.innerHTML = `"${q.text}" — <strong>${q.author}</strong> <em>(${q.category})</em>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// -------------------------------
// Show Random Quote
// -------------------------------
function showRandomQuote() {
  const filteredQuotes = lastSelectedCategory === 'all' ? quotes : quotes.filter(q => q.category === lastSelectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes in this category.</p>';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.author}</strong> <em>(${quote.category})</em>`;
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
  showRandomQuote();
}

// -------------------------------
// Add New Quote
// -------------------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const author = newQuoteAuthor.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text && author && category) {
    quotes.push({ text, author, category });
    saveQuotes();
    populateCategories();
    filterQuotes();

    newQuoteText.value = '';
    newQuoteAuthor.value = '';
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
// Simulate Server Sync (Mock API)
// -------------------------------
async function syncWithServer() {
  try {
    // Mock fetch from server (JSONPlaceholder simulation)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts'); 
    const serverQuotes = await response.json();
    
    // Simple conflict resolution: server data takes precedence
    serverQuotes.slice(0,5).forEach((sq, index) => {
      quotes[index] = { text: sq.title, author: `ServerUser${sq.userId}`, category: 'ServerData' };
    });

    saveQuotes();
    populateCategories();
    filterQuotes();
    console.log('Synced with server successfully.');
  } catch (err) {
    console.error('Server sync failed:', err);
  }
}

// -------------------------------
// Event Listeners
// -------------------------------
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);
exportJsonBtn.addEventListener('click', exportToJson);

// -------------------------------
// Initialize App
// -------------------------------
populateCategories();
filterQuotes();
