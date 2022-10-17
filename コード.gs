function main() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('メール')
  const body = sheet.getRange('B2:B2').getValue();
  const itemSheet = spreadsheet.getSheetByName('main')
  const items = Item.createFromEmailBody(itemSheet, body)
  for(const item of items){
    item.appendRow();
  }
}
