### 2. `script.js` (Advanced DOM Manipulation – Full Solution)
```javascript
// Initial quotes database
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "motivational" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "You miss 100% of the shots you don't take.", category: "motivational" },
  { text: "I think, therefore I am.", category: "philosophy" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" },
  { text: "Simplicity is the soul of efficiency.", category: "design" }
];

let currentQuote = null;

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const toggleFormBtn = document.getElementById('toggleForm');
const addQuoteForm = document.getElementById('addQuoteForm');

// Populate category filter dynamically
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  
  categoryFilter.innerHTML = ''; // Clear existing options
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Show a random quote (filtered by selected category)
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  
  let availableQuotes = quotes;
  if (selectedCategory !== "all") {
    availableQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (availableQuotes.length === 0) {
    quoteDisplay.innerHTML = `<em>No quotes found in this category yet.</em>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[randomIndex];

  // Avoid showing the same quote twice in a row
  if (currentQuote && quote.text === currentQuote.text && availableQuotes.length > 1) {
    showRandomQuote();
    return;
  }

  currentQuote = quote;

  // Advanced DOM manipulation: create elements dynamically
  quoteDisplay.innerHTML = ''; // Clear previous content

  const quoteText = document.createElement('p');
  quoteText.textContent = `"${quote.text}"`;

  const categorySpan = document.createElement('span');
  categorySpan.textContent = `— ${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}`;
  categorySpan.style.fontWeight = 'bold';
  categorySpan.style.color = '#007bff';
  categorySpan.style.display = 'block';
  categorySpan.style.marginTop = '15px';
  categorySpan.style.fontStyle = 'normal';
  categorySpan.style.fontSize = '0.9em';

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(categorySpan);
}

// Add new quote from form
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const message = document.getElementById('formMessage');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim().toLowerCase();

  if (!text || !category) {
    message.textContent = "Please fill in both fields!";
    message.style.color = "red";
    return;
  }

  // Add the new quote
  quotes.push({ text, category });
  
  // Update UI
  populateCategories();
  categoryFilter.value = category; // Switch to new category
  showRandomQuote();

  // Clear form
  textInput.value = '';
  categoryInput.value = '';
  message.textContent = "Quote added successfully!";
  message.style.color = "green";

  setTimeout(() => {
    message.textContent = '';
  }, 3000);
}

// Toggle add quote form visibility
toggleFormBtn.addEventListener('click', () => {
  if (addQuoteForm.style.display === 'none' || !addQuoteForm.style.display) {
    addQuoteForm.style.display = 'block';
    toggleFormBtn.textContent = 'Hide Form';
  } else {
    addQuoteForm.style.display = 'none';
    toggleFormBtn.textContent = 'Add Your Own Quote';
  }
});

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);

// Initial setup
populateCategories();
showRandomQuote();


### Features Included (All Requirements Met)
- Pure JavaScript DOM manipulation (no frameworks)
- Dynamic quote display with category
- Random quote selection (avoids repetition)
- Dynamic category filter (auto-updated when new categories added)
- Form to add new quotes dynamically
- Updates both data and UI instantly
- Clean, responsive design with CSS
- Form validation and user feedback
