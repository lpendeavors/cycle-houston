import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { TabsModule } from '../pages/tabs/tabs.module';
import { HomeModule } from '../pages/home/home.module';
import { RideModule } from '../pages/ride/ride.module';
import { ProfileModule } from '../pages/profile/profile.module';
import { PipesModule } from '../pipes/pipes.module';

import { ProfileProvider } from '../providers/profile-provider';
import { WeatherProvider } from '../providers/weather-provider';
import { LocationProvider } from '../providers/location-provider';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TabsModule,
    HomeModule,
    RideModule,
    ProfileModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundGeolocation,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProfileProvider,
    WeatherProvider,
    LocationProvider
  ]
})
export class AppModule {}
