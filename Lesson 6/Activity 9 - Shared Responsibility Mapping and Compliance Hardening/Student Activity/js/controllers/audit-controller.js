"use strict";

const auditHistory = [];
const byId = (id) => document.getElementById(id);
function renderAudit(audit) {
  byId("checked").textContent = audit.checked;
  byId("passed").textContent = audit.passed;
  byId("failed").textContent = audit.failed;
  byId("pending").textContent = audit.pending;
  byId("score").textContent = audit.score === null ? "—" : `${audit.score}%`;
  byId("scoreRing").style.setProperty("--score", `${audit.score ?? 0}%`);
  const scoreColor =
    audit.score === null
      ? "#eeeeee"
      : audit.score <= 50
        ? "#dc2626"
        : audit.score <= 80
          ? "#ea580c"
          : "#16a34a";
  byId("scoreRing").style.setProperty("--score-color", scoreColor);
  byId("score").style.color = scoreColor;

  byId("scoreNote").textContent = audit.pending
    ? `${audit.pending} control(s) not implemented; excluded from score.`
    : "All six controls are included in this score.";
  byId("resultCount").textContent =
    `${audit.checked} OF ${audit.results.length} CHECKED`;
  byId("controlList").replaceChildren(
    ...audit.results.map((result) => {
      const row = document.createElement("div");
      row.className = "control";
      const icon = document.createElement("span");
      icon.className = `control-icon control-icon--${result.status}`;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "icon");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      const paths = {
        pass: "M20 6 9 17l-5-5",
        fail: "M12 3 2.5 20h19L12 3Zm0 6v4m0 3h.01",
        pending: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
      };
      path.setAttribute("d", paths[result.status]);
      svg.append(path);
      icon.append(svg);
      const text = document.createElement("div");
      const name = document.createElement("div");
      name.className = "control-name";
      name.textContent = result.name;
      const detail = document.createElement("div");
      detail.className = "control-detail";
      detail.textContent = result.detail;
      text.append(name, detail);
      const status = document.createElement("span");
      status.className = `status ${result.status}`;
      status.textContent =
        result.status === "pending"
          ? "NOT IMPLEMENTED"
          : result.status.toUpperCase();
      row.append(icon, text, status);
      return row;
    }),
  );
}
function renderHistory() {
  byId("historyList").replaceChildren(
    ...auditHistory.map((audit, index) => {
      const row = document.createElement("div");
      row.className = "history-row";
      const label = document.createElement("strong");
      label.textContent = index === 0 ? "Initial audit" : `Audit ${index + 1}`;
      const summary = document.createElement("span");
      summary.textContent = `${audit.time.toLocaleTimeString()} · ${audit.checked} checked · ${audit.passed} passed · ${audit.failed} failed · ${audit.pending} pending · ${audit.score === null ? "—" : audit.score + "%"}`;
      row.append(label, summary);
      return row;
    }),
  );
}
byId("runAudit").addEventListener("click", () => {
  const audit = runAudit();
  renderAudit(audit);
  auditHistory.push(audit);
  renderHistory();
});
