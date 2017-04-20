import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home } from './home';

import { HomeWeatherModule } from '../../components/home-weather/home-weather.module';
import { RideListModule } from '../../components/ride-list/ride-list.module';

import { ProfileProvider } from '../../providers/profile-provider';

@NgModule({
  declarations: [
    Home,
  ],
  imports: [
    IonicPageModule.forChild(Home),
    HomeWeatherModule,
    RideListModule
  ],
  providers: [
    ProfileProvider
  ],
  exports: [
    Home
  ]
})
export class HomeModule {}
