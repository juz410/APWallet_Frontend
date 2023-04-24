import {
  HttpClient, HttpErrorResponse, HttpHeaders, HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EMPTY, NEVER, Observable, iif, of, throwError,
} from 'rxjs';
import {
  catchError, concatMap, delay, publishLast, refCount, retryWhen, switchMap,
  timeout,
} from 'rxjs/operators';

import { CasService } from './cas.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WsApiService {
  apiUrl = environment.url;

  constructor(
    public http: HttpClient,
    private cas: CasService,
  ) { }

  /**
   * GET: Request WS API with cache (mobile only) and error handling.
   *
   * Caching strategies inspired by https://serviceworke.rs/caching-strategies.html
   *
   * @param endpoint - <apiUrl><endpoint> for service, used for caching
   * @param options.attempts - number of retries (default: 4)
   * @param options.auth - authentication required (default: true)
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 20000)
   * @param options.url - url of web service (default: apiUrl)
   * @param options.withCredentials - request sent with cookies (default: false)
   * @return data observable
   */
  get<T>(endpoint: string, options: {
    attempts?: number,
    auth?: boolean,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    url?: string,
    withCredentials?: boolean
  } = {}): Observable<T> {
    options = {
      attempts: 4,
      auth: true,
      headers: {},
      params: {},
      timeout: 40000,
      url: this.apiUrl,
      withCredentials: false,
      ...options
    };

    const url = options.url + endpoint;
    console.log(url)
    const opt = {
      params: options.params,
      withCredentials: options.withCredentials,
      headers: options.headers
    };

    return (!options.auth // always get ticket if auth is true
      ? this.http.get<T>(url, opt)
      : this.cas.getST(url.split('?').shift()).pipe( // remove service url params
        switchMap(ticket => this.http.get<T>(url, { ...opt, params: { ...opt.params, ticket } })),
      )
    ).pipe(
      catchError(err => {
        if (400 <= err.status && err.status < 500) {
          return throwError(err);
        }
        // TODO: show error message to the user
        // this.toastCtrl.create({ message: err.message, duration: 3000, position: 'top' })
        //   .then(toast => toast.present());
      }),
      retryWhen(errors => errors.pipe(
        concatMap((err, n) => iif( // use concat map to keep errors in order (not parallel)
          () => !(400 <= err.status && err.status < 500) && n < options.attempts, // skip 4xx
          of(err).pipe(delay((2 ** (n + 1) + Math.random() * 8) * 1000)), // 2^n + random 0-8
          throwError(err), // propagate error if all retries failed
        ))
      )),
      timeout(options.timeout)
    );
  }

  /**
   * POST: Simple request WS API.
   *
   * @param endpoint - <apiUrl><endpoint> for service
   * @param options.auth - authentication required (default: true)
   * @param options.body - request body (default: null)
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 20000)
   * @param options.url - url of web service (default: apiUrl)
   * @param options.withCredentials - request sent with cookies (default: false)
   * @return data observable
   */
  post<T>(endpoint: string, options: {
    auth?: boolean,
    body?: any | null,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    withCredentials?: boolean,
    url?: string,
  } = {}): Observable<T> {
    options = {
      auth: true,
      body: null,
      headers: {},
      params: {},
      timeout: 120000,
      url: this.apiUrl,
      withCredentials: false,
      ...options
    };

    const url = options.url + endpoint;
    const opt = {
      headers: options.headers,
      params: options.params,
      withCredentials: options.withCredentials,
    };

    return (!options.auth // always get ticket if auth is true
      ? this.http.post<T>(url, options.body, opt)
      : this.cas.getST(url.split('?').shift()).pipe( // remove service url params
        switchMap(ticket => this.http.post<T>(url, options.body, { ...opt, params: { ...opt.params, ticket } })),
      )
    ).pipe(
      catchError(this.handleClientError),
      timeout(options.timeout),
      publishLast(),
      refCount(),
    );
  }

  /**
   * PUT: Simple request WS API.
   *
   * @param endpoint - <apiUrl><endpoint> for service
   * @param options.auth - authentication required (default: true)
   * @param options.body - request body (default: null)
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 10000)
   * @param options.url - url of web service (default: apiUrl)
   * @param options.withCredentials - request sent with cookies (default: false)
   * @return data observable
   */
  put<T>(endpoint: string, options: {
    auth?: boolean,
    body?: any | null,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    url?: string,
    withCredentials?: boolean,
  } = {}): Observable<T> {
    options = {
      auth: true,
      body: null,
      headers: {},
      params: {},
      timeout: 20000,
      url: this.apiUrl,
      withCredentials: false,
      ...options
    };

    const url = options.url + endpoint;
    const opt = {
      headers: options.headers,
      params: options.params,
      withCredentials: options.withCredentials,
    };

    return (!options.auth // always get ticket if auth is true
      ? this.http.put<T>(url, options.body, opt)
      : this.cas.getST(url.split('?').shift()).pipe( // remove service url params
        switchMap(ticket => this.http.put<T>(url, options.body, { ...opt, params: { ...opt.params, ticket } })),
      )
    ).pipe(
      catchError(this.handleClientError),
      timeout(options.timeout),
      publishLast(),
      refCount(),
    );
  }

  /**
   * DELETE: Simple request WS API.
   *
   * @param endpoint - <apiUrl><endpoint> for service
   * @param options.auth - authentication required (default: true)
   * @param options.body - request body (default: null)
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 10000)
   * @param options.url - url of web service (default: apiUrl)
   * @param options.withCredentials - request sent with cookies (default: false)
   * @return data observable
   */
  delete<T>(endpoint: string, options: {
    auth?: boolean,
    body?: any | null,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    url?: string,
    withCredentials?: boolean,
  } = {}): Observable<T> {
    options = {
      auth: true,
      body: null,
      headers: {},
      params: {},
      timeout: 20000,
      url: this.apiUrl,
      withCredentials: false,
      ...options
    };

    const url = options.url + endpoint;
    const opt = {
      headers: options.headers,
      params: options.params,
      body: options.body,
      withCredentials: options.withCredentials,
    };

    return (!options.auth // always get ticket if auth is true
      ? this.http.delete<T>(url, opt)
      : this.cas.getST(url.split('?').shift()).pipe( // remove service url params
        switchMap(ticket => this.http.delete<T>(url, { ...opt, params: { ...opt.params, ticket } })),
      )
    ).pipe(
      catchError(this.handleClientError),
      timeout(options.timeout),
      publishLast(),
      refCount(),
    );
  }

  /** Handle client error by rethrowing 4xx or return empty observable for 304. */
  private handleClientError(err: HttpErrorResponse): Observable<never> {
    if (400 <= err.status && err.status <= 500) {
      return throwError(err);
    } else if (err.status === 304) {
      return EMPTY;
    } else {
      console.error('Unknown http error response', err);
      return NEVER;
    }
  }

}
