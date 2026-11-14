import { useState } from 'react'

// One photo in the feed: author name, the image and a like button
function PhotoCard({ photo }) {
  const [likes, setLikes] = useState(0) // every card starts with 0 likes

  function handleLike() {
    setLikes(likes + 1)
  }

  return (
    <article className="card">
      <div className="card-header">
        <span className="avatar">{photo.author.charAt(0)}</span>
        <span className="author">{photo.author}</span>
      </div>

      <div className="image-box">
        <img
          className="photo"
          src={photo.download_url}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
        />
      </div>

      <div className="card-footer">
        <button
          className={likes > 0 ? 'like-button liked' : 'like-button'}
          onClick={handleLike}
          aria-label={`Like photo by ${photo.author}`}
        >
          <i className="fa-solid fa-thumbs-up"></i>
          <span className="like-count">{likes}</span>
        </button>
        <span className="photo-id">#{photo.id}</span>
      </div>
    </article>
  )
}

export default PhotoCard
