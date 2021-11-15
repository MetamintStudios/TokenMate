//Remember, before reading in an image, check if its an empty asset to just skip.
import { Asset, Layer } from './modules'
import { NFTImage } from './modules'
import jimp from 'jimp'
import signale from 'signale'

//prob doesn't matter we are just using it to store path and read essentailly.
const ASSET_PATH = `/Users/mattmulhall/Desktop/ShitAssets`;
const OUTPUT_PATH = `/Users/mattmulhall/TokenMate/out`

async function GeneratePeacesOfShit(){

    const Backgrounds = new Layer([
        new Asset(
            `${ASSET_PATH}/Background/BrownBackground.png`,
            .14,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Brown'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Background/BlueBackground.png`,
            .14,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Blue'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Background/GradientBackground.png`,
            .11,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Gradient'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Background/GreenBackground.png`,
            .14,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Green'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Background/GreyBackground.png`,
            .14,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Grey'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Background/PinkBackground.png`,
            .14,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Pink'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Background/SolanaBackground.png`,
            .05,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Solana'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Background/YellowBackground.png`,
            .14,
            {
                attribute: {
                    trait_type: 'Background',
                    value: 'Yellow'
                }
            }
        )
    ])

    /* Stand */

    const Stands = new Layer([
        new Asset(
            `${ASSET_PATH}/Stand/DiamondPlungerStand.png`,
            0.05,
            {
                attribute: {
                    trait_type: 'Stand',
                    value: 'Diamond Plunger'
                },
                incompatible_with: [
                    'DiamondPlungerHat',
                    'GoldPlungerHat',
                    'PlungerHat'
                ]
            }
        ),
        new Asset(
            `${ASSET_PATH}/Stand/IceCreamCone.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Stand',
                    value: 'Ice Cream Cone'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Stand/PlungerStand.png`,
            0.2,
            {
                attribute: {
                    trait_type: 'Stand',
                    value: 'Regular Plunger'
                },
                incompatible_with: [
                    'DiamondPlungerHat',
                    'GoldPlungerHat',
                    'PlungerHat'
                ]
            }
        ),
        new Asset(
            `${ASSET_PATH}/Stand/GoldPlungerStand.png`,
            0.05,
            {
                attribute: {
                    trait_type: 'Stand',
                    value: 'Gold Plunger Stand'
                },
                incompatible_with: [
                    'DiamondPlungerHat',
                    'GoldPlungerHat',
                    'PlungerHat'
                ]
            }
        ),
        new Asset(
            ``,
            .6,
            {
                name: 'No stand',
                attribute: {
                    trait_type: 'Stand',
                    value: 'None'
                },
                empty_layer: true
            }
        )
    ])

    /* CHARACTERS */ 
    const Characters = new Layer([
        new Asset(
            `${ASSET_PATH}/Character/BananaBase.png`,
            0.025,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Banana'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/BlueBase.png`,
            .12,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Blue'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/GreenBase.png`,
            .12,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Green'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/GreyBase.png`,
            .12,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Grey'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/PinkBase.png`,
            .12,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Pink'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/PoopBase.png`,
            0.30,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Poop'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/RainbowBase.png`,
            0.025,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Rainbow'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/SkullBase.png`,
            .025,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Skull'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/SolanaBase.png`,
            0.025,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Solana'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Character/YellowBase.png`,
            .12,
            {
                attribute: {
                    trait_type: 'Fecies',
                    value: 'Yellow'
                }
            }
        )
    ])

    const SpecialBackgrounds = new Layer([
        new Asset(
            `${ASSET_PATH}/AssetBg/Flies.png`,
            .20,
            {
                attribute: {
                    trait_type: 'Special Background',
                    value: 'Flies'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/AssetBg/ShitSteam.png`,
            .20,
            {
                attribute: {
                    trait_type: 'Special Background',
                    value: 'Steaming Shit'
                },
                incompatible_with: [
                    'DiamondPlungerHat',
                    'GoldPlungerHat',
                    'PlungerHat'
                ]
            }
        ),
        new Asset(
            ``,
            0.6,
            {
                name: 'No Background',
                attribute: {
                    trait_type: 'Special Background',
                    value: 'None'
                },
                empty_layer: true
            }
        )
    ])

    /* Face Options */
    const FaceOptions = new Layer([
        new Asset(
            ``,
            0.6,
            {
                name: 'No face options',
                attribute: {
                    trait_type: 'Face Options',
                    value: 'None'
                },
                empty_layer: true
            }
        ),
        new Asset(
            `${ASSET_PATH}/Face/Blush.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Face Options',
                    value: 'Blush'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Face/BothSpots.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Face Options',
                    value: 'Two Blemishes'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Face/TopSpot.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Face Options',
                    value: 'One Top Blemish'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Face/BottomSpot.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Face Options',
                    value: 'One Bottom Blemish'
                }
            }
        )
    ])

    const Mouths = new Layer([
        new Asset(
            `${ASSET_PATH}/Mouth/Smile.png`,
            .35,
            {
                attribute: {
                    trait_type: 'Mouth',
                    value: 'Big Smile'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Mouth/Surprised.png`,
            .2,
            {
                attribute: {
                    trait_type: 'Mouth',
                    value: 'Surprised'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Mouth/SlightSmile.png`,
            .12,
            {
                attribute: {
                    trait_type: 'Mouth',
                    value: 'Slight Smile'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Mouth/BitingLip.png`,
            .13,
            {
                attribute: {
                    trait_type: 'Mouth',
                    value: 'Biting Lip'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Mouth/InBetweenSmile.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Mouth',
                    value: 'Small Smile'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Mouth/Serious.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Mouth',
                    value: 'Big Smile'
                }
            }
        )
    ])

    const Eyes = new Layer([
        new Asset(
            `${ASSET_PATH}/Eyes/3DGlasses.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: '3D Glasses'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/AngryEyes.png`,
            0.125,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Angry Eyes'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/ClosedEyes.png`,
            0.125,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Closed Eyes'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/Eyes.png`,
            0.15,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Normal Eyes'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/Sleep.png`,
            0.15,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Sleepy Eyes'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/StonedEyes.png`,
            0.05,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Stoned Eyes'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/SunGlasses.png`,
            0.05,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Sun Glasses'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/Wink.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Wink'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/BlueTronGlasses.png`,
            0.05,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Blue Tron Glasses'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/PurpleTronGlasses.png`,
            0.05,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Purple Tron Glasses'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Eyes/GoldTronGlasses.png`,
            0.05,
            {
                attribute: {
                    trait_type: 'Eyes',
                    value: 'Gold Tron Glasses'
                }
            }
        )
    ])

    const Hats = new Layer([
        new Asset(
            `${ASSET_PATH}/Hat/Fedora.png`,
            0.1,
            {
                attribute: {
                    trait_type: 'Hat',
                    value: 'Fedora'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Hat/DiamondPlungerHat.png`,
            0.025,
            {
                attribute: {
                    trait_type: 'Hat',
                    value: 'Diamond Plunger'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Hat/GoldPlungerHat.png`,
            0.075,
            {
                attribute: {
                    trait_type: 'Hat',
                    value: 'Gold Plunger'
                }
            }
        ),
        new Asset(
            `${ASSET_PATH}/Hat/PlungerHat.png`,
            0.2,
            {
                attribute: {
                    trait_type: 'Hat',
                    value: 'Regular Plunger'
                }
            }
        ),
        new Asset(
            ``,
            0.6,
            {
                name: 'No Hat',
                attribute: {
                    trait_type: 'Hat',
                    value: 'No Hat'
                },
                empty_layer: true
            }
        )
    ])


    var nfts_generated: number = 0;

    const Layers = [ 
        Backgrounds,
        Stands,
        Characters,
        SpecialBackgrounds,
        FaceOptions,
        Mouths,
        Eyes,
        Hats
    ]
    
    const frequencyMap: Map<string, boolean> = new Map<string, boolean>();

    while ( nfts_generated < 250 ) {
        signale.info(`[PeaceOfShitDriver] Generating NFT ${nfts_generated + 1}`)

        const NFTToGen = new NFTImage(nfts_generated);

        signale.info(`[PeaceOfShitDriver] NFTImage Initialized.`)

        for ( var idx = 0; idx < Layers.length; ++ idx ){
            
            var chosenAsset = Layers[idx].selectAsset();

            // If the asset is not compatible get until they are.
            while ( !NFTToGen.compatible(chosenAsset ) ) {
                chosenAsset = Layers[idx].selectAsset();
                signale.warn(`[PeaceOfShitDriver] Selected asset invalid ${chosenAsset.name}, picking another.`)
            }
            
            signale.info(`[PeaceOfShitDriver] Selected Asset ${chosenAsset.name}.`)
            // Apply layer
            // Should validate configuration to make sure that there
            // isn't a layer that is incompatible with another.
            NFTToGen.applyLayer(chosenAsset);

            signale.info(`[PeaceOfShitDriver] Applied layer to image.`)
        }

        const hash = NFTToGen.hash();

        const exists = frequencyMap.get(hash)
        
        if ( exists ){
            signale.info(`[PeaceOfShitDriver] Generated a duplicate NFT hash, skipping.`)
            continue;
        }

        frequencyMap.set(hash, true);

        var GeneratedNFT: jimp;
        try {
            GeneratedNFT = await NFTToGen.rasterize();
            signale.info(`[PeaceOfShitDriver] Rasterized Image.`)
            GeneratedNFT.write(`${OUTPUT_PATH}/${NFTToGen.position}.png`)
            signale.info(`[PeaceOfShitDriver] Wrote image.`)
            nfts_generated += 1
        } catch ( e : any ) {
            signale.error(e)
        }

    }

}

GeneratePeacesOfShit().catch((e) => {
    signale.error(e)
});

