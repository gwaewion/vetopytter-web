window.onload = function () {
	setInterval(showTime, 1);
	getRecords();
};

function getCookie() {
	return document.cookie.split(";").filter(function (cookie) { cookie.indexOf("_tt") > -1 ? cookie : false });
}

function exit() {
	var result = confirm("really?");
	if (result == true) { 
		noAskExit();
	}
}

function noAskExit() {
	document.cookie = "_tt=; expires=-1;";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/", true);
	xhr.setRequestHeader("Pragma", "no-cache");
	xhr.setRequestHeader("Expires", "-1");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.onload = function () {
		document.location.reload(false);
		window.close();
	}
	xhr.send();
}

// function buildTree() {
// 	var treeHolder = document.getElementById('stuffTree');
// 	treeHolder.innerHTML = '23';
// }

// function getRecord(recordId) {
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("GET", "/api/1.0/show/record/" + recordId, true);
// 	xhr.onload = function () {
// 		return response = JSON.parse(xhr.response);
// 	}		
// 	xhr.send();
// }

function getRecords() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/show/record/all", true);
	xhr.onload = function () {
		buildList(JSON.parse(xhr.response)); 
	}		
	xhr.send();
}

function buildList(response) {
	var listHolder = document.getElementById('recordsList');
	listHolder.innerHTML = "";
	var records = response;

	var table = document.createElement("table");
	listHolder.appendChild(table);
	var tableRow = document.createElement("tr");
	// table.setAttribute("border", "1");
	table.appendChild(tableRow);
	// var tableHeaderId = document.createElement("th");
	// tableHeaderId.innerHTML = "ID";
	var tableHeaderRecordName = document.createElement("th");
	// tableHeaderRecordName.style.width = "50px";
	tableHeaderRecordName.innerHTML = "Name";
	// var tableHeaderServerAddress = document.createElement("th");
	// tableHeaderServerAddress.innerHTML = "Address";
	var tableHeaderUsername = document.createElement("th");
	tableHeaderUsername.innerHTML = "Username";
	var tableHeaderPassword = document.createElement("th");
	tableHeaderPassword.innerHTML = "Password";
	var tableHeaderAction = document.createElement("th");
	tableHeaderAction.innerHTML = "Action";
	// tableHeaderAction.style.width = "100px";
	// var tableHeaderURL = document.createElement("th");
	// tableHeaderURL.innerHTML = "URL";
	// var tableHeaderNotes = document.createElement("th");
	// tableHeaderNotes.innerHTML = "Notes";
	// tableRow.appendChild(tableHeaderId);
	tableRow.setAttribute("border", "1");
	tableRow.appendChild(tableHeaderRecordName);
	// tableRow.appendChild(tableHeaderServerAddress);
	tableRow.appendChild(tableHeaderUsername);
	tableRow.appendChild(tableHeaderPassword);
	tableRow.appendChild(tableHeaderAction);
	// tableRow.appendChild(tableHeaderURL);
	// tableRow.appendChild(tableHeaderNotes);

	for (var item in records.records) {
		var record = records.records[item];
		// console.log(record);
		var tableRow = document.createElement("tr");
		tableRow.setAttribute("id", "recordRow");
		tableRow.setAttribute("class", "recordRow");
		tableRow.setAttribute("record_id", record._id.$oid);
		table.appendChild(tableRow);
		// var tableHeaderId = document.createElement("td");
		// tableHeaderId.innerHTML = record._id.$oid;
		var tableDataRecordName = document.createElement("td");
		tableDataRecordName.setAttribute("id", "recordNameInRow");
		tableDataRecordName.innerHTML = record.name;
		// var tableHeaderServerAddress = document.createElement("td");
		// tableHeaderServerAddress.innerHTML = record.serverAddress;
		var tableDataUsername = document.createElement("td");
		tableDataUsername.setAttribute("id", "usernameInRow");
		tableDataUsername.innerHTML = record.username;
		var tableDataPassword = document.createElement("td");
		tableDataPassword.setAttribute("id", "passwordInRow");
		tableDataPassword.innerHTML = "******";

		var tableDataAction = document.createElement("td");
		tableDataAction.setAttribute("id", "recordAction");
		var tableDataActionEdit = document.createElement("p");
		tableDataActionEdit.innerHTML = "edit";
		var tableDataActionDelete = document.createElement("p");
		tableDataActionDelete.innerHTML = "delete";
		tableDataActionEdit.setAttribute("id", "recordEdit");
		tableDataActionDelete.setAttribute("id", "recordDelete");
		tableDataAction.appendChild(tableDataActionEdit);
		tableDataAction.appendChild(tableDataActionDelete);
		
		// var tableDataURL = document.createElement("td");
		// tableDataURL.setAttribute("id", "url");
		// tableDataURL.innerHTML = record.url;
		// var tableHeaderNotes = document.createElement("td");
		// tableHeaderNotes.innerHTML = record.notes;
		// tableRow.appendChild(tableHeaderId);
		tableRow.appendChild(tableDataRecordName);
		// tableRow.appendChild(tableHeaderServerAddress);
		tableRow.appendChild(tableDataUsername);
		tableRow.appendChild(tableDataPassword);
		tableRow.appendChild(tableDataAction);
		// tableRow.appendChild(tableHeaderURL);
		// tableRow.appendChild(tableHeaderNotes);
		// listHolder.append("<tr><td>" + record._id.$oid + "</td><td>" + record.name + "</td><td>" + record.serverAddress + "</td><td>" + record.username + "</td>\
		// <td>" + record.password + "</td><td>" + record.url + "</td><td>" + record.notes + "</td></tr>");
		tableDataRecordName.onclick = function () {
			var record = this.parentNode;
			var recordDetails = document.getElementById("recordDetails");
			displayRecord(recordDetails, record.getAttribute("record_id"));
		};
		tableDataActionEdit.onclick = function () {
			var record = this.parentNode.parentNode;
			var recordId = record.getAttribute("record_id");
			showEditRecordForm(recordId);
		};
		tableDataActionDelete.onclick = function () {
			var record = this.parentNode.parentNode;
			var recordId = record.getAttribute("record_id");
			var result = confirm("rlly?");
			result == true ? deleteRecord(recordId) : false;
			// deleteRecord(recordId);
		};
	}
}

function displayRecord(recordHolder, recordId) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/show/record/" + recordId, true);
	xhr.onload = function () {
		var response = JSON.parse(xhr.response);

		recordHolder.innerHTML = "";

		var recordName = document.createElement("p");
		var serverAddress = document.createElement("p");
		var username = document.createElement("p");
		var password = document.createElement("p");
		var url = document.createElement("p");
		var notes = document.createElement("p");
		var creationDate = document.createElement("p");
		var modificationDate = document.createElement("p");

		recordName.innerHTML = "name: " + response.name;
		serverAddress.innerHTML = "serverAddress: " + response.serverAddress;
		username.innerHTML = "username: " + response.username;

		var passwordValue = response.password;
		password.innerHTML = "password: ******";
		password.onclick = function () {
			if (password.innerHTML == "password: ******") {
				password.innerHTML = "password: " + passwordValue;
			} else {
				password.innerHTML = "password: ******";
			}
		};
		password.onmouseout = function () {
			password.innerHTML = "password: ******";
		}
		
		url.innerHTML = "url: " + response.url;
		notes.innerHTML = "notes: " + response.notes;
		creationDate.innerHTML = "creationDate: " + new Date(response.creationDate.$date);
		modificationDate.innerHTML = "modificationDate: " + new Date(response.modificationDate.$date);

		recordHolder.appendChild(recordName);
		recordHolder.appendChild(serverAddress);
		recordHolder.appendChild(username);
		recordHolder.appendChild(password);
		recordHolder.appendChild(url);
		recordHolder.appendChild(notes);
		recordHolder.appendChild(creationDate);
		recordHolder.appendChild(modificationDate);
	}		
	xhr.send();
}

function addRecord() {
	var recordName = document.getElementById("recordNameInForm");
	var serverAddress = document.getElementById("recordServerAddressInForm");
	var username = document.getElementById("recordUsernameInForm");
	var password = document.getElementById("recordPasswordInForm");
	var url = document.getElementById("recordURLInForm");
	var notes = document.getElementById("recordNotesInForm");

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/1.0/add/record", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (JSON.parse(xhr.response).result == "success") {
			getRecords();
		} else {
			alert("srsly?");
		}
		
	}		
	xhr.send(JSON.stringify({
		'recordName': recordName.value, 
		'serverAddress': serverAddress.value, 
		'username': username.value, 
		'password': password.value, 
		'url': url.value, 
		'notes': notes.value
	}));

	recordName.value = "";
	serverAddress.value = "";
	username.value = "";
	password.value = "";
	url.value = "";
	notes.value = "";

	var overlay = document.getElementById("recordOverlay");
	overlay.style.visibility = "hidden";
}

function editRecord(recordId) {
	console.log(recordId);
	var recordName = document.getElementById("recordNameInForm");
	var serverAddress = document.getElementById("recordServerAddressInForm");
	var username = document.getElementById("recordUsernameInForm");
	var password = document.getElementById("recordPasswordInForm");
	var url = document.getElementById("recordURLInForm");
	var notes = document.getElementById("recordNotesInForm");

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/1.0/update/record", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (JSON.parse(xhr.response).result == "success") {
			getRecords();
		} else {
			alert(JSON.parse(xhr.response).result);
		}
		
	}		
	xhr.send(JSON.stringify({
		'recordId': recordId,
		'recordName': recordName.value, 
		'serverAddress': serverAddress.value, 
		'username': username.value, 
		'password': password.value, 
		'url': url.value, 
		'notes': notes.value,
		'modificationDate': new Date().valueOf()
	}));

	recordName.value = "";
	serverAddress.value = "";
	username.value = "";
	password.value = "";
	url.value = "";
	notes.value = "";

	var overlay = document.getElementById("recordOverlay");
	overlay.style.visibility = "hidden";
}

function deleteRecord(recordId) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/delete/record/" + recordId, true);
	xhr.onload = function () {
		if (JSON.parse(xhr.response).result == "success") {
			getRecords();
		} else {
			alert("srsly?");
		}
	}		
	xhr.send();
}