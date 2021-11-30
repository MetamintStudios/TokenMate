import jimp from 'jimp'
import { Layer } from './Layer'
import { Asset, Attribute } from './Asset'
import signale from 'signale';
import fs from 'fs';

export interface MediaContent{
    uri: string,
    type: string,
    cdn?: boolean
}

export interface Creator {
    address: string,
    share: number
}

export interface JSONOptions{
    name: string,
    symbol: string,
    description: string,
    seller_fee_basis_points: number,
    image: string,
    external_url: string,
    attributes?: Attribute[],
    collection: {
        name: string,
        family: string
    },
    properties: {
        files: MediaContent[],
        category: string,
        creators: Creator[]
    }
}

export class NFTImage{
    // NFT Image base layer.
    image: jimp;
    // Layers 
    layers: Array<Asset>;
    // Position in the overall NFT generation
    position: number;
    // Unique hash for this NFT
    hash_code: string;
    // Cumulative probability of this NFT's layers. 
    rarity: number;


    constructor( position: number ){
        this.position = position;
        this.layers = Array<Asset>();
        this.rarity = 1;
    }

    compatible ( toApply: Asset ) : boolean {
        for ( var i = 0; i < this.layers.length; ++i ) {
            const check = this.layers[i];
            if ( !check.compatible(toApply) ){
                signale.warn(`[TokenMate NFTImage.compatible] ${check.name} is not compatible with ${toApply.name}`)
                return false;
            }
        }
        return true;
    }

    // Returns a hash of this NFTImage to see if its been generated before.
    hash ( ) : string {
        // Only need to calculate once.
        if ( this.hash_code )
            return this.hash_code;

        this.hash_code = '';
        for ( var i = 0; i < this.layers.length; ++i )
            this.hash_code += this.layers[i].name!;

        return this.hash_code;
    }

    applyLayer( asset: Asset /*z_index?: number*/ ) {
        // Will apply layers in the order this is called.
        // Will add support for z_indexing later.
        this.layers.push(asset);
    }

    getAttributes( ) : Attribute[] {
        // Write json meta data into json file.
        const attributes = Array<Attribute>();

        this.layers.forEach( ( asset ) => {
            this.rarity *= asset.probability;
        })

        this.layers.forEach( ( asset: Asset ) => {
            if ( asset.has_attribute ){
                attributes.push(asset.attribute!)
            }
        })

        return attributes;
    }
    
    async rasterize() : Promise<jimp> {
        this.image = await this.layers[0].read();

        for ( var idx = 1; idx < this.layers.length; ++idx ) {
            const asset = this.layers[idx];

            if ( asset.empty_layer ){
                signale.debug(`[TokenMate NFTImage.rasterize] Selected empty layer, nothing to apply.`)
                continue;
            }
            
            const assetImage = await asset.read();
            await this.image.blit(assetImage, asset?.offset_x ? asset!.offset_x : 0, asset?.offset_y ? asset!.offset_y : 0);
        }
        
        return this.image;
    }

}