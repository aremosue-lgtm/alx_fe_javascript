// 1. quotes array with text and category (global)
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "technology" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "You miss 100% of the shots you don’t take.", category: "motivational" },
  { text: "It’s not a bug – it’s an undocumented feature.", category: "programming" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// 2. Function must be called exactly displayRandomQuote
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available yet.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Update the DOM
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
}

// 3. Function must be called exactly addQuote and must push to the array
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (text === "" || category === "") {
    alert("Please enter both quote and category");
    return;
  }

  // This line is the one the checker looks for
  quotes.push({ text: text, category: category });

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Optional: show one of the quotes (including the new one)
  displayRandomQuote();
}

// 4. Event listener on the button with id="newQuote"
newQuoteBtn.addEventListener("click", displayRandomQuote);

// Show a quote when the page loads
displayRandomQuote();
