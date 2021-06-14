const assert = require('assert');
const render = require('../../render');

it('has a test input', async () => {
    const dom = await render('index.html');

    const input = dom.window.document.querySelector('input');

    assert(input);
});

it('shows a success message when valid email', async () => {
    const dom = await render('index.html');

    const input = dom.window.document.querySelector('input');
    input.value = 'wid@test.com';
    dom.window.document
        .querySelector('form')
        .dispatchEvent(new dom.window.Event('submit'));
    
    const h1 = dom.window.document.querySelector('h1');

    assert.strictEqual(h1.innerHTML, 'Looks Good');
});

it('shows a fail message when invalid email', async () => {
    const dom = await render('index.html');

    const input = dom.window.document.querySelector('input');
    input.value = 'widtest.com';
    dom.window.document
        .querySelector('form')
        .dispatchEvent(new dom.window.Event('submit'));
    
    const h1 = dom.window.document.querySelector('h1');

    assert.strictEqual(h1.innerHTML, 'Boo!');
});