import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { }

  endpoint = "http://localhost:5001"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getAllData(): Observable<any> {
    return this.http.get(this.endpoint + '/arqui2p2').pipe(
      map((data: any) => {
        return data
      })
    )
  }

  getDatabyDate(data: object): Observable<any> {
    return this.http.post(this.endpoint + '/arqui2p2/currentDate', data).pipe(
      map((data: any)=>{
        return data
      })
    )
  }

  insertData(data: object): Observable<any> {
    return this.http.post(this.endpoint + '/arqui2p2', data).pipe(
      map((data: any)=>{
        return data
      })
    )
  }

  last(data): Observable<any> {
    return this.http.post(this.endpoint + '/arqui2p2/last', data).pipe(
      map((data: any)=>{
        return data
      })
    )
  }
  lasttiempo(data): Observable<any> {
    return this.http.post(this.endpoint + '/arqui2p2/lasttiempo', data).pipe(
      map((data: any)=>{
        return data
      })
    )
  }
  lastposicion(data): Observable<any> {
    return this.http.post(this.endpoint + '/arqui2p2/lastposicion', data).pipe(
      map((data: any)=>{
        return data
      })
    )
  }
}
