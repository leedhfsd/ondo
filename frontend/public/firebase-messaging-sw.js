importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAk9W2eCQ5qrmgZv4WvC--1_WuflqeXZ0Y",
  authDomain: "ondo-ffd48.firebaseapp.com",
  projectId: "ondo-ffd48",
  storageBucket: "ondo-ffd48.appspot.com",
  messagingSenderId: "11671201090",
  appId: "1:11671201090:web:8883a7703bea1735ac14db",
  measurementId: "G-E488XVDL6J",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/assets/icons/character_icon.png",
    badge: "/assets/icons/favicon76.png",
    data: {
      url: "https://i11c110.p.ssafy.io/member/chat", // 클릭 시 이동할 경로
    },
  };

  // Service Worker에서 알림을 표시하는 코드
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 클릭시 앱을 실행시키는 코드
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click Received.");

  const urlToOpen = event.notification.data.url || "/";

  event.notification.close(); // 알림 닫기

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
