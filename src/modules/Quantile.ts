import * as ss from 'simple-statistics';

export interface Quantile {
    value: number,
    attribute_value: string
}

export const DefaultQuantiles: Array<Quantile> = [
    {
        value: .5,
        attribute_value: "Common"
    },
    {
        value: .25,
        attribute_value: "Rare"
    },
    {
        value: .15,
        attribute_value: "Very Rare"
    },
    {
        value: .0725,
        attribute_value: "Super Rare"
    },
    {
        value: .0275,
        attribute_value: "Ultra"
    },
    {
        value: 0,
        attribute_value: "Legendary"
    }
]

export function calculateAttribute( distribution: Array<number>, rarity: number, quantiles: Array<Quantile> ) : string{
    quantiles.sort( ( a: Quantile, b: Quantile ) => {
        return a.value < b.value ? 1 : -1;
    })

    // Must verify that the quantiles are sorted, even though this is over head, its more realistic than asking the user to 
    // enforce order. Once the flow is built out for integrating this into the driver code, just sort it there.

    for ( var idx = 0; idx < quantiles.length - 1; ++idx ){
        const p = ss.quantile(distribution, quantiles[idx].value)
        if ( rarity > p ){
            // If its not higher than any of the intermediate rarities,
            // then it is going to be the rarest type.
            return quantiles[idx].attribute_value;
        }
    }
    return quantiles[quantiles.length - 1].attribute_value;
}