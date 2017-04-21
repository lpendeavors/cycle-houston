import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { RideDetails } from './ride-details';
import { RideMapModule } from '../ride-map/ride-map.module';

@NgModule({
  declarations: [
    RideDetails
  ],
  imports: [
    IonicModule.forRoot(RideDetails),
    RideMapModule
  ],
  exports: [
    RideDetails
  ]
})
export class RideDetailsModule {}
