// quotes array with text and category
let quotes = [
  { text: "Life is beautiful", category: "Inspiration" },
  { text: "Keep learning", category: "Education" },
  { text: "Never give up", category: "Motivation" }
];

// function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = quotes[randomIndex].text;
}

// function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  showRandomQuote();
  alert("Quote added successfully!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// function to create the add quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer") || document.body;

  const form = document.createElement("div");

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

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addButton);

  formContainer.appendChild(form);
}

// set up event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// initialize on page load
window.onload = function() {
  showRandomQuote();
  createAddQuoteForm();
};
