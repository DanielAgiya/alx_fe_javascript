// -------------------------------
// Quotes Array
// -------------------------------
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", category: "Success" }
];

// -------------------------------
// DOM Elements
// -------------------------------
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// -------------------------------
// Display Random Quote Function
// -------------------------------
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <em>(${quote.category})</em>`;
}

// -------------------------------
// Add Quote Function
// -------------------------------
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    displayRandomQuote(); // Update DOM after adding
    textInput.value = '';
    categoryInput.value = '';
  } else {
    alert('Please fill in all fields.');
  }
}

// -------------------------------
// Event Listeners
// -------------------------------
newQuoteBtn.addEventListener('click', displayRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// -------------------------------
// Initialize App
// -------------------------------
displayRandomQuote();
