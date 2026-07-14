#!/usr/bin/env python3
"""Validate and normalize the minimum inputs for a repository-style API resource."""
from __future__ import annotations
import argparse
import json
import re

def identifier(value: str) -> str:
    if not re.fullmatch(r'[a-z][A-Za-z0-9]*', value):
        raise argparse.ArgumentTypeError('must be lower camel case')
    return value

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--singular', required=True, type=identifier)
parser.add_argument('--plural', required=True, type=identifier)
parser.add_argument('--profile', choices=('crud', 'lookup'), default='crud')
parser.add_argument('--public', nargs='*', default=())
args = parser.parse_args()
allowed = {'create', 'read', 'update', 'delete', 'list'} if args.profile == 'crud' else {'list'}
unknown = set(args.public) - allowed
if unknown:
    parser.error('unsupported public operations: ' + ', '.join(sorted(unknown)))
print(json.dumps({'singular': args.singular, 'plural': args.plural, 'profile': args.profile, 'public': list(args.public)}, indent=2))
