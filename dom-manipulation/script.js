// Initialize quotes array from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Life is beautiful", category: "Inspiration" },
  { text: "Keep learning", category: "Education" },
  { text: "Never give up", category: "Motivation" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = quotes[randomIndex].text;
  sessionStorage.setItem("lastQuote", quotes[randomIndex].text);
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));
  showRandomQuote();
  alert("Quote added successfully!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Export quotes to JSON file
function exportQuotes() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Import quotes from JSON file
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
        alert("Invalid JSON format!");
      }
    } catch {
      alert("Error parsing JSON file!");
    }
  };
  reader.readAsText(file);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Initialize on page load
window.onload = function() {
  showRandomQuote();
};
