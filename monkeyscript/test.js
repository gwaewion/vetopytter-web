// function showLeafContextMenu() {
// 	var leafConextMenu = document.getElementById("catalogContextMenu");
// 	leafConextMenu.style.visibility = "visible";
// }

// function getPointerCoordinates(event) {
// 	var x = event.clientX;
// 	var y = event.clientY;
// }

// window.addEventListener("contextmenu", showLeafContextMenu());

// window.addEventListener("contextmenu", showCoords);

function showCatalogContextMenu(event) {
	document.body.setAttribute("oncontextmenu", "return false;");
	console.log(event.clientX + " " + event.clientY);
	var menu = document.getElementById("catalogContextMenu");
	menu.style.position = "absolute";
	menu.style.left = event.clientX + "px";
	menu.style.top = event.clientY + "px";
	menu.style.visibility = "visible";
	window.addEventListener("click", hideCatalogContextMenu);
}

function hideCatalogContextMenu() {
	console.log(document.getElementById(event.target.id).className);
	var menu = document.getElementById("catalogContextMenu");
	if (event.target.id != "menuItem" && event.target.id != "menuItems") {
		menu.style.visibility = "hidden";
		document.body.setAttribute("oncontextmenu", "");
	}
}

// document.getElementById("catalogsTree").addEventListener("contextmenu", showCatalogHolderContextMenu(event));

// function showCatalogHolderContextMenu(event) {
// 	document.body.setAttribute("oncontextmenu", "return false;");
// 	console.log(event.clientX + " " + event.clientY);
// 	var menu = document.getElementById("catalogHolderContextMenu");
// 	if (event.target.id != "treeLeaf") {
// 		menu.style.position = "absolute";
// 		menu.style.left = event.clientX + "px";
// 		menu.style.top = event.clientY + "px";
// 		menu.style.visibility = "visible";
// 		window.addEventListener("click", hideCatalogHolderContextMenu);
// 	}
// }

// function hideCatalogHolderContextMenu() {
// 	console.log(event.target.id);
// 	var menu = document.getElementById("catalogHolderContextMenu");
// 	if (event.target.id != "treeLeaf") {
// 		menu.style.visibility = "hidden";
// 		document.body.setAttribute("oncontextmenu", "");
// 	}
// }

function showImportForm() {
	var overlay = document.getElementById("uploadOverlay");
	overlay.style.visibility = (overlay.style.visibility == "visible") ? "hidden" : "visible";
}

function uploadFile() {
	console.log(document.getElementById("fileChooser").files);
	var files = document.getElementById("fileChooser").files;
	if (files.length == 1) {
		var xml = files[0];
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "api/1.0/upload/xml", true);
		xhr.onload = function() {
			
		}
		xhr.send(xml);
	}
	showImportForm()
}