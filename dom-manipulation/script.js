// script.js — Web Storage (localStorage + sessionStorage) + JSON import/export
const file = event.target.files?.[0];
if (!file) return;


const fileReader = new FileReader();
fileReader.onload = function (e) {
try {
const imported = JSON.parse(e.target.result);
if (!Array.isArray(imported)) throw new Error('JSON must be an array of quote objects');


// basic validation: each item should have text and category (strings)
const validated = imported.filter(item => item && typeof item.text === 'string' && typeof item.category === 'string');


if (validated.length === 0) {
alert('No valid quotes found in the imported file.');
return;
}


// Append imported quotes (could be changed to replace if desired)
quotes.push(...validated);
saveQuotesToLocalStorage();
alert(`Imported ${validated.length} quotes successfully.`);
} catch (err) {
console.error('Import failed', err);
alert('Failed to import quotes: ' + (err.message || err));
} finally {
// reset input value so same file can be re-imported if desired
importFileInput.value = '';
}
};
fileReader.readAsText(file);
}


// -------------------------
// Initialization
// -------------------------
(function init() {
const loaded = loadQuotesFromLocalStorage();
if (!loaded) {
// First run — save defaults to localStorage so user starts with them
saveQuotesToLocalStorage();
}


createAddQuoteForm();


// Event wiring
exportJsonBtn.addEventListener('click', exportQuotesAsJson);
importFileInput.addEventListener('change', importFromJsonFile);
importBtn.addEventListener('click', () => importFileInput.click());


// Try to restore last viewed from session, otherwise show a random quote
const restored = restoreLastViewed();
if (!restored) showRandomQuote();
})();
