// ===============================
// Default Quotes (if none saved)
// ===============================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Stay focused and never give up.", category: "Inspiration" },
    { text: "Consistency is the key to success.", category: "Success" }
];

// ===============================
// DOM Elements
// ===============================
const quoteDisplay = document.getElementById("quoteDisplay");
const addBtn = document.getElementById("addBtn");
const generateBtn = document.getElementById("generateBtn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const categoryFilter = document.getElementById("categoryFilter");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

const SS_LAST_INDEX = "lastViewedQuote";

// ===============================
// Save Quotes to Local Storage
// ===============================
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories(); // update categories dynamically
}

// ===============================
// Display Quote
// ===============================
function displayQuote(index) {
    const q = quotes[index];
    quoteDisplay.textContent = `"${q.text}" — ${q.category}`;

    // save last viewed
    sessionStorage.setItem(SS_LAST_INDEX, index);
}

// ===============================
// Generate Random Quote
// ===============================
function generateRandomQuote() {
    const filtered = getFilteredQuotes();

    if (filtered.length === 0) return alert("No quotes available for this category.");

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const actualIndex = quotes.indexOf(filtered[randomIndex]);

    displayQuote(actualIndex);
}

generateBtn.addEventListener("click", generateRandomQuote);

// ===============================
// Add Quote
// ===============================
addBtn.addEventListener("click", () => {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
        alert("Please fill all fields.");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();

    newQuoteText.value = "";
    newQuoteCategory.value = "";
    quoteDisplay.textContent = "Quote added successfully!";
});

// ===============================
// Populate Categories into Dropdown
// ===============================
function populateCategories() {
    const categories = ["all"];

    quotes.forEach(q => {
        if (!categories.includes(q.category)) {
            categories.push(q.category);
        }
    });

    categoryFilter.innerHTML = categories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");

    // Restore last filter
    const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) {
        categoryFilter.value = savedFilter;
    }
}

// ===============================
// Get Filtered Quotes
// ===============================
function getFilteredQuotes() {
    const selected = categoryFilter.value;

    if (selected === "all") return quotes;

    return quotes.filter(q => q.category === selected);
}

// ===============================
// Filter Quotes on Change
// ===============================
function filterQuotes() {
    localStorage.setItem("selectedCategory", categoryFilter.value);

    const filtered = getFilteredQuotes();

    if (filtered.length === 0) {
        quoteDisplay.textContent = "No quotes in this category.";
    } else {
        displayQuote(quotes.indexOf(filtered[0]));
    }
}

categoryFilter.addEventListener("change", filterQuotes);

// ===============================
// Export Quotes to JSON File
// ===============================
function exportToJsonFile() {
    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

exportBtn.addEventListener("click", exportToJsonFile);

// ===============================
// Import Quotes from JSON
// ===============================
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) throw new Error();

            quotes.push(...imported);
            saveQuotes();
            alert("Quotes imported successfully!");
        } catch (err) {
            alert("Invalid JSON file.");
        }
    };

    reader.readAsText(file);
}

importInput.addEventListener("change", importFromJsonFile);

// ===============================
// Load Page
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    populateCategories();

    // Load last viewed quote if exists
    const last = sessionStorage.getItem(SS_LAST_INDEX);
    if (last !== null && quotes[last]) {
        displayQuote(last);
    }
});
