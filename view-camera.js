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

    // Request video stream from the rear camera (facingMode: "environment")
    function getRearCameraStream() {
      const constraints = {
        audio: false,
        video: {
          facingMode: { exact: 'environment' }  // Request the rear camera
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(successCallback)
        .catch(errorCallback);
    }

    // Initially, request the rear camera stream
    getRearCameraStream();

  }

});
