import { Component } from '@angular/core';

import { MessagePage } from '../message/message';
import { ActivePage } from '../active/active';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MessagePage;
  tab3Root = ActivePage;

  constructor() {

  }
}
