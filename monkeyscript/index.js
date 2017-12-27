function login() {
	var username = document.loginForm.username.value;
	var password = document.loginForm.password.value;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/auth", true);
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
				document.location.reload(true);	
			}
			xhrOther.send();
		} else {
			showStatus(response);
		}
	}
	xhr.send(JSON.stringify({"username": username, "password": password}));	
}

//todo add fade-in and fade-out animation
function showStatus(response) {
	var status = document.getElementById('status');
	status.innerHTML = response.error;
}