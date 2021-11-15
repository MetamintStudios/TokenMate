import { Asset } from './Asset'
import signale from 'signale'

export class Layer{

    assets: Array<Asset>;
    overallProbability : number = 0;

    constructor( assets: Array<Asset> ){
        this.assets = assets

        // Accepted probability formats:
        //
        // Decimal:
        // .25, .25, .25, .25
        // Probability calculated as the passed probability, will be normalized to the format below.
        // If the probabilities do not add up to 1, the probabilities will be normalized.
        // 
        // Relative Event Occurences:
        // Ap = [1, 2, 3, 5, 1]
        // Probabilities will be calculated as: 
        // for all x in Ap: 
        //  Px = x / sum(Ap)

        for ( var i = 0; i < this.assets.length; ++i ) {
            this.overallProbability += this.assets[i].probability;
        }

        if ( this.overallProbability < 1 ){
            const factor = this.normalizeProbability();
            if ( factor )
                this.overallProbability *= factor;
        }
    }

    getMinAssetProbability ( ) : Asset | void {

        if ( !this.assets || this.assets.length === 0 ){
            signale.error(`[TokenMate: Layer.getMinAssetProbability] invalid assets, cannot calculate minimum probability.`);
            return;
        }

        var min: Asset = this.assets[0];

        this.assets.forEach( ( value ) => {
            if ( value.probability < min.probability )
                min = value;
        })

        return min;
    }

    normalizeProbability ( ) : number | void{
        const minimumProbability = this.getMinAssetProbability();

        if ( !minimumProbability ) {
            signale.error(`[TokenMate: Layer.normalizeProbability] Received invalid result for minimum probability, unable to initialize layer.`)
            return;
        }

        const normalizationFactor = 1 / minimumProbability.probability;

        for ( var i = 0; i < this.assets.length; ++i ){
            this.assets[i].probability *= normalizationFactor;
        }

        return normalizationFactor
    }

    selectAsset ( ) : Asset {
        const rand = Math.random();
        var chance = 0

        for ( const idx in this.assets) {
            chance += ( this.assets[idx].probability / this.overallProbability );

            if ( rand < chance ) {
                return this.assets[idx];
            }
        }
        
        // Unable to simulate an event.
        throw new Error(`[TokenMate Layer.selectAsset] Unable to select an asset in this layer. Please check probabilities.`)
    }
}