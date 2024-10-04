let currentStream = null;
let usingRearCamera = false;  // Track whether we're using the rear camera

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

    // Get the video stream based on the facingMode (front or rear camera)
    function getCameraStream(facingMode) {
      const constraints = {
        audio: false,
        video: {
          facingMode: { exact: facingMode }  // Use "user" for front, "environment" for rear
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(successCallback)
        .catch(errorCallback);
    }

    // Initially, use the front camera ("user" facingMode)
    getCameraStream('user');

    // Switch cameras when the video element is double-clicked
    video.addEventListener('dblclick', event => {
      if (location.href.includes('&debug')) {
        console.log('Switching cameras');
        console.log('Current stream:', currentStream);
      }

      // Stop the current stream's tracks before switching
      stopCurrentStream();

      // Toggle between front (user) and rear (environment) camera
      usingRearCamera = !usingRearCamera;
      const facingMode = usingRearCamera ? 'environment' : 'user';

      // Request a new stream using the selected camera (front or rear)
      getCameraStream(facingMode);
    });
  }
});
