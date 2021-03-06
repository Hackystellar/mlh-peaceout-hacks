// gsap animations
TweenMax.to(".overlay", 1.2, {
  top: "-120%",
  ease: Expo.easeOut,
  delay: 3,
});


const video = document.getElementById('video')
const capture = document.getElementById('capture-btn')
const timer = document.getElementById('timer')

const setTimer = () => {
  timer.style.display = 'block'
  timeLeft = 10;
  function countdown() {
    timeLeft--;
    timer.innerHTML = String(timeLeft);
    if (timeLeft > 0) {
      setTimeout(countdown, 1000);
    }
  };
  setTimeout(countdown, 1000);
}

const startProcess = async () => {
  let predictedExpression;
  //turning on camera and taking usre input
  const mediaStream = navigator.getUserMedia(
    { video: {} },
    await function (stream) {
      video.srcObject = stream
      console.log(stream)
    },
    err => console.error(err)
  )

  // setting up timer here : 
  setTimer();

  // loading models for face exp recognition
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('/models')

  const detectExpression = async () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    console.log('detection function trigerred')
    setInterval( async () => {
       let detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
       if (detections.length) {
          const obj = detections[0].expressions
          let maxvalueExp = _.last(_.sortBy(obj))
          for (property in obj) {
            if (obj[property] === maxvalueExp) {
               predictedExpression = property
            }
          }
       }
       const resizedDetections = faceapi.resizeResults(detections, displaySize)
       canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
       faceapi.draw.drawDetections(canvas, resizedDetections)
       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
       let faceExp = faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 500)
  }
  let baseUrl = "https://mlh-peaceout-hacks.vercel.app";
  video.addEventListener('play', detectExpression)
  const captureImageExpressions = async () => {
    video.style.display = 'none'
    if ( predictedExpression === 'happy' ){
      window.open(`${baseUrl}/pages/happy.html`, '_blank');
    }
    if ( predictedExpression === 'sad' ){
      window.open(`${baseUrl}/pages/sad.html`, '_blank');
    }
    if ( predictedExpression === 'neutral' ){
      window.open(`${baseUrl}/pages/neutral.html`, '_blank');
    }
    if ( predictedExpression === 'angry' ){
      window.open(`${baseUrl}/pages/angry.html`, '_blank');
    }
    if ( predictedExpression === 'disgusted' ){
      window.open(`${baseurl}/pages/angry.html`, '_blank');
    }
    if ( predictedExpression === 'surprised' ){
      window.open(`${baseUrl}/pages/happy.html`, '_blank');
    }
    if ( predictedExpression === 'fearful' ){
      window.open(`${baseUrl}/pages/sad.html`, '_blank');
    }
    await location.reload()
  }
  capture.addEventListener('click', captureImageExpressions)
}

for (let index = 0; index < 2; index++) {
  let getStartedBtn = document.getElementsByClassName('get-started-btn')[index]
  console.log(getStartedBtn)
  getStartedBtn.addEventListener('click', startProcess);
}


