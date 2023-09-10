import Lockr from 'lockr'

const THEME_STORAGE_KEY = 'Theme:key'

// only visible on mobile.
const darkModeThemeColor = '#021316'
const lightModeThemeColor = '#ffffff'

export const Theme = {
  Dark: 'dark',
  Light: 'light',
}

export const DefaultTheme = Theme.Dark

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
    if (window.matchMedia){
      const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light;
      return Lockr.get(THEME_STORAGE_KEY, defaultTheme)
    } else {
      return Lockr.get(THEME_STORAGE_KEY, DefaultTheme)
    }
  }
  return theme
}

export function setTheme(theme) {
  const bodyNode = document.querySelector('body')
  bodyNode.setAttribute('data-theme', theme)
  Lockr.set(THEME_STORAGE_KEY, theme)

  if (theme === Theme.Light) {
    document
      .querySelector(`meta[name='theme-color']`)
      .setAttribute('content', lightModeThemeColor)
  } else if (theme === Theme.Dark) {
    document
      .querySelector(`meta[name='theme-color']`)
      .setAttribute('content', darkModeThemeColor)
  }
}
