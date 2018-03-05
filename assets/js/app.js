AppManager = {};

AppManager.init = function(){

    var config = {
        apiKey: "AIzaSyD00hvSWEo3VSW3-GbWF6-1HdNFxAokozw",
        authDomain: "fe-demo-app.firebaseapp.com",
        databaseURL: "https://fe-demo-app.firebaseio.com",
        projectId: "fe-demo-app",
        storageBucket: "fe-demo-app.appspot.com",
        messagingSenderId: "275291743756"
      };

      firebase.initializeApp(config);

      firebase.auth().onAuthStateChanged(function(user) {

       // debugger;

        if (user) {

          //if (user.emailVerified) {

            if(AppManager.userLoggedCallback){
              AppManager.userLoggedCallback(user);
            }
            //console.log('Email is verified');
          //}
          //else {
            //user.sendEmailVerification(); 
            //console.log('Email is not verified');
          //}

          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // ...
        } else {
          // User is signed out.
          // ...
        }
      });

}

AppManager.createUser = function(name, email, password, next){
  debugger;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result){
    debugger;
    AppManager.loginWithEmailPassword(email, password, function(error, user){

      if(error){
        next(error.message, null);
      }else{
        AppManager.saveUser(user.uid, name, email, function(error, data){
          if(error){
            next(error.message, null);
          }else{
            next(null, data);
          }
          
        });
      }
    });

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...

    next(error, null);
  });

};

AppManager.saveUser = function(userId, name, email, next){
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
  }).then(function(result){
    next(null, result);
  }).catch(function(error) {
    next(error, null);
  });
};

AppManager.onUserUpdated = function(userId, next){
  //var usernameRef = firebase.database().ref('users/' + userId + '/username');
  var userRef = firebase.database().ref('users/' + userId);
  // userRef.onnce(
  userRef.on('value', function(snapshot) {
    next(snapshot.val());
  });
}

AppManager.loginWithEmailPassword = function(email, password, next){
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(result){
    next(null, result);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    next(errorMessage, null);
  });

};

AppManager.loginGithub = function(next){

  var provider = new firebase.auth.GithubAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    AppManager.saveUser(user.uid, user.email, user.email, function(error, data){
      if(error){
        next(error.message, null);
      }else{
        next(null, data);
      }
      
    });
  
    //next(null, user);

    
    // ...
  }).catch(function(error) {

    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    next(errorMessage, null);
  });


};

AppManager.getCurrentUser = function(){
  return firebase.auth().currentUser;
}

AppManager.logout = function(next){
  firebase.auth().signOut().then(function() {
    next(null);
  }).catch(function(error) {
    // An error happened.
    next(error);
  });
};

AppManager.init();

