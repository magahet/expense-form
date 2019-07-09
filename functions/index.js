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
  let exp = snapshot.data()

  console.log(exp)
  //authenticate request
  jwtClient.authorize((err, tokens) => {
    console.log('jwt error: ' + err)

    let resource = {
      values: [
        [
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
      resource,
      auth: jwtClient,
    }

    sheets.spreadsheets.values.append(request, (err, response) => {
      console.log('sheet error: ' + err)
      console.log(response)
    })
  })
  return true
}