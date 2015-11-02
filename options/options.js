function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};

var dummyLabel = {
	'name': 	'Localhost',
	'regexp': 	'^http(s)?.*://localhost.*$',
	'position': 'top',
	'color': 	'#3ADF00',
	'enabled': 	true
};

function addLabel (label) {
	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	var td2 = document.createElement('td');
	var td3 = document.createElement('td');
	var td4 = document.createElement('td');
	var td5 = document.createElement('td');
	var td6 = document.createElement('td');
	td1.innerHTML = '<input type="text" class="label" name="name" value="' + label.name + '">';
	td2.innerHTML = '<input type="text" class="regexp" name="regexp" value="' + label.regexp + '">';
	td3.innerHTML = '<select name="position"><option value="top">Top</option><option value="right">Right</option><option value="bottom">Bottom</option><option value="left">Left</option></select>';
	td3.querySelector('select').value = label.position;
	td4.innerHTML = '<input type="color" name="color" value="' + label.color + '">';
	td5.innerHTML = '<input type="checkbox" name="enabled" ' + (label.enabled ? 'checked' : '') + '>';
	td6.innerHTML = '<button class="delete">Delete</button>';
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);
	tr.appendChild(td5);
	tr.appendChild(td6);
	document.querySelector('#labels').appendChild(tr);
};

function saveLabels () {
	var name,regexp,position,color,enabled;
	var labels = {};
	var trs = document.querySelectorAll('tbody tr');

	for (var i=0,t=trs.length; i<t; i++) {
		name = trs[i].querySelector('input[name=name]');
		regexp = trs[i].querySelector('input[name=regexp]');
		position = trs[i].querySelector('select[name=position]');
		color = trs[i].querySelector('input[name=color]');
		enabled = trs[i].querySelector('input[name=enabled]');

		labels[i] = {
			'name': 	name.value,
 			'regexp': 	regexp.value,
			'position': position.value,
			'color': 	color.value,
 			'enabled': 	enabled.checked
		};
	};

	chrome.storage.sync.set({'labels': labels}, function() {
	    // Update status to let user know options were saved.
	    var message = document.querySelector('.message');
	    message.style.display = 'block';
	    setTimeout(function() {
			message.style.display = 'none';
	    }, 1200);
    });
};

function loadLabels () {
	chrome.storage.sync.get(null, function(data){
		for (var i in data.labels) {
			addLabel(data.labels[i]);
		};
	});
};

function delLabel (e) {
	var tr = e.target.parentNode.parentNode;
	tr.parentNode.removeChild(tr);
};

document.addEventListener('click', function (event) {
    if ( event.target.id === 'new' ) {
        addLabel(dummyLabel);
    }
    if ( event.target.id === 'save' ) {
        saveLabels();
    }
    if ( hasClass(event.target, 'delete') ) {
    	delLabel(event);
    }
});

loadLabels();