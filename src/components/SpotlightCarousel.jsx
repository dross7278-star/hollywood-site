import { useEffect, useMemo, useState } from 'react'

function SpotlightCarousel({ slides, kicker, onToggleMyList, isInMyList }) {
  const validSlides = useMemo(
    () => (slides ?? []).filter((slide) => slide?.poster || slide?.backdrop),
    [slides],
  )
  const [activeIndex, setActiveIndex] = useState(0)

  const normalizedIndex =
    validSlides.length > 0 ? activeIndex % validSlides.length : 0
  const activeSlide = validSlides[normalizedIndex]

  useEffect(() => {
    if (validSlides.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validSlides.length)
    }, 5200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [validSlides.length])

  if (!activeSlide) {
    return null
  }

  function goToPrevious() {
    if (validSlides.length < 2) {
      return
    }

    setActiveIndex((prev) => (prev === 0 ? validSlides.length - 1 : prev - 1))
  }

  function goToNext() {
    if (validSlides.length < 2) {
      return
    }

    setActiveIndex((prev) => (prev + 1) % validSlides.length)
  }

  return (
    <section
      className="hero-banner hero-carousel"
      style={{
        backgroundImage: `linear-gradient(30deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.35)), linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(8, 9, 16, 0.9) 80%), url(${activeSlide.backdrop || activeSlide.poster})`,
      }}
    >
      <button
        type="button"
        className="hero-arrow left"
        onClick={goToPrevious}
        aria-label="Previous spotlight title"
      >
        <span aria-hidden="true">←</span>
      </button>

      <div className="hero-content hero-fade-content" key={`${activeSlide.id}-${normalizedIndex}`}>
        <p className="kicker">{kicker}</p>
        <h1>{activeSlide.title}</h1>
        <p className="description">{activeSlide.overview}</p>
        <div className="hero-actions">
          <button type="button" className="primary-btn">
            ▶ Play
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => onToggleMyList(activeSlide)}
          >
            {isInMyList(activeSlide.id, activeSlide.mediaType)
              ? 'Remove from My List'
              : '+ My List'}
          </button>
        </div>
        <div className="hero-dots" aria-hidden="true">
          {validSlides.map((item, index) => (
            <span key={item.id} className={index === normalizedIndex ? 'active' : ''}></span>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="hero-arrow right"
        onClick={goToNext}
        aria-label="Next spotlight title"
      >
        <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}

export default SpotlightCarousel
