/* Importing from core library starts*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
/* Importing from core library ends*/

/* Importing from bootstrap library starts*/
import { ModalModule } from 'ng2-bootstrap';
import { TabsModule } from 'ng2-bootstrap';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
/* Importing from bootstrap library ends*/

/* Importing application routing starts*/
import { appRouting } from './app.routing';
/* Importing application routing ends*/

/* Importing Application services starts*/
import { AppService } from './services/app.service';
import { HttpService } from './services/http.service';
import { SocketService } from './services/socket.service';
import { EmitterService } from './services/emitter.service';
/* Importing Application services ends*/

/* Importing application components starts*/
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ConversationComponent } from './conversation/conversation.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { NotFoundComponent } from './not-found/not-found.component';
/* Importing application components ends*/

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AuthComponent,
        ChatListComponent,
        ConversationComponent,
        NotFoundComponent,
        NewChatComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        appRouting,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        ToastModule.forRoot()
    ],
    providers : [HttpService,SocketService,AppService,EmitterService],
    bootstrap: [AppComponent]
})
export class AppModule { }