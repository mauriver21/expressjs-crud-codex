#!/usr/bin/env python3
"""Copy the bundled Express API template into a new, empty directory."""

from __future__ import annotations

import argparse
from pathlib import Path
import re
import shutil


TEXT_SUFFIXES = {".json", ".ts", ".md", ".example", ".prettierrc"}


def package_name(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    if not normalized:
        raise argparse.ArgumentTypeError("package name must contain a letter or digit")
    return normalized


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--name", required=True, type=package_name)
    args = parser.parse_args()

    destination = args.destination.resolve()
    if destination.exists() and any(destination.iterdir()):
        parser.error(f"destination is not empty: {destination}")

    template = Path(__file__).resolve().parent.parent / "assets" / "template"
    destination.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template, destination, dirs_exist_ok=True)

    for path in destination.rglob("*"):
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
        (destination / relative).mkdir(parents=True, exist_ok=True)

    print(f"Scaffolded {args.name} at {destination}")


if __name__ == "__main__":
    main()
