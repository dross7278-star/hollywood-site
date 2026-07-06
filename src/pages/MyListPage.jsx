import { useAuth } from '../context/AuthContext'

function MyListPage() {
  const { myList, toggleMyList } = useAuth()

  return (
    <main>
      <section className="library-header">
        <h1>My List</h1>
        <p>Your saved shows and movies for this profile.</p>
      </section>

      {myList.length === 0 ? (
        <section className="empty-state">
          <h2>Your list is empty</h2>
          <p>Add titles from Home, Movies, or TV Shows.</p>
        </section>
      ) : (
        <section className="rail-section">
          <div className="poster-grid">
            {myList.map((item) => (
              <article className="poster-card" key={`${item.mediaType}-${item.id}`}>
                <img src={item.poster} alt={item.title} loading="lazy" />
                <div className="poster-overlay">
                  <h3>{item.title}</h3>
                  <p>
                    {item.year} • ★ {item.voteAverage}
                  </p>
                  <button
                    type="button"
                    className="tiny-btn"
                    onClick={() => toggleMyList(item)}
                  >
                    Remove
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

export default MyListPage
