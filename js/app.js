console.log("app.js");

if(navigator.serviceWorker){
    navigator.serviceWorker.register("/sw.js");
    //navigator.serviceWorker.register("sw.js");
}