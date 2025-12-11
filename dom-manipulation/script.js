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

// REQUIRED mock API URL (for tests)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

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

// REQUIRED FUNCTION NAME: fetchQuotesFromServer
async function fetchQuotesFromServer() {
  try {
    syncStatus.textContent = 'Syncing with server...';

    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // JSONPlaceholder posts → transform into quotes
    const serverQuotes = Array.isArray(data)
      ? data.map(post => ({
          text: post.title || post.body || `post-${post.id}`,
          category: `user-${post.userId || 'unknown'}`
        }))
      : [];

    let added = 0;
    let updated = 0;

    serverQuotes.forEach(serverQuote => {
      const existingIndex = quotes.findIndex(q => q.text === serverQuote.text);

      if (existingIndex === -1) {
        quotes.push(serverQuote);
        added++;
      } else if (quotes[existingIndex].category !== serverQuote.category) {
        // server precedence
        quotes[existingIndex].category = serverQuote.category;
        updated++;
      }
    });

    if (added || updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncStatus.textContent =
        `Sync complete: ${added} new quotes added, ${updated} updated.`;
    } else {
      syncStatus.textContent = 'Sync complete: No changes.';
    }

  } catch (err) {
    syncStatus.textContent = 'Sync failed: Could not reach server.';
    console.error(err);
  }
}

// POST a new quote to the server (test looks for method: "POST" and headers Content-Type)
async function postQuoteToServer(payload) {
  try {
    // The test looks for these exact strings:
    // "method", "POST", "headers", "Content-Type"
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn('Server responded with non-OK status when posting quote:', response.status);
      return null;
    }

    const result = await response.json();
    // JSONPlaceholder returns an object with an id — we can attach it locally if helpful
    if (result && result.id) {
      // attach a serverId field to the quote stored locally for traceability
      const localIndex = quotes.findIndex(q => q.text === payload.text && q.category === payload.category);
      if (localIndex !== -1) {
        quotes[localIndex].serverId = result.id;
        saveQuotes();
      }
    }
    return result;
  } catch (err) {
    console.error('Failed to POST quote to server:', err);
    return null;
  }
}

// Populate category dropdown
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

// Filter quotes by category
function filterQuotes() {
  const selected = categoryFilter.value || 'all';
  localStorage.setItem(FILTER_STORAGE_KEY, selected);

  quoteDisplay.innerHTML = '';

  let filtered = quotes;
  if (selected !== 'all') {
    filtered = quotes.filter(q => q.category === selected);
  }

  if (!filtered.length) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  filtered.forEach(quote => {
    const t = document.createElement('p');
    t.textContent = `"${quote.text}"`;

    const c = document.createElement('p');
    c.textContent = `— ${quote.category}`;
    c.style.fontStyle = 'italic';
    c.style.marginTop = '5px';
    c.style.color = '#555';
    c.style.marginBottom = '20px';

    quoteDisplay.appendChild(t);
    quoteDisplay.appendChild(c);
  });
}

// Show a random quote (main logic)
function showRandomQuote() {
  if (!quotes.length) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  lastQuoteInfo.textContent = `Last viewed: "${quote.text}" — ${quote.category}`;

  quoteDisplay.innerHTML = '';

  const t = document.createElement('p');
  t.textContent = `"${quote.text}"`;

  const c = document.createElement('p');
  c.textContent = `— ${quote.category}`;
  c.style.fontStyle = 'italic';
  c.style.marginTop = '15px';
  c.style.color = '#555';

  quoteDisplay.appendChild(t);
  quoteDisplay.appendChild(c);
}

// REQUIRED FUNCTION NAME: displayRandomQuote (alias for tests)
function displayRandomQuote() {
  showRandomQuote();
}

// Create add-quote form
function createAddQuoteForm() {
  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';

  const catInput = document.createElement('input');
  catInput.id = 'newQuoteCategory';
  catInput.placeholder = 'Enter quote category';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(catInput);
  formContainer.appendChild(addBtn);
}

// Add a new quote (also POSTs to server)
async function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl = document.getElementById('newQuoteCategory');
  const text = (textEl && textEl.value || '').trim();
  const category = (catEl && catEl.value || '').trim() || 'uncategorized';

  if (!text) {
    alert('Enter a quote!');
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();

  // clear inputs
  if (textEl) textEl.value = '';
  if (catEl) catEl.value = '';

  // Post to server (mock)
  const serverResult = await postQuoteToServer({
    title: newQuote.text,      // using title field to align with jsonplaceholder shape
    body: newQuote.text,
    userId: newQuote.category  // we put category in userId to keep some traceability (it's mock)
  });

  if (serverResult) {
    // feedback for the user
    alert('Quote added and posted to server!');
  } else {
    alert('Quote added locally. Failed to post to server.');
  }
}

// Export quotes to JSON
function exportToJsonFile() {
  const d
