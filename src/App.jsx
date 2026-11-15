import { useState, useEffect, useRef } from 'react'
import PhotoCard from './PhotoCard.jsx'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([]) // all photos loaded so far
  const [page, setPage] = useState(1) // which page to load next
  const [loading, setLoading] = useState(true) // true while a page is downloading (page 1 starts right away)
  const [hasMore, setHasMore] = useState(true) // false once a page comes back empty
  const [error, setError] = useState('')
  const bottomRef = useRef(null) // invisible marker at the end of the list

  // 1. Load a page of photos every time `page` changes
  useEffect(() => {
    let ignore = false // stops a request from being used twice (React StrictMode runs effects twice in dev)

    // Try the Picsum feed first (give up after 5 seconds or on an error status).
    // If it fails, use our own copy of the feed in public/feed/page-1.json, page-2.json ...
    fetch(`https://picsum.photos/v2/list?page=${page}`, { signal: AbortSignal.timeout(5000) })
      .then((response) => {
        if (!response.ok) throw new Error(`Picsum returned ${response.status}`)
        return response
      })
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

  // 2. When the marker at the bottom of the list comes within 300px of the screen, load the next page.
  // The observer is created again after every load, so if a page is too short to fill the screen
  // the marker is still visible and the next page loads straight away (no scrolling needed).
  useEffect(() => {
    if (loading || !hasMore || error) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect() // ask for one page only, even if the observer fires again
        setLoading(true)
        setPage((oldPage) => oldPage + 1)
      },
      { rootMargin: '0px 0px 300px 0px' },
    )

    observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [loading, hasMore, error])

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

      <div ref={bottomRef} aria-hidden="true"></div>

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
