"use strict";

// STUDENT CODING AREA: edit only the three functions below.
// PART A: Complete the three tasks below. Part B handles loading and display.
// These are exercise rules for fictional evidence, not general intrusion detection.
const suspiciousIPs = ["198.51.100.24", "203.0.113.77"];

// For the failed-recovery test, change servicesHealthy to false, then reload.
const recoveryEvidence = {
  backupPredatesIncident: true,
  integrityMatches: true,
  maliciousArtifactRemoved: true,
  credentialsRotated: true,
  servicesHealthy: true,
};

// TASK 1: Return an ARRAY of suspicious event objects.
function detectSuspiciousEvents(logs) {
  const suspiciousEvents = [];

  // TODO: Loop through logs.
  // Add an event once if its IP is in suspiciousIPs OR its status is "ALERT".
  // Hint: use suspiciousIPs.includes(entry.ip), ||, and push().
  // Do not modify the original event objects.

  return suspiciousEvents;
}

// TASK 2: Return an ARRAY of unique suspicious failed-login IPs.
function buildBlacklist(logs) {
  const blacklist = [];

  // TODO: Loop through logs.
  // Add an IP only when ALL conditions hold:
  // - its IP is in suspiciousIPs
  // - eventType is "LOGIN"
  // - status is "FAILED"
  // - blacklist does not already include that IP
  // Hint: combine conditions with && and use !blacklist.includes(entry.ip).

  return blacklist;
}

// TASK 3: Return an ARRAY of readable result strings.
function checkRecovery(checks) {
  const results = [];

  // TODO: Loop through Object.entries(checks).
  // Add "PASS: name" for true and "FAIL: name" for false.
  // Add ONE final message:
  // "RECOVERY COMPLETE" only if all values are true;
  // otherwise "RECOVERY INCOMPLETE".
  // Hint: track a boolean called allPassed; use if/else.

  return results;
}

// PART B: File loading, display, and button controls.

// 1. Store the fictional records loaded from the selected JSON file.
let systemEventLogs = [];
let firewallBlacklistIPs = [];

// Find each HTML control once. The names below describe its purpose.
const fileInput = document.getElementById("log-file");
const fileStatus = document.getElementById("file-status");
const logsTable = document.getElementById("logs");
const outputBox = document.getElementById("output");
const reportBox = document.getElementById("report");
const showButton = document.getElementById("show");
const analyzeButton = document.getElementById("analyze");
const recoverButton = document.getElementById("recover");
const resetButton = document.getElementById("reset");
const downloadButton = document.getElementById("download");

const reportTemplate = `INCIDENT REPORT - Lesson 5
Student / Section:
Incident ID:
1. Summary and affected assets:
2. Evidence and chronological timeline:
3. Detection rules and limitations:
4. Containment recommendations:
5. Eradication recommendations:
6. Recovery verification and results:
7. Privacy concerns and responsible disclosure:
8. Lessons learned and preventive controls:
`;

function writeOutput(lines) {
  outputBox.textContent = lines.join("\n");
  for (const line of lines) {
    console.log(line);
  }
}

// 2. Check that the selected file contains valid event records.
function validateLogs(logs) {
  if (!Array.isArray(logs) || logs.length === 0) {
    throw new Error("The JSON must contain a nonempty array of event records.");
  }

  const requiredFields = [
    "timestamp",
    "eventType",
    "status",
    "user",
    "ip",
    "details",
  ];

  for (let index = 0; index < logs.length; index++) {
    const entry = logs[index];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`Record ${index + 1} must be an object.`);
    }

    for (const field of requiredFields) {
      if (typeof entry[field] !== "string" || entry[field].trim() === "") {
        throw new Error(
          `Record ${index + 1}: ${field} must be a nonempty string.`,
        );
      }
    }

    if (Number.isNaN(Date.parse(entry.timestamp))) {
      throw new Error(`Record ${index + 1}: timestamp is invalid.`);
    }

    for (const field of ["authorized", "encrypted"]) {
      if (
        (entry.eventType === "FILE_DOWNLOAD" || field in entry) &&
        typeof entry[field] !== "boolean"
      ) {
        throw new Error(`Record ${index + 1}: ${field} must be true or false.`);
      }
    }
  }

  return logs;
}

// 3. Read the file, convert its text into data, and store the records.
async function loadLogFile() {
  const file = fileInput.files[0];
  if (!file) return;

  systemEventLogs = [];
  firewallBlacklistIPs = [];
  showButton.disabled = true;
  analyzeButton.disabled = true;
  logsTable.replaceChildren();
  fileStatus.textContent = "Loading evidence...";

  try {
    const text = await file.text(); // Wait for the file contents.
    const logs = JSON.parse(text); // Convert JSON text into JavaScript data.
    validateLogs(logs); // Invalid records cause an error caught below.
    systemEventLogs = logs; // Store the records for the other functions.
    showButton.disabled = false;
    analyzeButton.disabled = false;
    fileStatus.textContent =
      `Loaded ${file.name}: ${systemEventLogs.length} events.`;
    showEvidence();
    writeOutput(["Evidence loaded. Select Analyze logs to investigate."]);
  } catch (error) {
    fileStatus.textContent =
      "Evidence was not loaded.";
    writeOutput([
      `Unable to load logs: ${error.message}`,
      "Correct the JSON file and select it again.",
    ]);
  } finally {
    fileInput.value = ""; // Allow selecting the same file again.
  }
}

// 4. Display each record as a table row.
function showEvidence() {
  if (systemEventLogs.length === 0) {
    writeOutput(["Load incident_logs.json first."]);
    return;
  }

  const body = logsTable;
  body.replaceChildren();
  for (const entry of systemEventLogs) {
    const row = document.createElement("tr");
    for (const key of [
      "timestamp",
      "eventType",
      "status",
      "user",
      "ip",
      "details",
    ]) {
      const cell = document.createElement("td");
      cell.textContent = entry[key];
      row.appendChild(cell);
    }
    body.appendChild(row);
  }
}

// 5. Analyze the loaded records using the functions above.
function analyzeSystemBreach() {
  const logs = systemEventLogs;
  if (logs.length === 0) {
    writeOutput(["Load incident_logs.json first."]);
    return;
  }

  // Sort a copy to keep the original evidence unchanged.
  const orderedLogs = logs.slice();
  orderedLogs.sort(compareLogTimes);
  const suspiciousEvents = detectSuspiciousEvents(orderedLogs);
  firewallBlacklistIPs = buildBlacklist(orderedLogs);
  const lines = [
    "ANALYSIS RESULTS",
    `Suspicious events: ${suspiciousEvents.length}`,
  ];

  for (const entry of suspiciousEvents) {
    lines.push(
      `${entry.timestamp} | ${entry.eventType} | ${entry.status} | ${entry.ip}`,
    );
  }

  lines.push(
    `SIMULATED BLACKLIST: ${firewallBlacklistIPs.join(", ") || "None"}`,
  );
  lines.push(
    "This array does not block network traffic. Preserve evidence and recommend authorized containment.",
  );
  writeOutput(lines);
}

function compareLogTimes(firstLog, secondLog) {
  return Date.parse(firstLog.timestamp) - Date.parse(secondLog.timestamp);
}

// 6. Check recovery using the function above, then display the results.
function verifyRecovery() {
  const results = checkRecovery(recoveryEvidence);
  writeOutput(results);
}


function resetDisplay() {
  firewallBlacklistIPs = [];
  logsTable.replaceChildren();
  writeOutput([
    "Display reset. Loaded JSON evidence and your report text were retained.",
  ]);
}

// 7. Download the report box contents as a text file.
function downloadReport() {
  const reportText = reportBox.value;
  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "incident_report.txt";
  link.click();

  function releaseDownloadURL() {
    URL.revokeObjectURL(url);
  }
  setTimeout(releaseDownloadURL, 1000);
}

// 8. Connect each control to the function it runs.
fileInput.addEventListener("change", loadLogFile);
showButton.addEventListener("click", showEvidence);
analyzeButton.addEventListener("click", analyzeSystemBreach);
recoverButton.addEventListener("click", verifyRecovery);
resetButton.addEventListener("click", resetDisplay);
downloadButton.addEventListener("click", downloadReport);
reportBox.value = reportTemplate;
