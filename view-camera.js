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

    // Get the initial video stream using default camera
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then(successCallback)
      .catch(errorCallback);

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

        // Stop the current stream's tracks and reset it
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
          currentStream = null;
        }

        // Increment camId to switch to the next camera
        camId = (camId + 1) % cameras.length;

        // Request a new stream using the next camera
        navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            deviceId: { exact: cameras[camId] }  // Set the specific camera by its deviceId
          }
        }).then(successCallback).catch(errorCallback);
      }
    });

  }

});
