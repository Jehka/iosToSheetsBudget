# ios-to-sheets-budget
Lightweight expense tracker: iOS Shortcut → Google Apps Script → Google Sheets  
Logs: Date | Amount | Category (UPI/Cash) | Notes (actual category) | Explanation  
Sends weekly summary email.

## Files
- `Code.gs` — Apps Script (doPost, doGet, sendWeeklySummary)
- `shortcuts/Log Expense.shortcut.json` — iOS Shortcut JSON (importable)
- `sheet-template.csv` — sample sheet template
- `LICENSE` — MIT

## Setup (quick)
1. Create a Google Sheet. Name the tab `Budget` (or change the name in `Code.gs` consistently).
2. In the sheet, ensure header row:

Date | Amount | Category | Notes | Explanation

3. Open **Extensions → Apps Script**, paste `Code.gs`. Save.
4. Deploy:
- Click **Deploy → New deployment** → Select **Web App**.
- Execute as: **Me**
- Who has access: **Anyone**
- Deploy and copy the Web App URL.
5. Edit the iOS Shortcut:
- Import `shortcuts/Log Expense.shortcut.json` into Shortcuts.
- Replace `<YOUR_WEB_APP_URL>` with the Web App URL from step 4.
6. Test:
- Run the Shortcut on your iPhone, fill fields, and confirm the row appears in the sheet.
7. Weekly summary:
- In Apps Script editor, click **Triggers** (left clock icon).
- Add Trigger: `sendWeeklySummary` → Time-driven → Week timer → pick day/time.

## Notes & troubleshooting
- If you see `No POST data received`, ensure the Shortcut sends JSON and has header `Content-Type: application/json`.
- If `Sheet not found`, confirm the tab name in the spreadsheet matches the name in the script.
- To change timezone formatting, update `"GMT+5:30"` in `Code.gs`.

## License
MIT
