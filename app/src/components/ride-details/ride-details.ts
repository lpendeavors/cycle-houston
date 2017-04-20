import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

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
export class RideDetails {

  ride: RideModel;

  constructor(
    public viewCtrl: ViewController
  ) {}
  
  dismissModal() {
    this.viewCtrl.dismiss();
  }

}
