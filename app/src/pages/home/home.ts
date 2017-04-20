import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile-provider';

/**
 * Generated class for the Home page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home implements OnInit {
  
  private hasProfile: boolean;

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider
  ) {}
  
  ngOnInit(): void {
    this.profileProvider.getProfile()
    .then(profile => { if (profile) this.hasProfile = true; });
  }
}
