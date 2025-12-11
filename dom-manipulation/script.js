// Global quotes array
const quotes = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "The best way to predict your future is to create it.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Creativity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Global DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// -------------------------------
// Update category dropdown
// -------------------------------
function updateCategoryDropdown() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// -------------------------------
// Function required by tests: displayRandomQuote
// -------------------------------
function displayRandomQuote() {
  const selectedCategory = categoryFilter.value || "all";
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const idx = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[idx].text;
}

// -------------------------------
// Function required by tests: addQuote
// -------------------------------
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both quote text and category are required.");
    return;
  }

  // Add to quotes array
  quotes.push({ text, category });

  // Update category dropdown
  const prevCategory = categoryFilter.value;
  updateCategoryDropdown();

  if ([...categoryFilter.options].some(o => o.value.toLowerCase() === prevCategory.toLowerCase())) {
    categoryFilter.value = prevCategory;
  } else {
    categoryFilter.value = category;
  }

  // Update display with newly added quote
  quoteDisplay.textContent = text;

  // Clear inputs
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// -------------------------------
// Event listeners required by tests
// -------------------------------
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", displayRandomQuote);

// Initialize dropdown and display a quote on page load
updateCategoryDropdown();
displayRandomQuote();
