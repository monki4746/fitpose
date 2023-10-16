document.addEventListener('DOMContentLoaded', function() {

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);

// 플랭크 자세를 감지하는 함수
function detectPlankPose(poseLandmarks) {
  // 이 부분에서 플랭크 자세를 감지하는 로직을 추가합니다.
  const leftShoulder = poseLandmarks[11];
  const rightShoulder = poseLandmarks[12];
  const leftHip = poseLandmarks[23];
  const rightHip = poseLandmarks[24];
  const leftKnee = poseLandmarks[25];
  const rightKnee = poseLandmarks[26];

  // 어깨, 엉덩이, 무릎의 각도 계산
  const shoulderHipAngle = calculateAngle(leftShoulder, rightShoulder, leftHip);
  const hipKneeAngle = calculateAngle(leftHip, rightHip, leftKnee);
  const shoulderKneeAngle = calculateAngle(leftShoulder, rightShoulder, leftKnee);

  // 각도 조건 설정
  const shoulderHipAngleThreshold = 120;  // 어깨와 엉덩이의 각도
  const hipKneeAngleThreshold = 160;  // 엉덩이와 무릎의 각도
  const shoulderKneeAngleThreshold = 160;  // 어깨와 무릎의 각도

  // 각도가 일정 범위 안에 있는 경우 플랭크 자세로 판단
  if (
    shoulderHipAngle > shoulderHipAngleThreshold &&
    hipKneeAngle > hipKneeAngleThreshold &&
    shoulderKneeAngle > shoulderKneeAngleThreshold
  ) {
    // 플랭크 자세로 판단
    return true;
  }

  return false;
}

// 세 점 사이의 각도 계산 함수
function calculateAngle(pointA, pointB, pointC) {
  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
                   Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs(radians * (180 / Math.PI));

  // 각도가 180도를 초과하지 않도록 보정
  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

// 원하는 운동 자세를 감지하는 로직
const isPlankPose = detectPlankPose(results.poseLandmarks);

if (isPlankPose) {
  console.log("플랭크 자세 감지됨!");
  // 운동 카운트 증가 및 표시
  exerciseCount++;
  updateExerciseCount(exerciseCount);
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

  // 운동 카운트를 업데이트하는 함수 추가
function updateExerciseCount(count) {
  const exerciseCountElement = document.getElementById('exercise-count');
  if (exerciseCountElement) {
    exerciseCountElement.innerText = `운동 횟수: ${count}`;
  }
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

});