var activatedHome = true;
var instHome;
$.fn.exists = function () {
	return this.length !== 0;
}
chrome.runtime.sendMessage({amActivated: "fbOnTask"}, function(response) {
	activatedHome = response.bool;//I'm not sure if this is asynchronous or not -- but I'm banking that the sendMessage() function returns before the html-document is ready
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	activated = message.bool;
	if (instHome && !activated) {
		instHome.close();
		$( "a:contains('Home')" ).unbind('click', homePrompt);
	} else if (!activated) {
		$( "a:contains('Home')" ).unbind('click', homePrompt);
	} else {
		$( "a:contains('Home')" ).click(homePrompt);
	}
});

function homePrompt() {
	instHome = $('[id=fbOnTask_Home][data-remodal-id=modal]').remodal({hashTracking: false});
	instHome.open();
	
	$('#intro_fbOnTask_Home').html("<b>What did you come here to do?</b>");
	$("#initial_fbOnTask_Home").css("display", "initial");
	$("#searchPrompt_fbOnTask_Home").css("display", "none");
	$("#chatPrompt_fbOnTask_Home").css("display", "none");
	$("#notificationsPrompt_fbOnTask_Home").css("display", "none");
	$("#searchText_fbOnTask_Home").val("");
	$("#chatText_fbOnTask_Home").val("");
	$("#searchInputBox_fbOnTask_Home").removeClass("has-error has-success");
	$("#chatInputBox_fbOnTask_Home").removeClass("has-error has-success");

	var searchTrigger = $('#search_fbOnTask_Home').bind('click', searchHandler);
	function searchHandler(e) {
		e.preventDefault();
		$('#intro_fbOnTask_Home').html("<b>Search for a...?</b>");
		$("#initial_fbOnTask_Home").css("display", "none");
		$("#searchPrompt_fbOnTask_Home").css("display", "initial");
		//$('#fbOnTask').attr("style", "width:250px");//510x300
	}
	var searchBox = $('#searchSubmit_fbOnTask_Home').bind('click', searchBoxHandler);
	function searchBoxHandler(e) {
		e.preventDefault();
		var searchText = $('#searchText_fbOnTask_Home').val();
		var category = $('input[name=query_fbOnTask_Home]:checked', '#searchCategory_fbOnTask_Home').val();
		if (searchText) {
			var query = "search/" + category + "/?q=" + searchText;
			$("#searchInputBox_fbOnTask_Home").addClass("has-success");
			instHome.close();
			var newURL = window.location.href + query;
			window.location.href = newURL;
		} else {
			$("#searchInputBox_fbOnTask_Home").addClass("has-error");
		}
	}
	document.getElementById('searchText_fbOnTask_Home').onkeypress = function(e){
		if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode == '13'){
			searchBoxHandler(e);
			return false;
		}
	}
	
	var chatTrigger = $('#chat_fbOnTask_Home').bind('click', chatHandler);
	function chatHandler(e) {
		e.preventDefault();
		$('#intro_fbOnTask_Home').html("<b>Person/group to chat up:</b>");
		$("#initial_fbOnTask_Home").css("display", "none");
		$("#chatPrompt_fbOnTask_Home").css("display", "initial");
		//$('#fbOnTask').attr("style", "width:250px");//510x270
	}
	var chatBox = $('#chatSubmit_fbOnTask_Home').bind('click', chatBoxHandler);
	function chatBoxHandler(e) {
		e.preventDefault();
		var chatText = $('#chatText_fbOnTask_Home').val();
		if (chatText) {
			$("#chatInputBox_fbOnTask_Home").addClass("has-success");
			instHome.close();
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
			$("#chatInputBox_fbOnTask_Home").addClass("has-error");
		}
	}
	document.getElementById('chatText_fbOnTask_Home').onkeypress = function(e){
		if (!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode == '13'){
			chatBoxHandler(e);
			return false;
		}
	}
	
	var notifTrigger = $('#notifications_fbOnTask_Home').bind('click', notifHandler);
	function notifHandler(e) {
		e.preventDefault();
		$('#intro_fbOnTask_Home').html("<b>What are you trying to see?</b>");
		$("#initial_fbOnTask_Home").css("display", "none");
		$("#notificationsPrompt_fbOnTask_Home").css("display", "initial");
		//$('#fbOnTask').attr("style", "width:250px");//510x250
	}
	var notifBox = $('#notificationsSubmit_fbOnTask_Home').bind('click', notifBoxHandler);
	function notifBoxHandler(e) {
		e.preventDefault();
		var notifCategory = $('input[name=notifs_fbOnTask_Home]:checked', '#notificationsCategory_fbOnTask_Home').val();
		instHome.close();
		var newURL = window.location.href + notifCategory;
		window.location.href = newURL;
	}
	
	var statusTrigger = $('#status_fbOnTask_Home').bind('click', statusHandler);
	function statusHandler(e) {
		e.preventDefault();
		instHome.close();
		var str = "div#feedx_container";
		if ($(str).exists()) {
			document.getElementById("feedx_container").click();//Apparently jQuery just doesn't always work with Facebook's front-end
		} else if ($("div:contains('on your mind?')").exists()) {
			$("div:contains('on your mind?')").trigger('click');//For older versions of fb
		}
	}
	
	var bdayTrigger = $('#birthday_fbOnTask_Home').bind('click', birthdayHandler);
	function birthdayHandler(e) {
		e.preventDefault();
		instHome.close();
		if ($('a[ajaxify="/birthday/reminder/dialog/"]').exists()) {//Seems to be the catch-all case
			document.querySelectorAll('[ajaxify="/birthday/reminder/dialog/"]')[0].click();
		} else {
			alert("It's no one's birthday!");
		}
	}
}

$(document).ready(function() {
	$.fn.exists = function () {
		return this.length !== 0;
	}
	
	if ($('*:contains("Home")').exists()) {//Check if user is logged in by telling if there's a "Home" button present, essentially
		$.get(chrome.extension.getURL('templates/homePrompt.html'), function(htmlFile) {
			var myHomePrompt = $.parseHTML(htmlFile);
			$(myHomePrompt).appendTo('body');
			$('#fbOnTask_Home').css("width", "675px");//I do the width resizing here
			if (activatedHome) {
				$( "a:contains('Home')" ).click(homePrompt);//When user presses 'Home' button
			}
		});
	}
	
});