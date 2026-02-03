// ===================================
// إعدادات Firebase
// ===================================
const firebaseConfig = {
    apiKey: "AIzaSyDdLB3KHZVbNw3O9QrKJzBw2pL_pFn8Iso",
    databaseURL: "https://mazen-2ba04-default-rtdb.firebaseio.com",
    projectId: "mazen-2ba04"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
