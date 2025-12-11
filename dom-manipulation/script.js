// script.js - tests expect: quotes array, displayRandomQuote, addQuote, and event listeners

// -------------------------------
// Quotes array required by tests
// -------------------------------
const quotes = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "The best way to predict your future is to create it.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Creativity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Wrap in DOMContentLoaded so elements are present
document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");

  if (!quoteDisplay) {
    console.error("Missing #quoteDisplay element.");
    return;
  }

  // Populate category dropdown based on available quotes
  function updateCategoryDropdown() {
    const unique = [...new Map(quotes.map(q => [q.category.toLowerCase(), q.category])).values()];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    unique.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  // Tests expect a function named displayRandomQuote
  function displayRandomQuote() {
    const selectedCategory = categoryFilter.value || "all";
    const pool = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

    if (!pool || pool.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
    }

    const idx = Math.floor(Math.random() * pool.length);
    const chosen = pool[idx];
    // Update DOM
    quoteDisplay.textContent = chosen.text;
  }

  // Tests expect a function named addQuote that adds to the quotes array and updates DOM/dropdown
  function addQuote() {
    const text = (newQuoteText && newQuoteText.value || "").trim();
    const category = (newQuoteCategory && newQuoteCategory.value || "").trim();

    if (!text || !category) {
      // keep behavior simple for tests
      alert("Both text and category are required.");
      return;
    }

    // Add to quotes array (mutates the exported `quotes` const's contents)
    quotes.push({ text, category });

    // Update dropdown and select the new category
    const previous = categoryFilter.value;
    updateCategoryDropdown();
    if ([...categoryFilter.options].some(o => o.value.toLowerCase() === previous.toLowerCase())) {
      categoryFilter.value = previous;
    } else {
      categoryFilter.value = category;
    }

    // Immediately show the added quote
    quoteDisplay.textContent = text;

    // Clear inputs
    if (newQuoteText) newQuoteText.value = "";
    if (newQuoteCategory) newQuoteCategory.value = "";
  }

  // Expose functions globally for test harness / inline onclick compatibility
  window.displayRandomQuote = displayRandomQuote;
  window.addQuote = addQuote;

  // Attach event listeners (tests check for listener on #newQuote)
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", displayRandomQuote);
  } else {
    console.warn("#newQuote button not found - tests will fail.");
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", displayRandomQuote);
  }

  if (addQuoteBtn) {
    addQuoteBtn.addEventListener("click", addQuote);
  }

  // Initial population and first displayed quote
  updateCategoryDropdown();
  displayRandomQuote();
});
