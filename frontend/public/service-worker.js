const sCacheName = "ondo-pwa"; // 캐시제목 선언
const aFilesToCache = [
  // 캐시할 파일 선언
];

// // 2. Install - 설치
// self.addEventListener('install', pEvent => {
//     console.log('서비스워커 설치(install)함!');
//   });

// // 3. Activation - 업데이트
// self.addEventListener('activate', pEvent => {
//     console.log('서비스워커 동작(activation) 시작됨!');
// });

// // 4. fetch - 데이터 요청
// self.addEventListener('fetch', pEvent => {
//     console.log("데이터 요청(fetch)!", pEvent.request)
// });

// 알림 클릭 시 이벤트 리스너
// self.addEventListener("notificationclick", function (event) {
//   event.notification.close(); // 알림 닫기

//   // 원하는 페이지로 이동
//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then(function (clientList) {
//         // 이미 열린 창이 있다면 해당 창을 포커스하고, 없다면 새 창을 열어 이동
//         for (let i = 0; i < clientList.length; i++) {
//           const client = clientList[i];
//           if (client.url === "/" && "focus" in client) {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow("/member/chat"); // 이동할 페이지 URL
//         }
//       })
//   );
// });
