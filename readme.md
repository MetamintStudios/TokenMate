# Welcome to TokenMate
TokenMate is an open source repository that serves as a general platform for unique & probabilistic NFT image generation. This project also produces metadata that relates directly with these images. TokenMate aims to be an artist to mint end to end service that allows for ultimate configurability, and incredibly fast run time. TokenMate v0.0.1 already supports a large amount of configurability, and will only continue to have it added. TokenMate currently only exports metadata to the metaplex metadata standard for solana, and we will be accepting PR's for any other metadata standard as a part of our configurability.

# Requirements
* NodeJs
* npm
* Installed dependencies from package.json upon pulling.

# Prefix
In TokenMate, there are two main data types when referring to image generation, namely: Layers & Assets. A layer is a container of Assets. Layers are a very light container, and only do minimal work with probabilities, as well as event simluation to select Assets. Assets on the other hand are rather complex data types that contain many different options that can be modified, all of which are surfaced to you in the tmconfig.json.

# Commands

## Setup
In order to make TokenMate as easy to use as possible, the configuration step of TokenMate is as automated as possible. Despite this, it still requires some knowledge to use properly. When given an asset directory, TokenMate will walk the directory and generate a configuration file in the root directory (or anywhere else you specify). Setup expects the following directory structure:

* Root
    * Layer Type ( i.e. Background )
        * Asset ( Blue.png )

When named according to their desired attribute name/value, TokenMate will automatically populate these fields in the config file. If you have the following directory:

* Assets
    * Background
        * Blue
        * Red

TokenMate will populate a Background layer, as well as Blue & Red options ( later referred to as Assets ) for this layer. 

## IMPORTANT!!! 
This config file may not be complete, and may require you to make some changes to get expected behavior.

### Config Options:
* **name**: Required, this will be the name for each individual NFT, if your project is Easy Equines, then your name would be Easy Equine. In the metadata processing phase, the number will be appended to the end, so you will get *Easy Equine #0* and so on.
* **description**: Required, description of your NFT project.
* **seller_fee_basis_points**: Required, basis points for your creator royalty. 500 is 5%.
* **external_url**: Required, url that your NFT will point to if owners want support or a point of contact.
* **collection.name**: Required, name of your NFT Collection.
* **collection.family**: Required, family of your NFT Collection.
* **properties.creators**: Required, array of address and share pairs for creators of this NFT. Each address will get ```( share / 100 * mint_proceeds )``` and ```( share / 100 * ( seller_fee_basis_points / 10000 ) * transaction_proceeds)```

### Asset Options:
* **path**: Required, path to .png (must be a .png file) file that relates to this image.
* **probability**: Default 1. Probability is likely to be the most important option for every asset that you have. This option can take any value, but, if the cumulative probability of assets in a layer is not 1, the probabilities will be normalized. With the default value of 1, all layers will be equally likely. Tip: A good guide to go by is giving the *coolest* assets a low probability (.05 and below). You can also easily do test generations, and see if the distribution you get is desireable.
* **attribute**: Optional, with setup, this option is populated based on the Layer folder name, and Asset file name. You can change these manually in the tmconfig.json file if you do not want them to be the folder/file name pair. It is recommended that you use the automatic naming, and name the folders and files accordingly.
* **offset_x**: Optional, pixels to offset this layer in the X-axis. This option is only supported for necessity. Optimally, your artist will supply files that have fixed size, so that the placement is inherent based off of the image data. If you do not have static image sizes, you can find offsets by using photoshop, or another photo editing software.
* **offset_y**: Optional, pixels to offset this layer in the Y-axis. This option is only supported for necessity. Optimally, your artist will supply files that have fixed size, so that the placement is inherent based off of the image data. If you do not have static image sizes, you can find offsets by using photoshop, or another photo editing software.
* **empty_layer**: Optional, this option, when set to true, ignores the path argument, and simply does not do anything when this layer is selected by the Layer.selectAsset function. *IMPORTANT*: Based on the way TokenMate works right now, you will have to manually place this asset within your configuration file, and set the argument to true. The easier option to have empty layers is simply adding a blank file with the name *No Background.png* for example.
* **incompatible_with**: Optional, this option exists to allow you to describe Assets across other layers, that cannot be selected with this asset. I.E. Blue background shouldn't have a blue skin type, your blue background asset entry would have the following ```incompatible_with = ['path/to/blue/skin']```
* **name**: Optional, default is the file name without extension. Modify the value after running setup if you want to change the names in the metadata output.

### Layer Options
Included in the configuration is a single, ***incredibly*** important option, z-index.

* **z_index**: Required, default is the order in which your file system enumerates the options through the node fs library. Start at 0 with the background, and then continue to add layers on top by incrementing that layers z_index by 1. If your NFTs do not come out right, this is most likely the option that is causing it.

### Setup Example:

``` npx ts-node src/TokenMate.ts setup ```
* ```directory```: Directory where the asset files are currently situated. There should be sub directories, where unique classes of assets are stored.
* ```-o, --out <string>```: Path to json file that you want to write this TokenMate configuration to.

## Generate 

***IMPORTANT***: Please make sure you read the #setup

Generate is the part of the process where TokenMate does the heavy lifting, and begins generating NFTs & metadata. At this point, the work for you should be done, and you should only have to call generate with a few parameters.

### Generate Example:
```npx ts-node src/TokenMate.ts generate```
* ```input```: Path to JSON file containing the json file created by the setup command in this script.
* ```-n, --number <number>```: Number of nfts to generate.
* ```-o, --output <string>```: Path to directory where we will write NFT images, and meta data.
* ```--include_rarity```:  Includes rarity as an attribute on the NFT. This flag will make the program run longer, as it will build a distribution after generation, and retro-actively apply a configurable rarity descriptor (i.e. Common) as an attribute. The distribution is as follows:

* 50th Percentile and below: Common
    * ~50 occurences per 100
* 50th to 75th Percentile: Rare
    * ~25 occurences per 100
* 75th to 85th Percentile: Very Rare
    * ~10 occurences per 100
* 85th to 92.5th Percentile: Super Rare
    * ~7.5 occurences per 100
* 92.5th to 97.5th Percentile: Ultra
    * ~5 occurences per 100
* 97.5th Percentile and above: Legendary 
    * ~2.5 occurences per 100

### Important Considerations (Please read)
* The upper bound for producable NFT's is: `layers^avg_options_per_layer`.
* Because TokenMate is both probabilistic & enumerative, as your requested NFTs nears the upper bound for producable NFTs, the probability will become pointless. At this number, TokenMate will become purely enumerative, and generate all possible unique combinations. TokenMate will still generate rarities by cumulative probabilty of distinct events, but these probabilities will be theoretical. This will also cause the generation to become very slow, so if you plan to get close to this limit, just make probabilities equivalent.


# Example
If you have read the above documentation, follow along with this example for proper usage.

* `npx ts-node src/TokenMate.ts setup /path/to/Assets`
* `npx ts-node src/TokenMate.ts generate ./tmconfig.json -n NUMBER_TO_GENERATE -o ./out/ --include_rarity`

Enjoy your unique NFTs!