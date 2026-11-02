"use strict";

// Load fictional evidence from incident_logs.json using the file picker.
let systemEventLogs = [];
let firewallBlacklistIPs = [];

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
  document.getElementById("output").textContent = lines.join("\n");
  lines.forEach((line) => console.log(line));
}

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

  for (const [index, entry] of logs.entries()) {
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

async function loadLogFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  systemEventLogs = [];
  firewallBlacklistIPs = [];
  document.getElementById("show").disabled = true;
  document.getElementById("analyze").disabled = true;
  document.getElementById("logs").replaceChildren();
  document.getElementById("file-status").textContent = "Loading evidence...";

  try {
    const text = await file.text();
    systemEventLogs = validateLogs(JSON.parse(text));
    document.getElementById("show").disabled = false;
    document.getElementById("analyze").disabled = false;
    document.getElementById("file-status").textContent =
      `Loaded ${file.name}: ${systemEventLogs.length} events.`;
    showEvidence();
    writeOutput(["Evidence loaded. Select Analyze logs to investigate."]);
  } catch (error) {
    document.getElementById("file-status").textContent =
      "Evidence was not loaded.";
    writeOutput([
      `Unable to load logs: ${error.message}`,
      "Correct the JSON file and select it again.",
    ]);
  } finally {
    event.target.value = "";
  }
}

function showEvidence() {
  if (systemEventLogs.length === 0) {
    writeOutput(["Load incident_logs.json first."]);
    return;
  }

  const body = document.getElementById("logs");
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

function analyzeSystemBreach(logs) {
  if (logs.length === 0) {
    writeOutput(["Load incident_logs.json first."]);
    return;
  }

  const orderedLogs = [...logs].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );
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

function verifyRecovery() {
  writeOutput(checkRecovery(recoveryEvidence));
}

document.getElementById("log-file").addEventListener("change", loadLogFile);

document.getElementById("show").addEventListener("click", showEvidence);
document
  .getElementById("analyze")
  .addEventListener("click", () => analyzeSystemBreach(systemEventLogs));
document.getElementById("recover").addEventListener("click", verifyRecovery);
document.getElementById("reset").addEventListener("click", () => {
  firewallBlacklistIPs = [];
  document.getElementById("logs").replaceChildren();
  writeOutput([
    "Display reset. Loaded JSON evidence and your report text were retained.",
  ]);
});
document.getElementById("report").value = reportTemplate;
document.getElementById("download").addEventListener("click", () => {
  const blob = new Blob([document.getElementById("report").value], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "incident_report.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
