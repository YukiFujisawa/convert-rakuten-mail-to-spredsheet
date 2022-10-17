const KEYWORD = '10%税込';


const ITEM_COLS = new Map([
  [0, 'itemName'],
  [1, 'price'],
  [2, 'qty'],
  [3, 'total'],
  [4, 'url'],
]);
class Item {
  constructor(sheet, record) {
    this.sheet = sheet;
    for (const [key, value] of ITEM_COLS) {
      this[value] = record[key];
    }
  }
  static createFromEmailBody(sheet, body) {
    const bodyRows = body.split(/\r\n|\n|\r/);
    let itemCount = 0;
    for (const row of bodyRows) {
      if (row.includes(KEYWORD)) {
        itemCount += 1;
      }
    }
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const record = [];
      let bodyCount = 0
      for (const row of bodyRows) {
        bodyCount += 1;
        if (row.includes(KEYWORD)) {
          items.push(new Item(sheet, record));
          for (let j = 0; j < bodyCount; j++) {
            bodyRows.shift();
          }
          break;
        } else {
          if (row.indexOf('>  <https://item.rakuten.co.jp') === 0) {
            let url = row.split(' <')[1].replace('>', '').trim();
            record[4] = url;
          } else if (row.indexOf(' <https://item.rakuten.co.jp') > 0) {
            let itemName = row.split(' <')[0].replace('>', '').trim();
            record[0] = itemName;
          } else if (row.includes('円')) {
            const array = row.split(' ');
            record[1] = array[1].replace('円', '').replace(',', '');
            record[2] = array[3].replace('個', '');
            record[3] = array[5].replace('円', '').replace(',', '');
          }
        }
      }
    }
    return items;
  }
  /**
   * @return {Object[]}
   */
  toArray() {
    const result = [];
    for (const [key, value] of ITEM_COLS) {
      result.push(this[value]);
    }
    return result;
  }

  /**
   * @return {number} ID
   */
  appendRow() {
    return this.sheet.appendRow(this.toArray());
  }
}

function testCreateFromEmailBody() {
  const spreadsheet = SpreadsheetApp.openById('12anhMGmIxEsIP9JItBezfD-6hJ_I7_7U3jqObYEZVIg')
  const sheet = spreadsheet.getSheetByName('メール例')
  const itemSheet = SpreadsheetApp.getActiveSheet();
  const body = sheet.getRange('B2:B2').getValue();
  const items = Item.createFromEmailBody(itemSheet, body)
  Logger.log(items);
}
