// quotes array - must exist globally for test
var quotes = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "The best way to predict your future is to create it.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Creativity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// DOM elements - globally accessible for test
var quoteDisplay = document.getElementById("quoteDisplay");
var categoryFilter = document.getElementById("categoryFilter");
var newQuoteBtn = document.getElementById("newQuote");
var addQuoteBtn = document.getElementById("addQuoteBtn");
var newQuoteText = document.getElementById("newQuoteText");
var newQuoteCategory = document.getElementById("newQuoteCategory");

// -------------------------------
// update category dropdown
// -------------------------------
function updateCategoryDropdown() {
  var uniqueCategories = [];
  quotes.forEach(function(q){
    if(uniqueCategories.indexOf(q.category) === -1){
      uniqueCategories.push(q.category);
    }
  });

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(function(cat){
    var opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// -------------------------------
// displayRandomQuote function required by test
// -------------------------------
function displayRandomQuote() {
  var selectedCategory = categoryFilter.value || "all";
  var filteredQuotes = selectedCategory === "all" ? quotes :
    quotes.filter(function(q){ return q.category.toLowerCase() === selectedCategory.toLowerCase(); });

  if(filteredQuotes.length === 0){
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  var idx = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[idx].text;
}

// -------------------------------
// addQuote function required by test
// -------------------------------
function addQuote() {
  var text = (newQuoteText.value || "").trim();
  var category = (newQuoteCategory.value || "").trim();

  if(!text || !category){
    alert("Both text and category are required.");
    return;
  }

  // Add new quote
  quotes.push({ text: text, category: category });

  // Update dropdown
  var prevCategory = categoryFilter.value;
  updateCategoryDropdown();
  if ([...categoryFilter.options].some(function(o){ return o.value.toLowerCase() === prevCategory.toLowerCase(); })) {
    categoryFilter.value = prevCategory;
  } else {
    categoryFilter.value = category;
  }

  // Update display
  quoteDisplay.textContent = text;

  // Clear inputs
  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// -------------------------------
// Attach event listeners for test harness
// -------------------------------
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", displayRandomQuote);

// Initialize
updateCategoryDropdown();
displayRandomQuote();
