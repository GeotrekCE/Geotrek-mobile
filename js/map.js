var onDeviceReady = function() {
	
	var localFileName = 'tiles-ign.mbtiles';
    var remoteFile = 'lien_to_remote_file';
	
    
	resizeMap();

	$(window).resize(function() {
		console.log("resize");

		resizeMap();
	});
	// verifyingMap(localFileName, remoteFile);
	buildMap();

};

function initMapPage() {
	console.log("initMapPage");
	document.addEventListener("deviceready", onDeviceReady, true);
}

function resizeMap() {
	console.log("resizeMap");

	var mapHeight = $(window).height();
	var mapWidth = $(window).width();
	$("#map").height(mapHeight);
	$("#map").width(mapWidth);
}

function buildMap() {
	console.log("buildMap");


	var name = "tiles-ign.mbtiles";
	var type = "db";
	console.log("before MBTilesPlugin ");
	var mbTilesPlugin = new MBTilesPlugin();
	console.log("after MBTilesPlugin ");
	mbTilesPlugin.getDirectoryWorking({type: type} , function(r) {
		console.log("getDirectoryWorking : " + r.directory_working);
	});

	var query ="SELECT * FROM metadata WHERE rowid = ?1";
	var params = new Array();
	params[0] = "1";
	mbTilesPlugin.open({name: name, type: type},
			function(r) {
				console.log("open : " + r);

				mbTilesPlugin.executeStatment({query: query, params: params},
							function(result)
							{
								console.log("exectuteStatment : " + JSON.stringify(result));
							},
							function(error)
							{
								console.log("exectuteStatment Error " + JSON.stringify(error));
							});

				mbTilesPlugin.getMinZoom(function(result) {
					console.log("getMinZoom --" + result + "--");
					var map = new L.Map("map", {
						center : [43.2803905,5.405139],//tozeur
						
						zoom : 13,
						attributionControl: false
						
					});
					console.log("MBTilesPlugin");
					var layer = new L.TileLayer.MBTilesPlugin(mbTilesPlugin,{
						tms:true,
						zoom: result.min_zoom,
						maxZoom : result.max_zoom,
						zoomOffset:0
					}, function(temp) {
						console.log("TileLayer initalized");
						console.log(temp);
						map.addLayer(temp);
						console.log("TileLayer initalized2");
					});
					console.log("MAP CENTER POINT " + JSON.stringify(map.latLngToLayerPoint(new L.LatLng(38.89611,-77.035446))));
				}, function(e) {
					console.log("err : " + JSON.stringify(e));
				});
			}, function(e) {
				console.log("open failed : " + JSON.stringify(e));


			});
	
	
}

function verifyingMap(localFileName, remoteFile){
	
	var fs;				// file system object
	var ft;				// TileTransfer object
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		console.log('file system retrieved.');
		fs = fileSystem;

		// check to see if files already exists
		var file = fs.root.getFile(localFileName, {create: false}, function () {
			// file exists
			console.log('exists');


			buildMap();
		}, function () {
			// file does not exist
			console.log('does not exist');


			console.log('downloading sqlite file...');
			ft = new FileTransfer();
			ft.download(remoteFile, localFileName, function (entry) {
				console.log('download complete: ' + entry.fullPath);
				buildMap();

			}, function (error) {
				console.log('error with download', error);
				navigator.notification.confirm(
				        'You are the winner!',  // message
				        onConfirm(button),              // callback to invoke with index of button pressed
				        'Game Over',            // title
				        'Retry,Cancel'          // buttonLabels
				    );
			});
		});
	});
	
	function onConfirm(button){
		
		console.log('You selected button ' + buttonIndex);

	}
	

	function logButton(){
		
		console.log('You selected button');

	}
	
	
	
}
