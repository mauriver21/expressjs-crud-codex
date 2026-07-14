#!/usr/bin/env python3
"""Perform read-only structural checks for repository-style Express APIs."""
from __future__ import annotations
import argparse
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('project_root', type=Path)
args = parser.parse_args()
root = args.project_root.resolve()
if not root.is_dir(): parser.error(f'not a directory: {root}')
checks = {
    'entrypoint': root / 'src/index.ts',
    'routes': root / 'src/routes/index.ts',
    'app singleton': root / 'src/singletons/app/index.ts',
    'tsconfig': root / 'tsconfig.json',
    'vitest config': root / 'vitest.config.ts',
}
for name, path in checks.items():
    print(f'[{"ok" if path.is_file() else "missing"}] {name}: {path.relative_to(root)}')
for layer in ('controllers', 'models', 'repositories'):
    count = len(list((root / 'src' / layer).glob('create*/index.ts')))
    print(f'[info] {layer} factories: {count}')
validators = len(list((root / 'src' / 'validators').glob('*/index.ts')))
print(f'[info] validator modules: {validators}')
