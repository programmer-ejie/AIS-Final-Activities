# Student Exercise: Incident Response and Documentation

Duration: 8 hours. Work individually or in pairs as directed.

## Start here

You will write three JavaScript functions using arrays, loops, and conditions. The HTML, JSON loading, sorting, and display code are already complete. You do not need to write DOM or file-loading code.

1. Open `index.html` and select this folder's `incident_logs.json` using **Load evidence**.
2. Open `script.js`. Complete only the three functions marked TASK 1, TASK 2, and TASK 3.
3. Save, refresh the page, and load the JSON again after every code change. Check the F12 Console if an error occurs.
4. Empty analysis results are expected before you complete the functions.

## Files and roles

| File                          | Your responsibility                                                    |
| ----------------------------- | ---------------------------------------------------------------------- |
| `script.js`                   | Complete three functions and test the recovery setting.                |
| `incident_logs.json`          | Read the eight events. Keep the original; save a copy for extra tests. |
| `support.js` and `index.html` | Provided working interface and loader. No edits needed.                |
| `incident_report.txt`         | Replace with your downloaded completed report.                         |
| `recovery_checklist.txt`      | Record your verification results.                                      |
| `incident_logs.txt`           | Reference pointer only; the application does not read it.              |

## Task 1: Detect suspicious events

Complete `detectSuspiciousEvents(logs)`. Return an array containing each event whose IP appears in `suspiciousIPs` OR whose status is `ALERT`. Add each qualifying event once, even if it meets both conditions. Keep the original records unchanged. Sorting is already provided.

These are explicit rules for this fictional scenario. They flag evidence for investigation; a failed login alone does not prove a successful compromise.

Expected result with the original JSON: **5 suspicious events**, at 09:05:00, 09:05:30, 09:06:00, 09:07:00, and 09:08:00. The denied folder request at 09:02:00 is not flagged by these rules.

## Task 2: Build a simulated blacklist

Complete `buildBlacklist(logs)`. Return unique IPs from suspicious-source records where eventType is LOGIN AND status is FAILED.

Expected result: **2 unique IPs**, `198.51.100.24` and `203.0.113.77`. The repeated failure at 09:05:30 must not create a duplicate. Running Analyze logs twice must still show only two IPs.

This array does not configure a firewall. Explain what authorized containment actions you would recommend after preserving evidence.

## Task 3: Verify simulated recovery

Complete `checkRecovery(checks)`. Return an array of strings: one PASS or FAIL line per property, followed by one final message.

- All five properties true: **5 PASS lines** followed by `RECOVERY COMPLETE`.
- Change `servicesHealthy` to false, save, refresh, and load the JSON: **4 PASS lines and 1 FAIL line** followed by `RECOVERY INCOMPLETE`.
- Restore `servicesHealthy` to true when finished.

These values represent provided verification evidence. They do not perform backup restoration or prove a real system is safe.

## Test your work

Record expected and actual results in `test_notes.txt`:

1. Original JSON: five suspicious events and two unique blacklist IPs.
2. Analyze twice: no duplicate blacklist entries.
3. All recovery checks true: recovery complete.
4. One recovery check false: recovery incomplete.
5. Save a copy as `incident_logs_test.json`. Add one normal SUCCESS event from `192.168.1.22` and one FAILED LOGIN from `198.51.100.24`, each with a valid timestamp and all required string fields. Load that copy: six suspicious events, still two blacklist IPs. Keep the original JSON unchanged.

## Short incident report

Use the report box on the page, then download it. Write a short paragraph or a few sentences for each provided section. Cite timestamps, distinguish observations from conclusions, recommend containment and eradication, state recovery test results, and identify authorized incident/privacy staff by role as reporting recipients. Do not include real personal data. Complete the recovery checklist with your observed results.

## Suggested schedule

- Hour 1: Briefing, evidence review, and explanation of provided code.
- Hours 2-3: Detection function.
- Hour 4: Unique blacklist function.
- Hour 5: Recovery function.
- Hour 6: Test cases and corrections.
- Hour 7: Report and checklist.
- Hour 8: Student demonstrations and submission.

## Submit and grading

Submit the project folder with completed `script.js`, unchanged original JSON, your test JSON, provided HTML and support.js, downloaded incident report, completed recovery checklist, and `test_notes.txt`. Include screenshots of analysis and both recovery outcomes.

- Detection accuracy and preserved evidence: 30 points.
- Unique blacklist and repeated-run behavior: 20 points.
- Recovery function and pass/fail tests: 20 points.
- Evidence-based short report and checklist: 20 points.
- Test notes and working demonstration: 10 points.
