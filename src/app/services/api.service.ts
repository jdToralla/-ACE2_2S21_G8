import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { }

  endpoint = "http://34.219.19.169:5001"
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // };

  getAllData(): Observable<any> {
    return this.http.get(this.endpoint + '/arqui2pro1').pipe(
      map((data: any) => {
        return data
      })
    )
  }


}
