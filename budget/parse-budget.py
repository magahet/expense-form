#!/usr/bin/env python3

import csv
import json
import argparse
from collections import defaultdict


def main():
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('filename', help='CSV file to parse')
    args = parser.parse_args()

    options_groups = defaultdict(list)

    with open(args.filename, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            options_groups[row['Category']].append({
                'text': row['Expense'],
                'value': {'category': row['Category'], 'expense': row['Expense']}
            })
    
    print(json.dumps(options_groups, indent=2))


if __name__ == "__main__":
    main()