import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { RideDetails } from '../ride-details/ride-details';
import { RideProvider } from '../../providers/ride-provider';

/**
 * Generated class for the TripList component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'ride-list',
  templateUrl: 'ride-list.html'
})
export class RideList {
  
  constructor(
    public modalCtrl: ModalController,
    public rideProvider: RideProvider
  ) {}
  
  presentDetailModal(rideData) {
    let detailModal = this.modalCtrl.create(RideDetails, { ride: rideData });
    detailModal.present();
  }

}
