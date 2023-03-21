/* Go to "EDIT YOUR CONFIG" part of the document
to customize the behaviour of the script */

/* LOGSEQ v0.8.18*/
// @ts-check

/* TYPES */

/**
 * @typedef {Object.<string, string>} ConfigKeys
 * @typedef {Object.<string, boolean>} Config
 * @typedef {Object.<string, string>} SelectorKeys
 */

/* KEYS */

/** @type {ConfigKeys} */
const CONFIG_KEYS = {
  SHOW_CUSTOM_ERRORS_ON_SCREEN: 'SHOW_CUSTOM_ERRORS_ON_SCREEN',
  SHOW_FAVORITES: 'SHOW_FAVORITES',
  SHOW_RECENTS: 'SHOW_RECENTS',
  SHOW_FAVORITES_FULL_NAME: 'SHOW_FAVORITES_FULL_NAME',
  SHOW_RECENTS_FULL_NAME: 'SHOW_RECENTS_FULL_NAME',
}

/** @type {SelectorKeys} */
const SELECTOR_KEYS = {
  FAVORITES: 'FAVORITES',
  RECENTS: 'RECENTS',
}

/* LOGSEQ DEFAULT CONFIG (FOR REFERENCE) */

/** @type {Config} */
const DEFAULT_CONFIG = {
  [CONFIG_KEYS.SHOW_CUSTOM_ERRORS_ON_SCREEN]: false,
  [CONFIG_KEYS.SHOW_FAVORITES]: true,
  [CONFIG_KEYS.SHOW_RECENTS]: true,
  [CONFIG_KEYS.SHOW_FAVORITES_FULL_NAME]: true,
  [CONFIG_KEYS.SHOW_RECENTS_FULL_NAME]: true,
}

/* EDIT YOUR DESIRED CONFIG HERE */

/** @type {Config} */
const CONFIG = {
  [CONFIG_KEYS.SHOW_CUSTOM_ERRORS_ON_SCREEN]: true,
  [CONFIG_KEYS.SHOW_FAVORITES]: true,
  [CONFIG_KEYS.SHOW_RECENTS]: false,
  [CONFIG_KEYS.SHOW_FAVORITES_FULL_NAME]: false,
  [CONFIG_KEYS.SHOW_RECENTS_FULL_NAME]: false,
}

/* SELECTORS */

/* Favorites */

/** @returns {HTMLElement | undefined} */ //@ts-ignore
const getFavoritesHeader = () => document.querySelectorAll('.header')[0]

/** @return {HTMLElement | null} */
const getFavoritesWrapper = () => document.querySelector('.favorites')

/** @return {NodeListOf<HTMLElement>} */
const getFavoriteItems = () => document.querySelectorAll('.favorite-item a')

/* Recents */

/** @returns {HTMLElement | undefined} */ //@ts-ignore
const getRecentsHeader = () => document.querySelectorAll('.header')[1]

/** @return {HTMLElement | null} */
const getRecentsWrapper = () => document.querySelector('.recent')

/** @return {NodeListOf<HTMLElement>} */
const getRecentItems = () => document.querySelectorAll('.recent-item a')

/* ----------------------------------- */

/* Main functions */

/**
 * @param {Config} config
 */
const applyConfig = (config) => {
  verifySelectors()

  Object.entries(config).forEach(([param, value]) => {
    switch (param) {
      case CONFIG_KEYS.SHOW_FAVORITES: {
        if (false === value) {
          toggleShowFavorites()
        }
        return
      }
      case CONFIG_KEYS.SHOW_RECENTS: {
        if (false === value) {
          toggleShowRecents()
        }
        return
      }
      case CONFIG_KEYS.SHOW_FAVORITES_FULL_NAME: {
        if (false === value) {
          createObserver(SELECTOR_KEYS.FAVORITES, getFavoritesWrapper(), removePathFromFavoriteItems)
          removePathFromFavoriteItems()
        }
        return
      }
      case CONFIG_KEYS.SHOW_RECENTS_FULL_NAME: {
        if (false === value) {
          createObserver(SELECTOR_KEYS.RECENTS, getRecentsWrapper(), removePathFromRecentItems)
          removePathFromRecentItems()
        }
        return
      }
      default:
        return
    }
  })
}

const toggleShowFavorites = () => getFavoritesHeader()?.click()
const toggleShowRecents = () => getRecentsHeader()?.click()
const removePathFromFavoriteItems = () => removePathFromItems(getFavoriteItems())
const removePathFromRecentItems = () => removePathFromItems(getRecentItems())

/* Other functions */

/**
 * @param {NodeListOf<HTMLElement>} items
 */
const removePathFromItems = (items) => {
  items.forEach((item) => {
    const elements = item.childNodes
    const lastElement = elements[elements.length - 1]
    const pageName = lastElement.textContent ?? ''
    const newPageName = removePathFromFullName(pageName)

    lastElement.textContent = newPageName
  })
}

/**
 * @param {string} fullName
 * @return {string}
 */
const removePathFromFullName = (fullName = '') => {
  const nameSplit = fullName.split('/')
  const hasPath = 1 !== nameSplit.length

  if (!hasPath) {
    return fullName
  }

  return nameSplit.pop() ?? fullName
}

/* Error management */

/**
 * @param {string} selectorName
 */
const showError = (selectorName) => {
  const message = `SERGI CONFIG ERROR!
The selector "${selectorName}" does not exist`

  console.error(message)

  if (true === CONFIG[CONFIG_KEYS.SHOW_CUSTOM_ERRORS_ON_SCREEN]) {
    alert(message)
  }
}

const verifySelectors = () => {
  const individualSelectors = [
    { getFavoritesHeader },
    { getFavoritesWrapper },
    { getRecentsHeader },
    { getRecentsWrapper },
  ]

  individualSelectors.forEach((selectorObj) => {
    const [selectorName, selectorFunction] = Object.entries(selectorObj)[0]

    if (null != selectorFunction && null != selectorFunction()) {
      return
    }

    showError(selectorName)
  })
}

/* Observer */

/**
 * @param {string} selectorName
 * @param {HTMLElement | null} element
 * @param {MutationCallback} callback
 */
const createObserver = (selectorName, element, callback) => {
  if (null == element) {
    showError(selectorName)
    return
  }

  const observerConfig = { attributes: true, childList: true, subtree: true }
  const observer = new MutationObserver(callback)
  observer.observe(element, observerConfig)
}

/* ------------------------------ */

applyConfig(CONFIG)
