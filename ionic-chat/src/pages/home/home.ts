import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Push, PushToken } from '@ionic/cloud-angular';

import { ShareProvider } from './../../providers/share/share';
import { UserPage } from '../user/user';
import { LoginPage } from './../login/login';
import { ActivePage } from '../active/active';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  tabIndex: number = 0;
  user: any;
  active: any;

  constructor(public navCtrl: NavController, public shareProvider: ShareProvider, public storage: Storage, public push: Push) {

    this.push.register().then((t: PushToken) => {
      console.log('abc');
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('Token saved', t.token);
    });

    this.push.rx.notification()
      .subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
      });

    this.tabIndex = 0;
    this.user = UserPage;
    this.active = ActivePage;
    if (!this.shareProvider.user) {
      this.navCtrl.push(LoginPage);
    }
  }

  logOut() {
    this.shareProvider.user = null;
    this.navCtrl.push(LoginPage);
  }

}
