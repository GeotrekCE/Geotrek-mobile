L.TileLayer.MBTilesPlugin = L.TileLayer.extend(
{
	mbTilesPlugin : null,
	mbTilesMetadata : null,
	base64Prefix : null,

	
	initialize: function(mbTilesPlugin, options, callback)
	{
		console.log("initialize");
		this.mbTilesPlugin = mbTilesPlugin;
		L.Util.setOptions(this, options);
		
		var tileLayer = this;
		var minZoom = 0;
		var maxZoom = 0;
		
		console.log("initialize2");
		mbTilesPlugin.getMinZoom(function(result)
		{
			console.log("getMinZoom");
			minZoom = result.min_zoom;
			console.log(result);
			console.log("getMinZoom --" + minZoom + "--");
			mbTilesPlugin.getMaxZoom(function(result)
			{
				console.log("getMaxZoom");
				maxZoom = result.max_zoom;
				console.log("getMaxZoom --" + maxZoom + "--");
				mbTilesPlugin.getMetadata(function(result)
				{
					console.log("getMetadata");
					mbTilesMetadata = result;
					console.log(result);
					L.Util.setOptions(tileLayer,
					{
						minZoom: minZoom,
						maxZoom: maxZoom
					});
					
					if (mbTilesMetadata.format)
					{
						base64Prefix = "data:image/" + mbTilesMetadata.format + ";base64,";
						console.log("base64Prefix --" + base64Prefix + "--");
					}
					else
					{
						// assuming that tiles are in png as default format ...
						base64Prefix = "data:image/png;base64,";
						console.log("base64Prefix --" + base64Prefix + "--");
					}
					callback(tileLayer);
				});
			});
		});
	},
	
	getTileUrl: function (tilePoint, zoom, tile)
	{	
		this._adjustTilePoint(tilePoint);
//		var z = this._getOffsetZoom(zoom);
		var z = this._getZoomForUrl();
		var x = tilePoint.x;
		var y = tilePoint.y;
		console.log("getTileUrl");
		console.log(this.mbTilesPlugin);
		console.log("-----");
		this.mbTilesPlugin.getTile({z: z, x: x, y: y},
			function(result)
			{
				tile.src = base64Prefix + result.tile_data;
				console.log("tile.src : " + JSON.stringify(result));
			},
			function(error)
			{
				console.log("failed to load tile " + JSON.stringify(error));
			});
	},
	
	_loadTile: function (tile, tilePoint, zoom)
	{
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		this.getTileUrl(tilePoint, this.options.zoom, tile);
	},
	
	
//	_adjustTilePoint: function (tilePoint) {
//		
//		console.log("Adjusting");
//		
//		var limit = this._getWrapTileNum();
//
//		// wrap tile coordinates
//		if (!this.options.continuousWorld && !this.options.noWrap) {
//			tilePoint.x = ((tilePoint.x % limit) + limit) % limit;
//		}
//		
//		console.log("tms : "  + this.options.tms);
//		if (this.options.tms) {
//			tilePoint.y = limit - tilePoint.y - 1;
//		}
//	},
//
//	
//	_getZoomForUrl: function () {
//
//		 var options = this.options,
//		 zoom = options.zoom;
//
//		 if (options.zoomReverse) {
//		 zoom = options.maxZoom - zoom;
//		 }
//
//		 return zoom + options.zoomOffset;
//		 },

});

