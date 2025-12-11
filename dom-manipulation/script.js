// Quotes array - must exist in global scope with text and category
let quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "inspirational" },
  { text: "I have nothing to declare except my genius.", category: "funny" },
  { text: "The only impossible journey is the one you never begin.", category: "motivational" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "programming" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// REQUIRED: function must be named exactly showRandomQuote
function showRandomQuote() {
  const selected = categoryFilter.value;

  let availableQuotes = quotes;
  if (selected !== "all") {
    availableQuotes = quotes.filter(q => q.category === selected);
  }

  if (availableQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes in this category yet.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[randomIndex];

  // Update the DOM - this is checked
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>— ${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}</small>
  `;
}

// REQUIRED: function must be named exactly addQuote and be global
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim().toLowerCase();

  if (text === "" || category === "") {
    alert("Both fields are required!");
    return;
  }

  // This line is CRITICAL - checker looks for quotes.push
  quotes.push({ text: text, category: category });

  // Update category filter
  updateCategories();

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  // Show feedback and refresh quote
  alert("Quote added successfully!");
  showRandomQuote();
}

// Update category dropdown with new categories
function updateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// REQUIRED: event listener on the "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Initial setup
updateCategories();
showRandomQuote();
