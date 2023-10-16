const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);

let exerciseCount = 0;  // 운동 카운트 변수 추가

function detectExercisePose(poseLandmarks) {
  // ... (이전 코드와 동일)

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

function onResults(results) {
  if (!results.poseLandmarks) {
    grid.updateLandmarks([]);
    return;
  }

  // 원하는 운동 자세를 감지하는 로직
  const isExercisePose = detectExercisePose(results.poseLandmarks);

  if (isExercisePose) {
    console.log("윗몸 일으키기 자세 감지됨!");
    // 운동 카운트 증가 및 표시
    exerciseCount++;
    updateExerciseCount(exerciseCount);
  }

  // ... (이전 코드와 동일)

  grid.updateLandmarks(results.poseWorldLandmarks);
}

// 운동 카운트를 업데이트하는 함수 추가
function updateExerciseCount(count) {
  const exerciseCountElement = document.getElementById('exercise-count');
  if (exerciseCountElement) {
    exerciseCountElement.innerText = `운동 횟수: ${count}`;
  }
}

// ... (이전 코드와 동일)

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
