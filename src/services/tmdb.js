const OMDB_API_BASE = 'https://www.omdbapi.com/'
const API_KEY = import.meta.env.VITE_OMDB_API_KEY

const fallbackHomeData = {
  hero: {
    id: 900001,
    mediaType: 'movie',
    title: 'Edge of Tomorrow',
    year: '2026',
    voteAverage: 8.3,
    overview:
      'A retired pilot is pulled into a covert mission where every decision rewrites Earth\'s future.',
    poster: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=1800&q=80',
  },
  rows: [
    {
      title: 'Most Popular Movies This Week',
      items: [
        {
          id: 900002,
          mediaType: 'movie',
          title: 'Night Signal',
          year: '2026',
          voteAverage: 7.8,
          poster:
            'https://images.unsplash.com/photo-1489599735734-79b4b9b2f5f1?auto=format&fit=crop&w=900&q=80',
        },
        {
          id: 900003,
          mediaType: 'movie',
          title: 'Last Horizon',
          year: '2026',
          voteAverage: 8.1,
          poster:
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80',
        },
        {
          id: 900004,
          mediaType: 'movie',
          title: 'Shadow Case',
          year: '2025',
          voteAverage: 7.5,
          poster:
            'https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=900&q=80',
        },
        {
          id: 900005,
          mediaType: 'movie',
          title: 'Frontline Echo',
          year: '2026',
          voteAverage: 7.2,
          poster:
            'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80',
        },
      ],
    },
    {
      title: 'Most Popular TV Shows This Week',
      items: [
        {
          id: 900006,
          mediaType: 'tv',
          title: 'Orbit 7',
          year: '2025',
          voteAverage: 7.9,
          poster:
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
        },
        {
          id: 900007,
          mediaType: 'tv',
          title: 'Red District',
          year: '2026',
          voteAverage: 7.3,
          poster:
            'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=900&q=80',
        },
        {
          id: 900008,
          mediaType: 'tv',
          title: 'Behind Zero',
          year: '2026',
          voteAverage: 8.5,
          poster:
            'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=900&q=80',
        },
        {
          id: 900009,
          mediaType: 'tv',
          title: 'Wild Type',
          year: '2024',
          voteAverage: 7.1,
          poster:
            'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
        },
        {
          id: 900010,
          mediaType: 'tv',
          title: 'Steel Harbor',
          year: '2026',
          voteAverage: 7.6,
          poster:
            'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
        },
      ],
    },
  ],
}

function safeYear(yearValue) {
  if (!yearValue) {
    return 'TBA'
  }

  const year = String(yearValue).slice(0, 4)
  return year || 'TBA'
}

function sanitizePoster(posterUrl) {
  if (!posterUrl || posterUrl === 'N/A') {
    return ''
  }

  return posterUrl
}

function mapOmdbType(typeValue, forcedMediaType) {
  if (forcedMediaType) {
    return forcedMediaType
  }

  return typeValue === 'series' ? 'tv' : 'movie'
}

function normalizeMedia(item = {}, forcedMediaType) {
  const mediaType = mapOmdbType(item.Type, forcedMediaType)
  const imdbRating = item.imdbRating && item.imdbRating !== 'N/A' ? item.imdbRating : 'N/A'
  const genre = item.Genre && item.Genre !== 'N/A' ? item.Genre : 'Unknown'

  return {
    id: item.imdbID ?? item.id ?? `${mediaType}-${item.Title ?? 'unknown'}`,
    mediaType,
    title: item.Title ?? item.title ?? 'Untitled',
    year: safeYear(item.Year),
    voteAverage: imdbRating,
    genre,
    overview: item.Plot && item.Plot !== 'N/A' ? item.Plot : 'No description available.',
    poster: sanitizePoster(item.Poster),
    backdrop: sanitizePoster(item.Poster),
  }
}

async function fetchOmdb(params) {
  if (!API_KEY) {
    throw new Error('Missing VITE_OMDB_API_KEY')
  }

  const query = new URLSearchParams({
    ...params,
    apikey: API_KEY,
  })
  const url = `${OMDB_API_BASE}?${query.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`OMDb request failed: ${response.status}`)
  }

  const data = await response.json()
  if (data.Response === 'False') {
    throw new Error(data.Error || 'OMDb request returned no results')
  }

  return data
}

async function fetchSearch(searchText, type) {
  const data = await fetchOmdb({
    s: searchText,
    type,
    page: '1',
  })

  return data.Search ?? []
}

async function fetchByImdbId(imdbId, forcedMediaType) {
  const details = await fetchOmdb({
    i: imdbId,
    plot: 'full',
  })

  return normalizeMedia(details, forcedMediaType)
}

function genreMatches(itemGenre, selectedGenre) {
  if (!selectedGenre) {
    return true
  }

  return String(itemGenre).toLowerCase().includes(String(selectedGenre).toLowerCase())
}

export async function searchMediaByFilters({ title, year, genre }) {
  const cleanTitle = String(title ?? '').trim()
  const cleanYear = String(year ?? '').trim()
  const cleanGenre = String(genre ?? '').trim()

  if (!cleanTitle) {
    return []
  }

  try {
    const searchData = await fetchOmdb({
      s: cleanTitle,
      y: cleanYear || undefined,
      page: '1',
    })

    const searchItems = (searchData.Search ?? []).slice(0, 10)
    const detailItems = await Promise.all(
      searchItems.map((item) =>
        fetchOmdb({
          i: item.imdbID,
          plot: 'short',
        })
          .then((details) => normalizeMedia(details))
          .catch(() => normalizeMedia(item)),
      ),
    )

    return detailItems.filter((item) => item.poster && genreMatches(item.genre, cleanGenre))
  } catch {
    return []
  }
}

function limitItems(items, count = 8) {
  return items.filter((item) => item.poster).slice(0, count)
}

async function enrichSearchResults(searchItems, forcedMediaType, count) {
  const deduped = searchItems.filter(
    (item, index, arr) => arr.findIndex((entry) => entry.imdbID === item.imdbID) === index,
  )

  const detailedItems = await Promise.all(
    deduped.map((item) =>
      fetchOmdb({
        i: item.imdbID,
        plot: 'short',
      })
        .then((details) => normalizeMedia(details, forcedMediaType))
        .catch(() => normalizeMedia(item, forcedMediaType)),
    ),
  )

  return limitItems(detailedItems, count)
}

export async function fetchHomeData() {
  try {
    const [movieRawA, movieRawB, tvRawA, tvRawB, hero] = await Promise.all([
      fetchSearch('Popular', 'movie'),
      fetchSearch('Top', 'movie'),
      fetchSearch('Popular', 'series'),
      fetchSearch('Top', 'series'),
      fetchByImdbId('tt3896198', 'movie'),
    ])

    const [movieItems, tvItems] = await Promise.all([
      enrichSearchResults([...movieRawA, ...movieRawB], 'movie', 5),
      enrichSearchResults([...tvRawA, ...tvRawB], 'tv', 5),
    ])

    return {
      hero: hero ?? movieItems[0] ?? tvItems[0] ?? fallbackHomeData.hero,
      rows: [
        { title: 'Most Popular Movies This Week', items: movieItems },
        { title: 'Most Popular TV Shows This Week', items: tvItems },
      ],
    }
  } catch {
    return fallbackHomeData
  }
}

export async function fetchMoviesData() {
  try {
    const [popularRaw, topRaw, hero] = await Promise.all([
      fetchSearch('Action', 'movie'),
      fetchSearch('Oscar', 'movie'),
      fetchByImdbId('tt0133093', 'movie'),
    ])

    const [popular, topRated] = await Promise.all([
      enrichSearchResults(popularRaw, 'movie', 12),
      enrichSearchResults(topRaw, 'movie', 12),
    ])

    return {
      hero: hero ?? popular[0] ?? fallbackHomeData.hero,
      rows: [
        {
          title: 'Popular Movies',
          items: popular,
        },
        {
          title: 'Top Rated Movies',
          items: topRated,
        },
      ],
    }
  } catch {
    return {
      hero: fallbackHomeData.hero,
      rows: [
        { title: 'Popular Movies', items: fallbackHomeData.rows[1].items },
        { title: 'Top Rated Movies', items: fallbackHomeData.rows[0].items },
      ],
    }
  }
}

export async function fetchTvData() {
  try {
    const [popularRaw, topRaw, hero] = await Promise.all([
      fetchSearch('Detective', 'series'),
      fetchSearch('Planet', 'series'),
      fetchByImdbId('tt0903747', 'tv'),
    ])

    const [popular, topRated] = await Promise.all([
      enrichSearchResults(popularRaw, 'tv', 12),
      enrichSearchResults(topRaw, 'tv', 12),
    ])

    return {
      hero: hero ?? popular[0] ?? fallbackHomeData.rows[2].items[0],
      rows: [
        {
          title: 'Popular TV Shows',
          items: popular,
        },
        {
          title: 'Top Rated TV Shows',
          items: topRated,
        },
      ],
    }
  } catch {
    return {
      hero: fallbackHomeData.rows[2].items[0],
      rows: [
        { title: 'Popular TV Shows', items: fallbackHomeData.rows[2].items },
        { title: 'Top Rated TV Shows', items: fallbackHomeData.rows[0].items },
      ],
    }
  }
}
