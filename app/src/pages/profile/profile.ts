import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { ProfileModel } from '../../models/profile-model';
import { ProfileProvider } from '../../providers/profile-provider';

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile implements OnInit {
  
  profile = new ProfileModel();
  
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private profileProvider: ProfileProvider
  ) {}
  
  save() {
    if (Object.keys(this.profile).length == 0) {
      return; // No profile to save
    } else {
      this.profileProvider.saveLocal(this.profile)
      .then(response => this.confirmSave());
    }
  }
  
  confirmSave() {
    let toast = this.toastCtrl.create({
      message: 'Profile was saved successfully',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  
  ngOnInit(): void {
    // Check for existing profile
    this.profileProvider.getProfile().then(profile => { 
      if (profile) this.profile = profile;
    });
  }

}
