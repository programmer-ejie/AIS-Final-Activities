# Student Exercise: Analyze and Test an Incident-Response Program

Duration: 90 minutes. Work individually or in small groups as directed.

## Objective

Use the supplied working JavaScript to interpret fictional security logs, explain detection rules, test recovery decisions, and justify response recommendations. No function implementation is required.

## Start

1. Open `index.html`. The eight supplied evidence records load automatically; no file selection or server is required.
2. Review the eight events. Read the three completed functions in `service.js`; `controller.js` processes evidence and calls those functions; `background.js` supplies interface controls and Word exports.
3. Predict the output before clicking **Analyze logs**. Run it twice and record the results.
4. Use **Guide Questions** in the navigation bar. Answer all eight questions with timestamps and explanations.
5. Download answers before refreshing. They are not saved automatically; paste saved text back into the boxes or combine downloaded copies for submission.

## Required tests

Record the test, expected output, actual output, PASS/FAIL, and security interpretation in your guide answers.

- Original JSON: five flagged events (09:05:00, 09:05:30, 09:06:00, 09:07:00, 09:08:00); two unique blacklist IPs (198.51.100.24 and 203.0.113.77).
- Analyze twice: still five events and two unique addresses.
- All recovery values true: five PASS lines and RECOVERY COMPLETE.
- In `service.js`, change only `servicesHealthy` to false, save, refresh, wait for evidence to load automatically, and verify: four PASS lines, one FAIL line, and RECOVERY INCOMPLETE. Restore true afterward.

The original JSON must remain unchanged. The temporary recovery setting is the only required code edit. An event flag does not prove compromise; the blacklist does not block traffic; supplied booleans do not independently verify a real restoration.

## Schedule

| Minutes | Work |
| --- | --- |
| 0-10 | Incident briefing and log fields. |
| 10-25 | Instructor demonstration and predictions. |
| 25-45 | Group analysis of evidence and code conditions. |
| 45-65 | Repeated-run and recovery tests; record results. |
| 65-80 | Group findings and response recommendations. |
| 80-90 | Debrief, individual reflection, and submission. |

## Submit and assessment

Submit `guide_question_answers.docx` (combine saved copies if needed) and screenshots of analysis and both recovery outcomes. Include names and section. The incident report box and checklist are available for an optional follow-up; a full report is not required in this 90-minute activity.

- Evidence-based interpretation: 30 points.
- Explanation of detection, uniqueness, and limitations: 25 points.
- Expected versus actual test results: 25 points.
- Justified containment and recovery recommendations: 20 points.

## Evidence source

For offline use, index.html includes a copy of incident_logs.json in its evidence-data block. The page reads that embedded copy automatically. If an instructor changes the evidence later, update both copies together.
