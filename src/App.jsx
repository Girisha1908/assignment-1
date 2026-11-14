import { useState, useEffect } from 'react'
import PhotoCard from './PhotoCard.jsx'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([]) // all photos loaded so far
  const [page, setPage] = useState(1) // which page to load next
  const [loading, setLoading] = useState(false) // true while a page is downloading
  const [hasMore, setHasMore] = useState(true) // false once a page comes back empty
  const [error, setError] = useState('')

  // 1. Load a page of photos every time `page` changes
  useEffect(() => {
    let ignore = false // stops a request from being used twice (React StrictMode runs effects twice in dev)

    setLoading(true)
    setError('')

    // Try the Picsum feed first (give up after 5 seconds).
    // If it fails, use our own copy of the feed in public/feed/page-1.json, page-2.json ...
    fetch(`https://picsum.photos/v2/list?page=${page}`, { signal: AbortSignal.timeout(5000) })
      .catch(() => fetch(`/feed/page-${page}.json`))
      .then((response) => response.json())
      .then((data) => {
        if (ignore) return

        if (data.length === 0) {
          setHasMore(false) // no more data, stop loading pages
        } else {
          setPhotos((oldPhotos) => [...oldPhotos, ...data]) // add new photos to the end
        }
        setLoading(false)
      })
      .catch(() => {
        if (ignore) return
        setError('Could not load photos. Please refresh the page.')
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [page])

  // 2. Watch the scroll position. When the user is near the bottom, ask for the next page.
  useEffect(() => {
    function handleScroll() {
      const scrolledTo = window.innerHeight + window.scrollY
      const pageHeight = document.documentElement.scrollHeight
      const nearBottom = scrolledTo >= pageHeight - 300

      if (nearBottom && !loading && hasMore && !error) {
        // page + 1 (not oldPage + 1): if the scroll event fires twice quickly,
        // both calls ask for the same page, so no page gets skipped
        setPage(page + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page, loading, hasMore, error])

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Photo feed</p>
        <h1 className="title">
          The <em>Gallery</em>
        </h1>
        <p className="subtitle">Scroll down — new photos load automatically.</p>
      </header>

      <main className="feed">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </main>

      <footer className="status">
        {loading && (
          <p>
            <i className="fa-solid fa-spinner fa-spin"></i> Loading photos…
          </p>
        )}

        {error && <p className="error">{error}</p>}

        {!hasMore && <p>You have reached the end · {photos.length} photos</p>}
      </footer>
    </div>
  )
}

export default App
