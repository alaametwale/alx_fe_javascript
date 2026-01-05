// ===== 1. المصفوفة الأساسية للاقتباسات =====
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "To be or not to be, that is the question.", category: "Philosophy" }
];

// ===== 2. عناصر DOM =====
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');
const exportBtn = document.getElementById('exportJson');
const importFile = document.getElementById('importFile');

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
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim() || "General";
  if (!text) return alert("Quote text cannot be empty!");
  quotes.push({ text, category });        // ✅ إضافة الاقتباس للمصفوفة
  saveQuotes();                           // ✅ تحديث localStorage
  populateCategories();                   // ✅ تحديث قائمة الفئات
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  showRandomQuote();                      // ✅ تحديث DOM مباشرة
}

// ===== 6. تعبئة قائمة الفئات =====
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  const saved = localStorage.getItem('lastCategory') || 'all';
  categoryFilter.value = saved;
}

// ===== 7. تصفية الاقتباسات =====
function getFilteredQuotes() {
  const category = categoryFilter.value;
  localStorage.setItem('lastCategory', category);
  return category === "all" ? quotes : quotes.filter(q => q.category === category);
}

function filterQuotes() {
  showRandomQuote();
}

// ===== 8. تصدير JSON =====
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// ===== 9. استيراد JSON =====
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

// ===== 10. Event Listeners =====
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);

// ===== 11. Initialize =====
populateCategories();
showRandomQuote();
