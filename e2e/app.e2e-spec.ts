import { FireChatPage } from './app.po';

describe('fire-chat App', function() {
  let page: FireChatPage;

  beforeEach(() => {
    page = new FireChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
