window.onload = function () {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/checkJWT", true);
	xhr.onload = function () {
		var response = JSON.parse(xhr.response);
		if (response.result == "JWT is valid") {
			setInterval(showTime, 1);
			// getRecords();
			buildTree();
		} else {
			document.body.innerHTML = ""; //need replace with showing popup message and redirecting to index page 
		}
	}	
	xhr.send();
};

// window.onload = function () {
// 	if (isCookieValid() == true) {
// 		setInterval(showTime, 1);
// 		getRecords();
// 	} else {
// 		document.body.innerHTML = "";
// 	}
// 	// console.log(isCookieValid());
// };

function getCookie() {
	return document.cookie.split(";").filter(function (cookie) { cookie.indexOf("_tt") > -1 ? cookie : false });
}

function exit() {
	var result = confirm("really?");
	if (result == true) { 
		noAskExit();
	}
}

// need to add cookie validation function for preventing access to someStuff page 

// function isCookieValid() {
// 	var xhrOther = new XMLHttpRequest();
// 	xhrOther.open("GET", "/api/1.0/checkJWT", true);
// 	xhrOther.onload = function () {
// 		console.log(xhrOther.response);
// 		var response = JSON.parse(xhrOther.response);
// 		if (response.result == "JWT is valid") {
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	}	
// 	xhrOther.send();
// }

function noAskExit() {
	document.cookie = "_tt=; expires=-1;";
	document.cookie = "_tt_expTime=; expires=-1;";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/", true);
	xhr.setRequestHeader("Pragma", "no-cache");
	xhr.setRequestHeader("Expires", "-1");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.onload = function () {
		// document.location.reload(false);
		// window.close();
		window.location = "/";
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
// 		buildList(JSON.parse(xhr.response));
// 	}		
// 	xhr.send();
// }

function getRecordsFromCatalog(catalogId) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/show/records/fromCatalog/" + catalogId, true);

	xhr.onload = function () {
		buildList(JSON.parse(xhr.response)); 
	}		
	xhr.send();
}

function buildTree() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/1.0/show/catalog/all", true);
	xhr.onload = function() {
		var response = JSON.parse(xhr.response);
		var catalogs = response.catalogs;
		var rootCatalog;

		for (var catalog in catalogs) {
			if (catalogs[catalog].name == "rootCatalog") {
				rootCatalog = catalogs[catalog];
			}
		}

		var catalogsTree = document.getElementById('catalogsTree');
		// catalogsTree.oncontextmenu = function() {
		// 	showCatalogHolderContextMenu(event);
		// }
		var treeRoot = document.createElement("ul");
		treeRoot.setAttribute("id", "treeRoot");
		// treeRoot.setAttribute("class", "collapsed");
		// treeRoot.innerHTML = "+";
		catalogsTree.appendChild(treeRoot);

		var childCatalogsOids = rootCatalog.catalogs;
		var xhrs = [];

		for (var i = 0; i <= childCatalogsOids.length - 1; i++) {
			(function (i){
                xhrs[i] = new XMLHttpRequest();
                xhrs[i].open("GET", "/api/1.0/show/catalog/" + childCatalogsOids[i].$oid, true);
                xhrs[i].onload = function () {	
	            	var catalog = JSON.parse(xhrs[i].response);
					if (catalog.catalogs.length == 0) {
						var treeLeaf = document.createElement("li");
						treeLeaf.setAttribute("class", "treeLeaf");
						treeLeaf.setAttribute("state", "collapsed");
						treeLeaf.setAttribute("hasChild", "no");
						treeLeaf.setAttribute("catalogId", catalog._id.$oid);
						treeLeaf.innerHTML = catalog.name;
						treeRoot.appendChild(treeLeaf);
						treeLeaf.onclick = function() {
							getRecordsFromCatalog(catalog._id.$oid);
						};
						treeLeaf.oncontextmenu = function() {
							showCatalogContextMenu(event);
 						};
                };}
                xhrs[i].send();
            })(i);
        }
	}
	xhr.send();
}

function buildList(response) {
	var records = response;

	var table = document.getElementById("recordsTable");
	table.innerHTML = "<tbody><tr><th>Name</th><th>Username</th><th>Password</th><th>Action</th></tr></tbody>";
	for (var item in records) {
		var record = records[item];
		var tableRow = document.createElement("tr");
		tableRow.setAttribute("id", "recordRow");
		tableRow.setAttribute("class", "recordRow");
		tableRow.setAttribute("align", "center");
		tableRow.setAttribute("recordId", record._id.$oid);

		table.appendChild(tableRow);
		var tableDataRecordName = document.createElement("td");
		tableDataRecordName.setAttribute("id", "recordNameInRow");
		tableDataRecordName.innerHTML = record.name;
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
		
		tableRow.appendChild(tableDataRecordName);
		tableRow.appendChild(tableDataUsername);
		tableRow.appendChild(tableDataPassword);
		tableRow.appendChild(tableDataAction);

		tableDataRecordName.onclick = function() {
			var record = this.parentNode;
			var recordDetails = document.getElementById("recordDetails");
			displayRecord(recordDetails, record.getAttribute("recordId"));
		};
		tableDataActionEdit.onclick = function() {
			var record = this.parentNode.parentNode;
			var recordId = record.getAttribute("recordId");
			showEditRecordForm(recordId);
		};
		tableDataActionDelete.onclick = function() {
			var record = this.parentNode.parentNode;
			var recordId = record.getAttribute("recordId");
			var result = confirm("rlly?");
			result == true ? deleteRecord(recordId) : false;
		};
	}
}

function displayRecord(recordHolder, recordId) {
	var xhrDisplayRecord = new XMLHttpRequest();
	xhrDisplayRecord.open("GET", "/api/1.0/show/record/" + recordId, true);
	xhrDisplayRecord.onload = function () {
		var response = JSON.parse(xhrDisplayRecord.response);

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
	xhrDisplayRecord.send();
}

function addRecord() {
	var recordName = document.getElementById("recordNameInForm");
	var serverAddress = document.getElementById("recordServerAddressInForm");
	var username = document.getElementById("recordUsernameInForm");
	var password = document.getElementById("recordPasswordInForm");
	var url = document.getElementById("recordURLInForm");
	var notes = document.getElementById("recordNotesInForm");

	var xhrAddRecord = new XMLHttpRequest();
	xhrAddRecord.open("POST", "/api/1.0/add/record", true);
	xhrAddRecord.setRequestHeader("Content-Type", "application/json");
	xhrAddRecord.onload = function () {
		if (JSON.parse(xhrAddRecord.response).result == "success") {
			getRecords();
		} else {
			alert("srsly?");
		}
		
	}		
	xhrAddRecord.send(JSON.stringify({
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
	// console.log(recordId);
	var recordName = document.getElementById("recordNameInForm");
	var serverAddress = document.getElementById("recordServerAddressInForm");
	var username = document.getElementById("recordUsernameInForm");
	var password = document.getElementById("recordPasswordInForm");
	var url = document.getElementById("recordURLInForm");
	var notes = document.getElementById("recordNotesInForm");

	var xhrEditRecord = new XMLHttpRequest();
	xhrEditRecord.open("POST", "/api/1.0/update/record", true);
	xhrEditRecord.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (JSON.parse(xhrEditRecord.response).result == "success") {
			getRecords();
		} else {
			alert(JSON.parse(xhrEditRecord.response).result);
		}
		
	}		
	xhrEditRecord.send(JSON.stringify({
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
	var catalogId;

	var xhrGetCatalog = new XMLHttpRequest();
	xhrGetCatalog.open("GET", "/api/1.0/show/catalog/byRecordId/" + recordId, true);
	xhrGetCatalog.onload = function() {
		catalogId = JSON.parse(xhrGetCatalog.response)._id.$oid;
	}
	xhrGetCatalog.send();

	var  xhrDeleteRecord = new XMLHttpRequest();
	xhrDeleteRecord.open("GET", "/api/1.0/delete/record/" + recordId, true);
	xhrDeleteRecord.onload = function () {
		if (JSON.parse(xhrDeleteRecord.response).result == "success") {
			getRecordsFromCatalog(catalogId);
		} else {
			alert("srsly?");
		}
	}		
	xhrDeleteRecord.send();
}