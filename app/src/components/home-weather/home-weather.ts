import { Component, OnInit } from '@angular/core';
import { WeatherProvider } from '../../providers/weather-provider';
import { LocationProvider } from '../../providers/location-provider';

/**
 * Generated class for the HomeWeather component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'home-weather',
  templateUrl: 'home-weather.html'
})
export class HomeWeather implements OnInit {
  
  weather: Object;
  
  constructor(
    public weatherProvider: WeatherProvider,
    public locationProvider: LocationProvider
  ) {}
  
  ngOnInit(): void {
    // Get current weather
    this.locationProvider.getPosition()
      .then(pos => this.weatherProvider.getWeather(pos.coords.latitude, pos.coords.longitude)
      .then(weather => {
        this.weather = weather;
      }));
  }
}
