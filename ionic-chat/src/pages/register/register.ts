import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';

declare var window: any;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
  private formRegister;
  message: string;
  classError: boolean;
  submitted: boolean = false;
  private base64Image;

  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  private optionLibary: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public storage: Storage,
    public camera: Camera,
    public http: Http,
    public actionSheetCtrl: ActionSheetController) {
    this.formRegister = this.formBuilder.group({
      'username': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25),
      ])),
      'email': new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)]))
    })
  }


  register() {
    if (this.formRegister.value.username) {
      this.formRegister.value.username = this.formRegister.value.username.trim();
    }
    if (this.formRegister.value.password) {
      this.formRegister.value.password = this.formRegister.value.password.trim();
    }
    if (this.formRegister.value.email) {
      this.formRegister.value.email = this.formRegister.value.email.trim();
    }
    console.log(this.formRegister);
    this.userProvider.signup({ 'email': this.formRegister.value.email, 'password': this.formRegister.value.password, 'username': this.formRegister.value.username }).subscribe(
      suc => {
        console.log(suc);
        this.classError = false;
      },
      err => {
        console.log(err);
        this.classError = true;
      }
    );
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Take a picture',
      buttons: [
        {
          text: 'Open your camera',
          handler: () => {
            this.camera.getPicture(this.options).then((imageData) => {
              this.makeFileIntoBlob(imageData).then((imageBlob) => {
                let headers = new Headers();
                headers.append('enctype', 'multipart/form-data');
                headers.append('Accept', 'application/json');
                let options = new RequestOptions({ headers: headers });
                let url = "http://localhost:4000/upload";
                const formData = new FormData();
                formData.append('txtImage[]', imageBlob, imageBlob.name);

                this.http.post(url, formData, options).map(response => response.json()).subscribe(result => {
                  alert(JSON.stringify(result));
                });
              })
            }, (err) => {
              console.log(err);
            });
          }
        },
        {
          text: 'From your libary',
          handler: () => {
            this.camera.getPicture(this.optionLibary).then((imageData) => {
              this.base64Image = 'data:image/jpeg;base64,' + imageData;
              this.makeFileIntoBlob(imageData).then((imageBlob) => {
                let headers = new Headers();
                headers.append('enctype', 'multipart/form-data');
                headers.append('Accept', 'application/json');
                let options = new RequestOptions({ headers: headers });
                let url = "http://localhost:4000/upload";
                const formData = new FormData();
                formData.append('txtImage[]', imageBlob, imageBlob.name);

                this.http.post(url, formData, options).map(response => response.json()).subscribe(result => {
                  alert(JSON.stringify(result));
                });
              })
            }, (err) => {
              console.log(err);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  getPicture() {
    this.presentActionSheet();
  }

  private makeFileIntoBlob(_imagePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
        fileEntry.file((resFile) => {
          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: resFile.type });
            imgBlob.name = resFile.name;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }
}
