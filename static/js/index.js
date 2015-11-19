$(document).ready(function() {

  $('#login').click(function() {
    fb_login();
  });

  $('#post').click(function() {
    FB.api("/me/photos?caption=Support Yale at localhost:5000", "POST", {
        "url": "http://www.folioart.co.uk/images/uploads/Jason-Brooks-Beauty-Folio_Art-Illustration-Advertising-Brand-Fashion-Beauty-Cosmetics-FaceGraphic1-L-L.jpg"
    }, function (response) {
        console.log(response);
        console.log(response.id);
        window.location.replace("https://facebook.com/photo.php?fbid=" + response.id + "&makeprofile=1&makeuserprofile=1");
    });
  });

  function fb_login(){
    FB.login(function(response) {
        console.log("meow");
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            //console.log(response); // dump complete info
            access_token = response.authResponse.accessToken; //get access token
            user_id = response.authResponse.userID; //get FB UID

            checkLoginState();

        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');

        }
    }, {
        scope: 'public_profile,email,publish_actions'
    });
}
    // This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            // $('.facebook').html("Already Authenticated");
            beginProfileGrab();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            console.log("not authorized");
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            console.log("other authorization");
        }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function() {
        FB.init({
            appId: '1063235140374274',
            cookie: true, // enable cookies to allow the server to access 
            // the session
            xfbml: true, // parse social plugins on this page
            version: 'v2.5' // use version 2.2
        });

        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });

    };

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    var userId;

    function beginProfileGrab() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name);
            userId = response.id;
            console.log("Thanks for logging in " + response.name);
            FB.api(userId + "/picture?type=large&height=500&width=500", function(response) {
                if (response && !response.error) {
                    var escaped = encodeURIComponent(response.data.url);
                    var c = document.getElementById("picture");
                    var ctx = c.getContext("2d");
                    var profile = new Image();
                    var overlay = new Image();
                    profile.src = "http://localhost:5000/serve?url=" + escaped;
                    profile.onload = function() {
                        ctx.drawImage(profile, 0, 0, 800, 800);
                        overlay.src = "http://localhost:5000/static/img/overlay.png";
                        overlay.onload = function() {
                            ctx.drawImage(overlay, 0, 0, 800, 800);
                            var img = c.toDataURL("image/png");
                            console.log(img);
                            $('#placeholder-image').fadeOut(function() {
                                $('#intern-image').attr("src", img);
                                $('#intern-image').css("border", "4px solid #ffffff")
                                $('#intern-image').css("border-radius", "2px")
                                $('#placeholder-image').fadeIn();
                            });
                            $('#login').fadeOut(function() {
                                $('#post').fadeIn();
                            });
                            console.log(response.data.url);
                        }
                    }

                }
            })
        });
    }
});