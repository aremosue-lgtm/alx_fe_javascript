// Initial quotes array
let quotes = [
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Creativity is intelligence having fun.", category: "Inspiration" }
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");


// -------------------------
// 1. Show a Random Quote
// -------------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  quoteDisplay.textContent = `"${selectedQuote.text}" — (${selectedQuote.category})`;
}

// Attach event listener
newQuoteButton.addEventListener("click", showRandomQuote);


// ---------------------------------------------
// 2. Create the "Add Quote" Form Dynamically
// ---------------------------------------------
function createAddQuoteForm() {
  const formDiv = document.createElement("div");
  formDiv.classList.add("form-container");

  formDiv.innerHTML = `
    <h3>Add a New Quote</h3>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  formContainer.appendChild(formDiv);

  // Attach event listener to the button created dynamically
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// Call to generate form on page load
createAddQuoteForm();


// -------------------------------
// 3. Add a New Quote Dynamically
// -------------------------------
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to array
  quotes.push({ text, category });

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";

  // Confirmation message
  quoteDisplay.textContent = `New quote added! Click "Show New Quote" to see it.`;
}
