presentationUtils = {
    fadeOutGuest: function(elementID) {
        var paragraph = document.getElementById(elementID),
        opacity = 1;
        
        if(elementID !== 'login') paragraph.innerHTML = newText;
        var timer = setInterval(function() {
            if(opacity <= 0.1) {
                clearInterval(timer);
                if(newText === "Logged in.") presentationUtils.fadeOut('login', 'Logging in.');
                else paragraph.innerHTML = '&nbsp;';
            }
            paragraph.style.opacity = opacity;
            paragraph.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
            opacity -= opacity * 0.1;
        }, 80);
    },
        
    fadeOut: function(elementID, newText) {
        var paragraph = document.getElementById(elementID),
            opacity = 1;
        
        if(paragraph.innerHTML.length < 10 || elementID === 'login') {
            if(elementID !== 'login') paragraph.innerHTML = newText;
            var timer = setInterval(function() {
                if(opacity <= 0.1) {
                    clearInterval(timer);
                    if(newText === "Logged in.") presentationUtils.fadeOut('login', 'Logging in.');
                    else paragraph.innerHTML = '&nbsp;';
                }
                paragraph.style.opacity = opacity;
                paragraph.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
                opacity -= opacity * 0.1;
            }, 80);
        }
    },

    executeQuery: function(parameters) {
        $.ajax({
            url: './services/gameQueries.js?' + parameters,
            success: function(response) {
                presentationUtils.fadeOut('exceptionText', response.toString());
            },
            error: function(response) {
                alert(response.responseText);
            }
        });
    },

    registerUser: function() {
        var email    = document.getElementById('email').value,
            password = document.getElementById('password').value,
            request  = 'cmd=registerUser&email=' + email + '&password=' + password;
        
        if(email && password) this.executeQuery(request);
        else this.fadeOut('exceptionText', "Please fill the fields.");
    },

    getJSONdata: function(url_path) {
        // $.getJSON("./smth.json", function(json) {
  //             return json; // this will show the info it in firebug console
        // });
        var json;
        $.ajax({
            type: "GET",
            async: false,
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            url: url_path,
            success: function(jsonData) {
                json = jsonData;
            },
            error: function() {
                console.log("Error getting json");
            },
        });
        console.log(json);
        return json;
    }
};