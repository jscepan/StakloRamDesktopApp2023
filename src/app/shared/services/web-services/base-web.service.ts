import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArrayResponseI } from 'src/app/core/interfaces/array-response.interface';

@Injectable({
  providedIn: 'root',
})
export class BaseWebService {
  private URL_PREFIX: string = 'http://localhost:45329/';

  constructor(private http: HttpClient) {}

  getRequest<T>(url: string): Observable<T> {
    const options = this.addOptionsForRequest();
    return this.http.get<T>(this.URL_PREFIX + url, options).pipe(
      map((res) => {
        return res as T;
      })
    );
  }

  getRequestForArray<T>(url: string): Observable<T[]> {
    const options = this.addOptionsForRequest();
    return this.http.get<T[]>(this.URL_PREFIX + url, options).pipe(
      map((res) => {
        return res as T[];
      })
    );
  }

  postRequest<T>(url: string, data: T): Observable<T> {
    const options = this.addOptionsForRequest();
    return this.http.post<T>(this.URL_PREFIX + url, data, options).pipe(
      map((res) => {
        return res as T;
      })
    );
  }

  postRequestForArray<T, K>(
    url: string,
    data: K,
    classType: Type<T>
  ): Observable<ArrayResponseI<T>> {
    const options = this.addOptionsForRequest();
    return this.http
      .post<ArrayResponseI<T>>(this.URL_PREFIX + url, data, options)
      .pipe(
        map((res) => {
          const result: ArrayResponseI<T> = {
            entities: res.entities
              ? res.entities.map((entity: T) => plainToClass(classType, entity))
              : [],
            nextID: res.nextID,
            totalCount: res.totalCount,
          };
          return result;
        })
      );
  }

  putRequest<T>(url: string, data: T): Observable<T> {
    const options = this.addOptionsForRequest();
    return this.http.put<T>(this.URL_PREFIX + url, data, options).pipe(
      map((res) => {
        return res as T;
      })
    );
  }

  deleteRequest<T>(url: string): Observable<T> {
    const options = this.addOptionsForRequest();
    // need to add body params to DELETE request because backend is not completely in RESTful standard
    return this.http.delete<T>(this.URL_PREFIX + url, options).pipe(
      map((res) => {
        return res as T;
      })
    );
  }

  private addOptionsForRequest(
    additionalHeaders?: object,
    responseType: string = 'json',
    body?: unknown
  ): object {
    // Create headers
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      ...additionalHeaders,
    });
    const options = {
      headers,
      responseType,
      reportProgress: false,
      observe: 'body',
      withCredentials: false,
      body,
    };

    return options;
  }
}
