// quotes array with text and category
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is beautiful", category: "Inspiration" },
  { text: "Keep learning", category: "Education" },
  { text: "Never give up", category: "Motivation" }
];

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = quotes[randomIndex].text;
  sessionStorage.setItem('lastQuote', JSON.stringify(quotes[randomIndex]));
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
  alert("Quote added successfully!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Populate categories in dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = savedCategory;
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem('selectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerHTML = filteredQuotes[randomIndex].text;
  }
}

// Fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
    const data = await res.json();
    // Transform mock data into quotes format
    const serverQuotes = data.map(item => ({ text: item.title, category: "Server" }));
    quotes = serverQuotes.concat(quotes);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories();
    showRandomQuote();
  } catch (err) {
    console.error("Failed to fetch quotes:", err);
  }
}

// Sync quotes to server (mock POST)
async function syncQuotes() {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotes)
    });
    alert("Quotes synced with server!");
  } catch (err) {
    console.error("Failed to sync quotes:", err);
  }
}

// Periodic sync
setInterval(syncQuotes, 60000); // every 60s

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
window.onload = function() {
  populateCategories();
  showRandomQuote();
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) document.getElementById("quoteDisplay").innerHTML = lastQuote.text;
  fetchQuotesFromServer();
};
