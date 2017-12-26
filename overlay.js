function showExitDialog() {
	var overlay = document.getElementById("exitOverlay");
	overlay.style.visibility = (overlay.style.visibility == "visible") ? "hidden" : "visible";
}

function showAddRecordForm() {
	var overlay = document.getElementById("recordOverlay");
	var recordName = document.getElementById("recordNameInForm");
	var serverAddress = document.getElementById("recordServerAddressInForm");
	var username = document.getElementById("recordUsernameInForm");
	var password = document.getElementById("recordPasswordInForm");
	var url = document.getElementById("recordURLInForm");
	var notes = document.getElementById("recordNotesInForm");
	recordName.value = "";
	serverAddress.value = "";
	username.value = "";
	password.value = "";
	url.value = "";
	notes.value = "";
	var submitButton = document.getElementById("recordFormSubmit");
	submitButton.onclick = addRecord;
	overlay.style.visibility = (overlay.style.visibility == "visible") ? "hidden" : "visible";
}

function showEditRecordForm(recordId) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/show/record/" + recordId, true);
	xhr.onload = function () {
		var response = JSON.parse(xhr.response);
		var overlay = document.getElementById("recordOverlay");
		var recordName = document.getElementById("recordNameInForm");
		var serverAddress = document.getElementById("recordServerAddressInForm");
		var username = document.getElementById("recordUsernameInForm");
		var password = document.getElementById("recordPasswordInForm");
		var url = document.getElementById("recordURLInForm");
		var notes = document.getElementById("recordNotesInForm");

		recordName.value = response.name;
		serverAddress.value = response.serverAddress;
		username.value = response.username;
		password.value = response.password;
		url.value = response.url;
		notes.value = response.notes;

		var submitButton = document.getElementById("recordFormSubmit");
		submitButton.onclick = function () {editRecord(recordId)};
		overlay.style.visibility = "visible";
	}		
	xhr.send();
}