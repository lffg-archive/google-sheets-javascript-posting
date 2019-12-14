//
// Original version from:
// https://medium.com/@dmccoy/how-to-submit-an-html-form-to-google-sheets-without-google-forms-b833952cc175
//

/* eslint-disable no-var */
/*globals PropertiesService, LockService, SpreadsheetApp, ContentService*/

function doGet(e) {
  return handleResponse(e);
}

var SHEET_NAME = 'RESULT_LIST';
var SCRIPT_PROP = PropertiesService.getScriptProperties();

function handleResponse(e) {
  // https://gsuite-developers.googleblog.com/2011/10/concurrency-and-google-apps-script.html
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);

    // We'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    var nextRow = sheet.getLastRow() + 1; // get next row

    var row = [];

    headers.forEach(function(header) {
      if (header === 'TIMESTAMP') {
        row.push(Date.now());
      } else {
        row.push(e.parameter[header]);
      }
    });

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', row: nextRow })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: e })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
