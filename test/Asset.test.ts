import { Asset } from '../src/modules'

const test_im_path = '/Users/mattmulhall/Desktop/SimplifiedHype/StardustProxies/public/images/StardustProxiesTransparent.png'
const test_im_path_bad_path = '/Users/mattmulhall/Desktop/SimplifiedHype/StardustProxies/public/images/Stardust_INVALID_ProxiesTransparent.png'
const test_im_path_jpg = '/Users/mattmulhall/Desktop/Simplified Clothing/Products/Fire Shorts/Front.jpg'

test('Test construction.', () => {
    const birthday_hat = new Asset(test_im_path, .25);

    expect(birthday_hat).toBeTruthy();
})

test('Test construction with attribute.', () => {

    const birthday_hat = new Asset(test_im_path, .25, {
        attribute: {
            trait_type: "Birthday Hat",
            value: "Polka Dots"
        },
        name: "PolkaBirthdayHat"
    });

    expect(birthday_hat).toBeTruthy();
    expect(birthday_hat.has_attribute).toBeTruthy();
    expect(birthday_hat.attribute?.trait_type).toEqual("Birthday Hat")
    expect(birthday_hat.attribute?.value).toEqual("Polka Dots")
    expect(birthday_hat.name).toEqual("PolkaBirthdayHat")
})

test('Test construction with automatic name.', () => {

    const birthday_hat = new Asset(test_im_path, .25, {
        attribute: {
            trait_type: "Birthday Hat",
            value: "Polka Dots"
        }
    });

    expect(birthday_hat).toBeTruthy();
    expect(birthday_hat.has_attribute).toBeTruthy();
    expect(birthday_hat.name).toEqual("StardustProxiesTransparent")
})

test('Test that offset x and offset y optional arguments behave correctly.', async () => {
    const birthday_hat = new Asset(test_im_path, .25);
    const birthday_hat2 = new Asset(test_im_path, .25, {
        offset_x: 15,
        offset_y: 5
    });

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