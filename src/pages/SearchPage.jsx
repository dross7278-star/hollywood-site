import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { searchMediaByFilters } from '../services/tmdb'

const GENRE_OPTIONS = [
  '',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
]

function SearchPage() {
  const { toggleMyList, isInMyList } = useAuth()
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [genre, setGenre] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setHasSearched(true)

    const found = await searchMediaByFilters({ title, year, genre })
    setResults(found)
    setIsLoading(false)
  }

  return (
    <main>
      <section className="search-header">
        <h1>Search</h1>
        <p>Find titles by name, release year, and genre.</p>
      </section>

      <form className="search-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Batman"
            required
          />
        </label>

        <label>
          Year
          <input
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="e.g. 2019"
            min="1900"
            max="2100"
          />
        </label>

        <label>
          Genre
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            <option value="">Any genre</option>
            {GENRE_OPTIONS.filter(Boolean).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="primary-btn" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {!hasSearched && <p className="status-text">Start by entering a title above.</p>}
      {hasSearched && !isLoading && results.length === 0 && (
        <p className="status-text">No matches found. Try a broader title or remove filters.</p>
      )}

      {results.length > 0 && (
        <section className="rail-section">
          <div className="section-header">
            <h2>Search Results</h2>
          </div>
          <div className="poster-grid">
            {results.map((item) => (
              <article className="poster-card" key={`${item.mediaType}-${item.id}`}>
                <img src={item.poster} alt={item.title} loading="lazy" />
                <div className="poster-overlay">
                  <h3>{item.title}</h3>
                  <p>
                    {item.year} • {item.genre}
                  </p>
                  <button
                    type="button"
                    className="tiny-btn"
                    onClick={() => toggleMyList(item)}
                  >
                    {isInMyList(item.id, item.mediaType)
                      ? 'Remove from My List'
                      : 'Add to My List'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default SearchPage
