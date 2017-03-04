var fs = require("fs");
var execSync = require('child_process').execSync;
var bbox = require('geojson-bbox');
var shapefile = require("shapefile");

var tileMillProjectName = "CongressionalDistricts";
var pathToMapStyleSheet = "~/Documents/MapBox/project/"+tileMillProjectName+"/highlighted_district.mss";
var pathToTileMill = "/Applications/TileMill.app/Contents/Resources";
//Should be absolute
var pathToExportedImages = "~/images/tx_house2";
var shpFileName = "data/tl_2016_48_sldl.shp";
var dbfFileName = "data/tl_2016_48_sldl.shp";

var template = '#districts { \n\
line-color:rgba(100,200,100,0.8);\n\
  line-width:0.25; \n\
  [NAMELSAD= "State House District {{DISTRICT_NUMBER}}"]{ \n\
    polygon-fill:#45CB41; \n\
    polygon-opacity:0.5; \n\
    line-color:#000; \n\
    line-width:1.0; \n\
    text-name:"House{{DISTRICT_NUMBER}}"; \n\
    text-face-name:@sans; \n\
    text-transform:uppercase; \n\
    text-character-spacing:1; \n\
    text-size:20; \n\
    text-allow-overlap:true; \n\
    text-halo-fill:rgba(255,255,255,0.75); \n\
    text-halo-radius:2; \n\
  } \n\
}';
var commandTemplate = "./index.js export {{PROJECT_NAME}} --bbox={{LAT_1}},{{LON_1}},{{LAT_2}},{{LON_2}} --format=png {{OUTPUT_PATH}}/district_{{DISTRICT_NUMBER}}.png";

shapefile.read(shpFileName, dbfFileName).then(function(data){
    //This converts our shpfile into GeoJSON.
    //Grab the features.
    var features = data['features']
    //We are assuming each feature is a congressional district and that they are in order.
    for(var idx in features)
    {
        //Get the district number
        var district = parseInt(idx)+1;
        console.log("District "+district)

        //Populate our District Number in our Map Stylesheet
        var newCSS = template.replace("{{DISTRICT_NUMBER}}", district).replace("{{DISTRICT_NUMBER}}",(district));
        //Put that in the appropriate place.
        fs.writeFileSync(pathToMapStyleSheet, newCSS, 'utf8');
        
        //Calculate the bounding box of the feature.
        var box = bbox(features[idx]);
        //We want to center our district with some margin around it.
        var latMargin = (box[2] - box[0])/1.2;
        var lonMargin = (box[3] - box[1])/1.2;

        var marginedBox = [box[0] - latMargin, box[1] - lonMargin, box[2] + latMargin, box[3] + lonMargin];

        var command = commandTemplate.replace("{{LAT_1}}", marginedBox[0])
            .replace("{{LON_1}}", marginedBox[1])
            .replace("{{LAT_2}}", marginedBox[2])
            .replace("{{LON_2}}", marginedBox[3])
            .replace("{{DISTRICT_NUMBER}}",(district))
            .replace("{{OUTPUT_PATH}}",pathToExportedImages)
            .replace("{{PROJECT_NAME}}", tileMillProjectName);

        execSync(command, {"cwd":pathToTileMill})
    }
});

