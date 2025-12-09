// ===== Initial Quotes =====
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categoryFilter = document.getElementById('categoryFilter');

// ===== Show Random Quote =====
function showRandomQuote() {
  let filteredQuotes = filterQuotesArray();
  if (filteredQuotes.length === 0) return quoteDisplay.textContent = "No quotes in this category!";
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// ===== Add Quote =====
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert("Please fill both fields");

  quotes.push({ text, category });
  populateCategories();
  saveQuotes();
  showRandomQuote();
}

// ===== Populate Categories =====
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>` +
    uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// ===== Filter Quotes =====
function filterQuotesArray() {
  const selected = categoryFilter.value;
  return selected === "all" ? quotes : quotes.filter(q => q.category === selected);
}

function filterQuotes() {
  localStorage.setItem('lastCategory', categoryFilter.value);
  showRandomQuote();
}

// ===== Web Storage =====
function loadQuotes() {
  const savedQuotes = JSON.parse(localStorage.getItem('quotes'));
  if (savedQuotes) quotes = savedQuotes;

  const lastCategory = localStorage.getItem('lastCategory');
  if (lastCategory) categoryFilter.value = lastCategory;

  populateCategories();
  showRandomQuote();
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ===== JSON Import/Export =====
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Server Sync & Conflict Resolution =====
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simple conflict resolution: Server takes precedence
    const serverQuotes = serverData.map(item => ({ text: item.title, category: "Server" }));
    
    // Merge: keep local quotes not in server
    const merged = [...serverQuotes];
    quotes.forEach(localQuote => {
      if (!serverQuotes.some(sq => sq.text === localQuote.text)) merged.push(localQuote);
    });

    quotes = merged;
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert("Data synced with server successfully!");
  } catch (err) {
    console.error("Sync error:", err);
  }
}

// ===== Event Listeners =====
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);

// ===== Initial Load =====
loadQuotes();

// ===== Optional: Periodic Auto-Sync every 60 seconds =====
setInterval(syncWithServer, 60000);
