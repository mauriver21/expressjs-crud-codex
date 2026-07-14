#!/usr/bin/env python3
"""Validate a repository-style data initializer name and dependency list."""
from __future__ import annotations

import argparse
import json
import re


def initializer_name(value: str) -> str:
    if not re.fullmatch(r'initialize[A-Z][A-Za-z0-9]*', value):
        raise argparse.ArgumentTypeError('must be lower camel case and begin with initialize')
    return value


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--name', required=True, type=initializer_name)
parser.add_argument('--depends-on', nargs='*', default=(), type=initializer_name)
args = parser.parse_args()

dependencies = list(args.depends_on)
if args.name in dependencies:
    parser.error('an initializer cannot depend on itself')
if len(dependencies) != len(set(dependencies)):
    parser.error('dependencies must be unique')

print(json.dumps({'name': args.name, 'dependsOn': dependencies}, indent=2))
