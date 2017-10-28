import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserProvider } from './../../providers/user/user';
import { ShareProvider } from './../../providers/share/share';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private email: String;
  private password: String;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public shareProvider: ShareProvider,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.shareProvider.presentLoading();
    this.userProvider.login({ 'username': this.email, 'password': this.password }).subscribe(
      response => {
        this.shareProvider.dismissLoading();
        this.storage.set('user', response);
        this.shareProvider.user = response;
        this.navCtrl.push(HomePage);
      },
      error => {
        console.log(error);
      }
    )
  }

  gotoSignup() {
    this.navCtrl.push(RegisterPage);
  }

}
