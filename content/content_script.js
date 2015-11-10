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
		var elem = document.createElement('div');
		
		deleteLabel();
		
		elem.id = labelId;
		elem.className = 'chrome-extension-site-labeler-label chrome-extension-site-labeler-label-' + l.position;
		elem.style.setProperty('background-color', convertHex(l.color, 85), 'important');
		elem.innerHTML = '<div>' + l.name + '</div>';
		document.body.appendChild(elem);

		// hide label on mouseover
		elem.addEventListener("mouseover", function(event){
			var lastmove, timer;
			var elem = document.querySelector('#' + labelId);
			var rect = elem.getBoundingClientRect(); // Get size and position before hide the label
			
			// Hide label
			elem.style.setProperty('display', 'none', 'important');

			// Clean-up and show label
			var showLabel = function(){
				document.removeEventListener("mousemove", handleMouseMove);
				clearInterval(timer);
				elem.style.setProperty('display', 'block', 'important');
			};

			// Show label if the mouse stay idle for a few seconds
			timer = setInterval(function(){
				var now = new Date().getTime();
				if ( lastmove && (now - lastmove) > 4000 ) {
					showLabel();
				}
			}, 1000);

			var handleMouseMove = function(event){
				var x = event.clientX;
				var y = event.clientY;
				
				lastmove = new Date().getTime(); // save timestamp of last mouse movement

				if ( x < rect.left || x > rect.right || y < rect.top || y > rect.bottom ) {
					showLabel();
				}
			};

			document.addEventListener("mousemove", handleMouseMove);
			
		});
	}
	return true;
});