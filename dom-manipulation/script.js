// REQUIRED: default quotes
createForm();


function addQuote() {
const text = document.getElementById("newQuoteText").value.trim();
const category = document.getElementById("newQuoteCategory").value.trim();


if (!text || !category) {
alert("Please fill all fields.");
return;
}


quotes.push({ text, category });
saveQuotes();


document.getElementById("newQuoteText").value = "";
document.getElementById("newQuoteCategory").value = "";


quoteDisplay.textContent = "Quote added successfully!";
}


// ----------------------------
// REQUIRED: exportToJsonFile()
// ----------------------------
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


// ----------------------------
// REQUIRED: importFromJsonFile()
// ----------------------------
function importFromJsonFile(event) {
const file = event.target.files[0];
const reader = new FileReader();


reader.onload = function(e) {
const imported = JSON.parse(e.target.result);
quotes.push(...imported);
saveQuotes();
alert("Quotes imported successfully!");
};


reader.readAsText(file);
}


importInput.addEventListener("change", importFromJsonFile);
