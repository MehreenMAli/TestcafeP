import { Selector } from 'testcafe';

fixture `My Fixture Demo`
    .page `https://google.com.ar`;
    

test('TC 90002: My first test', async t => {
    let searchInput = Selector('input.gLFyf.gsfi');
    //let searchInput = Selector('input').withAttribute('name','q');
    let search = 'TestCafe';
    await t
        //.maximizeWindow()
        //Check
        .expect(searchInput.exists).ok('The search input should be exist')
        //Complete input
        .typeText(searchInput,search)
        .pressKey('enter')
        .wait(5000);
});