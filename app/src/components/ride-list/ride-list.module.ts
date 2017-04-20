import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { RideList } from './ride-list';
import { RideDetailsModule } from '../ride-details/ride-details.module';
import { RideProvider } from '../../providers/ride-provider';

@NgModule({
  declarations: [
    RideList,
  ],
  imports: [
    IonicModule.forRoot(RideList),
    RideDetailsModule
  ],
  providers: [
    RideProvider
  ],
  exports: [
    RideList
  ]
})
export class RideListModule {}
