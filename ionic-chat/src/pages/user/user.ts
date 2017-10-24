import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../../providers/user/user';
import { NewChatPage } from '../new-chat/new-chat';
/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  private listMessage: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public userProvider: UserProvider) {
    this.storage.get('user').then(
      response => {
        this.userProvider.getListUser().subscribe(
          res => {
            if(res){
              console.log(res);
              for (let i = 0; i < res.length; i++) {
                this.listMessage.push(res[i]);
              }
            }
          },
          error => {
            console.log(error);
          }
        )
      },
      error => {
        console.log(error);
      }
    )
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  gotoChat(user) {
    this.navCtrl.push(NewChatPage, {
      user: user
    });
  }

}
