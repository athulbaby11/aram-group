# Google Sheet Integration Setup

This project sends Contact Drawer form data to a Google Sheet using Google Apps Script Web App.

## 1) Create the target Google Sheet
1. Create a new Google Sheet.
2. Rename the first sheet tab to `Leads` (or keep any name you prefer).
3. Add headers in row 1:
   - Timestamp
   - Full Name
   - Email
   - Phone
   - Notes
   - Page URL

4. Add one more sheet tab for backups:
  - Sheet name: `Leads_Backup`

## 2) Create Apps Script Web App
1. In the same sheet, open Extensions -> Apps Script.
2. Replace default code with:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads');
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, message: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var payload = e.parameter || {};
    var body = e.postData && e.postData.contents ? e.postData.contents : '';

    if (!payload.fullName && body) {
      try {
        payload = JSON.parse(body);
      } catch (err) {
        payload = {};
      }
    }

    // Honeypot field: if bot fills this hidden field, ignore submission.
    if (payload.website && String(payload.website).trim()) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'ignored' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      payload.submittedAt || new Date().toISOString(),
      payload.fullName || '',
      payload.email || '',
      payload.phone || '',
      payload.notes || '',
      payload.page || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function backupLeads() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var source = ss.getSheetByName('Leads');
  var backup = ss.getSheetByName('Leads_Backup');

  if (!source || !backup) {
    throw new Error('Leads or Leads_Backup sheet not found');
  }

  var values = source.getDataRange().getValues();
  if (!values || values.length <= 1) {
    return;
  }

  var timestamp = new Date().toISOString();
  var rows = [];

  for (var i = 1; i < values.length; i++) {
    rows.push([timestamp].concat(values[i]));
  }

  if (backup.getLastRow() === 0) {
    backup.appendRow([
      'Backup Time',
      'Timestamp',
      'Full Name',
      'Email',
      'Phone',
      'Notes',
      'Page URL'
    ]);
  }

  backup
    .getRange(backup.getLastRow() + 1, 1, rows.length, rows[0].length)
    .setValues(rows);
}

function setupBackupTrigger() {
  var triggers = ScriptApp.getProjectTriggers();

  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'backupLeads') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('backupLeads')
    .timeBased()
    .everyHours(12)
    .create();
}
```

## 3) Deploy
1. Click Deploy -> New deployment.
2. Type: Web app.
3. Execute as: Me.
4. Who has access: Anyone.
5. Deploy and copy the Web App URL.

## 4) Add endpoint in this project
Open `index.html` and set URL in form attribute:

```html
<form id="contactDrawerForm" class="drawer-form" data-sheet-endpoint="PASTE_WEB_APP_URL_HERE" novalidate>
```

## 5) Test
1. Open website.
2. Submit Contact form.
3. Verify new row in Google Sheet.

## 6) Enable automatic backup every 12 hours
1. In Apps Script, run `setupBackupTrigger` once.
2. Accept Google permissions.
3. Verify in Triggers page that `backupLeads` is scheduled every 12 hours.
4. Check `Leads_Backup` sheet after the first run.

## Notes
- If Google asks authorization during first deployment, allow it.
- Every script update may require a new deployment version.
- Keep field names unchanged in form (`fullName`, `email`, `phone`, `notes`).
- Keep anti-bot fields unchanged (`captchaAnswer`, `website`).
