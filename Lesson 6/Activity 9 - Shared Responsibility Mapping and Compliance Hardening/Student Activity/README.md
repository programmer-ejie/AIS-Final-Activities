# CSCAS — Activity 9 starter

A browser-only educational simulation for Laboratory 6. No cloud account, server, installation, or paid service is needed. Open `index.html` in a modern browser. The configuration and audit history reset on refresh.

## Classroom setup

1. Accept your GitHub Classroom assignment or create your own repository from the instructor's starter.
2. Clone your repository: `git clone https://github.com/OWNER/REPOSITORY.git` (replace the placeholder with your actual URL).
3. Open the folder in VS Code and open `index.html` in a browser.
4. Follow [Student guide.pdf](Student%20guide.pdf), complete the TODOs in `js/config/cloud-config.js` and `js/services/audit-service.js`, and prepare your own responsibility matrix and PDF audit report.
5. Commit and push to your own repository, and submit the required files, screenshots, report, and repository link through your LMS. Do not push directly to the instructor's starter repository.

## Starter behavior

Click **Run audit**. Four controls are evaluated: credentials, firewall, logging, and encryption. Encryption passes; credentials, firewall, and logging fail. MFA and disclosure are deliberately **not implemented**, not passing. The starter score is 25% (1 of 4 implemented checks). After students implement both checks with the specified initial values, the expected initial audit is 2 of 6 passing (33%), with credentials, firewall, logging, and MFA failing. After the student patch and a second audit, the expected result is 6 of 6 passing (100%).

The score is rounded to the nearest whole percent and excludes pending checks. The audit history shows each run in the current page session; console output contains the detailed result objects. Correct failing simulated settings in the configuration, save your changes, refresh the page, and run another audit to verify them.

## Files

- `index.html` — dashboard structure
- `style.css` — responsive dashboard styling
- `js/config/cloud-config.js` - simulated configuration and student TODO
- `js/services/audit-service.js` - checks and student TODO
- `js/controllers/audit-controller.js` - dashboard rendering and button events
- `js/routes/router.js` - navigation between views
- `Student guide.pdf` — step-by-step activity instructions
