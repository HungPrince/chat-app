import { ChatAngularPage } from './app.po';

describe('chat-angular App', function() {
  let page: ChatAngularPage;

  beforeEach(() => {
    page = new ChatAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
