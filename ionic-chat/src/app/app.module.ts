import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';
import { RegisterPage } from '../pages/register/register';
import { MessagePage } from '../pages/message/message';
import { ActivePage } from '../pages/active/active';
import { TabsPage } from '../pages/tabs/tabs';
import { UserPage } from '../pages/user/user';
import { NewChatPage } from '../pages/new-chat/new-chat';
import { SocketProvider } from '../providers/socket/socket';
import { ShareProvider } from '../providers/share/share';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1:725991726211:android:62f298703ce9ccdd',
  },
  'push': {
    'sender_id': '725991726211',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    MessagePage,
    ActivePage,
    UserPage,
    NewChatPage,
    TabsPage
  ],
  imports: [
    FormsModule,
    HttpModule,
    BrowserModule,
    CloudModule.forRoot(cloudSettings),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    MessagePage,
    ActivePage,
    UserPage,
    NewChatPage,
    TabsPage
  ],
  providers: [
    Camera,
    File,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    SocketProvider,
    ShareProvider
  ]
})
export class AppModule { }
