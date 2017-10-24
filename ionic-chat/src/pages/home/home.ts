import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UserPage } from '../user/user';
import { ActivePage } from '../active/active';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  tabIndex: number=0;
  user: any;
  active: any;

  constructor(public navCtrl: NavController) {
    this.tabIndex = 0;
    this.user = UserPage;
    this.active = ActivePage;
  }

}
