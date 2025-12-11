// script.js - corrected and defensive version

// -------------------------------
// SAMPLE QUOTES (initial state)
// -------------------------------
let quotes = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "The best way to predict your future is to create it.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Creativity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// -------------------------------
// SAFE DOM READY
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Get elements (guard if HTML structure is slightly different)
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn"); // preferred: button with id
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");

  // Defensive checks
  if (!quoteDisplay) {
    console.error("Missing #quoteDisplay element in HTML.");
    return;
  }
  if (!categoryFilter) {
    console.error("Missing #categoryFilter element in HTML.");
    return;
  }
  if (!newQuoteBtn) {
    console.error("Missing #newQuote button in HTML.");
    return;
  }
  if (!newQuoteText || !newQuoteCategory) {
    console.error("Missing input fields #newQuoteText or #newQuoteCategory.");
    // continue because addQuote won't work without them, but we can still show random quotes
  }

  // -------------------------------
  // Utility: update category dropdown
  // -------------------------------
  function updateCategoryDropdown() {
    // collect unique categories (preserve original case)
    const categories = [...new Map(quotes.map(q => [q.category.toLowerCase(), q.category])).values()];
    // Reset dropdown
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  // -------------------------------
  // Show random quote (respecting filter)
  // -------------------------------
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value || "all";
    const filtered = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

    if (!filtered || filtered.length === 0) {
      quoteDisplay.textContent = "No quotes available in this category.";
      return;
    }

    const idx = Math.floor(Math.random() * filtered.length);
    const chosen = filtered[idx];
    // Render nicely (you can expand this to include author, category displays, etc.)
    quoteDisplay.textContent = chosen.text;
  }

  // -------------------------------
  // Add quote - exposed function
  // -------------------------------
  function addQuote() {
    if (!newQuoteText || !newQuoteCategory) {
      alert("Add-quote inputs not found in the HTML.");
      return;
    }

    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
      alert("Both quote text and category are required.");
      return;
    }

    // Add to array
    quotes.push({ text, category });

    // Update dropdown (and keep user's selected option if possible)
    const prevSelection = categoryFilter.value || "all";
    updateCategoryDropdown();

    // Try to restore previous selection, or select the new category
    if ([...categoryFilter.options].some(o => o.value.toLowerCase() === prevSelection.toLowerCase())) {
      categoryFilter.value = prevSelection;
    } else {
      categoryFilter.value = category;
    }

    // Optionally show the added quote immediately:
    quoteDisplay.textContent = text;

    // Clear inputs
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    // Feedback
    // use alert for now (you can replace with a toast)
    alert("Quote added successfully!");
  }

  // Expose addQuote globally for cases where HTML uses onclick="addQuote()"
  // This ensures compatibility with both event-listener and inline onclick.
  window.addQuote = addQuote;

  // -------------------------------
  // Attach event listeners (defensive)
  // -------------------------------
  // Show New Quote button
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Category change should show a new quote for that category
  categoryFilter.addEventListener("change", showRandomQuote);

  // Add quote: prefer id button click, but also support inline onclick.
  if (addQuoteBtn) {
    addQuoteBtn.addEventListener("click", addQuote);
  } else {
    // If user used <button onclick="addQuote()"> in HTML, exposing window.addQuote is sufficient.
    console.warn("#addQuoteBtn not found; make sure your HTML uses either id='addQuoteBtn' or an inline onclick.");
  }

  // Initialize dropdown and show one quote on load
  updateCategoryDropdown();
  showRandomQuote();
});
