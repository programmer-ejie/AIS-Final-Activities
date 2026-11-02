"use strict";

// CLASS DISCUSSION: evidence -> detection -> unique IPs -> recovery results.
// These are supplied rules for fictional evidence, not proof of compromise.
const suspiciousIPs = ["198.51.100.24", "203.0.113.77"];

// For the failed-recovery test, change servicesHealthy to false, then reload.
const recoveryEvidence = {
  backupPredatesIncident: true,
  integrityMatches: true,
  maliciousArtifactRemoved: true,
  credentialsRotated: true,
  servicesHealthy: true,
};

// 1. Flag an event if its IP is listed OR its status is ALERT.
function detectSuspiciousEvents(logs) {
  const events = [];
  for (const log of logs) {
    if (suspiciousIPs.includes(log.ip) || log.status === "ALERT") {
      events.push(log);
    }
  }
  return events;
}

// 2. Collect unique listed IPs with failed LOGIN events (simulation only).
function buildBlacklist(logs) {
  const ips = [];
  for (const log of logs) {
    if (suspiciousIPs.includes(log.ip) && log.eventType === "LOGIN" &&
        log.status === "FAILED" && !ips.includes(log.ip)) {
      ips.push(log.ip);
    }
  }
  return ips;
}

// 3. Every supplied recovery check must pass; no real recovery is performed.
function checkRecovery(checks) {
  const results = [];
  let allPassed = true;
  for (const [name, value] of Object.entries(checks)) {
    const passed = value === true;
    results.push((passed ? "PASS: " : "FAIL: ") + name);
    if (!passed) allPassed = false;
  }
  results.push(allPassed ? "RECOVERY COMPLETE" : "RECOVERY INCOMPLETE");
  return results;
}
