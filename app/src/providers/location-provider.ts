import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationProvider {
  
  public locationUpdate: Subject<any> = new Subject();
  public watch: any;
  public speed: number;

  constructor(
    public zone: NgZone,
    public geolocation: Geolocation, 
    public backgroundGeolocation: BackgroundGeolocation
  ) {}
  
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then(pos => {
        return resolve(pos);
      },
      (error) => {
        reject(error.message || error);
      });
    })
  }
  
  startTracking(): void {
    // Background Tracking
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };
    
    this.backgroundGeolocation.configure(config).subscribe((location) => {
      this.zone.run(() => {
        this.locationUpdate.next(location);
      })
    }, (err) => {
      console.log(err);
    });
    
    // Turn on the background geolocation system
    this.backgroundGeolocation.start();
    
    // Foreground tracking
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };
    
    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      this.zone.run(() => {
        this.locationUpdate.next(position.coords);
      })
    });
  }
  
  stopTracking(): void {
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }
  
  handleError() {
    
  }

}