# Photo Gallery: Infinite Scroll

Assignment 1 for the Exactspace Front End / UI Developer Internship.

A single-page React app that shows photos in one column.
When you get near the bottom of the page, the next page of photos loads and is added to the list.
This keeps going until a page comes back empty.

For each page, the app first asks the [Picsum](https://picsum.photos) API (`https://picsum.photos/v2/list?page=N`).
If Picsum doesn't answer within 5 seconds, it loads the same page from the project's own feed in `public/feed/` instead
(see [Backup feed](#backup-feed-when-picsumphotos-cant-be-reached)).

## Features

- One-column feed showing each photo (`download_url`) with its `author`
- Infinite scroll: loads page 1, 2, 3 … one at a time and stops at the first empty page
- Thumbs-up button on every photo (Font Awesome icon) with a count that starts at 0 and goes up by 1 on each click
- Loading, error and "end of feed" messages
- Responsive layout that works on mobile and desktop

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## How the code is organised

| File | What it does |
| --- | --- |
| `src/App.jsx` | Holds the list of photos, fetches each page, and watches the scroll position to load the next page |
| `src/PhotoCard.jsx` | One photo card: author, image and like button (each card keeps its own like count) |
| `src/App.css` | Styles for the layout, cards and like button |
| `src/index.css` | Colours, fonts and page background |

### How infinite scroll works

1. `page` starts at 1. A `useEffect` fetches that page whenever `page` changes and adds the results to `photos`.
2. An empty marker `<div>` sits after the last photo. A second `useEffect` watches it with an `IntersectionObserver`. When it comes within 300px of the screen (and nothing is loading), `page` goes up by 1, which triggers the first effect again. The observer is recreated after every load, so if a page is too short to fill the screen, the next page loads without the user having to scroll.
3. When a page comes back with no data, `hasMore` becomes `false`, so no more pages are requested.

### Backup feed (when picsum.photos can't be reached)

Some networks block picsum.photos, so the project includes its own copy of the feed in the same format:

```
public/feed/page-1.json   5 photos
public/feed/page-2.json   5 photos
public/feed/page-3.json   5 photos
public/feed/page-4.json   []  (empty, so the app knows it reached the end)
public/feed/images/       the 15 pictures
```

For every page, the app tries `https://picsum.photos/v2/list?page=N` first. If that request fails or takes longer than 5 seconds, it loads `/feed/page-N.json` instead.

With the backup feed, you get 15 photos over 3 pages, then the "end of feed" message.
The author names in the backup feed are placeholders.

## Tech

React + Vite, plain CSS, Font Awesome (`@fortawesome/fontawesome-free`).
