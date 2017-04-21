import { Component } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
import { RideProvider } from '../../providers/ride-provider';

/**
 * Generated class for the Ride page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ride',
  templateUrl: 'ride.html',
})
export class Ride {
  
  private rideTypes: string[] = ['Work', 'School', 'Leisure', 'Excersise', 'Errand'];
  
  constructor(
    public alertCtrl: AlertController,
    public rideProvider: RideProvider
  ) {}

  start(): void {
    // Make sure a ride is not in progress
    if(!this.rideProvider.inProgress) {
      // Ask for the type of ride
      this.askRideType();
    }
  }
  
  askRideType(): void {
    // Create popup alert
    let list = this.alertCtrl.create();
    list.setTitle('Select ride type');
    // Add input for each type
    this.rideTypes.forEach((type) => {
      list.addInput({
        type: 'radio',
        label: type,
        value: type.toLowerCase(),
      });
    });
    // Add buttons
    list.addButton('Cancel');
    list.addButton({
      text: 'Begin',
      handler: data => {
        // Ensure type selection
        if (data) {
          // Set ride type and begin
          this.rideProvider.ride.type = data;
          this.rideProvider.startRide();
        }
      }
    });
    // Show list
    list.present();
  }
  
  stop(): void {
    // Ask for confirmation
    this.confirmEnd();
  }
  
  confirmEnd(): void {
    // Configure confirm popup
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'You are about to end your ride.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Do nothing
            return;
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            // End if confirmed
            this.rideProvider.endRide();
          }
        }
      ]
    });
    // Show confirm
    confirm.present();
  }

}
