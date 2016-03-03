var App = function(page) {

  this.page = page;
  this.createMap();
};




/*
* Creates map
*
*
*/
App.prototype.createMap = function() {
  var view = new ol.View({
    center: ol.proj.transform([-105.41, 32.82], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  });

  this.map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'osm'})
      })
    ],
    view: view
  });
  console.log('map created');
  this.getData();
};


/*
* Get data for page
*
*/
App.prototype.getData = function() {
  var self = this;

  $.getJSON('./resources/data/data.json', function(data) {
    console.log('data', data);
    self.data = data;
    self.addLayers();
    self.createLegend();
    self.wireEvents();
  });

};



/*
* Now that we are building legend dynamically needed to pull in some
* of the events from global_functions to handle events
* after legend is rendered
*
*/
App.prototype.wireEvents = function() {
  var self = this;

  //close btn
  $('.legend .layer-info-close').click(function (e) {
      e.preventDefault();
      $('body').close_layer_info();
  });

  // next btn
  $('.legend .layer-info-next').click(function (e) {
      e.preventDefault();
      $(this).parents('.legend').next('.legend').open_layer_info();
  });

  // help icon
  $('.legend .help').click(function (e) {
    e.preventDefault();
    var current_legend = $(this).parents('.legend');
    if (current_legend.hasClass('info-on')) {
      $('body').close_layer_info();
    } else {
      current_legend.open_layer_info();
    }
  });


  // help icon
  $('.legend .visibility').click(function (e) {
    var id = $(this).attr('id').replace('visibility-', '');
    var visible = $(this).is(':checked');
    self.map.getLayers().forEach(function(layer) {
      if (layer.get('layer_id') == id) {
        layer.setVisible(visible);
      }
    });
  });

};




/*
* Build legend based on supplied JSON
*
*/
App.prototype.createLegend = function() {
  var self = this;
  var layerIds = this.data.cases[this.page].layers;

  var checked;
  $.each(layerIds, function(i, id) {
    checked = (i === 0) ? 'checked' : '';
    var tmpl = '<li class="legend" id="legend-'+id+'">'+
      '<div class="text">'+self.data.layers[id].title+' <a href="#info-drought" class="help"><span class="icon icon-help"></span></a> <input class="visibility" id="visibility-'+id+'" type="checkbox" '+checked+'/></div>'+
        '<ul>'+
          '<li><span class="color" style="background-color: #2a0023;"></span><span class="tooltip">&gt; 105</span></li>'+
          '<li><span class="color" style="background-color: #c3003c;"></span><span class="tooltip">90–104</span></li>'+
          '<li><span class="color" style="background-color: #f5442d;"></span><span class="tooltip">70–89</span></li>'+
          '<li><span class="color" style="background-color: #f0f567;"></span><span class="tooltip">50–69</span></li>'+
          '<li><span class="color" style="background-color: #48f7d0;"></span><span class="tooltip">30–49</span></li>'+
          '<li><span class="color" style="background-color: #0078d4;"></span><span class="tooltip">&lt; 30</span></li>'+
        '</ul>'+
        '<div id="info-drought" class="layer-info">'+
        '<h3>'+self.data.layers[id].title+'</h3>'+
        '<p>'+self.data.layers[id].description+'</p>'+
        '<div class="actions">'+
          '<a href="#" class="layer-info-close"><span class="icon icon-close"></span>Close</a>'+
          '<a href="#" class="layer-info-next"><span class="icon icon-arrow-right"></span>Next</a>'+
        '</div>'+
      '</div>'+
    '</li>';

    $('#case-menu').append(tmpl);
  });

};




/*
* Sets zoom on map
* Triggered from custom zoom control in global_functions.js
*
*/
App.prototype.setZoom = function(zoom) {
  this.map.getView().setZoom(zoom);
};




/*
* changes layer order
* Triggered from drag and drop legend handler in global_functions.js
*
*/
App.prototype.reorderLayers = function() {
  var self = this;
  var layer;
  var ids = $('.legend').map(function() { return this.id; }).get().slice(0);
  $.each(ids.reverse(), function(i, id) {
    id = id.replace('legend-', '');
    self.map.getLayers().forEach(function(l) {
      if (l.get('layer_id') == id) {
        layer = l;
        layer.setZIndex(i);
      }
    });
  });
};





/*
* add layers to map!
*
*/
App.prototype.addLayers = function() {
  var self = this;

  console.log('add me', this.page);
  // console.log('map', this.map.getView().getProjection().getExtent());
  // console.log('map', this.map.getView().getProjection());

  var layerIds = this.data.cases[this.page].layers;
  var clone = layerIds.slice(0);

  var layer;
  console.log('layerIds', layerIds);
  $.each(clone.reverse(), function(i, id) {
    layer = null;

    if ( self.data.layers[id].type === 'WMS' ) {
      layer = new ol.layer.Image({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ol.source.ImageWMS({
          url: self.data.layers[id].url,
          params: {
            'LAYERS': self.data.layers[id].options.layer,
            'VERSION': self.data.layers[id].options.version || '1.3.0'
          },
          serverType: self.data.layers[id].options.type
        })
      });
    }

    if ( self.data.layers[id].type === 'tileWMS' ) {
      layer = new ol.layer.Tile({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ol.source.TileWMS({
          url: self.data.layers[id].url,
          params: {
            'LAYERS': self.data.layers[id].options.layer,
            'VERSION': self.data.layers[id].options.version || '1.3.0'
          },
          serverType: self.data.layers[id].options.type
        })
      });
    }

    if ( self.data.layers[id].type === 'ArcGISRest' ) {
      layer = new ol.layer.Tile({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ol.source.TileArcGISRest({
          url: self.data.layers[id].url,
          params: {
            'LAYERS': self.data.layers[id].options.layer || ''
          }
        })
      });
    }

    if ( i === clone.length - 1 ) {
      layer.setVisible(true);
    } else {
      layer.setVisible(false);
    }

    layer.set('layer_id', id);
    self.map.addLayer(layer);

  });

};
