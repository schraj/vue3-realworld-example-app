import merge from 'deepmerge'

import { NetworkError } from '../types/error'

import { Either, fail, success } from './either'
import params2query from './params-to-query'

interface FetchRequestOptions {
  prefix: string;
  headers: Record<string, string>;
  params: Record<string, string | number | boolean>;
}

export default class FetchRequest {
  private defaultOptions: FetchRequestOptions = {
    prefix: '',
    headers: {},
    params: {},
  }

  private options: FetchRequestOptions

  constructor (options: Partial<FetchRequestOptions> = {}) {
    this.options = merge(this.defaultOptions, options)
  }

  private generateFinalUrl = (url: string, options: Partial<FetchRequestOptions> = {}) => {
    const prefix = options.prefix ?? this.options.prefix
    const params = merge(this.options.params, options.params ?? {})

    let finalUrl = `${prefix}${url}`
    if (Object.keys(params).length) finalUrl += `?${params2query(params)}`

    return finalUrl
  }

  private generateFinalHeaders = (options: Partial<FetchRequestOptions> = {}) => {
    return merge(this.options.headers, options.headers ?? {})
  }

  private handleResponse = <T>(response: Response): Promise<Either<NetworkError, T>> => {
    if (response.ok) {
      return response.json().then(json => success(json as T))
    }

    return Promise.resolve(fail(new NetworkError(response)))
  }

  private handleCorrectResponse = <T>(response: Response): Promise<T> => {
    if (response.ok) {
      return response.json()
    }

    throw new NetworkError(response)
  }

  private runFetch ({ method, url, data, options }: {
    method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH',
    url: string,
    data?: Record<string, any>,
    options: Partial<FetchRequestOptions>
  }) {
    const finalUrl = this.generateFinalUrl(url, options)
    const headers = this.generateFinalHeaders(options)

    const fetchOptions: any = { method, headers }
    if (data) fetchOptions.body = JSON.stringify(data)
    return fetch(finalUrl, fetchOptions)
  }

  private runSafeFetch (method: 'GET' | 'DELETE', url: string, options: Partial<FetchRequestOptions>) {
    return this.runFetch({ method, url, options })
  }

  private runUnsafeFetch (method: 'POST' | 'PUT' | 'PATCH', url: string, data: Record<string, any> = {}, options: Partial<FetchRequestOptions> = {}) {
    return this.runFetch({ method, url, options, data })
  }

  get<T = any> (url: string, options: Partial<FetchRequestOptions> = {}) {
    return this.runSafeFetch('GET', url, options).then(r => this.handleCorrectResponse<T>(r))
  }

  checkableGet<T = any> (url: string, options: Partial<FetchRequestOptions> = {}) {
    return this.runSafeFetch('GET', url, options).then(r => this.handleResponse<T>(r))
  }

  post<T = any> (url: string, data: Record<string, any> = {}, options: Partial<FetchRequestOptions> = {}) {
    return this.runUnsafeFetch('POST', url, data, options).then(r => this.handleCorrectResponse<T>(r))
  }

  checkablePost<T = any> (url: string, data: Record<string, any> = {}, options: Partial<FetchRequestOptions> = {}) {
    return this.runUnsafeFetch('POST', url, data, options).then(r => this.handleResponse<T>(r))
  }

  delete<T = any> (url: string, options: Partial<FetchRequestOptions> = {}) {
    return this.runSafeFetch('DELETE', url, options).then(r => this.handleCorrectResponse<T>(r))
  }

  checkableDelete<T = any> (url: string, options: Partial<FetchRequestOptions> = {}) {
    return this.runSafeFetch('DELETE', url, options).then(r => this.handleResponse<T>(r))
  }

  put<T = any> (url: string, data: Record<string, any> = {}, options: Partial<FetchRequestOptions> = {}) {
    return this.runUnsafeFetch('PUT', url, data, options).then(r => this.handleCorrectResponse<T>(r))
  }

  checkablePut<T = any> (url: string, data: Record<string, any> = {}, options: Partial<FetchRequestOptions> = {}) {
    return this.runUnsafeFetch('PUT', url, data, options).then(r => this.handleResponse<T>(r))
  }

  patch<T = any> (url: string, data: Record<string, any> = {}, options: Partial<FetchRequestOptions> = {}) {
    return this.runUnsafeFetch('PATCH', url, data, options).then(r => this.handleCorrectResponse<T>(r))
  }

  checkablePatch<T = any> (url: string, data: Record<string, any> = {}, options: Partial<FetchRequestOptions> = {}) {
    return this.runUnsafeFetch('PATCH', url, data, options).then(r => this.handleResponse<T>(r))
  }

  public setAuthorizationHeader (token: string): void {
    if (!this.options.headers) this.options.headers = {}
    if (token) this.options.headers.Authorization = `Token ${token}`
  }

  public deleteAuthorizationHeader (): void {
    delete this.options?.headers?.Authorization
  }
}
