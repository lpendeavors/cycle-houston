import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { RideList } from './ride-list';
import { RideDetailsModule } from '../ride-details/ride-details.module';
import { RideProvider } from '../../providers/ride-provider';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RideList,
  ],
  imports: [
    IonicModule.forRoot(RideList),
    RideDetailsModule,
    PipesModule
  ],
  providers: [
    RideProvider
  ],
  exports: [
    RideList
  ]
})
export class RideListModule {}
