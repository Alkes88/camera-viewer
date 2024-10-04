let currentStream = null;

document.addEventListener('readystatechange', (event) => {

  if (document.readyState === 'complete') {

    const video = document.querySelector('video');

    // Function to handle success in getting video stream
    function successCallback(stream) {
      currentStream = stream;  // Set the current stream
      video.srcObject = stream;
      video.play();
      if (location.href.includes('&debug')) {
        console.log(`stream: ${stream}`);
      }
    }

    // Function to handle error in getting video stream
    function errorCallback(error) {
      window.alert('Error: ' + error.message);  // Display error message
      if (location.href.includes('&debug')) {
        console.log(`Error: ${error.message}`);
      }
    }

    // Stop the current stream
    function stopCurrentStream() {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        currentStream = null;
      }
    }

    // Request video stream from the rear camera using deviceId
    function getCameraStream(deviceId) {
      const constraints = {
        audio: false,
        video: {
          deviceId: { exact: deviceId }  // Request the specific camera by deviceId
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(successCallback)
        .catch(errorCallback);
    }

    // Enumerate all media devices and find the rear camera
    function findRearCamera() {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          if (location.href.includes('&debug')) {
            console.log('Available video devices:', videoDevices);
          }

          // Look for the rear camera by checking the device label
          const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear'));

          if (rearCamera) {
            // Rear camera found, request stream using its deviceId
            if (location.href.includes('&debug')) {
              console.log('Rear camera found:', rearCamera);
            }
            getCameraStream(rearCamera.deviceId);
          } else {
            // Fallback: if no rear camera is found, alert the user
            window.alert('Rear camera not found, using the default camera');
            if (location.href.includes('&debug')) {
              console.log('Rear camera not found, using default camera');
            }
            getCameraStream(videoDevices[0].deviceId);  // Use the first available camera
          }
        })
        .catch(error => {
          errorCallback(error);
        });
    }

    // Initially, try to find and use the rear camera
    findRearCamera();

  }

});
