// quotes array with text and category
let quotes = [
  { text: "Life is beautiful", category: "Inspiration" },
  { text: "Keep learning", category: "Education" },
  { text: "Never give up", category: "Motivation" }
];

// load quotes from localStorage if available
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
  // save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  // update localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  showRandomQuote();
  alert("Quote added successfully!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// function to export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// function to import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON file format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  reader.readAsText(file);
}

// set up event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// initialize on page load
window.onload = function() {
  showRandomQuote();
};
