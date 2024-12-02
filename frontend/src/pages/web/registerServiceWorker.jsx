// React의 useEffect 훅을 사용하기 위해 import
import { useEffect } from 'react';

// 로컬호스트 여부를 확인하는 상수
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' || // 호스트 이름이 localhost인지 확인
    window.location.hostname === '[::1]' || // 호스트 이름이 IPv6 로컬호스트인지 확인
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/ // 호스트 이름이 IPv4 로컬호스트인지 정규식으로 확인
    )
);

// 서비스 워커를 등록하는 훅
export default function useServiceWorker() {
  // useEffect 훅을 사용하여 컴포넌트가 마운트될 때와 언마운트될 때 실행
  useEffect(() => {
    // 환경이 프로덕션이고 서비스 워커를 지원하는 경우에만 실행
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location); // 퍼블릭 URL 생성
      if (publicUrl.origin !== window.location.origin) {
        return; // 퍼블릭 URL의 origin과 현재 페이지의 origin이 다르면 리턴
      }

      // 페이지 로드 시 실행할 함수 정의
      const onLoad = () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`; // 서비스 워커 파일 경로

        if (isLocalhost) {
          // 로컬호스트인 경우 유효한 서비스 워커인지 확인
          checkValidServiceWorker(swUrl);
          // 서비스 워커가 준비되었을 때 실행
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ'
            );
          });
        } else {
          // 로컬호스트가 아닌 경우 서비스 워커 등록
          registerValidSW(swUrl);
        }
      };

      // 페이지가 로드될 때 onLoad 함수 실행
      window.addEventListener('load', onLoad);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        window.removeEventListener('load', onLoad);
      };
    }
  }, []); // 빈 배열을 넣어 처음 렌더링될 때만 실행
}

// 유효한 서비스 워커를 등록하는 함수
function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl) // 서비스 워커를 등록
    .then((registration) => {
      // 업데이트가 발견되었을 때 실행되는 핸들러 설정
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        // 서비스 워커 상태가 변경될 때 실행되는 핸들러 설정
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 새로운 콘텐츠가 사용 가능함을 알림
              console.log('New content is available; please refresh.');
            } else {
              // 콘텐츠가 오프라인용으로 캐시되었음을 알림
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch((error) => {
      // 서비스 워커 등록 중 오류 발생 시 콘솔에 출력
      console.error('Error during service worker registration:', error);
    });
}

// 유효한 서비스 워커인지 확인하는 함수
function checkValidServiceWorker(swUrl) {
  // 서비스 워커 파일을 요청
  fetch(swUrl)
    .then((response) => {
      // 서비스 워커 파일이 없거나, 올바른 타입이 아닌 경우
      if (
        response.status === 404 || // 서비스 워커 파일이 없는 경우
        response.headers.get('content-type').indexOf('javascript') === -1 // 서비스 워커 파일이 아닌 경우
      ) {
        // 기존에 등록된 서비스 워커가 있는 경우 등록 해제 후 페이지 새로고침
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload(); // 서비스 워커 등록 해제 후 페이지 새로고침
          });
        });
      } else {
        // 유효한 서비스 워커인 경우 등록
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      // 인터넷 연결이 없는 경우 로그 출력
      console.log('No internet connection found. App is running in offline mode.');
    });
}

// 서비스 워커를 등록 해제하는 함수
export function unregister() {
  // 서비스 워커가 지원되는 경우
  if ('serviceWorker' in navigator) {
    // 서비스 워커가 준비되었을 때 실행
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister(); // 서비스 워커 등록 해제
    });
  }
}
