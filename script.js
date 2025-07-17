const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const workTable = document.getElementById("workTable");

days.forEach(day => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${day}</td>
    <td><input type="time" class="start" /></td>
    <td><input type="time" class="finish" /></td>
    <td class="dailyHours">0</td>
  `;
  workTable.appendChild(row);
});

function calculateTimeDiff(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  return (endMins - startMins) / 60;
}

function calculate() {
  let totalHours = 0;
  document.querySelectorAll("#workTable tr").forEach(row => {
    const start = row.querySelector(".start").value;
    const end = row.querySelector(".finish").value;
    let hours = 0;
    if (start && end) {
      hours = calculateTimeDiff(start, end);
      hours = hours < 0 ? 0 : hours; // Handle overnight errors
    }
    row.querySelector(".dailyHours").textContent = hours.toFixed(2);
    totalHours += hours;
  });

  document.getElementById("totalHours").textContent = totalHours.toFixed(2);

  const wage = parseFloat(document.getElementById("hourlyWage").value) || 0;
  const grossPay = totalHours * wage;
  document.getElementById("grossPay").textContent = grossPay.toFixed(2);

  // --- TAX Calculation (UK 2024/2025) ---
  let taxable = Math.max(0, grossPay * 52 - 12570); // annual income above threshold
  let tax = 0;
  if (taxable > 0) {
    tax = Math.min(taxable, 50270 - 12570) * 0.20; // Basic Rate
    // No higher tax logic for now
  }
  tax = tax / 52; // back to weekly
  document.getElementById("tax").textContent = tax.toFixed(2);

  // --- Pension ---
  const pensionYes = document.getElementById("pension").value === "yes";
  const pensionAmount = pensionYes ? grossPay * 0.05 : 0;
  document.getElementById("pensionAmount").textContent = pensionAmount.toFixed(2);

  // --- LISA ---
  const lisa = parseFloat(document.getElementById("lisa").value) || 0;
  document.getElementById("lisaAmount").textContent = lisa.toFixed(2);

  const netPay = grossPay - tax - pensionAmount - lisa;
  document.getElementById("netPay").textContent = netPay.toFixed(2);

  const dailyBank = parseFloat(document.getElementById("bankBalance").value) || 0;
  const target = parseFloat(document.getElementById("targetBalance").value) || 0;
  const diff = dailyBank - target;

  let leftover = netPay + diff;
  leftover = leftover < 0 ? 0 : leftover;
  document.getElementById("leftover").textContent = leftover.toFixed(2);

  // 50/50 Split
  document.getElementById("motiveMoney").textContent = (leftover / 2).toFixed(2);
  document.getElementById("investments").textContent = (leftover / 2).toFixed(2);
}
