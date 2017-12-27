function nicify(unit) {
	if (unit < 10) {
		unit = "0" + unit;
	}

	return unit;
}

function getTime() {
	var cookies = document.cookie.split(";");
	for (var cookie in cookies) {
		if (cookies[cookie].indexOf("_tt_expTime") > -1) {
			return (cookies[cookie].split("="))[1];
		}
	}
}

function showTime() {
	var tokenTimestamp = new Date(getTime());
	var currentTimestamp = new Date();

	var expTime = new Date(tokenTimestamp - currentTimestamp);
	expTime.setHours(0);
	var displayedTime = nicify(expTime.getHours()) + ":" + nicify(expTime.getMinutes()) + ":" + nicify(expTime.getSeconds());
	document.getElementById('time').innerHTML = displayedTime;

	if (displayedTime == "00:00:00") {
		noAskExit();
	}
}
