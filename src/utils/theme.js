import Lockr from 'lockr'

const THEME_STORAGE_KEY = 'Theme:key'

export const Theme = {
  Dark: 'dark',
  Light: 'light'
}

export const DefaultTheme = Theme.Light

export function toggleDarkOrLightTheme() {
  const theme = getTheme()
  if (theme === Theme.Dark) {
    setTheme(Theme.Light)
  } else {
    setTheme(Theme.Dark)
  }
}

export function getTheme() {
  const bodyNode = document.querySelector('body')
  const theme = bodyNode.getAttribute('data-theme')
  if (theme === '' || theme === null) {
    return Lockr.get(THEME_STORAGE_KEY, DefaultTheme)
  }
  return theme
}

export function setTheme(theme) {
  const bodyNode = document.querySelector('body')
  bodyNode.setAttribute('data-theme', theme)
  Lockr.set(THEME_STORAGE_KEY, theme)
}