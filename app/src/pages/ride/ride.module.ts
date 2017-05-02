import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ride } from './ride';

import { RideMapModule } from '../../components/ride-map/ride-map.module';
import { RideProvider } from '../../providers/ride-provider';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Ride
  ],
  imports: [
    IonicPageModule.forChild(Ride),
    RideMapModule,
    PipesModule
  ],
  providers: [
    RideProvider
  ],
  exports: [
    Ride
  ]
})
export class RideModule {}
