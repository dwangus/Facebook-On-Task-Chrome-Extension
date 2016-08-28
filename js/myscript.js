var activated = true;
var inst;

chrome.runtime.sendMessage({amActivated: "fbOnTask"}, function(response) {
	activated = response.bool;//I'm not sure if this is asynchronous or not -- but I'm banking that the sendMessage() function returns before the html-document is ready
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	activated = message.bool;
	if (!activated) {
		inst.close();
	}
});

function initiatePrompt() {
	$.get(chrome.extension.getURL('templates/prompt.html'), function(htmlFile) {
		var myPrompt = $.parseHTML(htmlFile);
		$(myPrompt).appendTo('body');
		$('#fbOnTask').css("width", "675px");//I do the width resizing here
		inst = $('[id=fbOnTask][data-remodal-id=modal]').remodal({hashTracking: false});
		inst.open();
	
		var searchTrigger = $('#search_fbOnTask').bind('click', searchHandler);
		function searchHandler(e) {
			e.preventDefault();
			$('#intro_fbOnTask').html("<b>Search for a...?</b>");
			$("#initial_fbOnTask").css("display", "none");
			$("#searchPrompt_fbOnTask").css("display", "initial");
			//$('#fbOnTask').attr("style", "width:250px");//510x300
		}
		var searchBox = $('#searchSubmit_fbOnTask').bind('click', searchBoxHandler);
		function searchBoxHandler(e) {
			e.preventDefault();
			var searchText = $('#searchText_fbOnTask').val();
			var category = $('input[name=query_fbOnTask]:checked', '#searchCategory_fbOnTask').val();
			if (searchText) {
				var query = "search/" + category + "/?q=" + searchText;
				$("#searchInputBox_fbOnTask").addClass("has-success");
				inst.close();
				var newURL = window.location.href + query;
				window.location.href = newURL;
			} else {
				$("#searchInputBox_fbOnTask").addClass("has-error");
			}
		}
		document.getElementById('searchText_fbOnTask').onkeypress = function(e){
			if (!e) e = window.event;
			var keyCode = e.keyCode || e.which;
			if (keyCode == '13'){
				searchBoxHandler(e);
				return false;
			}
		}
		
		var chatTrigger = $('#chat_fbOnTask').bind('click', chatHandler);
		function chatHandler(e) {
			e.preventDefault();
			$('#intro_fbOnTask').html("<b>Person/group to chat up:</b>");
			$("#initial_fbOnTask").css("display", "none");
			$("#chatPrompt_fbOnTask").css("display", "initial");
			//$('#fbOnTask').attr("style", "width:250px");//510x270
		}
		var chatBox = $('#chatSubmit_fbOnTask').bind('click', chatBoxHandler);
		function chatBoxHandler(e) {
			e.preventDefault();
			var chatText = $('#chatText_fbOnTask').val();
			if (chatText) {
				$("#chatInputBox_fbOnTask").addClass("has-success");
				inst.close();
				if (!(document.querySelectorAll('[data-tooltip-content="New Message"]')[0])) {//Write a new message button
					alert("Couldn't find chat search-box...");
				} else {
					document.querySelectorAll('[data-tooltip-content="New Message"]')[0].focus();
					document.querySelectorAll('[data-tooltip-content="New Message"]')[0].click();
					
					var checkExist = setInterval(function() {
						if ($("input.inputtext.textInput").length) {//This seems to be the "catch-all" case
							$("input.inputtext.textInput").val(chatText);
							$("input.inputtext.textInput").focus();
							$("input.inputtext.textInput").attr("style", "");
							clearInterval(checkExist);
						}
					}, 100);
				}
			} else {
				$("#chatInputBox_fbOnTask").addClass("has-error");
			}
		}
		document.getElementById('chatText_fbOnTask').onkeypress = function(e){
			if (!e) e = window.event;
			var keyCode = e.keyCode || e.which;
			if (keyCode == '13'){
				chatBoxHandler(e);
				return false;
			}
		}
		
		var notifTrigger = $('#notifications_fbOnTask').bind('click', notifHandler);
		function notifHandler(e) {
			e.preventDefault();
			$('#intro_fbOnTask').html("<b>What are you trying to see?</b>");
			$("#initial_fbOnTask").css("display", "none");
			$("#notificationsPrompt_fbOnTask").css("display", "initial");
			//$('#fbOnTask').attr("style", "width:250px");//510x250
		}
		var notifBox = $('#notificationsSubmit_fbOnTask').bind('click', notifBoxHandler);
		function notifBoxHandler(e) {
			e.preventDefault();
			var notifCategory = $('input[name=notifs_fbOnTask]:checked', '#notificationsCategory_fbOnTask').val();
			inst.close();
			var newURL = window.location.href + notifCategory;
			window.location.href = newURL;
		}
		
		var statusTrigger = $('#status_fbOnTask').bind('click', statusHandler);
		function statusHandler(e) {
			e.preventDefault();
			inst.close();
			var str = "div#feedx_container";
			if ($(str).exists()) {
				document.getElementById("feedx_container").click();//Apparently jQuery just doesn't always work with Facebook's front-end
			} else if ($("div:contains('on your mind?')").exists()) {
				$("div:contains('on your mind?')").trigger('click');//For older versions of fb
			}
		}
		
		var bdayTrigger = $('#birthday_fbOnTask').bind('click', birthdayHandler);
		function birthdayHandler(e) {
			e.preventDefault();
			inst.close();
			if ($('a[ajaxify="/birthday/reminder/dialog/"]').exists()) {//Seems to be the catch-all case
				document.querySelectorAll('[ajaxify="/birthday/reminder/dialog/"]')[0].click();
			} else {
				alert("It's no one's birthday!");
			}
		}
	});
}

$(document).ready(function() {
	$.fn.exists = function () {
		return this.length !== 0;
	}
	
	if ($('*:contains("Home")').exists() && activated) {//Check if user is logged in by telling if there's a "Home" button present, essentially
		initiatePrompt();
	}
});