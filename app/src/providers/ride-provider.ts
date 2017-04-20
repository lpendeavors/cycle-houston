import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { LocationProvider } from '../providers/location-provider';
import { RideModel } from '../models/ride-model';

/*
  Generated class for the TripProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RideProvider {
  
  public ride = new RideModel();
  public ticks = 0;
  public currentSpeed = 0;
  public rideHistory: RideModel[] = [];
  public inProgress: boolean;
  
  public rideUpdate: Subject<any> = new Subject();
  public rideStarted: Subject<any> = new Subject();
  public rideEnded: Subject<any> = new Subject();
  
  private timer = Observable.timer(0, 1000);
  private speeds: number[] = [];
  private lastCoord: any = {};
  private subscription: any;
  
  constructor(
    public http: Http,
    public zone: NgZone,
    public storage: Storage,
    public locationProvider: LocationProvider
  ) {
      // Subscribe to locationUpdate event
      this.locationProvider.locationUpdate.subscribe((pos) => {
        // Save location to ride object
        this.ride.addCoord(pos.latitude, pos.longitude);
        // Check speed
        if (pos.speed) {
          // Set current speed
          this.currentSpeed = pos.speed;
          // Calculate average speed
          this.calculateAvgSpeed(pos.speed);
        }
        // Calculate distance
        if (this.lastCoord.lat && this.lastCoord.lng) {
          this.calculateDistance(this.lastCoord.lat, this.lastCoord.lng, pos.latitude, pos.longitude);
        }
        // Call rideUpdate event with ride new coordinates
        this.rideUpdate.next(this.ride.points);
        // Update lastCoord variable
        this.lastCoord = { lat: pos.latitude, lng: pos.longitude };
      });
    
    // Check for ride history
    this.storage.ready().then(() => {
      storage.get('rides').then(rides => {
        if (rides) { this.rideHistory = rides; }
      });
    });
  }
  
  startRide(): void {
    // Call rideStarted event
    this.rideStarted.next();
    // Update progess indicator
    this.inProgress = true;
    // Start ride timer
    this.subscription = this.timer.subscribe(t => {
      this.zone.run(() => {
        this.ticks = t;
      });
    });
    // Set start time
    this.ride.startTime = Date.now();
    // Begin watching location
    this.locationProvider.startTracking();
  }
  
  endRide(): void {
    // Stop watching location
    this.locationProvider.stopTracking();
    // Call rideEnded event
    this.rideEnded.next();
    // Update progess indicator
    this.inProgress = false;
    // Stop ride timer and store value
    this.subscription.unsubscribe();
    this.ride.duration = this.ticks;
    this.ticks = 0;
    // Set end time
    this.ride.endTime = Date.now();
    // Upload ride data
    this.saveRide();
  }
  
  saveRide(): void {
    
    // Save ride locally
    this.saveLocal();
  }
  
  saveLocal(): Promise<RideModel[]> {
    return new Promise((resolve, reject) => {
      // Add ride to rideHistory array
      this.rideHistory.push(this.ride);
      // Ensure storage is accessible
      this.storage.ready().then(() => {
        // Save rideHistory array to storage
        this.storage.set('rides', this.rideHistory);
        // Return the promise
        resolve(this.rideHistory);
        // Reset ride
        this.resetRide();
      });
    });
  }
  
  resetRide(): void {
    // Reset ride object
    this.ride = new RideModel();
    // Reset other variables
    this.currentSpeed = 0;
    this.lastCoord = {};
    this.speeds = [];
  }
  
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): void {
    // Calculate distance between coordinates
    const radlat1 = Math.PI * lat1/180;
    const radlat2 = Math.PI * lat2/180;
    const theta = lon1-lon2;
    const radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    // Add to total distance
    this.zone.run(() => {
      this.ride.distance += dist;
    })
  }
  
  calculateAvgSpeed(newSpeed: number): void {
    // Add new speed
    this.speeds.push(newSpeed);
    // Calculate and set average speed
    let sum = 0;
    this.speeds.forEach(s => sum += s);
    this.ride.avgSpeed = sum / this.speeds.length;
  }

}
