// Array of quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "motivational" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "inspirational" },
  { text: "It is during our darkest moments that we must focus to see the light.", category: "wisdom" },
  { text: "Be yourself; everyone else is already taken.", category: "humor" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available yet!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Advanced DOM manipulation: create elements instead of using innerHTML string
  quoteDisplay.innerHTML = ''; // Clear previous content

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

// Function to create the add quote form dynamically
function createAddQuoteForm() {
  // Create input for quote text
  const newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.id = 'newQuoteText';
  newQuoteTextInput.type = 'text';
  newQuoteTextInput.placeholder = 'Enter a new quote';

  // Create input for quote category
  const newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.id = 'newQuoteCategory';
  newQuoteCategoryInput.type = 'text';
  newQuoteCategoryInput.placeholder = 'Enter quote category (e.g., motivational)';

  // Create add button
  const addQuoteBtn = document.createElement('button');
  addQuoteBtn.textContent = 'Add Quote';
  addQuoteBtn.addEventListener('click', addQuote); // Attach event listener

  // Append all to the form container
  formContainer.appendChild(newQuoteTextInput);
  formContainer.appendChild(newQuoteCategoryInput);
  formContainer.appendChild(addQuoteBtn);
}

// Function to add a new quote (called by the dynamically created button)
function addQuote() {
  const newQuoteTextInput = document.getElementById('newQuoteText');
  const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

  const text = newQuoteTextInput.value.trim();
  const category = newQuoteCategoryInput.value.trim() || 'uncategorized';

  if (text === '') {
    alert('Please enter a quote text!');
    return;
  }

  // Add to quotes array
  quotes.push({ text, category });

  // Clear inputs
  newQuoteTextInput.value = '';
  newQuoteCategoryInput.value = '';

  // Optional: Show confirmation by immediately displaying the new quote
  showRandomQuote();

  // Feedback to user
  alert('Quote added successfully!');
}

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);

// Create the form dynamically on page load
createAddQuoteForm();

// Show a quote on initial page load
showRandomQuote();
