// ===== Google Sheets Web App Endpoint =====
const API_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";

// ===== DOM References =====
const totalContactsEl = document.getElementById('totalContacts');
const sentTotalEl = document.getElementById('sentTotal');
const addedThisWeekEl = document.getElementById('addedThisWeek');
const sentThisWeekEl = document.getElementById('sentThisWeek');

// ===== Fetch and Render Data =====
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Replace with actual keys if your JSON keys differ
    totalContactsEl.textContent = data.totalContacts || 0;
    sentTotalEl.textContent = data.sentTotal || 0;
    addedThisWeekEl.textContent = data.addedThisWeek || 0;
    sentThisWeekEl.textContent = data.sentThisWeek || 0;

    console.log("✅ CRM Dashboard synced successfully.");
  } catch (error) {
    console.error("❌ Error fetching CRM data:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchData);
