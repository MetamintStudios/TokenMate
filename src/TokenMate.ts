import { program, Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { Asset, NFTImage, JSONOptions, Layer } from './modules'
import jimp from 'jimp'
import signale from 'signale'
import * as ss from 'simple-statistics'

program.command('setup')
    .argument(
        '<directory>',
        'Directory where the asset files are currently situated. There should be sub directories, where unique classes of assets are stored.',
        val => {
            try{
                const sub_files = fs.readdirSync(`${val}`)
                var sub_directories: string[] = sub_files.map((directory) => {
                    return path.join(val, directory)
                })
                sub_directories = sub_directories.filter((value) => {
                    const is_dir = fs.lstatSync(value).isDirectory()
                    if ( is_dir ){
                        const split = value.split(path.sep)
                        const layerName = split[split.length - 1]
                        signale.info(`[TokenMate Main] Found a layer: ${layerName}`)
                        return value
                    }
                })
                return sub_directories
            }catch (e){
                throw new Error(`[TokenMate Main] Error reading directory ${val}: ${e}.`)
            }
            
        }
    )
    .option(
        '-o, --out <string>',
        'Path to json file that you want to write this TokenMate configuration to.'
    )
    .action(
    async ( sub_dirs: string[], options ) => {

        interface Layer{
            assets: Asset[],
            name: string
        }

        //@ts-ignore next-line
        const { out } = options

        const Layers = new Array<Layer>();
        sub_dirs.forEach( ( value ) => {
            const split = value.split(path.sep)
            const layerName = split[split.length - 1]
            var assetList = fs.readdirSync(`${value}`)
            assetList = assetList.filter( ( file_name ) => {
                return !file_name.startsWith('.')
            })

            const assets: Array<Asset> = assetList.map( ( filename ) => {
                signale.success(`[TokenMate Main] Initializing asset ${filename} for layer ${layerName}`)
                return new Asset(
                    path.join(value, filename),
                    0.0,
                    {
                        attribute: {
                            value: filename.split('.')[0],
                            trait_type: layerName
                        }
                    }
                )
            })
            
            Layers.push({
                assets: assets,
                name: layerName
            })
        })

        if ( !out ) {
            fs.writeFileSync(path.join(__dirname, '../generated_assets.json'), JSON.stringify(Layers))
        } else {
            fs.writeFileSync(out, JSON.stringify(Layers))
        }

        signale.warn(`[TokenMate Main] WARNING: this command only enumerates data from your asset folder. You must assign probabilities to each layer option, and verify the metadata. You must also verify the z-index metadata option, so that the layer is placed in the proper z-index.`)
    }
)

program.command('generate')
    .argument(
        `<input>`,
        `Path to JSON file containing the json file created by the setup command in this script.`
    )
    .requiredOption(
        `-n, --number <number>`,
        `Number of nfts to generate.`
    )
    .requiredOption(
        `-o, --output <string>`,
        `Path to directory where we will write NFT images, and meta data.`
    )
    .requiredOption(
        `-c, --creator <string>`,
        `Creator solana key that will receive funds from NFT Minting.`
    )
    .action( 
    async ( input: string, options) => {
        const { number, output, creator } = options;
        const json = JSON.parse(fs.readFileSync(input, 'utf-8'));

        const Layers = new Array<Layer>();

        for ( var i = 0; i < json.length; ++i ) {
            const assets = new Array<Asset>();

            for ( var j = 0; j < json[i].assets.length; ++j ){
                assets.push(new Asset(
                    json[i].assets[j].path, 
                    json[i].assets[j].probability,
                    {
                        attribute: json[i].assets[j].attribute
                    }
                    ))
            }
            
            Layers.push(new Layer(
                assets
            ))
        }
        var nfts_generated = 0;

        const frequencyMap: Map<string, boolean> = new Map<string, boolean>();

        const stats = Array<number>();
        while ( nfts_generated < number ) {

            signale.info(`[PeaceOfShitDriver] Generating NFT ${nfts_generated + 1}`)

            const NFTToGen = new NFTImage(nfts_generated, true);

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

            const GeneratedNFT: jimp = await NFTToGen.rasterize();
            signale.info(`[PeaceOfShitDriver] Rasterized Image.`)
            const output_im_path = `${output}/${NFTToGen.position}.png`;
            console.log(output_im_path)
            const output_json_path = `${output}/${NFTToGen.position}.json`;
            GeneratedNFT.write(output_im_path)
            signale.info(`[PeaceOfShitDriver] Wrote image.`)

            const json: JSONOptions = {
                name: `Naughty Narwhals #${nfts_generated}`,
                symbol: ``,
                description: `555 Naughty Narwhals that are the horniest in the Solana Sea are ready to swim into your wallets and be the next blue chip NFT.`,
                seller_fee_basis_points: 500,
                image: output_im_path,
                external_url: `https://twitter.com/NarwhalsNaughty`,
                attributes: NFTToGen.getAttributes(),
                collection: {
                    name: "The Naughty Narwhals",
                    family: "Naughty Narwhals Studios"
                },
                properties: {
                    files: [{
                        uri: output_im_path,
                        type: 'image/png'
                    }],
                    category: 'image',
                    creators: [
                        {
                            address: creator,
                            share: 100
                        }
                    ]
                }
            }
            stats.push(NFTToGen.rarity);

            fs.writeFileSync(output_json_path, JSON.stringify(json));
            nfts_generated += 1        
        }

        signale.info(`STATISTICS...\n\n\n`)
        signale.info(`Min: ${ss.min(stats)}`)
        signale.info(`Max: ${ss.max(stats)}`)
        signale.info(`Standard Deviation: ${ss.standardDeviation(stats)}`)
        signale.info(`25th Percentile: ${ss.quantile(stats, .75)}`)
        signale.info(`Median Percentile: ${ss.quantile(stats, .5)}`)
        signale.info(`75th Percentile: ${ss.quantile(stats, .25)}`)
        signale.info(`85th Percentile: ${ss.quantile(stats, .15)}`)
        signale.info(`95th Percentile: ${ss.quantile(stats, .05)}`)
        signale.info(`99th Percentile: ${ss.quantile(stats, .01)}`)
    })

program.parse(process.argv);