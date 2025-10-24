export const minLength = (str = '', n = 1) => (str && str.length >= n)

export const maxLength = (str = '', n = Infinity) => (str && str.length <= n)

export const validateTitleDesc = (title = '', description = '', opts = {}) => {
  const { minTitle = 3, minDesc = 3, maxTitle = 80, maxDesc = 200 } = opts
  if (!minLength(title, minTitle) || !minLength(description, minDesc)) return { ok: false, reason: 'insufficient' }
  if (!maxLength(title, maxTitle)) return { ok: false, reason: 'title_too_long' }
  if (!maxLength(description, maxDesc)) return { ok: false, reason: 'desc_too_long' }
  return { ok: true }
}

export const validateWebsite = (website = '') => {
  const websiteTest = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g
  return websiteTest.test(website)
}

export default {
  minLength,
  maxLength,
  validateTitleDesc,
  validateWebsite
}
