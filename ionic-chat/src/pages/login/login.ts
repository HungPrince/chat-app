import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserProvider } from './../../providers/user/user';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    console.log(this.email, this.password);

    this.userProvider.login({ 'username': this.email, 'password': this.password }).subscribe(
      response => {
        this.storage.set('user', response);
        console.log(response);
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
