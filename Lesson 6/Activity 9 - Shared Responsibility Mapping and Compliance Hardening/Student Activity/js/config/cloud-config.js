"use strict";

// Simulated settings only. Refreshing the page restores these starter values.
const cloudConfig = {
  adminCredentials: { unique: true, defaultPasswordChanged: false },
  firewall: { unrestrictedAdminAccess: true, adminSource: "0.0.0.0/0" },
  logging: { enabled: false, retentionDays: 30, protectedFromChanges: false },
  storage: { encrypted: false, encryptedInTransit: false },
 
};
