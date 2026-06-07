# Repository Guidelines

## Project Structure & Module Organization
This is a static calisthenics roadmap app served directly from the repository root. `index.html` defines the page shell, `styles.css` contains all layout and visual styles, `app.js` handles rendering and local-storage state, and `data.js` stores the roadmap content. Exercise media lives in `img/`; animated demos use `img/s<stage>-<index>.gif`, and hover previews use matching files in `img/thumb/`. Utility scripts for downloading and generating media are in `scripts/`.

## Build, Test, and Development Commands
- `docker compose up -d`: serve the app with Nginx on `http://localhost:8765`.
- `docker compose down`: stop the local Nginx container.
- `bash scripts/generate-thumbs.sh`: create missing JPG previews from GIFs; requires ImageMagick `magick`.
- `bash scripts/download-gifs.sh`: download exercise GIF assets; review changes before committing generated media.

For quick static checks, opening `index.html` in a browser is usually enough, but Docker better matches the deployed path behavior.

## Coding Style & Naming Conventions
Use plain JavaScript, CSS, and HTML without a build step. Keep indentation at four spaces in HTML, CSS, and JS to match the existing files. Prefer descriptive camelCase names for JavaScript variables and functions. Keep roadmap IDs and media filenames stable: a data item with ID `s2-4` should map to `img/s2-4.gif` and `img/thumb/s2-4.jpg`. Preserve the current Russian UI copy style unless a change explicitly updates language.

## Testing Guidelines
There is no automated test suite yet. Validate changes manually in a browser after editing UI, data, or assets. Check that roadmap sections render, completion state persists after refresh, modals open and close, GIF previews load, and reset/expand/collapse controls still work. When changing media scripts, run them from the repository root and inspect `img/` plus `img/thumb/` for unexpected additions or overwrites.

## Commit & Pull Request Guidelines
Git history uses Conventional Commits, for example `feat: add svg favicon` and `fix: show full exercise gif without cropping`. Use a single-line Conventional Commit message, keep it at 50 characters or fewer, and do not add a body. Pull requests should describe the user-visible change, list manual checks performed, link related issues when applicable, and include screenshots or screen recordings for visual changes.

## Agent-Specific Instructions
When completing repository work, commit the finished changes to git. Do not revert unrelated local modifications; inspect `git status --short` before staging.
