const functions = require('firebase-functions');
const { google } = require('googleapis');
const admin = require('firebase-admin');

admin.initializeApp();

const jwtClient = new google.auth.JWT(
  functions.config().api_project.email,
  null,
  functions.config().api_project.private_key.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
)

const sheets = google.sheets('v4')

exports.syncToSheets = functions.firestore
  .document('rfkc-expenses/{id}')
  .onCreate(appendSheet)

function appendSheet(snapshot) {
  let id = snapshot.id
  let exp = snapshot.data()

  console.log(exp)
  //authenticate request
  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error('jwt error: ' + err)
      return
    }

    let resource = {
      values: [
        [
          id,
          exp.name,
          exp.date,
          exp.amount,
          exp.description,
          exp.vendor,
          exp.category,
          exp.expense,
          exp.receiptFilename
        ]
      ]
    }

    var request = {
      spreadsheetId: functions.config().rfkc_expense_sheet.id,
      range: 'Expenses',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource,
      auth: jwtClient,
    }

    sheets.spreadsheets.values.append(request, (err, response) => {
      if (err) {
        console.error('sheet error: ' + err)
        return
      }
      console.log(response)
    })
  })
  return true
}