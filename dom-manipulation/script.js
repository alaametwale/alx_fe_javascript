// quotes array
let quotes = [
  { text: "Life is beautiful", category: "Inspiration" },
  { text: "Keep learning", category: "Education" },
  { text: "Never give up", category: "Motivation" }
];

// Load quotes from localStorage if available
if(localStorage.getItem('quotes')) {
  quotes = JSON.parse(localStorage.getItem('quotes'));
}

// Display a random quote
function showRandomQuote() {
  const filtered = filterQuotesList();
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  quoteDisplay.innerHTML = filtered[randomIndex].text;
  sessionStorage.setItem('lastQuote', filtered[randomIndex].text);
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Create add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

// Populate categories in dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Clear previous options except "All"
  select.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore last selected category
  const lastFilter = localStorage.getItem('lastCategory') || 'all';
  select.value = lastFilter;
}

// Filter quotes based on category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem('lastCategory', selected);
  showRandomQuote();
}

// Return filtered quotes
function filterQuotesList() {
  const selected = document.getElementById("categoryFilter").value || 'all';
  if(selected === 'all') return quotes;
  return quotes.filter(q => q.category === selected);
}

// Export quotes to JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const imported = JSON.parse(reader.result);
    quotes = imported;
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories();
    showRandomQuote();
  };
  reader.readAsText(file);
}

// Simulate fetching from server
async function fetchQuotesFromServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  // For simulation, map posts to quotes
  data.slice(0,5).forEach(post => {
    if(!quotes.some(q => q.text === post.title)) {
      quotes.push({ text: post.title, category: "Server" });
    }
  });
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
}

// Sync quotes periodically
function syncQuotes() {
  setInterval(fetchQuotesFromServer, 60000); // every 60s
}

// Event listener for "Show New Quote"
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize on page load
window.onload = function() {
  populateCategories();
  createAddQuoteForm();
  showRandomQuote();
  syncQuotes();
};
