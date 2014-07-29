L.TileLayer.MBTilesPlugin = L.TileLayer.extend(
{
    mbTilesPlugin : null,
    base64Prefix : null,
    filename: null,

    initialize: function(mbTilesPlugin, filename, rootUrl, options, callback)
    {
        this.mbTilesPlugin = mbTilesPlugin;
        this.filename = filename;
        L.Util.setOptions(this, options);
        
        var tileLayer = this;
        
        mbTilesPlugin.init(
            {type: 'db', typepath: 'cdvfile', url: rootUrl},
            function(result) {

                mbTilesPlugin.open({name: filename}, function(result) {

                    mbTilesPlugin.getMetadata(function(metadata)
                    {
                        L.Util.setOptions(tileLayer,
                        {
                            minZoom: metadata.min_zoom,
                            maxZoom: metadata.max_zoom
                        });
                        
                        if (!!metadata.format)
                        {
                            base64Prefix = "data:image/" + metadata.format + ";base64,";
                        }
                        else
                        {
                            // assuming that tiles are in png as default format ...
                            base64Prefix = "data:image/png;base64,";
                        }
                        callback(tileLayer);
                    },
                    function(error) {
                        console.log('failed to load metadata');
                    });
                },
                function(error) {
                    console.log("failed to open db " + filename);
                });
            },
            function(error) {
                console.log("failed to init db " + filename)
            }
        );
    },
    
    getTileUrl: function (tilePoint, zoom, tile, filename)
    {   
        this._adjustTilePoint(tilePoint);
//      var z = this._getOffsetZoom(zoom);
        var z = this._getZoomForUrl();
        var x = tilePoint.x;
        var y = tilePoint.y;
        var mbTilesPlugin = this.mbTilesPlugin;

        mbTilesPlugin.open({name: filename}, function(result) {

            mbTilesPlugin.getTile(
                {z: z, x: x, y: y},
                function(result)
                {
                    tile.src = base64Prefix + result.tile_data;
                },
                function(error)
                {
                    console.log("failed to load tile " + JSON.stringify(error));
                }
            );
        }, function(error) {
            console.log("failed to open db " + filename);
        });

    },
    
    _loadTile: function (tile, tilePoint, zoom)
    {
        tile._layer = this;
        tile.onload = this._tileOnLoad;
        tile.onerror = this._tileOnError;
        this.getTileUrl(tilePoint, this.options.zoom, tile, this.filename);
    },
    
    
//  _adjustTilePoint: function (tilePoint) {
//      
//      console.log("Adjusting");
//      
//      var limit = this._getWrapTileNum();
//
//      // wrap tile coordinates
//      if (!this.options.continuousWorld && !this.options.noWrap) {
//          tilePoint.x = ((tilePoint.x % limit) + limit) % limit;
//      }
//      
//      console.log("tms : "  + this.options.tms);
//      if (this.options.tms) {
//          tilePoint.y = limit - tilePoint.y - 1;
//      }
//  },
//
//  
//  _getZoomForUrl: function () {
//
//       var options = this.options,
//       zoom = options.zoom;
//
//       if (options.zoomReverse) {
//       zoom = options.maxZoom - zoom;
//       }
//
//       return zoom + options.zoomOffset;
//       },

});

