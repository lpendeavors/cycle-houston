import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomeWeather } from './home-weather';

@NgModule({
  declarations: [
    HomeWeather,
  ],
  imports: [
    IonicModule.forRoot(HomeWeather)
  ],
  exports: [
    HomeWeather
  ]
})
export class HomeWeatherModule {}
