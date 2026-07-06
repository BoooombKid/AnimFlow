# Pipeline templates

AnimFlow includes three editable templates in `src/data/pipelineTemplates.js`.

## 3D animation

Asset, Layout, Blocking, Animation, FX & Simulation, Lighting & LookDev, Render, Compositing, Editing, Sound, Review, and Final Delivery.

## 2D animation

Asset, Storyboard, Animatic, Layout, Rough Animation, Clean Up, Color, Compositing, Editing, Sound, Review, and Final Delivery.

## Stop motion

Asset, Art Department, Storyboard, Animatic, Setup, Capture, Frame QC, Compositing, Editing, Sound, Review, and Final Delivery.

All templates distinguish shared resources from shot-specific work. Shot folder names use the selected shot count and are padded to three digits.

The shot prefix is derived from the project name:

- A one-word name stays complete: `About` becomes `About_frameqc_sc003`.
- A multi-word name uses uppercase initials: `MY Body` becomes `MB_frameqc_sc003`.
