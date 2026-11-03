"use strict";

// Find each HTML control once. The names below describe its purpose.
const fileStatus = document.getElementById("file-status");
const logsTable = document.getElementById("logs");
const outputBox = document.getElementById("output");
const reportBox = document.getElementById("report");
const showButton = document.getElementById("show");
const analyzeButton = document.getElementById("analyze");
const recoverButton = document.getElementById("recover");
const resetButton = document.getElementById("reset");
const downloadButton = document.getElementById("download");

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
  outputBox.textContent = lines.join("\n");
  for (const line of lines) {
    console.log(line);
  }
}

function resetDisplay() {
  firewallBlacklistIPs = [];
  logsTable.replaceChildren();
  writeOutput([
    "Display reset. Loaded JSON evidence and your report text were retained.",
  ]);
}

// 7. Download the report box contents as a text file.
function downloadReport() {
  const reportText = reportBox.value;
  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "incident_report.txt";
  link.click();

  function releaseDownloadURL() {
    URL.revokeObjectURL(url);
  }
  setTimeout(releaseDownloadURL, 1000);
}

// 8. Connect each control to the function it runs.
showButton.addEventListener("click", showEvidence);
analyzeButton.addEventListener("click", analyzeSystemBreach);
recoverButton.addEventListener("click", verifyRecovery);
resetButton.addEventListener("click", resetDisplay);
downloadButton.addEventListener("click", downloadReport);
reportBox.value = reportTemplate;
loadEvidence();

// Export the student's analysis separately from the incident report.
function downloadAnswers() {
  const lines = ["GUIDE QUESTION ANSWERS - Lesson 5", "Name(s) / Section: " + document.getElementById("student-name").value, ""];
  lines.push("1. Evidence and detection", "Which five events are flagged? Cite each timestamp and explain which condition matches. Why is the denied request at 09:02:00 not flagged?", document.getElementById("answer-1").value, "");
  lines.push("2. Successful login", "Why is the successful login at 09:06:00 flagged? Does SUCCESS prove that access was authorized? What additional evidence would you request?", document.getElementById("answer-2").value, "");
  lines.push("3. OR condition", "The internal IP at 09:07:00 is not in suspiciousIPs. Why is its event included? What would change if the detection OR operator (||) were replaced with AND (&&)? Predict without editing the code.", document.getElementById("answer-3").value, "");
  lines.push("4. Unique blacklist", "Explain each condition in buildBlacklist(). Why do the repeated failures at 09:05:00 and 09:05:30 produce one address? Does this array actually block traffic?", document.getElementById("answer-4").value, "");
  lines.push("5. Repeated analysis test", "Predict the suspicious-event count and unique blacklist IPs. Click Analyze logs twice. Record your expected result, actual result, and PASS/FAIL. Explain why addresses do not accumulate.", document.getElementById("answer-5").value, "");
  lines.push("6. Recovery tests", "Run recovery with all five values true. Then change servicesHealthy to false in status.js, save, refresh, wait for evidence to load automatically, and verify again. Record expected and actual results for both tests, then restore true. Download your answers before refreshing.", document.getElementById("answer-6").value, "");
  lines.push("7. Recovery evidence", "Does RECOVERY COMPLETE prove a real server is safe? Choose two recovery properties and describe the real evidence needed to support each PASS.", document.getElementById("answer-7").value, "");
  lines.push("8. Response and limitations", "Recommend two authorized containment actions and explain their purpose. Describe one concerning event the supplied rules could miss, and distinguish observed facts from conclusions that still need investigation.", document.getElementById("answer-8").value, "");
  const blob = createWordDocument(lines);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "guide_question_answers.docx";
  link.click();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}
document.getElementById("download-answers").addEventListener("click", downloadAnswers);

// Build a real Word document locally, without a server or internet connection.
function createWordDocument(lines) {
  function escapeXML(text) {
    return text.replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[character];
    }).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "");
  }

  // Each line becomes a paragraph. Keep typed line breaks and spacing.
  const paragraphs = [];
  function textRun(text, bold) {
    const properties = bold ? "<w:rPr><w:b/></w:rPr>" : "";
    const escaped = escapeXML(text).replace(/\t/g, '</w:t><w:tab/><w:t xml:space="preserve">');
    return '<w:r>' + properties + '<w:t xml:space="preserve">' + escaped + '</w:t></w:r>';
  }

  // After the three introduction lines, each question has four entries:
  for (let index = 0; index < lines.length; index++) {
    const position = index >= 3 ? (index - 3) % 4 : -1;
    const isQuestion = position === 0 || position === 1;
    const isAnswer = position === 2;
    const typedLines = lines[index].split(/\r\n|\r|\n/);
    for (let lineNumber = 0; lineNumber < typedLines.length; lineNumber++) {
      let runs = "";
      if (isAnswer && lineNumber === 0) {
        runs += textRun("Answer: ", true);
      }
      runs += textRun(typedLines[lineNumber], isQuestion);
      paragraphs.push("<w:p>" + runs + "</w:p>");
    }
  }
  const files = [
    ["[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ["_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ["word/document.xml", '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + paragraphs.join("") + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>']
  ];
  return createWordArchive(files);
}

// A .docx file is a ZIP archive of XML files. Store them without compression.
function createWordArchive(files) {
  const encoder = new TextEncoder();
  const parts = [];
  const directory = [];
  let offset = 0;
  let directorySize = 0;

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  for (const [filename, content] of files) {
    const name = encoder.encode(filename);
    const data = encoder.encode(content);
    const checksum = crc32(data);
    const header = new Uint8Array(30 + name.length);
    const local = new DataView(header.buffer);
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true);
    local.setUint16(12, 33, true); // January 1, 1980: valid ZIP date.
    local.setUint32(14, checksum, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    header.set(name, 30);
    parts.push(header, data);

    const entry = new Uint8Array(46 + name.length);
    const central = new DataView(entry.buffer);
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(14, 33, true);
    central.setUint32(16, checksum, true);
    central.setUint32(20, data.length, true);
    central.setUint32(24, data.length, true);
    central.setUint16(28, name.length, true);
    central.setUint32(42, offset, true);
    entry.set(name, 46);
    directory.push(entry);
    directorySize += entry.length;
    offset += header.length + data.length;
  }

  const end = new Uint8Array(22);
  const footer = new DataView(end.buffer);
  footer.setUint32(0, 0x06054b50, true);
  footer.setUint16(8, files.length, true);
  footer.setUint16(10, files.length, true);
  footer.setUint32(12, directorySize, true);
  footer.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}
