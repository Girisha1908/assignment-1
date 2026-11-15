# Photo Gallery: Infinite Scroll

A single-page React app that shows photos from the [Picsum](https://picsum.photos) feed in one column.

## Features

- One-column list of photos, each showing its `download_url` image and `author`
- Infinite scroll: when you reach the bottom, the next page (`https://picsum.photos/v2/list?page=N`) is loaded and added to the list, until a page comes back with no data
- Thumbs-up button (Font Awesome) on every photo with a count that starts at 0 and goes up by 1 on every click

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Code structure

| File | What it does |
| --- | --- |
| `src/main.jsx` | Starts the app and loads Font Awesome |
| `src/App.jsx` | Fetches each page and loads the next one when you reach the bottom |
| `src/PhotoCard.jsx` | One photo: author, image and like button with its own count |
| `src/App.css`, `src/index.css` | Styles |

### How infinite scroll works

1. `page` starts at 1. An effect fetches that page whenever `page` changes and adds the photos to the list.
2. An empty `<div>` sits after the last photo. An `IntersectionObserver` watches it. When it appears on screen, `page` goes up by 1, which loads the next page.
3. When a page returns an empty list, loading stops.

## Tech

React + Vite, plain CSS, Font Awesome (`@fortawesome/fontawesome-free`).
