// Array of quote objects { text, category }
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');
const exportBtn = document.getElementById('exportBtn');
const importFileInput = document.getElementById('importFile');
const lastQuoteInfo = document.getElementById('lastQuoteInfo');
const categoryFilter = document.getElementById('categoryFilter');
const manualSyncBtn = document.getElementById('manualSync');
const syncStatus = document.getElementById('syncStatus');

// Storage keys
const QUOTES_STORAGE_KEY = 'dynamicQuotes';
const FILTER_STORAGE_KEY = 'selectedCategoryFilter';

// Mock server URL (dummyjson.com provides 100 real quotes)
const SERVER_URL = 'https://dummyjson.com/quotes';

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem(QUOTES_STORAGE_KEY);
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (e) {
      quotes = [];
    }
  }
  if (quotes.length === 0) {
    // Initial defaults if nothing stored
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "motivational" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" },
      { text: "Be yourself; everyone else is already taken.", category: "humor" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

// Sync with server: fetch and merge (server precedence on conflicts)
async function syncWithServer() {
  try {
    syncStatus.textContent = 'Syncing with server...';
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    const serverQuotes = data.quotes.map(q => ({
      text: q.quote,
      category: q.author || 'unknown'
    }));

    let added = 0;
    let updated = 0;

    serverQuotes.forEach(serverQuote => {
      const existingIndex = quotes.findIndex(q => q.text === serverQuote.text);
      if (existingIndex === -1) {
        // New quote from server
        quotes.push(serverQuote);
        added++;
      } else if (quotes[existingIndex].category !== serverQuote.category) {
        // Conflict: same text, different category → server wins
        quotes[existingIndex].category = serverQuote.category;
        updated++;
      }
    });

    if (added || updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncStatus.textContent = `Sync complete: ${added} new quotes added, ${updated} updated from server.`;
    } else {
      syncStatus.textContent = 'Sync complete: No changes from server.';
    }
  } catch (err) {
    syncStatus.textContent = 'Sync failed: Could not reach server.';
    console.error(err);
  }
}

// Populate categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))].sort();
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  if (savedFilter && categories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
  }
}

// Filter quotes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem(FILTER_STORAGE_KEY, selected);

  quoteDisplay.innerHTML = '';
  let filtered = quotes;
  if (selected !== 'all') {
    filtered = quotes.filter(q => q.category === selected);
  }

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found in this category.</p>";
    return;
  }

  filtered.forEach(quote => {
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

// Show random quote
function showRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  lastQuoteInfo.textContent = `Last viewed: "${quote.text}" — ${quote.category}`;

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

// Create add form
function createAddQuoteForm() {
  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.type = 'text';
  textInput.placeholder = 'Enter a new quote';

  const catInput = document.createElement('input');
  catInput.id = 'newQuoteCategory';
  catInput.type = 'text';
  catInput.placeholder = 'Enter quote category';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(catInput);
  formContainer.appendChild(addBtn);
}

// Add quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim() || 'uncategorized';
  if (!text) {
    alert('Please enter a quote text!');
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  populateCategories();
  filterQuotes();
  alert('Quote added successfully!');
}

// Export / Import remain the same
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
      }
    } catch (err) {
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
exportBtn.addEventListener('click', exportToJsonFile);
importFileInput.addEventListener('change', importFromJsonFile);
manualSyncBtn.addEventListener('click', syncWithServer);

// Initialize
loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes();
syncWithServer(); // Initial sync

// Periodic sync every 30 seconds
setInterval(syncWithServer, 30000);

// Restore last viewed
const lastQuote = sessionStorage.getItem('lastViewedQuote');
if (lastQuote) {
  try {
    const q = JSON.parse(lastQuote);
    lastQuoteInfo.textContent = `Last viewed: "${q.text}" — ${q.category}`;
  } catch (e) {}
}
