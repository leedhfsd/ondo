import { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';

const OpenViduVideoComponent = ({ streamManager, filterEnabled }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [overlayImage, setOverlayImage] = useState(null);

  // 이미지를 불러오는 함수
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/icons/not_background_character.png'; // 여기에 이미지 경로를 설정 - public에 담겨있어야한다.
    img.onload = () => {
      setOverlayImage(img);
    };
  }, []);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  useEffect(() => {
    if (filterEnabled && videoRef.current && canvasRef.current && overlayImage) {
      // 캔버스 크기를 비디오 크기와 동기화
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      const onResults = (results) => {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });

          // 여기서 이미지를 얼굴의 중앙에 오버레이합니다 (눈과 코의 중간 위치에)
          const leftEye = landmarks[133];
          const rightEye = landmarks[362];
          const nose = landmarks[1];

          const overlayX = (leftEye.x + rightEye.x) / 2 * canvasRef.current.width;
          const overlayY = nose.y * canvasRef.current.height;

          const overlayWidth = 500; // 이미지의 너비를 설정하세요
          const overlayHeight = 600; // 이미지의 높이를 설정하세요

          canvasCtx.drawImage(overlayImage, overlayX - overlayWidth / 2, overlayY - overlayHeight / 2, overlayWidth, overlayHeight);
        }
        canvasCtx.restore();
      };

      faceMesh.onResults(onResults);

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();

      // 캔버스에서 스트림을 가져와서 송출에 사용
      const canvasStream = canvasRef.current.captureStream();

      if (streamManager && canvasStream) {
        streamManager.replaceTrack(canvasStream.getVideoTracks()[0]);
      }
    }
  }, [filterEnabled, overlayImage]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ display: filterEnabled ? 'none' : 'block' }} />
      <canvas ref={canvasRef} style={{ display: filterEnabled ? 'block' : 'none' }} />
    </div>
  );
};

export default OpenViduVideoComponent;
