import { useRef } from 'react'

function MediaRail({ title, items, onToggleMyList, isInMyList }) {
  const railRef = useRef(null)

  function scrollRail(direction) {
    if (!railRef.current) {
      return
    }

    const distance = railRef.current.clientWidth * 0.82
    railRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    })
  }

  return (
    <section className="rail-section">
      <div className="section-header">
        <h2>{title}</h2>
      </div>
      <div className="poster-rail">
        <button
          type="button"
          className="rail-arrow left"
          onClick={() => scrollRail('left')}
          aria-label={`Scroll ${title} left`}
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className="poster-grid" ref={railRef}>
          {items.map((item) => {
            const saved = isInMyList(item.id, item.mediaType)

            return (
              <article className="poster-card" key={`${item.mediaType}-${item.id}`}>
                <img src={item.poster} alt={item.title} loading="lazy" />
                <div className="poster-overlay">
                  <h3>{item.title}</h3>
                  <p>
                    {item.year} • ★ {item.voteAverage}
                  </p>
                  <p className="card-description">{item.overview}</p>
                  <button
                    type="button"
                    className="tiny-btn"
                    onClick={() => onToggleMyList(item)}
                  >
                    {saved ? 'Remove from My List' : 'Add to My List'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <button
          type="button"
          className="rail-arrow right"
          onClick={() => scrollRail('right')}
          aria-label={`Scroll ${title} right`}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}

export default MediaRail
