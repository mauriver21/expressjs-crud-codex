#!/usr/bin/env python3
"""Create a pnpm single-repository API or pnpm monorepo with an API package."""

from __future__ import annotations

import argparse
from pathlib import Path
import re
import shutil
import json


TEXT_SUFFIXES = {".json", ".ts", ".md", ".example", ".prettierrc"}
GITIGNORE = "node_modules/\ndist/\n.env.dev\n.env.test\n.env.prod\n"


def package_name(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    if not normalized:
        raise argparse.ArgumentTypeError("package name must contain a letter or digit")
    return normalized


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--name", required=True, type=package_name)
    parser.add_argument("--layout", choices=("single", "monorepo"), required=True)
    parser.add_argument("--workspace-name", type=package_name)
    args = parser.parse_args()

    root = args.destination.resolve()
    app_dir = root if args.layout == "single" else root / "packages" / "api" / args.name
    if args.layout == "single" and root.exists() and any(root.iterdir()):
        parser.error(f"destination is not empty: {root}")
    if args.layout == "monorepo":
        conflicts = ("package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml")
        existing = [name for name in conflicts if (root / name).exists()]
        if existing:
            parser.error(f"monorepo root already has configuration: {', '.join(existing)}")
        if app_dir.exists() and any(app_dir.iterdir()):
            parser.error(f"service destination is not empty: {app_dir}")

    template = Path(__file__).resolve().parent.parent / "assets" / "template"
    app_dir.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template, app_dir, dirs_exist_ok=True)

    for path in app_dir.rglob("*"):
        if path.is_file() and (path.suffix in TEXT_SUFFIXES or path.name.startswith(".env")):
            content = path.read_text(encoding="utf-8")
            path.write_text(content.replace("__APP_NAME__", args.name), encoding="utf-8")

    conventional_dirs = (
        "src/constants",
        "src/interfaces",
        "src/models",
        "src/providers",
        "src/repositories",
        "src/validators",
    )
    for relative in conventional_dirs:
        (app_dir / relative).mkdir(parents=True, exist_ok=True)

    if not (app_dir / ".gitignore").exists():
        (app_dir / ".gitignore").write_text(GITIGNORE, encoding="utf-8")

    if args.layout == "monorepo":
        workspace_name = args.workspace_name or package_name(root.name)
        (root / "package.json").write_text(
            json.dumps(
                {
                    "name": workspace_name,
                    "version": "1.0.0",
                    "private": True,
                    "packageManager": "pnpm@10.0.0",
                    "scripts": {
                        "dev": f"pnpm --filter {args.name} dev",
                        "build": f"pnpm --filter {args.name} build",
                        "test": f"pnpm --filter {args.name} test",
                    },
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        (root / "pnpm-workspace.yaml").write_text("packages:\n  - 'packages/*/*'\n", encoding="utf-8")
        if not (root / ".gitignore").exists():
            (root / ".gitignore").write_text(GITIGNORE, encoding="utf-8")

    print(f"Scaffolded {args.layout} layout for {args.name} at {app_dir}")


if __name__ == "__main__":
    main()
