window.onload = function () { 
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/checkVP", true);
	xhr.onload = function () {
		if (xhr.status != 200) {
			document.getElementById("status").innerHTML = "VP core in not accessible!"; //add automated reload link 
			document.getElementById("username").disabled = true;
			document.getElementById("password").disabled = true;
			document.getElementById("submit").disabled = true;
		}
	}	
	xhr.send();
};

function login() {
	var username = document.loginForm.username.value;
	var password = document.loginForm.password.value;

	if (username != "") {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/api/1.0/auth", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = function () {
			var response = JSON.parse(xhr.response);
			if (response.hasOwnProperty('_tt')) {
				var token = response._tt;
				var date = new Date;
				date.setDate(date.getDate());
				date.setHours(date.getHours() + 1);
				document.cookie = "_tt=" + token + "; expires=" + date;  //add secure
				document.cookie = "_tt_expTime=" + date.toISOString(); 
				var xhrOther = new XMLHttpRequest();
				xhrOther.open("GET", "/someStuff", true);
				// xhrOther.setRequestHeader("Authorization", "Bearer " + token);
				xhrOther.onload = function () {
					// document.location.reload(true);	
					window.location = "someStuff";
				}
				xhrOther.send();
			} else {
				showStatus(response);
			}
		}
		xhr.send(JSON.stringify({"username": username, "password": password}));
	} else {
		alert("srsly???? empty fields????");
	}
}

//todo add fade-in and fade-out animation
function showStatus(response) {
	var status = document.getElementById('status');
	status.innerHTML = response.error;
}