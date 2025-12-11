// Array of quote objects (will be loaded from localStorage if available)
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');
const exportBtn = document.getElementById('exportBtn');
const importFileInput = document.getElementById('importFile');
const lastQuoteInfo = document.getElementById('lastQuoteInfo');

// Key for localStorage
const QUOTES_STORAGE_KEY = 'dynamicQuotes';

// Load quotes from localStorage on initialization
function loadQuotes() {
  const stored = localStorage.getItem(QUOTES_STORAGE_KEY);
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored quotes', e);
      quotes = [];
    }
  } else {
    // Default quotes if nothing in storage
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "motivational" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" },
      { text: "Be yourself; everyone else is already taken.", category: "humor" }
    ];
    saveQuotes(); // Save defaults
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available yet!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Store last viewed quote in sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));

  // Update last quote info display
  lastQuoteInfo.textContent = `Last viewed: "${quote.text}" — ${quote.category}`;

  quoteDisplay.innerHTML = ''; // Clear previous

  const quoteText = document.createElement('p');
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.style.fontStyle = 'italic';
  quoteCategory.style.marginTop = '15px';
  quoteCategory.style.color = '#555';

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Create the add quote form dynamically
function createAddQuoteForm() {
  const newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.id = 'newQuoteText';
  newQuoteTextInput.type = 'text';
  newQuoteTextInput.placeholder = 'Enter a new quote';

  const newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.id = 'newQuoteCategory';
  newQuoteCategoryInput.type = 'text';
  newQuoteCategoryInput.placeholder = 'Enter quote category (e.g., motivational)';

  const addQuoteBtn = document.createElement('button');
  addQuoteBtn.textContent = 'Add Quote';
  addQuoteBtn.addEventListener('click', addQuote);

  formContainer.appendChild(newQuoteTextInput);
  formContainer.appendChild(newQuoteCategoryInput);
  formContainer.appendChild(addQuoteBtn);
}

// Add a new quote
function addQuote() {
  const newQuoteTextInput = document.getElementById('newQuoteText');
  const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

  const text = newQuoteTextInput.value.trim();
  const category = newQuoteCategoryInput.value.trim() || 'uncategorized';

  if (text === '') {
    alert('Please enter a quote text!');
    return;
  }

  quotes.push({ text, category });
  saveQuotes(); // Persist immediately

  newQuoteTextInput.value = '';
  newQuoteCategoryInput.value = '';

  showRandomQuote();
  alert('Quote added successfully!');
}

// Export quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format: Expected an array of quotes.');
      }
    } catch (err) {
      alert('Failed to import: Invalid JSON file.');
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
exportBtn.addEventListener('click', exportToJsonFile);
importFileInput.addEventListener('change', importFromJsonFile);

// Initialize
loadQuotes();
createAddQuoteForm();
showRandomQuote(); // Show initial quote

// Restore last viewed quote info if available in sessionStorage
const lastQuote = sessionStorage.getItem('lastViewedQuote');
if (lastQuote) {
  try {
    const q = JSON.parse(lastQuote);
    lastQuoteInfo.textContent = `Last viewed: "${q.text}" — ${q.category}`;
  } catch (e) {
    console.error('Failed to parse last viewed quote');
  }
}
