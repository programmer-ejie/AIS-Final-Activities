"use strict";

// Evidence processing and calls to the main functions in service.js.
let systemEventLogs = [];
let firewallBlacklistIPs = [];

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

  }

  return logs;
}

// 3. Load the supplied evidence embedded in index.html for offline use.
function loadEvidence() {
  systemEventLogs = [];
  firewallBlacklistIPs = [];
  showButton.disabled = true;
  analyzeButton.disabled = true;
  logsTable.replaceChildren();
  try {
    const text = document.getElementById("evidence-data").textContent;
    const logs = JSON.parse(text);
    validateLogs(logs);
    systemEventLogs = logs;
    showButton.disabled = false;
    analyzeButton.disabled = false;
    fileStatus.textContent = `Loaded incident_logs.json: ${logs.length} events. Ready to analyze.`;
    showEvidence();
    writeOutput(["Evidence loaded automatically. Select Analyze logs to investigate."]);
  } catch (error) {
    fileStatus.textContent = "Evidence could not be loaded.";
    writeOutput([`Unable to load evidence: ${error.message}`]);
  }
}

// 4. Display each record as a table row.
function showEvidence() {
  if (systemEventLogs.length === 0) {
    writeOutput(["Evidence is unavailable. Refresh the page to try again."]);
    return;
  }

  const body = logsTable;
  body.replaceChildren();
  for (const entry of systemEventLogs) { // row : 8
    const row = document.createElement("tr");
    for (const key of [ // columns : 6
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

// 5. Analyze the loaded records using service.js.
function analyzeSystemBreach() {
  const logs = systemEventLogs;
  if (logs.length === 0) {
    writeOutput(["Evidence is unavailable. Refresh the page to try again."]);
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

// 6. Display the recovery results returned by service.js.
function verifyRecovery() {
  const results = checkRecovery(recoveryEvidence);
  writeOutput(results);
}
