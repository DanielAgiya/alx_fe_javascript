// -------------------------------
// Load quotes from local storage or set default
// -------------------------------
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett", category: "Success" }
];

// Load last selected category from local storage
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

// -------------------------------
// Display Quotes in DOM
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
  let filteredQuotes = lastSelectedCategory === 'all' ? quotes : quotes.filter(q => q.category === lastSelectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes in this category.</p>';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.author}</strong> <em>(${quote.category})</em>`;
}

// -------------------------------
// Populate Category Filter
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
// Add a New Quote
// -------------------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const author = newQuoteAuthor.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text && author && category) {
    quotes.push({ text, author, category });
    localStorage.setItem('quotes', JSON.stringify(quotes));
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
// Event Listeners
// -------------------------------
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);

// -------------------------------
// Initialize App
// -------------------------------
populateCategories();
filterQuotes();
