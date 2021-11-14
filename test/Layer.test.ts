import { Layer, Asset } from '../src/modules'

test('Test construction, and probability normalization.', () => {
    //Test construction with decimal probabilities.

    const head = new Layer([
        new Asset('/path/to/image', .01),
        new Asset('/path/to/image', .2)
    ])

    const expectedNormalizationFactor = ( 1 / .01 );
    expect(head.overallProbability).toBeCloseTo( ( expectedNormalizationFactor * .01 ) + ( expectedNormalizationFactor * .2 ));
    
    const background = new Layer([
        new Asset('/path/to/image', 1),
        new Asset('/path/to/image', 20)
    ])

    expect(background.overallProbability).toEqual( 1 + 20 );

    const necklace = new Layer([
        new Asset('/path/to/image', .01),
        new Asset('/path/to/image', .9),
        new Asset('/path/to/image', .09)
    ])

    expect(necklace.overallProbability).toEqual( 1 );
})

test('Test event simulation with decimals.', () => {
    const head = new Layer([
        new Asset('/path/to/image1', .01),
        new Asset('/path/to/image2', .99)
    ])
    const frequencyMap: Map<string, number> = new Map<string, number>();
    
    // Since this is a unit test, lets just set it manually to not
    // waste all that time on the if branch
    frequencyMap.set('/path/to/image1', 0);
    frequencyMap.set('/path/to/image2', 0);

    const iterations = 10000
    for ( var i = 0; i < iterations; ++i ) {
        const outcome = head.selectAsset() as Asset;

        // double checks that we get an actual output
        expect(outcome).toBeTruthy();
        const freq = frequencyMap.get(outcome.path) as number
        frequencyMap.set(outcome.path, freq+1)
    }

    expect(frequencyMap.get('/path/to/image1')! / iterations).toBeCloseTo( .01, 2);
    expect(frequencyMap.get('/path/to/image2')! / iterations).toBeCloseTo( .99, 2);
})

test('Test event simulation with relative event occurences.', () => {
    const head = new Layer([
        new Asset('/path/to/image1', 1),
        new Asset('/path/to/image2', 2)
    ])
    const frequencyMap: Map<string, number> = new Map<string, number>();
    
    // Since this is a unit test, lets just set it manually to not
    // waste all that time on the if branch
    frequencyMap.set('/path/to/image1', 0);
    frequencyMap.set('/path/to/image2', 0);

    const iterations = 10000
    for ( var i = 0; i < iterations; ++i ) {
        const outcome = head.selectAsset() as Asset;

        // double checks that we get an actual output
        expect(outcome).toBeTruthy();
        const freq = frequencyMap.get(outcome.path) as number
        frequencyMap.set(outcome.path, freq+1)
    }

    expect(frequencyMap.get('/path/to/image1')! / iterations).toBeCloseTo( 1 / 3, 1);
    expect(frequencyMap.get('/path/to/image2')! / iterations).toBeCloseTo( 2 / 3, 1);
})