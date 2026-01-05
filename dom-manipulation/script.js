// ===== 1. المصفوفة الأساسية للاقتباسات =====
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "To be or not to be, that is the question.", category: "Philosophy" }
];

// ===== 2. عناصر DOM =====
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const exportBtn = document.getElementById('exportJson');
const importFile = document.getElementById('importFile');
const addQuoteContainer = document.getElementById('addQuoteContainer');

// ===== 3. حفظ الاقتباسات في التخزين المحلي =====
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ===== 4. عرض اقتباس عشوائي =====
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  quoteDisplay.textContent = `${filtered[randomIndex].text} (${filtered[randomIndex].category})`;
}

// ===== 5. إضافة اقتباس جديد =====
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim() || "General";

  if (!text) return alert("Quote text cannot be empty!");

  quotes.push({ text, category });  // ✅ إضافة الاقتباس للمصفوفة
  saveQuotes();                     // ✅ تحديث localStorage
  populateCategories();             // ✅ تحديث قائمة الفئات
  textInput.value = "";
  categoryInput.value = "";
  showRandomQuote();                // ✅ تحديث DOM مباشرة
}

// ===== 6. إنشاء نموذج إضافة الاقتباسات ديناميكيًا =====
function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const inputText = document.createElement('input');
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement('input');
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addBtn = document.createElement('button');
  addBtn.textContent = "Add Quote";
  addBtn.id = "addQuoteBtn";
  addBtn.addEventListener('click', addQuote); // ربط الدالة addQuote

  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addBtn);

  addQuoteContainer.appendChild(formDiv);
}

// ===== 7. تعبئة قائمة الفئات =====
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  const saved = localStorage.getItem('lastCategory') || 'all';
  categoryFilter.value = saved;
}

// ===== 8. تصفية الاقتباسات =====
function getFilteredQuotes() {
  const category = categoryFilter.value;
  localStorage.setItem('lastCategory', category);
  return category === "all" ? quotes : quotes.filter(q => q.category === category);
}

function filterQuotes() {
  showRandomQuote();
}

// ===== 9. تصدير JSON =====
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// ===== 10. استيراد JSON =====
importFile.addEventListener('change', (event) => {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else alert('Invalid JSON format!');
    } catch {
      alert('Error parsing JSON file!');
    }
  };
  fileReader.readAsText(event.target.files[0]);
});

// ===== 11. Event Listeners =====
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes);

// ===== 12. Initialize =====
createAddQuoteForm();
populateCategories();
showRandomQuote();
