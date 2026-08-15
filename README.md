# Darwin Saire — Portfolio

Personal portfolio website of **Darwin Saire Pilco** — Machine Learning Engineer, Data Scientist, NLP Developer, Computer Vision Specialist, and University Professor.

🔗 **Live site:** [darwinsaire.com.br](https://darwinsaire.com.br/)

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f?logo=github)
![No build step](https://img.shields.io/badge/build-none-blue)
![License](https://img.shields.io/badge/code-MIT-informational)

---

## About

A single-page site presenting my background, teaching activity, certificates, publications, and projects. It's built with plain HTML, CSS, and vanilla JavaScript — no framework, no bundler, no package manager — and deploys straight to GitHub Pages on a custom domain.

Sections:

- **Home** — intro, bio, and social links
- **About** — education, experience, volunteering, interests, languages, and honors
- **Teaching** — courses and academic activity
- **Certificates** — completed courses and certifications
- **Publications** — papers and research output
- **Projects** — selected engineering/ML projects
- **Contact** — how to reach me

## Tech stack

- **HTML5 / CSS3 / vanilla JavaScript** — no framework or build tooling
- [Font Awesome](https://fontawesome.com/) and [flag-icon-css](https://github.com/lipis/flag-icon-css), loaded from a CDN
- A vendored copy of [`ityped`](https://github.com/nekitcorp/ityped) for the animated hero text
- Hosted on **GitHub Pages**, with a custom domain via the `CNAME` file

## Project structure

```
.
├── index.html              # Page shell: <head>, sidebar/nav, style switcher, script loader
├── sections/                # One HTML fragment per menu section (fetched at runtime)
│   ├── home.html
│   ├── about.html
│   ├── teaching.html
│   ├── certificate.html
│   ├── publication.html
│   ├── project.html
│   └── contact.html
├── css/
│   ├── style.css            # Layout/components + responsive breakpoints
│   ├── theme.css            # Accent color overrides
│   └── styleSwitcher.css    # Dark mode overrides
├── js/
│   ├── include.js           # Fetches sections/*.html into .main-content, then loads script.js
│   └── script.js            # Nav/section switching, dark mode, hero text animation
├── imgs/                    # Images: tech logos, certificate/employer logos, project & publication images
├── docs/                    # Resume/CV (linked from the Home and About sections)
└── CNAME                    # Custom domain for GitHub Pages
```

See [`CLAUDE.md`](./CLAUDE.md) for a deeper dive into how the page is assembled and styled — useful before making structural changes.

## Running locally

There's no build step, but the page loads its sections via `fetch()`, so it must be served over HTTP rather than opened as a local `file://` path:

```bash
git clone https://github.com/DarwinSaire/Portfolio.git
cd Portfolio
python3 -m http.server 8000
```

Then open **http://localhost:8000/**.

## Customizing content

- **Add a certificate / publication / project**: copy an existing `<div class="...-item">` block inside the matching file in `sections/` and edit its content, image, and links.
- **Add a timeline entry** (education, experience, volunteering, etc.): copy an existing `.timeline-item` block in `sections/about.html` or `sections/teaching.html`.
- **Add a whole new menu section**: keep the sidebar `<li>` order in `index.html`, the `sectionNames` array in `js/include.js`, and the new `sections/*.html` file all in sync — see `CLAUDE.md` for details.

## Deployment

Pushing to `master` triggers GitHub Pages' automatic build and deploy — no CI workflow file needed. The custom domain is configured via the `CNAME` file at the repo root.

## Contact

- ✉️ [darwinsaireonline@gmail.com](mailto:darwinsaireonline@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/darwinsairep/)
- 🎓 [Google Scholar](https://scholar.google.com.br/citations?user=XWnzSz0AAAAJ&hl=en)
- 🐙 [GitHub](https://github.com/DarwinSaire)

## License

The code in this repository is available under the [MIT License](https://opensource.org/licenses/MIT). The personal content (bio, resume, images, publications, project descriptions) is © Darwin Saire and not licensed for reuse.
