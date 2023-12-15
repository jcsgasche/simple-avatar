// Check if the browser supports the Web Audio API
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support the Web Audio API. Please use a different browser.");
    throw new Error("Web Audio API not supported");
}

// Request access to the microphone
navigator.mediaDevices.getUserMedia({audio:true, video:false})
    .then(stream => {
        const audioContext = new AudioContext();
        const audioInput = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        audioInput.connect(analyser)

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const imageElement = document.getElementById('Robot');
        let currentImageIndex = 0;
        const imageSources = ['robotClosed.png', 'robotOpen.png', 'robotOpenBig.png', 'robotOpenSmall.png']

        let isSilent = false;

        function switchImage() {
            analyser.getByteFrequencyData(dataArray);
            let sum = dataArray.reduce((a,b) => a + b, 0);
            let average = sum / dataArray.length;

            if (average > 0) {
                if (isSilent) {
                    isSilent = false; // Reset the flag when sound is detected
                    currentImageIndex = 0; // Start from the first image again
                }
                imageElement.src = imageSources[currentImageIndex];
                currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            } else {
                if (!isSilent) {
                    isSilent = true; // Set the flag when it becomes silent
                    currentImageIndex = 0; // Reset to the first image
                    imageElement.src = imageSources[currentImageIndex];
                }
            }
        }

        setInterval(switchImage, 75)
    })
    .catch(error => {
        console.error('Access to audio input was denied or an error occurred:', error);
    });