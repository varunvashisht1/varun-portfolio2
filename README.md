# Varun Vashisht — Portfolio Website

A premium, futuristic single-page portfolio site. Static HTML/CSS/JS — no build step, no framework. Hosts perfectly on **GitHub Pages**, Netlify, Vercel, Cloudflare Pages, or any static host.

## Structure

```
varun-portfolio/
├── index.html              # The whole site
├── assets/
│   ├── css/styles.css      # All styles (cyber-neon theme)
│   └── js/main.js          # All interactions
├── media/                  # All images live here — swap freely
│   ├── hero-bg.jpg         # (currently unused — JS canvas covers the hero)
│   ├── about-bg.jpg        # decorative
│   ├── avatar.png          # the "VV" avatar — replace with your photo
│   ├── og-image.jpg        # social share preview
│   ├── case-1.jpg          # case study thumbnails
│   ├── case-2.jpg
│   ├── case-3.jpg
│   ├── blog-1.jpg          # blog post thumbnails
│   ├── blog-2.jpg
│   └── blog-3.jpg
└── README.md
```

## Deploy to GitHub Pages (5 minutes)

1. Create a new public repository on GitHub. A common naming convention:
   - `varun-portfolio` (any name) — site will live at `https://<username>.github.io/varun-portfolio/`
   - `<your-username>.github.io` — site will live at `https://<your-username>.github.io/` (root domain)
2. From the project folder, in a terminal:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. On GitHub, go to **Settings → Pages**. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main`, folder: `/ (root)`
   - Save.
4. Wait ~30 seconds, refresh, and your site will be live at the URL GitHub shows you.

> Tip: For a custom domain (e.g. `varunvashisht.com`), add a `CNAME` file containing your domain at the project root, then point your DNS to GitHub Pages following the GitHub docs.

## Swapping the images

Drop replacements into the `media/` folder using the **same filenames** and they'll appear automatically on the site:

| File | Where it shows up | Recommended size |
|------|--------------------|------------------|
| `avatar.png` | About section circular portrait | 800×800 (square, transparent or solid bg) |
| `case-1.jpg` | Case study card 1 (Oil & Energy) | 1200×800 |
| `case-2.jpg` | Case study card 2 (Healthcare) | 1200×800 |
| `case-3.jpg` | Case study card 3 (AI/ML) | 1200×800 |
| `blog-1.jpg` | Insights post 1 | 1200×800 |
| `blog-2.jpg` | Insights post 2 | 1200×800 |
| `blog-3.jpg` | Insights post 3 | 1200×800 |
| `og-image.jpg` | Social media share preview | 1200×630 |
| `about-bg.jpg` | Decorative — not currently rendered | 1400×1000 |

If you want to use **different filenames**, just update the references in `index.html` (search for `media/`).

## Customising content

- **Text** — open `index.html`, find the section you want and edit. Comments mark each section (`<!-- HERO -->`, `<!-- ABOUT -->`, etc.).
- **Colours / theme** — open `assets/css/styles.css` and edit the CSS variables in the `:root { ... }` block at the top:
  - `--cyan`, `--violet`, `--pink` — the neon accent colours
  - `--bg`, `--bg-2` — background depths
- **Hero phrases (typing effect)** — open `assets/js/main.js`, search for `phrases =` and edit the array.
- **Contact email** — used in two places: `index.html` (mailto link in the contact list) and `assets/js/main.js` (the form's mailto handler). Update both if you change it.

## Local preview

You can just double-click `index.html`. Or run a tiny local server (recommended for the contact form / fonts to behave correctly):

```bash
# Python 3 (no install needed on most systems)
python3 -m http.server 8080

# OR Node
npx serve .
```

Then open `http://localhost:8080` in your browser.

## What's inside

- **Editorial professional aesthetic** — warm cream backdrop, deep navy, steel blue and muted gold accents. Fraunces serif for headlines, Inter for body.
- **Real photography** — Unsplash CDN images for hero, about, case studies, and insights. Each `<img>` has an `onerror` handler that falls back to the local `/media` placeholders if Unsplash is ever unavailable.
- **Cinematic hero** — slow-pan stock photo with a navy gradient overlay so headlines stay legible.
- **Scroll-reveal animations** — sections fade in smoothly as you scroll.
- **Animated counters** — stats count up when they enter view.
- **Refined nav** — translucent sticky top bar that gets a frosted background after scroll.
- **Responsive** — built mobile-first; scales cleanly from phones to ultrawide.
- **Reduced-motion friendly** — respects `prefers-reduced-motion` and disables animations for users who prefer that.
- **No tracking, no backend** — pure static. The form opens the user's mail client.

## Swapping the stock images

The Unsplash photos are referenced directly in `index.html` (search for `images.unsplash.com`). To use a different photo:

1. Find a free image at [unsplash.com](https://unsplash.com).
2. Right-click the image → **Copy image address**.
3. In `index.html`, replace the matching `src="..."` URL.

Alternatively, drop a file into `media/` (e.g. `media/avatar.png`, `media/case-1.jpg`) and the `onerror` handler will pick it up automatically if Unsplash is blocked or fails.

## License

You own the content. Free to modify and deploy as you wish.
