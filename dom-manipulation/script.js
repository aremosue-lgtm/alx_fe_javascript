// Array of quote objects
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');
const exportBtn = document.getElementById('exportBtn');
const importFileInput = document.getElementById('importFile');
const lastQuoteInfo = document.getElementById('lastQuoteInfo');
const categoryFilter = document.getElementById('categoryFilter');

// Storage keys
const QUOTES_STORAGE_KEY = 'dynamicQuotes';
const FILTER_STORAGE_KEY = 'selectedCategoryFilter';

// Load quotes from localStorage
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
    // Default quotes
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "motivational" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" },
      { text: "Be yourself; everyone else is already taken.", category: "humor" },
      { text: "Innovation distinguishes between a leader and a follower.", category: "motivational" },
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "wisdom" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))].sort();

  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add each category
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1); // Capitalize
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter if exists
  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  if (savedFilter && categories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
  }
}

// Filter and display quotes based on selected category
function filterQuotes() {
  const selected = categoryFilter.value;

  // Save selected filter
  localStorage.setItem(FILTER_STORAGE_KEY, selected);

  // Clear display
  quoteDisplay.innerHTML = '';

  let filteredQuotes = quotes;
  if (selected !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selected);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found in this category.</p>";
    return;
  }

  // Display each quote
  filteredQuotes.forEach(quote => {
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `— ${quote.category}`;
    quoteCategory.style.fontStyle = 'italic';
    quoteCategory.style.marginTop = '5px';
    quoteCategory.style.color = '#555';
    quoteCategory.style.marginBottom = '20px';

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  });
}

// Show a single random quote (ignores filter - for "Show New Quote" button)
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available yet!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Update sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  lastQuoteInfo.textContent = `Last viewed: "${quote.text}" — ${quote.category}`;

  // Display single quote (clears previous filtered list)
  quoteDisplay.innerHTML = '';

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

// Create add quote form dynamically
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

// Add new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim() || 'uncategorized';

  if (text === '') {
    alert('Please enter a quote text!');
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = '';
  categoryInput.value = '';

  // Update categories and re-apply current filter
  populateCategories();
  filterQuotes();

  alert('Quote added successfully!');
}

// Export to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid format: Expected an array.');
      }
    } catch (err) {
      alert('Failed to import JSON.');
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
populateCategories();
filterQuotes(); // Apply saved filter or show all

// Restore last viewed quote info
const lastQuote = sessionStorage.getItem('lastViewedQuote');
if (lastQuote) {
  try {
    const q = JSON.parse(lastQuote);
    lastQuoteInfo.textContent = `Last viewed: "${q.text}" — ${q.category}`;
  } catch (e) { /* ignore */ }
}
