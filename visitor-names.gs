/**
 * Visitor name collector for the portfolio chatbot.
 * Stores each visitor's name in a Google Sheet, skipping duplicates
 * (case-insensitive). Deploy this as a Web App and paste its URL into
 * homepage.html (the SHEET_ENDPOINT constant).
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // avoid race conditions on simultaneous visitors
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Name', 'First seen']);
    }

    var data = JSON.parse(e.postData.contents);
    var name = (data.name || '').toString().trim().replace(/\s+/g, ' ');
    if (!name) {
      return json({ status: 'error', message: 'empty name' });
    }

    // Case-insensitive duplicate check against the Name column.
    var duplicate = false;
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 1, last - 1, 1).getValues();
      var lower = name.toLowerCase();
      duplicate = existing.some(function (row) {
        return row[0].toString().trim().toLowerCase() === lower;
      });
    }

    if (!duplicate) {
      sheet.appendRow([name, new Date()]);
    }

    return json({ status: 'ok', duplicate: duplicate });
  } catch (err) {
    return json({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
