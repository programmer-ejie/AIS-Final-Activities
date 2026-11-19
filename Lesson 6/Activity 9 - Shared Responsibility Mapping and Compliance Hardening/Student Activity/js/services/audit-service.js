"use strict";

// Simulated settings only. Refreshing the page restores these starter values.
const cloudConfig = {
  adminCredentials: { unique: true, defaultPasswordChanged: false },
  firewall: { unrestrictedAdminAccess: true },
  logging: { enabled: false },
  storage: { encrypted: true },
  // TODO 1: Add properties for MFA and a disclosure policy.
  // Choose clear names and initial values: MFA should fail; disclosure should pass.
};

// Each implemented check returns a boolean. A null check is deliberately pending;
// pending checks are never counted as passing or included in the score.
const controls = [
  {
    id: "credentials",
    name: "Administrator credentials",
    detail: "Unique credentials and changed default password",
    check: (c) =>
      c.adminCredentials.unique && c.adminCredentials.defaultPasswordChanged,
  },
  {
    id: "firewall",
    name: "Firewall rules",
    detail: "Administrator access is not open to everyone",
    check: (c) => !c.firewall.unrestrictedAdminAccess,
  },
  {
    id: "logging",
    name: "System logging",
    detail: "Audit logging is enabled",
    check: (c) => c.logging.enabled,
  },
  {
    id: "encryption",
    name: "Data encryption",
    detail: "Stored data is encrypted",
    check: (c) => c.storage.encrypted,
  },
  {
    id: "mfa",
    name: "Multi-factor authentication",
    detail: "MFA is enforced for administrators",
    check: null,
  },
  {
    id: "disclosure",
    name: "Disclosure policy",
    detail: "A security disclosure policy is present",
    check: null,
  },
  // TODO 2: Replace both null values above with validation functions that
  // return true or false based on the properties you added to cloudConfig.
];

function runAudit() {
  const results = controls.map((control) => {
    if (typeof control.check !== "function")
      return { ...control, status: "pending" };
    const result = control.check(cloudConfig);
    // A missing value must not silently become a pass.
    return { ...control, status: result === true ? "pass" : "fail" };
  });
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const pending = results.filter((r) => r.status === "pending").length;
  const checked = passed + failed;
  const score = checked ? Math.round((passed / checked) * 100) : null;
  const audit = {
    results,
    passed,
    failed,
    pending,
    checked,
    score,
    time: new Date(),
  };
  console.log("Audit results:", audit);
  return audit;
}

function applyRemediationPatch() {
  // TODO 3: Change the simulated settings that cause the credentials, firewall, logging, and MFA
  // failures. Do not change passing controls just to make the audit pass.
  // Return true when your patch has been implemented, then run a new audit.
  return false;
}
