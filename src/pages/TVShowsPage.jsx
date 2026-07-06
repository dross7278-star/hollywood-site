import { useEffect, useMemo, useState } from 'react'
import MediaRail from '../components/MediaRail'
import SpotlightCarousel from '../components/SpotlightCarousel'
import { useAuth } from '../context/AuthContext'
import { fetchTvData } from '../services/tmdb'

function parseYear(value) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function TVShowsPage() {
  const { toggleMyList, isInMyList } = useAuth()
  const [data, setData] = useState(null)

  const heroSlides = useMemo(() => {
    if (!data) {
      return []
    }

    return [data.hero, ...data.rows.flatMap((row) => row.items)]
      .filter((item, index, arr) => arr.findIndex((entry) => entry.id === item.id) === index)
      .sort((a, b) => parseYear(b.year) - parseYear(a.year))
      .slice(0, 4)
  }, [data])

  useEffect(() => {
    let active = true

    fetchTvData().then((result) => {
      if (active) {
        setData(result)
      }
    })

    return () => {
      active = false
    }
  }, [])

  if (!data) {
    return <p className="status-text">Loading TV shows...</p>
  }

  return (
    <main>
      <SpotlightCarousel
        slides={heroSlides}
        kicker="Series Spotlight"
        onToggleMyList={toggleMyList}
        isInMyList={isInMyList}
      />

      {data.rows.map((row) => (
        <MediaRail
          key={row.title}
          title={row.title}
          items={row.items}
          onToggleMyList={toggleMyList}
          isInMyList={isInMyList}
        />
      ))}
    </main>
  )
}

export default TVShowsPage
