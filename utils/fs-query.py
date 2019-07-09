#!/usr/bin/env python3

import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


def main():
    cred = credentials.Certificate(
        "/home/gar/media/credentials/cwla/cornerstone-wla-firebase-adminsdk-lud9w-d2834e7e6f.json"
    )
    app = firebase_admin.initialize_app(cred)
    db = firestore.client()
    col = db.collection("rfkc-expenses")
    records = []
    for doc in col.stream():
        record = doc.to_dict()
        record.update({"id": doc.id})
        records.append(record)
    expenses = pd.DataFrame(records)
    expenses.set_index("id")
    print(expenses)
    expenses.to_csv("expenses.csv")


if __name__ == "__main__":
    main()
