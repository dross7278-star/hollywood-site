/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const PROFILES = [
  { id: 'adventurer', name: 'Adventurer', avatar: 'AD' },
  { id: 'cinephile', name: 'Cinephile', avatar: 'CP' },
  { id: 'kids', name: 'Kids', avatar: 'KD' },
]

const STORAGE_KEYS = {
  authenticated: 'nf-authenticated',
  activeProfile: 'nf-active-profile',
  myListByProfile: 'nf-my-list-by-profile',
}

const AuthContext = createContext(null)

function getStoredBoolean(key) {
  try {
    return window.localStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

function getStoredValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    getStoredBoolean(STORAGE_KEYS.authenticated),
  )
  const [activeProfileId, setActiveProfileId] = useState(() =>
    getStoredValue(STORAGE_KEYS.activeProfile, PROFILES[0].id),
  )
  const [myListByProfile, setMyListByProfile] = useState(() =>
    getStoredValue(STORAGE_KEYS.myListByProfile, {}),
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.authenticated, String(isAuthenticated))
  }, [isAuthenticated])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.activeProfile,
      JSON.stringify(activeProfileId),
    )
  }, [activeProfileId])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.myListByProfile,
      JSON.stringify(myListByProfile),
    )
  }, [myListByProfile])

  const activeProfile = useMemo(
    () => PROFILES.find((profile) => profile.id === activeProfileId) ?? PROFILES[0],
    [activeProfileId],
  )

  const myList = myListByProfile[activeProfile.id] ?? []

  function login(profileId) {
    setActiveProfileId(profileId)
    setIsAuthenticated(true)
  }

  function logout() {
    setIsAuthenticated(false)
  }

  function switchProfile(profileId) {
    setActiveProfileId(profileId)
  }

  function isInMyList(id, mediaType) {
    return myList.some((item) => item.id === id && item.mediaType === mediaType)
  }

  function toggleMyList(item) {
    setMyListByProfile((prev) => {
      const current = prev[activeProfile.id] ?? []
      const exists = current.some(
        (saved) => saved.id === item.id && saved.mediaType === item.mediaType,
      )

      const updated = exists
        ? current.filter(
            (saved) => !(saved.id === item.id && saved.mediaType === item.mediaType),
          )
        : [item, ...current]

      return {
        ...prev,
        [activeProfile.id]: updated,
      }
    })
  }

  const value = {
    profiles: PROFILES,
    isAuthenticated,
    activeProfile,
    myList,
    login,
    logout,
    switchProfile,
    toggleMyList,
    isInMyList,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
