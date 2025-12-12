// ===== SHARED STORAGE KEYS (use across pages) =====
const STORAGE_KEY = "NATOLI_OUTBOUND_CONTACTS_V2";
const TARGET_KEY = "NATOLI_OUTBOUND_WEEKLY_TARGET_V1";

// ===== YOUR GOOGLE SHEETS APP SCRIPT WEB APP URL =====
const API_URL = "https://script.google.com/macros/s/AKfycbzSMVIjihGnzuHsl1vOvr3zvYzf_-ezy1EeG2S7yZcq0BDVVhm1iUQ1HmUKRtSX8w1pw/exec";

// Load contacts from local storage or fallback
let contacts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// --- Update metrics ---
function updateDashboard() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  const weekStart = startOfWeek.toISOString().slice(0, 10);

  let totalSent = 0;
  let addedToday = 0;
  let addedThisWeek = 0;
  let sentToday = 0;
  let sentThisWeek = 0;

  contacts.forEach(c => {
    const created = c.created?.slice(0, 10);
    const sent = c.sentDate?.slice(0, 10);

    if (c.sent) totalSent++;
    if (created === today) addedToday++;
    if (created >= weekStart) addedThisWeek++;
    if (sent === today) sentToday++;
    if (sent >= weekStart) sentThisWeek++;
  });

  // Metrics
  document.getElementById("totalContacts").textContent = contacts.length;
  document.getElementById("totalSent").textContent = totalSent;
  document.getElementById("sentCompleted").textContent = totalSent;
  document.getElementById("sentTotal").textContent = contacts.length;
  document.getElementById("addedToday").textContent = addedToday;
  document.getElementById("addedThisWeek").textContent = addedThisWeek;
  document.getElementById("sentToday").textContent = sentToday;
  document.getElementById("sentThisWeek").textContent = sentThisWeek;
  document.getElementById("sentThisWeekText").textContent = sentThisWeek;

  // Progress bar
  const target = parseInt(localStorage.getItem(TARGET_KEY)) || 0;
  const percent = target ? Math.min((sentThisWeek / target) * 100, 100) : 0;
  document.getElementById("weeklyProgress").value = percent;
  document.getElementById("weeklyTarget").value = target;
}

// --- Save weekly target ---
function saveWeeklyTarget() {
  const value = parseInt(document.getElementById("weeklyTarget").value);
  localStorage.setItem(TARGET_KEY, value);
  updateDashboard();
}

// --- Load contacts from Sheets if online ---
function fetchContactsFromSheets() {
  if (!navigator.onLine) return;

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      if (data?.contacts) {
        contacts = data.contacts;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
        updateDashboard();
      }
    })
    .catch(err => console.error("Failed to fetch from Sheets", err));
}

// --- INIT ---
window.addEventListener("load", () => {
  fetchContactsFromSheets();
  updateDashboard();
});

