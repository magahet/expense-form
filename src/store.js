/* eslint-disable */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import moment from 'moment'


// Initialize Firebase, copy this from the cloud console
// Or use mine :)
var config = {
  apiKey: "AIzaSyBR_HIFL2P87OelyzJvrXfxT4Lat5qPqjM",
  authDomain: "cornerstone-wla.firebaseapp.com",
  databaseURL: "https://cornerstone-wla.firebaseio.com",
  projectId: "cornerstone-wla",
  storageBucket: "cornerstone-wla.appspot.com",
  messagingSenderId: "949974617408"
}

firebase.initializeApp(config)

const db = firebase.firestore()
const expenses = db.collection('rfkc-expenses')
const storage = firebase.storage().ref().child('rfkc-expenses/2019')

// The shared state object that any vue component can get access to.
// Has some placeholders that we’ll use further on!
export const store = {
  async save(data) {
    //put request upload file to firebase storage
    let fileUrl = ''

    if (data.file) {
      let extension = data.file.name.split('.').pop()
      let imageRef = storage.child(slugify(data.name) + '/' + moment().format() + extension)

      await imageRef.put(data.file)
      fileUrl = await imageRef.getDownloadURL()
    }

    data.expenses.forEach(expense => {
      expenses.add({
        name: data.name,
        category: expense.category.category,
        expense: expense.category.expense,
        date: expense.date,
        description: expense.description,
        amount: postTaxTotal(expense.amount, data.taxRate),
        receiptFilename: fileUrl,
        vendor: expense.vendor,
      })
    })
  },
}

function postTaxTotal(amount, taxRate) {
  if (!taxRate || isNaN(taxRate) || taxRate > 1) {
    return +amount
  }
  return amount * (1 + taxRate)
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
