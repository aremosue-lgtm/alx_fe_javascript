// ------------- Global quotes array -------------
var quotes = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "The best way to predict your future is to create it.", category: "Motivation" },
  { text: "Creativity takes courage.", category: "Creativity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// ------------- DOM elements (global) -------------
var quoteDisplay = document.getElementById("quoteDisplay");
var categoryFilter = document.getElementById("categoryFilter");
var newQuoteBtn = document.getElementById("newQuote");
var addQuoteBtn = document.getElementById("addQuoteBtn");
var newQuoteText = document.getElementById("newQuoteText");
var newQuoteCategory = document.getElementById("newQuoteCategory");

// ------------- Update category dropdown -------------
function updateCategoryDropdown() {
  var uniqueCategories = [];
  for (var i = 0; i < quotes.length; i++) {
    if (uniqueCategories.indexOf(quotes[i].category) === -1) {
      uniqueCategories.push(quotes[i].category);
    }
  }
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  for (var j = 0; j < uniqueCategories.length; j++) {
    var opt = document.createElement("option");
    opt.value = uniqueCategories[j];
    opt.textContent = uniqueCategories[j];
    categoryFilter.appendChild(opt);
  }
}

// ------------- displayRandomQuote (required by ALX) -------------
function displayRandomQuote() {
  var selectedCategory = categoryFilter.value || "all";
  var filteredQuotes = [];
  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    for (var i = 0; i < quotes.length; i++) {
      if (quotes[i].category.toLowerCase() === selectedCategory.toLowerCase()) {
        filteredQuotes.push(quotes[i]);
      }
    }
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  var idx = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[idx].text;
}

// ------------- addQuote (required by ALX) -------------
function addQuote() {
  var text = newQuoteText.value.trim();
  var category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both quote text and category are required.");
    return;
  }

  quotes.push({ text: text, category: category });

  var prevCategory = categoryFilter.value;
  updateCategoryDropdown();

  if ([...categoryFilter.options].some(function(o) { return o.value.toLowerCase() === prevCategory.toLowerCase(); })) {
    categoryFilter.value = prevCategory;
  } else {
    categoryFilter.value = category;
  }

  quoteDisplay.textContent = text;

  newQuoteText.value = "";
  newQuoteCategory.value = "";
}

// ------------- Event listeners (global scope) -------------
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", displayRandomQuote);

// Initialize on page load
updateCategoryDropdown();
displayRandomQuote();
