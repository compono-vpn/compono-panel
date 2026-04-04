import {
    REMNAWAVE_CLIENT_TYPE_BROWSER,
    REMNAWAVE_CLIENT_TYPE_HEADER
} from '@remnawave/backend-contract'
import consola from 'consola/browser'
import axios, { AxiosInstance } from 'axios'

import { logoutEvents } from '../emitters/emit-logout'

let authorizationToken = ''

/**
 * Resolves the API base URL using the following priority:
 *
 * 1. VITE_API_BASE_URL — explicit override for cutover (e.g. "https://api.componovpn.com")
 * 2. DOMAIN_OVERRIDE=1 + DOMAIN_BACKEND — legacy dev override
 * 3. In development: DOMAIN_BACKEND (e.g. "http://127.0.0.1:3003")
 * 4. In production: window.location.origin (same-origin, current default)
 *
 * To point the panel at compono-api for cutover, set VITE_API_BASE_URL in the
 * Docker build or ArgoCD values. No code change required.
 */
function resolveApiBaseUrl(): string {
    // Highest priority: explicit API base URL for migration/cutover
    if (__VITE_API_BASE_URL__) {
        return __VITE_API_BASE_URL__
    }

    // Legacy: DOMAIN_OVERRIDE forces DOMAIN_BACKEND regardless of environment
    if (__DOMAIN_OVERRIDE__ === '1') {
        return __DOMAIN_BACKEND__
    }

    // Development: use configured backend domain
    if (__NODE_ENV__ === 'development') {
        return __DOMAIN_BACKEND__
    }

    // Production default: same-origin (panel.compono.it.com serves both SPA and proxies API)
    return window.location.origin
}

export const API_BASE_URL = resolveApiBaseUrl()

/**
 * Resolves the compono-api base URL for per-module cutover.
 *
 * When VITE_COMPONO_API_URL is set, individual API hook modules can use the
 * Go-based compono-api instead of the NestJS compono-backend. This enables
 * gradual per-screen migration without switching the entire panel at once.
 *
 * When empty/unset, returns null — callers should fall back to the default instance.
 */
export const COMPONO_API_URL: string | null = __VITE_COMPONO_API_URL__ || null

function applyInterceptors(inst: AxiosInstance): void {
    inst.interceptors.request.use((config) => {
        config.headers.set('Authorization', `Bearer ${authorizationToken}`)
        return config
    })

    inst.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if (error.response) {
                const responseStatus = error.response.status
                if (responseStatus === 403 || responseStatus === 401) {
                    try {
                        logoutEvents.emit()
                    } catch (error) {
                        consola.log('error', error)
                    }
                }
            }
            return Promise.reject(error)
        }
    )
}

const defaultHeaders = {
    'Content-type': 'application/json',
    Accept: 'application/json',
    [REMNAWAVE_CLIENT_TYPE_HEADER]: REMNAWAVE_CLIENT_TYPE_BROWSER
}

export const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: defaultHeaders
})

applyInterceptors(instance)

/**
 * Secondary axios instance pointing at compono-api (Go backend).
 * Only created when VITE_COMPONO_API_URL is set. Shares the same auth
 * token and interceptors as the default instance.
 *
 * Used by individual API hook modules that have been cut over to compono-api.
 */
export const componoApiInstance: AxiosInstance | null = COMPONO_API_URL
    ? (() => {
          const inst = axios.create({
              baseURL: COMPONO_API_URL,
              headers: defaultHeaders
          })
          applyInterceptors(inst)
          return inst
      })()
    : null

export const setAuthorizationToken = (token: string) => {
    authorizationToken = token
}
