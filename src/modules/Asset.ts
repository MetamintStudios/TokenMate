import jimp from 'jimp'
import signale from 'signale';

export interface Attribute{
    trait_type: string,
    value: string
}

interface AssetOptions{
    // What is the NFT attribute value if this asset is an attribute
    attribute?: Attribute;
    // Offset to be added to the asset during placement in the X plane
    offset_x?: number;
    // Offset to be added to the asset during placement in the Y plane
    offset_y?: number
    // Flag that when set to true, treats this image as a transparent layer, and doesn't apply it.
    empty_layer?: boolean;
    // List of paths or layer names that are incompatible with this layer.
    incompatible_with?: Array<string>;
    // Name of the asset, if not set, the path will be parsed.
    name?: string;

}

export class Asset{

    // Path to the image corresponding to this asset.
    path: string;
    // Probability associated with this asset w.r.t. to the layer.
    probability: number;
    // Image after it has been read.
    image: jimp;
    // Does this asset bring an attribute?
    has_attribute: boolean;
    // Name of the asset, if not set, the path will be parsed.
    name: string;
    // What is the NFT attribute value if this asset is an attribute
    attribute?: Attribute;
    // Offset to be added to the asset during placement in the X plane
    offset_x?: number;
    // Offset to be added to the asset during placement in the Y plane
    offset_y?: number
    // Flag that when set to true, treats this image as a transparent layer, and doesn't apply it.
    empty_layer?: boolean;
    // List of paths or layer names that are incompatible with this layer.
    incompatible_with?: Array<string>;

    constructor ( path: string, probability: number, options?: AssetOptions ){
        this.path = path;
        this.probability = probability;

        this.offset_x = options?.offset_x;
        this.offset_y = options?.offset_y;

        this.empty_layer = options?.empty_layer;
        this.incompatible_with = options?.incompatible_with;
        
        this.attribute = options?.attribute;
        this.has_attribute = this.attribute ? true : false;

        if ( options && 'name' in options ) {
            this.name = options.name!;
        } else {
            this.name = this.path.split('\\').pop()!.split('/').pop()!.split('.')[0];
        }
    }

    compatible ( other: Asset ) : boolean {
        if ( this.incompatible_with ){
            signale.info(`[TokenMate Asset.compatible] ${this.name} has an incompatibility list, checking if it includes ${other.name}.`);
            return !this.incompatible_with.includes(other.name);
        } else {
            signale.info(`[TokenMate Asset.compatible] ${this.name} does not have an incompatibility list, returning true for all options.`);
            return true;

        }
    }

    async read ( ) : Promise<jimp> {
        this.image = await jimp.read(this.path);
        if ( this.image.getExtension() != 'png')
            throw new Error(`[TokenMate Asset.read] TokenMate does not support image types that are not png. Layered image building requires transparent backgrounds.`)
        return this.image;
    }
}