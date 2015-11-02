(function(){

	var auxLastUpdate = 0;

	// check if the site on the given tab has to be labeled
	function labeler(tab){
		var title = tab.title;
		var url = tab.url;
		var l, regexp;

		chrome.storage.sync.get(null, function(data){
			for ( var i in data.labels ) {
				l = data.labels[i];
				regexp = new RegExp(l.regexp);

				if ( l.enabled && regexp.test(url) ) {

					chrome.tabs.sendMessage(tab.id, {'action': 'dolabel', 'data': {'label': l}}, function(response) {
						if ( typeof response == 'undefined' ) {
							chrome.tabs.executeScript(tab.id, {file: "content/content_script.js"}, function(){
								chrome.tabs.insertCSS(tab.id, {file: "content/content_script.css"}, function(){
									chrome.tabs.sendMessage(tab.id, {'action': 'dolabel', 'data': {'label': l}}, function(response) {});
								});
							});
						}
					});

					break;
				}
			};
		});
	};

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		labeler(tab);
	});

})();