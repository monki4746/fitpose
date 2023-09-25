const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);

// 원하는 운동 자세를 감지하는 함수
function detectExercisePose(poseLandmarks) {
  // 이 부분에서 원하는 운동 자세를 감지하는 로직을 추가합니다.
  const leftShoulder = poseLandmarks[11]; 
  const rightShoulder = poseLandmarks[12]; 
  const hip = poseLandmarks[24]; 

  if (leftShoulder.y < hip.y && rightShoulder.y < hip.y) {
    // 팔이 엉덩이 위에 위치하면 "윗몸 일으키기"로 판단
    return true;
  }

  return false;
}

function onResults(results) {
  if (!results.poseLandmarks) {
    grid.updateLandmarks([]);
    return;
  }

  // 원하는 운동 자세를 감지하는 로직
  const isExercisePose = detectExercisePose(results.poseLandmarks);

  if (isExercisePose) {
    console.log("윗몸 일으키기 자세 감지됨!");
    // 원하는 동작을 추가
    // 해당 자세를 가지고 운동 카운트를 증가시키거나 다른 액션을 수행할 코드 추가.
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.segmentationMask, 0, 0,
                      canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'destination-out';
  // canvasCtx.fillStyle = '#00FF00';
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  canvasCtx.restore();

  grid.updateLandmarks(results.poseWorldLandmarks);
}

// Pose와 Camera 설정
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});
camera.start();
