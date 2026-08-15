# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is Darwin Saire's personal portfolio website: a static, single-page HTML/CSS/JS site (no framework, no build tooling, no package manager, no tests). `index.html` is a thin shell — the sidebar/nav and page chrome only; the seven content sections live as separate HTML fragments under `sections/` and are stitched into the page at runtime by `js/include.js` (see "Site architecture" below). It's deployed via GitHub Pages with a custom domain configured through the `CNAME` file (`darwinsaire.com.br`). This file is intentionally untracked (see `.gitignore`) so it stays local-only and never appears when the repo is browsed on GitHub.

## Working with this repo

There is no build/lint/test pipeline — this is plain static HTML/CSS/JS served as-is.

- **Preview locally**: you must serve the directory (e.g. `python3 -m http.server`) — opening `index.html` directly via `file://` no longer works, because `js/include.js` uses `fetch()` to load the `sections/*.html` fragments, and browsers block `fetch` of local files under the `file://` origin.
- **Deploy**: pushing to the default branch is picked up by GitHub Pages; there is no separate build step. The `sections/*.html` fragments are plain static files fetched client-side, so no build/assembly step runs before or during deploy.

## Structure

- `index.html` — the page shell only: `<head>` (meta tags, favicon, CSS links), the `.preloader`, the `.aside` sidebar/nav, an **empty** `<div class="main-content">`, the dark-mode `.style-switcher` button, and the `<script src="js/include.js">` tag. It no longer contains any section markup.
- `sections/*.html` — one HTML fragment per menu section (`home.html`, `about.html`, `teaching.html`, `certificate.html`, `publication.html`, `project.html`, `contact.html`), each the `<section class="... section" id="...">...</section>` block (with its surrounding `<!-- X Section -->` / `<!-- X Section End -->` comments) that used to live inline in `index.html`. Edit these directly — there's no need to touch `index.html` to change section content.
- `js/include.js` — fetches every file in `sections/` (in a hardcoded `sectionNames` array) and injects them into `.main-content` in that order, then dynamically appends `<script src="js/script.js">` so it only runs once the sections exist in the DOM. Loads and runs before `js/script.js`.
- `css/style.css` — all layout/component styling (single large stylesheet), including responsive breakpoints at the bottom of the file (`@media (max-width: 1050px/991px/767px/575px)`) that collapse the sidebar nav into a toggleable overlay and stack two-column blocks to one column.
- `css/theme.css` — accent-color overrides only (currently `dodgerblue`), loaded as an "alternate style" sheet.
- `css/styleSwitcher.css` — dark-mode (`body.dark`) color overrides, scoped per-component to mirror `style.css`.
- `js/script.js` — all section-switching/dark-mode/nav behavior (see below). Also contains a minified, vendored copy of `ityped` (the animated-text-cycling library) at the top of the file rather than as a separate dependency. Its preloader-hide logic checks `document.readyState` before falling back to a `window`'s `"load"` listener, since by the time it's loaded (after `js/include.js`'s fetches resolve) `"load"` may already have fired.
- `imgs/` — all images, organized by use (`logos/` = tech stack icons, `logo-courses/` = certificate issuer logos, `logos-companies/` = employer/organization logos used in About's timeline items, `projects/`, `publications/`, `blog/` (unused leftover)). `favicon.svg` (the browser-tab icon) lives at the top level of `imgs/`.
- `docs/` — only `Resume_CV_2026.pdf` should live here; it's what the "CV" (hero) and "Download CV" (About) buttons link to. Don't add other documents here without checking whether they're meant to be public — this folder is served as-is by GitHub Pages.
- FontAwesome and flag-icon-css are pulled from a CDN in `<head>`; there are no other external JS/CSS dependencies.

## Site architecture (important to understand before editing)

The page behaves like a single-page app, assembled client-side from multiple files at load time:

- **Section loading**: `index.html` ships with an empty `.main-content`. On load, `js/include.js` fetches each `sections/*.html` fragment and injects them into `.main-content` in order, then loads `js/script.js`. Until that fetch resolves, no `.section` elements exist in the DOM at all.
- **Three things must stay in the same order**, or nav clicks will show/hide the wrong section: the `<li>` order in `.aside .nav` (`index.html`), the `sectionNames` array in `js/include.js`, and (implicitly) the fragment files it lists. `addBackSectionClass`/`removeBackSectionClass` in `js/script.js` index into `document.querySelectorAll(".section")` positionally — so all three must agree on order (Home, About, Teaching, Certificates, Publications, Projects, Contact) whenever a section is added, removed, or reordered.
- **Section switching**: once loaded, all sections sit in the DOM at once (`position: fixed`, stacked by `z-index`); only the section with the `.active` class is on top/visible. Clicking a sidebar nav link (`.aside .nav a`) removes `.active` from all sections/nav links and adds it to the target, driven entirely by `js/script.js` (`showSection`, `updateNav`). **A plain in-content `<a href="#section-id">` does nothing visually** — only clicks on `.nav li a` (and the dedicated `.hire-me` handler) trigger `showSection`/`updateNav`. Don't add ad-hoc cross-section links in body copy; if one is needed, it must go through the same nav-click machinery.
- **Dark mode**: toggled via `.style-switcher` button, which adds/removes `body.dark`/`body.light` classes and persists the choice in `localStorage["theme"]`. Both `style.css` and `theme.css`/`styleSwitcher.css` have `body.dark` variants for affected selectors.
- **Section styling is scoped by a top-level class, not a shared component class**: e.g. `.timeline`/`.timeline-item`/`.timeline-text`/`.about-text`/`.education`/`.experience` are only styled under selectors like `.about .about-content .timeline ...` (same pattern for `.publication`/`.project` with their own `.timeline` variants). A new section that wants that visual language needs the matching top-level class on its `<section>` (e.g. the Teaching section is `class="teaching about section"` specifically so it inherits the About styling) — adding the markup alone without that class renders unstyled.
- **Content sections are repeated markup blocks**: Certificates (`sections/certificate.html`), Publications (`sections/publication.html`), and Projects (`sections/project.html`) are each a list of near-identical hand-written `<div class="...-item">` blocks (see `<!-- ... item -->` / `<!-- ... item End -->` comments). To add a new certificate/publication/project, copy an existing block within the relevant fragment file and edit its content/image/links — there is no templating or data file driving these.
- Timeline entries under About/Teaching (`sections/about.html`, `sections/teaching.html` — Education/Experience/Volunteering/Interests/Languages/Honors) follow the same copy-a-block pattern using `.timeline-item` / `.timeline-text` markup, generally ordered most-recent-first by end/completion date (ongoing items first). Timeline items that represent an employer/organization (e.g. under Volunteering) show its logo via `<img class="timeline-logo">` inside `.timeline-title`, sourced from `imgs/logos-companies/`.

## Content conventions

- Contact email and several social links are hardcoded in multiple places (`sections/home.html` hero social links, `sections/contact.html`, `mailto:` links) — update all occurrences together when changing.
- Project/certificate/publication images referenced in `sections/*.html` must exist under the matching `imgs/` subfolder; filenames are otherwise unconstrained.
- The contact form (Formspree-based) is present in `sections/contact.html` but commented out; only the static contact-info blocks are live.
- External links use `target="_blank" rel="noopener noreferrer"`; keep that pairing on new links.
