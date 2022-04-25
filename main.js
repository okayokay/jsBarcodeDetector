const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

async function detect() {

  	const barcodeDetector = new BarcodeDetector({formats: ['qr_code']});





  	let itemsFound = [];
  	const list = document.getElementById("barcode-list");
  	const zaman = document.getElementById('zaman');

	var start = new Date().getTime();
    var now = new Date().getTime();
    let sure = 0;

    let sureler = [];

  	async function render() {
    	let barcodes = await barcodeDetector.detect(videoElement);
        barcodes.forEach((barcode) => {
          	if (!itemsFound.includes(barcode.rawValue)) {
            	itemsFound.push(barcode.rawValue);
            	const li = document.createElement("li");
            	li.innerHTML = barcode.rawValue;
            	list.appendChild(li);
            	setTimeout(() =>  {
					li.remove();
					const index = itemsFound.indexOf(barcode.rawValue);
					if (index > -1) {
						itemsFound.splice(index, 1);
					}
            	}, 3000);
          	}
        });

      	// setTimeout(render, 100);
      	render();
    	now = new Date().getTime();
    	sure = Math.floor(1000 /(now - start));
    	sureler.unshift(sure);
		sureler.splice(20);
    	zaman.innerHTML = Math.floor(average(sureler));
    	start = new Date().getTime();
  	};

    setTimeout(render, 100);

}




function getStream() {
  	if (window.stream) {
    	window.stream.getTracks().forEach(function (track) {
      		track.stop();
    	});
  	}

	localStorage.kamera = videoSelect.value;

	let videoID = { video: { facingMode: "environment" } };

	if (videoSelect.value) {
		videoID = {
			deviceId: { exact: videoSelect.value },
			audio: false,
			width: { ideal: 300},
			height: { ideal: 300 }
       	}
	}

  	let constraints = {
		video: videoID
	};


  	navigator.mediaDevices
    	.getUserMedia(constraints)
    	.then(gotStream)
    	.catch(handleError);
}

function gotStream(stream) {
  	window.stream = stream; // make stream available to console
  	videoElement.srcObject = stream;
  	detect();
}

function handleError(error) {
  	console.error("Error: ", error);
}

const videoSelect = document.querySelector("select#videoSource");

const videoElement = document.querySelector("video");


navigator.mediaDevices
  	.enumerateDevices()
  	.then(gotDevices)
	.then(getStream)
  	.catch(handleError);

videoSelect.onchange = getStream;

function gotDevices(deviceInfos) {
  	for (let i = 0; i !== deviceInfos.length; ++i) {
    	const deviceInfo = deviceInfos[i];
    	const option = document.createElement("option");
    	option.value = deviceInfo.deviceId;
    	if (deviceInfo.kind === "audioinput") {
    	} else if (deviceInfo.kind === "videoinput") {
      		option.text = deviceInfo.label || "camera " + (videoSelect.length + 1);
      		videoSelect.appendChild(option);
    	} else {
      		console.log("Found another kind of device: ", deviceInfo);
    	}
  	}
	if (localStorage.kamera) {
		videoSelect.value = localStorage.kamera
	}

}


