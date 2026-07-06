# Netflix Clone (React)

A Netflix-inspired React app built with Vite.

## Completed Features

- Multi-page navigation with React Router
- Protected routes with login screen
- Profile switching with profile-specific "My List"
- "My List" add/remove interactions persisted in local storage
- OMDb integration for Home, Movies, and TV Shows pages
- Automatic fallback content when OMDb API key is missing

## Routes

- /login
- /
- /movies
- /tv
- /my-list

## Setup

1. Install dependencies:

	npm install

2. Optional: enable live OMDb data by creating a .env file in project root:

	VITE_OMDB_API_KEY=your_omdb_api_key_here

3. Run development server:

	npm run dev

4. Build for production:

	npm run build

## Notes

- If no OMDb key is configured, the UI still works using fallback media content.
- My List and selected profile are saved in local storage.

## GitHub Website (Pages)

- This repository is configured to deploy automatically to GitHub Pages from the main branch.
- Website URL after the workflow runs: https://dross7278-star.github.io/netflix-clone/

### One-time setup in GitHub

1. In repository settings, open Pages and ensure the source is GitHub Actions.
2. In repository settings, open Secrets and variables > Actions.
3. Add a repository secret named VITE_OMDB_API_KEY with your OMDb key.
