var onDeviceReady = function() {
	
	var localFileName = 'tiles-ign.mbtiles';
    var remoteFile = 'http://cg44.makina-corpus.net/tmp/POSOW-19.04.2012.mbtiles';
	
    
	resizeMap();

	$(window).resize(function() {
		console.log("resize");

		resizeMap();
	});
	verifyingMap(localFileName, remoteFile);
	//buildMap();

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

					mbTilesPlugin.getMetadata(function(result)
				    {
						console.log("getMetadata");

						var metadatacenter = result.center;

						var res = metadatacenter.split(",");

						var map = new L.Map("map", {
							center : [res[0],res[1]],//tozeur
							
							zoom : res[2],
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
					});
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
	var type = "db";

	console.log("verifyMap");

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		console.log('file system retrieved.');
		fs = fileSystem;

		var mbTilesPlugin = new MBTilesPlugin();
		console.log("after MBTilesPlugin ");
		mbTilesPlugin.getDirectoryWorking({type: type} , function(r) {
			console.log("getDirectoryWorking Verify : " + r.directory_working);
			var absoluteLocalFileName = r.directory_working + localFileName;

			console.log(absoluteLocalFileName);
			// check to see if files already exists
			var file = fs.root.getFile(absoluteLocalFileName, null, function (fileEntry) {
				// file exists
				console.log('exists, or not...');
				console.log(fileEntry);

				buildMap();
			}, function () {
				// file does not exist
				console.log('does not exist');


				console.log('downloading sqlite file...');
				ft = new FileTransfer();
				ft.onprogress = function(progressEvent) {
				    if (progressEvent.lengthComputable) {
				      //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
				      console.log(progressEvent.loaded / progressEvent.total);
				    } else {
				      //loadingStatus.increment();
				      console.log("+1");
				    }
				};
				ft.download(remoteFile, absoluteLocalFileName, function (entry) {
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

	});
	
	function onConfirm(button){
		
		console.log('You selected button ' + buttonIndex);

	}
	

	function logButton(){
		
		console.log('You selected button');

	}
	
}
