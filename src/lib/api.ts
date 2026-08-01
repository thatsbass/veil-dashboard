import axios from 'axios'

let getClerkToken: (() => Promise<string | null>) | null = null

export function setClerkTokenFn(fn: () => Promise<string | null>) {
  getClerkToken = fn
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 15_000,
})

api.interceptors.request.use(async (config) => {
  if (getClerkToken) {
    const token = await getClerkToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message: string =
      (err.response?.data as { error?: string })?.error ??
      err.message ??
      'Request failed'
    return Promise.reject(new Error(message))
  },
)

export default api
