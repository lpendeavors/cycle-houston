import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Home } from '../home/home';
import { Ride } from '../ride/ride';
import { Profile } from '../profile/profile';

/**
 * Generated class for the Tabs tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
@IonicPage()
export class Tabs {

  tab1Root: any = Home;
  tab2Root: any = Ride;
  tab3Root: any = Profile;

  constructor(public navCtrl: NavController) {}

}
