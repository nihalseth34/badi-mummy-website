# For Badi Mummy 🪔🎂

A scrollable birthday card: a winding path of tappable photo chapters, a handwritten poem, a song, and a confetti finale. Plain HTML/CSS/JS — no build step, so it's ready to push straight to GitHub Pages.

## Project layout

```
badi-mummy-website/
├── index.html                 the page itself (you shouldn't need to touch this)
├── assets/
│   ├── css/style.css          all styling (you shouldn't need to touch this)
│   └── js/
│       ├── content.js         ← EDIT THIS for all text, photos/videos, poem, and song
│       └── app.js             the page's logic (you shouldn't need to touch this)
├── photos/
│   ├── 01-where-it-all-began/
│   ├── 02-simply-her/
│   ├── 03-her-better-half/
│   ├── 04-her-devar-devrani/
│   ├── 05-mere-4-anmol-ratna/
│   └── 06-family-and-fun/
└── song/
```

## Adding your photos (and videos)

1. Drop the files for a chapter straight into its folder, e.g. `photos/01-where-it-all-began/1.jpg`, `2.jpg`, `3.mp4`.
2. Open `assets/js/content.js` and list those filenames under that chapter's `media` array, in the order you want them to appear:

   ```js
   media: [
     { file: "1.jpg", caption: "Her wedding day" },
     { file: "2.mp4", caption: "A little video from that day" },
     { file: "3.jpg", caption: "Diwali, 2019" }
   ]
   ```
3. Save and refresh the page. That chapter's circle on the path now shows the first item as its thumbnail, and tapping it opens everything as a swipeable carousel — photos display full-bleed, videos get playback controls right in the carousel.

You can leave a chapter's `media` array empty — it'll show a friendly "add a photo" placeholder instead of breaking. Any filename listed that isn't actually in the folder falls back the same way, so it's safe to fill in `content.js` ahead of uploading files.

Images: `.jpg`, `.jpeg`, `.png`, `.webp`. Videos: `.mp4`, `.webm`, `.mov`, `.m4v` — the card tells them apart automatically from the file extension, so no extra setup needed. Keep video clips short (a few MB, not tens) since GitHub Pages serves everything as static files with no compression step. Keep filenames lowercase with no spaces — GitHub Pages is case-sensitive.

## Adding the poem

In `content.js`, edit `poem.lines` — one array entry per line — and `poem.signature`.

## Adding the song

Put the audio file in `song/` (e.g. `song/song.mp3`) and make sure `song.src` in `content.js` matches the filename exactly. `.mp3`, `.m4a`, `.ogg`, and `.wav` all work in a browser.

## Previewing locally

Opening `index.html` directly in a browser works for a quick look, but the cleanest local preview runs a tiny local server so paths resolve exactly like they will on GitHub Pages:

```bash
cd badi-mummy-website
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing to GitHub Pages

1. Create a new repository on GitHub and push this folder's contents to it (this folder should be the root of the repo, or the root of the branch you deploy from).
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose the branch (usually `main`) and folder `/ (root)`, then save.
4. GitHub will give you a URL like `https://<your-username>.github.io/<repo-name>/` within a minute or two — that's the link to share.

## Notes

- The page renders in a fixed festive night palette regardless of the visitor's light/dark mode setting — that's deliberate, not a bug.
- Motion (the floating background particles, scroll reveals, the finale burst) automatically turns itself down for visitors with "reduce motion" turned on in their OS settings.
