import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate('/home/gar/media/credentials/cwla/cornerstone-wla-firebase-adminsdk-lud9w-d2834e7e6f.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()
col = = db.collection('rfkc-expenses')
col = db.collection('rfkc-expenses')
docs = [d for d in col.stream()]
docs
docs[0]
d = docs[0]
d.to_dict()
docs = [d.to_dict() for d in col.stream()]
docs
expenses = pd.DataFrame(docs)
expenses
expenses[expenses['name'].str.contains('Leslie')]
les = expenses[expenses['name'].str.contains('Leslie')]
ls
les
les.sort_values('amount')
les.sort_values('amount', ascending=False)
print(les.sort_values('amount', ascending=False))
les.to_dense()
les.to_string()
les.to_csv()
les.to_csv('/tmp/leslie.csv')
expenses.size
expenses.to_clipboard()
expenses.to_csv('/home/gar/media/rfkc/fb.csv')

