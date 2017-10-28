import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the NewChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-chat',
  templateUrl: 'new-chat.html',
})
export class NewChatPage {

  public messages: any = [];
  public user: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public userProvider: UserProvider) {
    this.user = this.navParams.get('user');
    this.storage.get('user').then(
      success => {
        this.userProvider.getMessages({ 'userId': success.userId, 'toUserId': this.user._id }).subscribe(
          res => {
            this.messages = res.messages;
          },
          error => {
            console.log(error);
          }
        )
      }
    )
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewChatPage');
  }

  sendMessage(event){
    console.log(event.target.value);
  }

}
