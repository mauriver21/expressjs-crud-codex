#!/usr/bin/env python3
"""Report missing repository-style Drizzle/PostgreSQL infrastructure without editing files."""
from __future__ import annotations
import argparse
from pathlib import Path

REQUIRED = ('package.json', 'tsconfig.json', 'src/config/index.ts', 'src/db/index.ts', 'src/singletons/pgClient/index.ts', 'drizzle.config.ts')

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('project_root', type=Path)
args = parser.parse_args()
root = args.project_root.resolve()
if not root.is_dir():
    parser.error(f'not a directory: {root}')
missing = [path for path in REQUIRED if not (root / path).is_file()]
print(f'project: {root}')
print('missing: ' + (', '.join(missing) if missing else 'none'))
