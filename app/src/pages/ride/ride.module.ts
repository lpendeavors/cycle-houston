import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ride } from './ride';

import { RideMapModule } from '../../components/ride-map/ride-map.module';
import { RideProvider } from '../../providers/ride-provider';

@NgModule({
  declarations: [
    Ride
  ],
  imports: [
    IonicPageModule.forChild(Ride),
    RideMapModule
  ],
  providers: [
    RideProvider
  ],
  exports: [
    Ride
  ]
})
export class RideModule {}
