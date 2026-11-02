"use strict";

// STUDENT CODING AREA: edit only the three functions below.
// index.html and support.js are complete. They load JSON and display results.
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
