import { useEffect, useState } from 'react'
import MediaRail from '../components/MediaRail'
import SpotlightCarousel from '../components/SpotlightCarousel'
import { useAuth } from '../context/AuthContext'
import { fetchHomeData } from '../services/tmdb'

function HomePage() {
  const { toggleMyList, isInMyList } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    let active = true

    fetchHomeData().then((result) => {
      if (active) {
        setData(result)
      }
    })

    return () => {
      active = false
    }
  }, [])

  if (!data) {
    return <p className="status-text">Loading home feed...</p>
  }

  const heroSlides = [data.hero, ...data.rows.flatMap((row) => row.items)]
    .filter((item, index, arr) => arr.findIndex((entry) => entry.id === item.id) === index)
    .slice(0, 6)

  return (
    <main>
      <SpotlightCarousel
        slides={heroSlides}
        kicker="Featured This Week"
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

export default HomePage
