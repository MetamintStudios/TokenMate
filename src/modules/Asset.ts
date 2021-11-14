import jimp from 'jimp'

export class Asset{

    // Path to the image corresponding to this asset.
    path: string;
    // Probability associated with this asset w.r.t. to the layer.
    probability: number;
    // Image after it has been read.
    image: jimp;
    // Offset to be added to the asset during placement in the X plane
    offset_x?: number;
    // Offset to be added to the asset during placement in the Y plane
    offset_y?: number

    constructor ( path: string, probability: number, offset_x?: number, offset_y?: number ){
        this.path = path;
        this.probability = probability;
        this.offset_x = offset_x;
        this.offset_y = offset_y;
    }

    async read ( ) : Promise<jimp> {
        this.image = await jimp.read(this.path);
        if ( this.image.getExtension() != 'png')
            throw new Error(`[TokenMate Asset.read] TokenMate does not support image types that are not png. Layered image building requires transparent backgrounds.`)
        return this.image;
    }
}