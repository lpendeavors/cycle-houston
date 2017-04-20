import { NgModule } from '@angular/core';
import { RideMap } from './ride-map';

import { LocationProvider } from '../../providers/location-provider';
import { RideProvider } from '../../providers/ride-provider';

@NgModule({
  declarations: [
    RideMap,
  ],
  providers: [
    LocationProvider,
    RideProvider
  ],
  exports: [
    RideMap
  ]
})
export class RideMapModule {}
