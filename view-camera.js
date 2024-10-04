let cameras = [];
let camId = 0;
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

    // Get the video stream from a specific camera
    function getCameraStream(deviceId) {
      const constraints = {
        audio: false,
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(successCallback)
        .catch(errorCallback);
    }

    // Initial video stream from the default camera
    getCameraStream(null);

    // Check for mediaDevices and enumerateDevices support
    if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices().then(media_devices => {
        media_devices.forEach(media_device => {
          if (location.href.includes('&debug')) {
            console.log(media_device);
          }
          // Filter only video input devices and store them in cameras array
          if (media_device.kind === 'videoinput') {
            cameras.push(media_device.deviceId);  // Push each camera deviceId
          }
        });

        if (location.href.includes('&debug')) {
          console.log('Cameras detected:', cameras);
        }
      });
    }

    // Switch cameras when the video element is double-clicked
    video.addEventListener('dblclick', event => {
      if (cameras.length > 1) {  // Ensure there are multiple cameras to switch between
        if (location.href.includes('&debug')) {
          console.log('Switching cameras');
          console.log('Current cameras:', cameras);
          console.log('Current camId:', camId);
          console.log('Current stream:', currentStream);
        }

        // Stop the current stream's tracks
        stopCurrentStream();

        // Increment camId to switch to the next camera
        camId = (camId + 1) % cameras.length;

        // Request a new stream using the next camera
        getCameraStream(cameras[camId]);
      }
    });
  }
});
