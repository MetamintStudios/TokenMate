import jimp from 'jimp'
import { Layer } from './Layer'
import { Asset } from './Asset'
import signale from 'signale';

export class NFTImage{
    // NFT Image base layer.
    image: jimp;
    // Layers 
    layers: Array<Asset>;
    // Position in the overall NFT generation
    position: number;


    constructor( position: number ){
        this.position = position;
        this.layers = Array<Asset>();
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
        var hash: string = '';
        for ( var i = 0; i < this.layers.length; ++i )
            hash += this.layers[i].name!;
        return hash
    }

    applyLayer( asset: Asset /*z_index?: number*/ ) {
        // Will apply layers in the order this is called.
        // Will add support for z_indexing later.
        this.layers.push(asset);
    }
    
    json( ) : Object {
        
        return {};
    }
    
    async rasterize() : Promise<jimp> {
        this.image = await this.layers[0].read();

        for ( var idx = 1; idx < this.layers.length; ++idx ) {
            const asset = this.layers[idx];

            if ( asset.empty_layer ){
                signale.info(`[TokenMate NFTImage.rasterize] Selected empty layer, nothing to apply.`)
                continue;
            }
            
            const assetImage = await asset.read();
            await this.image.blit(assetImage, asset?.offset_x ? asset!.offset_x : 0, asset?.offset_y ? asset!.offset_y : 0);
        }
        
        return this.image;
    }

}