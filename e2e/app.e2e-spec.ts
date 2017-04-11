import { MzsadiePage } from './app.po';

describe('mzsadie App', () => {
  let page: MzsadiePage;

  beforeEach(() => {
    page = new MzsadiePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
