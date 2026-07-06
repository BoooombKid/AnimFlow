# AnimFlow

AnimFlow is an open-source browser tool that creates production-ready animation project folders directly on your computer. Enter a project name, choose a pipeline type, select a destination, and AnimFlow builds the complete folder tree with a plain-text `README.txt` in every folder.

**Live app:** [https://boooombkid.github.io/AnimFlow/](https://boooombkid.github.io/AnimFlow/)

## Features

- 3D animation, 2D animation, and stop-motion templates
- Configurable shot count with consistent `sc001` naming
- Direct local folder creation through the File System Access API
- A purpose-written `README.txt` in every generated folder
- Live pipeline preview before anything is written
- Existing-project protection: AnimFlow will not overwrite a folder with the same project name
- Responsive interface for desktop and mobile Chromium browsers
- No server upload: project names and folder contents stay on the user's device

## Browser support

Direct folder creation requires the File System Access API. Use a current version of Chrome, Edge, or another compatible Chromium browser. The app must run from `https://` or `localhost`.

## Local development

```bash
pnpm install
pnpm dev
```

Then open the local URL printed by Vite.

## Tests and production build

```bash
pnpm test
pnpm build
```

## How folder generation works

1. The selected pipeline template creates numbered production stages.
2. Shot-based stages use the configured shot count and three-digit shot IDs.
3. Shared assets remain outside shot folders to avoid duplication.
4. Every generated directory receives a contextual plain-text `README.txt` with its purpose, usage rules, and naming guidance.

See [Pipeline Templates](docs/PIPELINE_TEMPLATES.md) for the full structure of each project type.

## Privacy

AnimFlow does not upload project information. The browser only writes to the destination folder after the user explicitly grants access.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

## License

MIT
