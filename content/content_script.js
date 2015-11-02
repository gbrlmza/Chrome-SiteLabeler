var labelId = 'chrome-extension-site-labeler-9a755174852e61f89f8f8ab6ffeaf8fe91c4003c64715829b79c3ea3187d9425d36040fecb8e2446';

// Remove existent label
function deleteLabel() {
	var elem = document.querySelector('#' + labelId);
	if (elem) { elem.parentNode.removeChild(elem); }
}

// Convert HEX color code to RGBA
function convertHex(hex, opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);
    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

// Listen to messages send by background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == 'dolabel') {
		var l = request.data.label;
		deleteLabel();
		var elem = document.createElement('div');
		elem.id = labelId;
		elem.className = 'chrome-extension-site-labeler-label chrome-extension-site-labeler-label-' + l.position;
		elem.style.setProperty('background-color', convertHex(l.color, 90), 'important');
		elem.innerHTML = '<div>' + l.name + '</div>';
		document.body.appendChild(elem);
	}
	return true;
});