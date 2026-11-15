import { useState, useEffect, useRef } from 'react'
import PhotoCard from './PhotoCard.jsx'
import './App.css'

const API_URL = 'https://picsum.photos/v2/list?page='

function App() {
  const [photos, setPhotos] = useState([]) // all photos loaded so far
  const [page, setPage] = useState(1) // page to load
  const [loading, setLoading] = useState(true) // true while a page is loading
  const [hasMore, setHasMore] = useState(true) // false once a page has no data
  const [error, setError] = useState(false)
  const bottomRef = useRef(null) // marker after the last photo

  // Load a page whenever `page` changes
  useEffect(() => {
    let ignore = false // ignore the result if this effect was cleaned up

    fetch(API_URL + page)
      .then((response) => response.json())
      .then((data) => {
        if (ignore) return
        if (data.length === 0) {
          setHasMore(false) // empty page: stop loading
        } else {
          setPhotos((oldPhotos) => [...oldPhotos, ...data])
        }
        setLoading(false)
      })
      .catch(() => {
        if (ignore) return
        setError(true)
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [page])

  // When the marker reaches the bottom of the screen, load the next page
  useEffect(() => {
    if (loading || !hasMore || error) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect()
        setLoading(true)
        setPage((oldPage) => oldPage + 1)
      }
    })

    observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [loading, hasMore, error])

  return (
    <div className="app">
      <h1 className="title">Photo Gallery</h1>

      <main className="feed">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </main>

      <div ref={bottomRef}></div>

      <p className="status">
        {loading && 'Loading...'}
        {error && 'Could not load photos.'}
        {!hasMore && 'No more photos.'}
      </p>
    </div>
  )
}

export default App
