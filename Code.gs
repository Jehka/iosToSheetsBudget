// Apps Script for: iOS Shortcut -> Google Sheets Budget Tracker
function doGet(e) {
  return ContentService.createTextOutput("Budget Tracker WebApp is live.")
                       .setMimeType(ContentService.MimeType.TEXT);
}
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No POST data received"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Budget");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Sheet not found. Make sure a tab named 'Budget' exists."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    var date = Utilities.formatDate(new Date(), "GMT+5:30", "dd-MMM-yyyy");
    var amountValue = Number(data.amount) || 0;
    var amountStr = "₹" + amountValue.toFixed(2);
    sheet.appendRow([date, amountStr, data.category||"", data.note||"", data.explanation||""]);
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.message}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
function sendWeeklySummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Budget");
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var today = new Date(), weekAgo = new Date(); weekAgo.setDate(today.getDate()-7);
  var totalsByPayment = {}, totalsByNote = {}, grandTotal = 0;
  for (var i=1;i<data.length;i++){
    var row = data[i], rowDate = new Date(row[0]);
    if (rowDate>=weekAgo && rowDate<=today){
      var amt=parseFloat((row[1]||"").toString().replace(/[^\d.-]/g,""))||0;
      grandTotal+=amt;
      totalsByPayment[row[2]||"Unknown"]=(totalsByPayment[row[2]]||0)+amt;
      totalsByNote[row[3]||"Uncategorized"]=(totalsByNote[row[3]]||0)+amt;
    }
  }
  var body="Weekly Expense Summary\n\nTotal: ₹"+grandTotal.toFixed(2)+"\n\nBy Payment Method:\n";
  for(var p in totalsByPayment) body+="- "+p+": ₹"+totalsByPayment[p].toFixed(2)+"\n";
  body+="\nBy Category (Notes):\n";
  for(var n in totalsByNote) body+="- "+n+": ₹"+totalsByNote[n].toFixed(2)+"\n";
  MailApp.sendEmail({to: Session.getActiveUser().getEmail(), subject: "Weekly Expense Summary", body: body});
}
