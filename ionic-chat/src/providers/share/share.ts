import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ShareProvider {

  constructor(public http: Http, public loadingController: LoadingController) {
    console.log('Hello ShareProvider Provider');
  }

  user: any;
  instanceLoading: any;

  public presentLoading() {
    if (!this.instanceLoading) {
      this.instanceLoading = this.loadingController.create({
        content: 'Please wait...'
      });
    }
    this.instanceLoading.present();
  }

  public dismissLoading(){
    if(this.instanceLoading){
      this.instanceLoading.dismiss();
    }
    this.instanceLoading = null;
  }


}
