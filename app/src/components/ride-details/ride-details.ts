import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { RideMap } from '../ride-map/ride-map';

import { RideModel } from '../../models/ride-model';

/**
 * Generated class for the TripDetails component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'ride-details',
  templateUrl: 'ride-details.html'
})
export class RideDetails implements OnInit {
  
  @ViewChild(RideMap)
  private rideMap: RideMap;

  public ride: RideModel;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {}
  
  dismissModal(): void {
    // Close rideDetail modal
    this.viewCtrl.dismiss();
  }
  
  replayRide(): void {
    // Call replay method on rideMap
    this.rideMap.startReplay();
  }
  
  ngOnInit(): void {
    this.ride = this.params.get('ride');
  }

}
