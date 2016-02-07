var map;
var finalTags;
//Begin ESRI code

      require([
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/dijit/PopupTemplate",
        "esri/request",
        "esri/geometry/Point",
        "esri/graphic",
        "dojo/on",
        "dojo/_base/array",
        "dojo/domReady!",
      ], function(
        Map,
        FeatureLayer,
        PopupTemplate,
        esriRequest,
        Point,
        Graphic,
        on,
        array
      ) {

var AllTheData = {
  'dataPoints' : new Array(250),
  'geometry' : [],
  'title' : [],
  'description': [],
  'graphics':[],
  'url':[],
  'otherUrl': []
};

function getCredentials(cb) {
  var data = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  };

  return $.ajax({
    'url': 'https://api.clarifai.com/v1/token',
    'data': data,
    'type': 'POST'
  })
  .then(function(r) {
    localStorage.setItem('accessToken', r.access_token);
    localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
    cb();
  });
}



function parseResponse(resp, imgurl) {
  if (resp.status_code === 'OK') {
    var results = resp.results;

    tags = results[0].result.tag.classes;

  } else {
    console.log('Sorry, something is wrong.');
  }

  $('#tags').text(tags.toString().replace(/,/g, ', '));
  for(i=0;i<250;i++){
    if (imgurl == AllTheData.url[i]){
      AllTheData.dataPoints[i] = tags;
      break;
    }
  }

  return tags;
}

function run(imgurl) {
  var data = {
    'url': imgurl
  };
  if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
    || localStorage.getItem('accessToken') === null) {
    getCredentials(function() {
      var accessToken = localStorage.getItem('accessToken');

      return $.ajax({
        'url': 'https://api.clarifai.com/v1/tag',
        'headers': {
          'Authorization': 'Bearer ' + accessToken
        },
        'data': data,
        'type': 'POST'
      }).then(function(r,imgurl){
        parseResponse(r, imgurl);
      }).then(function(r){

        runMeLast(r);}
      );
    });
  } else {
    var accessToken = localStorage.getItem('accessToken');

    return $.ajax({
      'url': 'https://api.clarifai.com/v1/tag',
      'headers': {
        'Authorization': 'Bearer ' + accessToken
      },
      'data': data,
      'type': 'POST'
    }).then(function(r) {
      console.log(data.url);
      parseResponse(r, data.url);
    }).then(function(r){

      runMeLast(r);}
    );
  }
}




//  End of Clarifai Code










        var featureLayer;

        map = new Map("mapDiv", {
          basemap: "dark-gray",
          center: [-117.820, 34.05574 ],
          zoom: 5
        });


        //hide the popup if its outside the map's extent
        map.on("mouse-drag", function(evt) {
          if (map.infoWindow.isShowing) {
            var loc = map.infoWindow.getSelectedFeature().geometry;
            if (!map.extent.contains(loc)) {
              map.infoWindow.hide();
            }
          }
        });

        function runMeLast(r){
          var features = [];
          console.log(JSON.stringify(AllTheData.dataPoints));
          console.log(JSON.stringify(AllTheData.url));
          console.log(JSON.stringify(AllTheData.geometry));
          for(i=0; i<AllTheData.dataPoints.length;i++){
            var attr = {
              'title' : AllTheData.title[i]   ,
              'description' : AllTheData.otherUrl[i]+"<img src=\""+AllTheData.url[i]+"\" \"width = \"240\" height=\"160\" /><\/a><\/p><p><b>Keywords :<\/b>"+AllTheData.dataPoints[i]+"<\/p>"
            };
            var graphic = new Graphic(AllTheData.geometry[i]);
            graphic.setAttributes(attr);
            features.push(graphic);
        }
          featureLayer.applyEdits(features, null, null);
      }

        //create a feature collection for the flickr photos
        var featureCollection = {
          "layerDefinition": null,
          "featureSet": {
            "features": [],
            "geometryType": "esriGeometryPoint"
          }
        };
        featureCollection.layerDefinition = {
          "geometryType": "esriGeometryPoint",
          "objectIdField": "ObjectID",
          "drawingInfo": {
            "renderer": {
              "type": "simple",
              "symbol": {
                "type": "esriPMS",
                "url": "../img/social_flickr_box.png",
                "contentType": "image/png",
                "width": 15,
                "height": 15
              }
            }
          },
          "fields": [{
            "name": "ObjectID",
            "alias": "ObjectID",
            "type": "esriFieldTypeOID"
          }, {
            "name": "description",
            "alias": "Description",
            "type": "esriFieldTypeString"
          }, {
            "name": "title",
            "alias": "Title",
            "type": "esriFieldTypeString"
          }]
        };

        //define a popup template
        var popupTemplate = new PopupTemplate({
          title: "{title}",
          description: "{description}",
          keywords: "{keywords}"
        });

        //create a feature layer based on the feature collection
        featureLayer = new FeatureLayer(featureCollection, {
          id: 'flickrLayer',
          infoTemplate: popupTemplate
        });


        //associate the features with the popup on click
        featureLayer.on("click", function(evt) {
          map.infoWindow.setFeatures([evt.graphic]);
        });

        map.on("layers-add-result", function(results) {
          requestPhotos();
        });
        //add the feature layer that contains the flickr photos to the map
        map.addLayers([featureLayer]);

      function requestPhotos() {
        //get geotagged photos from flickr
        //tags=flower&tagmode=all
        var requestHandle = esriRequest({
          url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1c3ec063d7ec928228bb799d059ba282&min_upload_date=1449459707&max_upload_date=1423280507&has_geo=1&per_page=250&page=1&format=json&nojsoncallback=0",
          callbackParamName: "jsoncallback"
        });
        requestHandle.then(requestSucceeded, requestFailed);
      }



      function requestSucceeded(response, io) {
        //loop through the items and add to the feature layer

        var pages = 1 ;
          array.forEach(response.photos.photo, function(item) {

            var id = item.id ;
            var farm = item.farm ;
            var secret = item.secret;
            var size = "_h";
            var serverID = item.server ;
            var url = "http://farm"+farm+".staticflickr.com/"+serverID+"/"+id+"_"+secret+size+".jpg" ;
            var otherUrl = "<p><a href=\"http://www.flickr.com/photos/"+item.owner+"/"+id+"/\">";


            var requestHandle2 = esriRequest({
              url : "https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=1c3ec063d7ec928228bb799d059ba282&photo_id="+id+"&format=json&nojsoncallback=0",
              callbackParamName : "jsoncallback"
            });

            requestHandle2.then( function(response, io){

              AllTheData.url.push(url);
              AllTheData.otherUrl.push(otherUrl);
              var geometry = new Point(response.photo.location.longitude, response.photo.location.latitude);
              AllTheData.geometry.push(geometry);
              console.log(JSON.stringify(geometry));
              AllTheData.title.push(item.title ? item.title : "Flickr Photo");
              //var graphic = new Graphic(geometry);
              //AllTheData.graphics.push(graphic);

            }, requestFailed).then(function (r){
              run(url);
            });


        });
      }

      function secondRequestSucceed(response, io){

      }


      function requestFailed(error) {
        console.log('failed');
      }
    });
