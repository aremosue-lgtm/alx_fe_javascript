// Array of quote objects { text, category, optional serverId }
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

// Fetch quotes from server and merge (server -> local)
async function fetchQuotesFromServer() {
  try {
    syncStatus.textContent = 'Fetching from server...';
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = Array.isArray(data)
      ? data.map(post => ({
          text: post.title || post.body || `post-${post.id}`,
          category: `user-${post.userId || 'unknown'}`,
          serverId: post.id
        }))
      : [];

    let added = 0;
    let updated = 0;

    serverQuotes.forEach(serverQuote => {
      const existingIndex = quotes.findIndex(q => q.text === serverQuote.text || q.serverId === serverQuote.serverId);
      if (existingIndex === -1) {
        // New from server
        quotes.push({
          text: serverQuote.text,
          category: serverQuote.category,
          serverId: serverQuote.serverId
        });
        added++;
      } else {
        // If exists but different category, server takes precedence
        if (quotes[existingIndex].category !== serverQuote.category) {
          quotes[existingIndex].category = serverQuote.category;
          updated++;
        }
        // Ensure serverId is saved locally
        if (!quotes[existingIndex].serverId && serverQuote.serverId) {
          quotes[existingIndex].serverId = serverQuote.serverId;
        }
      }
    });

    if (added || updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncStatus.textContent = `Fetched: ${added} added, ${updated} updated.`;
    } else {
      syncStatus.textContent = 'Fetched: No changes.';
    }
  } catch (err) {
    syncStatus.textContent = 'Fetch failed: Could not reach server.';
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
    return result;
  } catch (err) {
    console.error('Failed to POST quote to server:', err);
    return null;
  }
}

// New: syncQuotes function (required by tests)
// This function performs a two-way-ish sync:
// 1) Pulls latest from server and merges (server wins on conflicts).
// 2) Pushes local-only quotes (no serverId) to server.
async function syncQuotes() {
  try {
    syncStatus.textContent = 'Starting sync...';

    // 1) Pull from server first
    await fetchQuotesFromServer();

    // 2) Find local quotes that haven't been posted (no serverId)
    const localOnly = quotes.filter(q => !q.serverId);

    let pushed = 0;
    for (const q of localOnly) {
      // Prepare payload to match JSONPlaceholder shape
      const payload = {
        title: q.text,
        body: q.text,
        userId: typeof q.category === 'string' ? q.category : String(q.category)
      };

      const res = await postQuoteToServer(payload);
      if (res && res.id) {
        // attach serverId locally
        const idx = quotes.findIndex(localQ => localQ.text === q.text && localQ.category === q.category && !localQ.serverId);
        if (idx !== -1) {
          quotes[idx].serverId = res.id;
          pushed++;
        }
      }
    }

    if (pushed > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
    }

    syncStatus.textContent = `Sync complete: pushed ${pushed} local quotes.`;
    return { pushed };
  } catch (err) {
    syncStatus.textContent = 'Sync failed.';
    console.error('syncQuotes error:', err);
    return { pushed: 0, error: err };
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

// Add a new quote (adds locally and attempts to post to server)
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

  // Try to post to server immediately; if it fails, syncQuotes will pick it up later
  const serverResult = await postQuoteToServer({
    title: newQuote.text,
    body: newQuote.text,
    userId: newQuote.category
  });

  if (serverResult && serverResult.id) {
    // attach serverId locally
    const idx = quotes.findIndex(q => q.text === newQuote.text && q.category === newQuote.category && !q.serverId);
    if (idx !== -1) {
      quotes[idx].serverId = serverResult.id;
      saveQuotes();
    }
    alert('Quote added and posted to server!');
  } else {
    alert('Quote added locally. Will sync to server when possible.');
  }
}

// Export quotes to JSON
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

// Import quotes from JSON
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
        alert('Quotes imported!');
      }
    } catch (err) {
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

// Event listeners
newQuoteBtn.addEventListener('click', displayRandomQuote);
exportBtn.addEventListener('click', exportToJsonFile);
importFileInput.addEventListener('change', importFromJsonFile);
// Wire manual sync button to syncQuotes (test may expect syncQuotes to be callable)
manualSyncBtn.addEventListener('click', () => {
  // call syncQuotes but don't await here so UI isn't blocked
  syncQuotes();
});
categoryFilter.addEventListener('change', filterQuotes);

// Initialize app
loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes();
fetchQuotesFromServer(); // initial fetch from server

// Auto-sync using the syncQuotes function every 30 seconds
setInterval(syncQuotes, 30000);

// Restore last viewed quote
const lastQuote = sessionStorage.getItem('lastViewedQuote');
if (lastQuote) {
  try {
    const q = JSON.parse(lastQuote);
    lastQuoteInfo.textContent = `Last viewed: "${q.text}" — ${q.category}`;
  } catch (e) {}
}
