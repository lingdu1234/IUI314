import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const TokenExpKey = 'CMHLI-MG82X-FACMG'
const TokenExpStatus = 'WEFWF-GEWWS-PJIHY'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token,expires) {
  return Cookies.set(TokenKey, token,{expires})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTokenExp(expires) {
  return window.localStorage.setItem(TokenExpKey, expires)
}
export function setTokenExpStatus(status) {
  return window.localStorage.setItem(TokenExpStatus, status)
}

export function getTokenExp() {
  return window.localStorage.getItem(TokenExpKey)
}
export function getTokenExpStatus() {
  return window.localStorage.getItem(TokenExpStatus)
}

export function removeTokenExp() {
  return window.localStorage.removeItem(TokenExpKey)
}
export function removeTokenExpStatus() {
  return window.localStorage.removeItem(TokenExpStatus)
}