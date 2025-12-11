// REQUIRED: default quotes


// restore last selected category
const saved = localStorage.getItem('selectedCategory');
if (saved && options.includes(saved)) {
categoryFilter.value = saved;
} else {
categoryFilter.value = 'all';
}
}


function filterQuote() {
const category = categoryFilter.value;
localStorage.setItem('selectedCategory', category);


if (category === 'all') {
showRandomQuote();
return;
}


const filtered = quotes.filter(q => q.category === category);
if (filtered.length === 0) {
quoteDisplay.textContent = 'No quotes available in this category.';
return;
}


const choice = filtered[Math.floor(Math.random() * filtered.length)];
quoteDisplay.textContent = `"${choice.text}" — (${choice.category})`;


// store index of this quote in session (index relative to main quotes array)
const idx = quotes.indexOf(choice);
if (idx >= 0) sessionStorage.setItem('lastViewedQuote', idx);
}


// wire change event
if (categoryFilter) categoryFilter.addEventListener('change', filterQuote);


// initialize categories and restore filter
populateCategories();


// restore last viewed
const lastViewed = sessionStorage.getItem('lastViewedQuote');
if (lastViewed !== null && quotes[lastViewed]) {
const q = quotes[lastViewed];
quoteDisplay.textContent = `"${q.text}" — (${q.category})`;
} else {
showRandomQuote();
}
