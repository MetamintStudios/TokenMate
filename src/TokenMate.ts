import { program, Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { getLogger, Asset, NFTImage, JSONOptions, Layer, DefaultQuantiles, Quantile, calculateAttribute } from './modules'
import jimp from 'jimp'
import signale from 'signale'

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
                        signale.info(`[TokenMate Setup] Found a layer: ${layerName}`)
                        return value
                    }
                })
                return sub_directories
            }catch (e){
                throw new Error(`[TokenMate Setup] Error reading directory ${val}: ${e}.`)
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
        const { out, verbose } = options

        const Layers = new Array<Layer>();
        sub_dirs.forEach( ( value ) => {
            const split = value.split(path.sep)
            const layerName = split[split.length - 1]
            var assetList = fs.readdirSync(`${value}`)
            assetList = assetList.filter( ( file_name ) => {
                return !file_name.startsWith('.')
            })

            const assets: Array<Asset> = assetList.map( ( filename ) => {
                signale.success(`[TokenMate Setup] Initializing asset ${filename} for layer ${layerName}`)
                return new Asset(
                    path.join(value, filename),
                    1,
                    {
                        attribute: {
                            value: filename.split('.')[0],
                            trait_type: layerName,
                        },
                        incompatible_with: [],
                        offset_x: 0,
                        offset_y: 0,
                        empty_layer: false,
                        name:  filename.split('.')[0]
                    }
                )
            })
            
            Layers.push({
                assets: assets,
                name: layerName
            })
        })

        const config = {
            config: {
                name: 'NFT Name, the NFTs number will be appended at the end of this name.',
                description: 'Describe your NFT Project!',
                seller_fee_basis_points: 0,
                external_url: 'url of your twitter or website',
                collection: {
                    name: 'NFT Collection Name',
                    family: 'NFT Collection Family Name'
                },
                properties: {
                    creators: [
                        {
                            address: 'your solana address',
                            share: 100
                        }
                    ]
                }
            },
            layers: Layers
        }

        if ( !out ) {
            fs.writeFileSync(path.join(__dirname, '../tmconfig.json'), JSON.stringify(config))
        } else {
            fs.writeFileSync(out, JSON.stringify(config))
        }

        signale.warn(`[TokenMate Setup] WARNING: this command only enumerates data from your asset folder. You must assign probabilities to each layer option, and verify the metadata. You must also verify the z-index metadata option, so that the layer is placed in the proper z-index.`)
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
    .option(
        `--include_rarity`,
        `Includes rarity as an attribute on the NFT. This flag will make the program run longer, as it will build a distribution after generation, and retro-actively apply a configurable rarity descriptor (i.e. Common) as an attribute.`
    )
    .option(
        '--verbose',
        'Includes debug logs in output to stdout.'
    )
    .action( 
    async ( input: string, options) => {
        const { number, output, creator, include_rarity, verbose } = options;
        const progOptions = JSON.parse(fs.readFileSync(input, 'utf-8'));
        const output_path = path.resolve(output);
        const debug = (msg: string) => {
            if ( verbose )
                signale.debug(msg)
        }

        const Layers = new Array<Layer>();

        /* Initialize */

        const config = progOptions.config;
        const layers: Array<Layer> = progOptions.layers;
        var num_layers = layers.length;
        var num_assets = 0;
        layers.forEach( ( layer ) => {
            const assets = new Array<Asset>();

            layer.assets.forEach( ( asset ) => {
                assets.push( new Asset ( 
                    asset.path,
                    asset.probability,
                    {
                        attribute: asset.attribute,
                        incompatible_with: asset.incompatible_with,
                        offset_x: asset.offset_x,
                        offset_y: asset.offset_y,
                        empty_layer: asset.empty_layer,
                        name: asset.name
                    }
                ));
                num_assets++;
            })
            Layers.push(new Layer(assets));
        })
        
        // Check that we can even generate the amount of NFTs requested.
        const max_nfts = Math.pow(num_layers, num_assets / num_layers);
        if ( max_nfts < number ) {
            throw new Error(`[TokenMate Generate] ${number} NFTs were requested, the supplied assets can only support a maximum of ${max_nfts}.`)
        }


        /* Generate */
        interface JsonFile{
            path: string,
            data: JSONOptions,
            rarity: number
        }

        const metadata = Array<JsonFile>();
        const stats = Array<number>();
        const lookup = new Set<string>();

        if ( !fs.existsSync(output) ) {
            fs.mkdirSync(output);
        }

        var nfts_generated = 0;
        while ( nfts_generated < number ) {

            signale.info(`[TokenMate Generate] Generating NFT #${nfts_generated + 1}.`)

            const NFTToGen = new NFTImage(nfts_generated);

            debug(`[TokenMate Generate] NFTImage Initialized.`)

            for ( var idx = 0; idx < Layers.length; ++ idx ){
                
                var chosenAsset = Layers[idx].selectAsset();

                // If the asset is not compatible get until they are.
                while ( !NFTToGen.compatible(chosenAsset ) ) {
                    chosenAsset = Layers[idx].selectAsset();
                    signale.warn(`[TokenMate Generate] Selected asset invalid ${chosenAsset.name}, picking another.`)
                }
                debug(`[TokenMate Generate] Selected Asset ${chosenAsset.name}.`)
                // Apply layer
                // Should validate configuration to make sure that there
                // isn't a layer that is incompatible with another.
                NFTToGen.applyLayer(chosenAsset);

                debug(`[TokenMate Generate] Applied layer to image.`)
            }

            const hash = NFTToGen.hash();

            const exists = lookup.has(hash);
            
            if ( exists ){
                debug(`[TokenMate Generate] Generated a duplicate NFT hash, skipping.`)
                continue;
            }

            //NFT Accepted
            signale.success(`[TokenMate Generate] NFT #${nfts_generated + 1} Generated.`)

            lookup.add(hash);

            const GeneratedNFT: jimp = await NFTToGen.rasterize();
            debug(`[TokenMate Generate] Rasterized Image.`)

            const output_im_path = path.join(output_path, `${NFTToGen.position}.png`);
            const output_json_path = path.join(output_path, `${NFTToGen.position}.json`);
            GeneratedNFT.write(output_im_path)
            debug(`[TokenMate Generate] Wrote image.`)

            const json: JSONOptions = {
                name: `${config.name} #${nfts_generated}`,
                symbol: config.symbol,
                description: config.description,
                seller_fee_basis_points: config.seller_fee_basis_points,
                image: output_im_path,
                external_url: config.external_url,
                attributes: NFTToGen.getAttributes(),
                collection: {
                    name: config.collection.name,
                    family: config.collection.family
                },
                properties: {
                    files: [{
                        uri: output_im_path,
                        type: 'image/png'
                    }],
                    category: 'image',
                    creators: config.properties.creators
                }
            }
            /* Defer metadata write so we can add rarity if its desired. */
            metadata.push({
                path: output_json_path,
                data: json,
                rarity: NFTToGen.rarity
            })

            stats.push(NFTToGen.rarity);
            nfts_generated += 1        
        }

        const writeJson = ()=> {
            metadata.forEach( ( file ) => {
                fs.writeFileSync(file.path, JSON.stringify(file.data));
            })
        }

        if ( include_rarity ) {
            metadata.forEach( ( value ) => {
                value.data.attributes!.push({
                    trait_type: `Rarity`,
                    value: calculateAttribute(stats, value.rarity, DefaultQuantiles)
                })
            })
        }

        writeJson();
        signale.success(`[TokenMate Generate] Generated ${nfts_generated} NFTs for collection ${config.collection.name}.`);
    })

program.name('TokenMate')
program.version('v0.0.1')
program.parse(process.argv);