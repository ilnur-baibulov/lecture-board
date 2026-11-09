#!/usr/bin/env python3
"""Kept for old commands: the engine moved into the skill folder, lecture-board/scripts/mdscript.py."""
import pathlib, runpy, sys
target = pathlib.Path(__file__).resolve().parent / 'lecture-board/scripts/mdscript.py'
sys.argv[0] = str(target)
runpy.run_path(str(target), run_name='__main__')
