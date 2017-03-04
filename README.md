## Congressional District Map Exporter
This script lets you customize styles for a map in [TileMill](https://tilemill-project.github.io/tilemill/) and then batch export maps of State Congressional Districts.

Here is an example image that I've exported.
![example image](https://cloud.githubusercontent.com/assets/2040141/23582504/3a4c549a-00f1-11e7-8cfd-1c7c5e723761.png)

## Dependencies
* Mac OSx (Not a hard dependency; just that everything in here has not been written to be cross platform, so you'll need to make some changes)
* [TileMill](https://tilemill-project.github.io/tilemill/) (Note there is an issue with TileMill on Mac OS 10.11 - see [this issue](https://github.com/tilemill-project/tilemill/issues/2539#issuecomment-198029808))
* NodeJS

## Installation
To install the nodejs dependencies, use npm.
```
npm install
```

TileMill requires projects to be located in a certain directory (`~/Documents/Mapbox/project`). You will need to copy `tilemill_projects/CongressionalDistricts` into this directory.

Then, open TileMill and verify you can open the project up. Here you can edit any of the map styles that you want, or add extra layers to the map.

## Usage
This script requires a shapefile and dbf file specified as `shpFileName` and `dbfFileName`. We are assuming a US Government TIGER file for the State Legislatures [see this link](https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2016&layergroup=State+Legislative+Districts)

This shapefile will need to be loaded in the TileMill project as a layer with `id` of `districts`.

The script will iteratre through all of the `features` in the shapefile. For each feature (which are each a district in our case), it will export the a png image with that district centered. It uses the specified TileMill project for this exporting.

The specific styling of each district (for instance, the color they are shaded in) are specified in the `index.js` file (using CartoCSS).

To run the script,
```
node index.js
```

