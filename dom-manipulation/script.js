// -------------------------------
// QUOTE DATA
// -------------------------------
let quotes = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "The best way to predict your future is to create it.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Creativity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// -------------------------------
// DOM ELEMENTS
// -------------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// -------------------------------
// INITIALIZATION
// -------------------------------
updateCategoryDropdown();

// -------------------------------
// SHOW RANDOM QUOTE
// -------------------------------
function showRandomQuote() {
  let selectedCategory = categoryFilter.value;

  // Filter by category
  let filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// -------------------------------
// ADD NEW QUOTE
// -------------------------------
function addQuote() {
  let text = newQuoteText.value.trim();
  let category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both fields are required.");
    return;
  }

  // Add new quote to the array
  quotes.push({ text, category });

  // Update categories in dropdown
  updateCategoryDropdown();

  // Clear fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added successfully!");
}

// -------------------------------
// UPDATE CATEGORY DROPDOWN
// -------------------------------
function updateCategoryDropdown() {
  let categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// -------------------------------
// EVENT LISTENERS
// -------------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);
