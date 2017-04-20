import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

/*
  Generated class for the WeatherProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WeatherProvider {
  
  private apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';
  private key = '066e7359820f382914a2eff95cad643a';

  constructor(public http: Http) {}
  
  getWeather(lat: number, lng: number): Promise<any> {
    const url = `${this.apiUrl}lat=${lat}&lon=${lng}&appid=${this.key}&units=imperial`;
    return this.http
                .get(url)
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError);
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // TODO
    return Promise.reject(error.message || error);
  }

}
