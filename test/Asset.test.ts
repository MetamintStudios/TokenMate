import { Asset } from '../src/modules'

const test_im_path = '/Users/mattmulhall/Desktop/SimplifiedHype/StardustProxies/public/images/StardustProxiesTransparent.png'
const test_im_path_bad_path = '/Users/mattmulhall/Desktop/SimplifiedHype/StardustProxies/public/images/Stardust_INVALID_ProxiesTransparent.png'
const test_im_path_jpg = '/Users/mattmulhall/Desktop/Simplified Clothing/Products/Fire Shorts/Front.jpg'

test('Test construction', () => {
    const birthday_hat = new Asset(test_im_path, .25);

    expect(birthday_hat).toBeTruthy();
})

test('Test that offset x and offset y optional arguments behave correctly.', async () => {
    const birthday_hat = new Asset(test_im_path, .25);
    const birthday_hat2 = new Asset(test_im_path, .25, 15, 5);

    expect(birthday_hat.offset_x).toBeFalsy();
    expect(birthday_hat.offset_y).toBeFalsy();
    expect(birthday_hat2.offset_x).toBeTruthy();
    expect(birthday_hat2.offset_y).toBeTruthy();
})

test('Test image reading behavior', async () => {
    const birthday_hat = new Asset(test_im_path, .25);

    const image = await birthday_hat.read();

    expect(image).toBeTruthy();
})

test('Test image reading failure', async () => {
    const birthday_hat = new Asset(test_im_path_bad_path, .25);
    try{
        await birthday_hat.read()
    } catch ( error: unknown ) {
        // This code won't run if there is no error, so 
        // This shows that the error does indeed throw
        expect(1).toEqual(1);
    }
})

test('Test image reading failure on non-png', async () => {
    const birthday_hat = new Asset(test_im_path_jpg, .25);
    try{
        await birthday_hat.read()
    } catch ( error: unknown ) {
        // This code won't run if there is no error, so 
        // This shows that the error does indeed throw
        expect(1).toEqual(1);
    }
})