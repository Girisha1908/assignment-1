import { useState } from 'react'

// One photo: author, image and a like button
function PhotoCard({ photo }) {
  const [likes, setLikes] = useState(0)

  return (
    <article className="card">
      <p className="author">{photo.author}</p>

      <img className="photo" src={photo.download_url} alt={photo.author} loading="lazy" />

      <button className="like-button" onClick={() => setLikes((oldLikes) => oldLikes + 1)}>
        <i className="fa-solid fa-thumbs-up"></i> {likes}
      </button>
    </article>
  )
}

export default PhotoCard
