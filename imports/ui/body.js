import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { AbstractCollection } from '../api/abstract_s.js';

import './body.html';
import './atTitle_html.html';

import './to-title-case.js'
import './functions.js'

Template.atTitle_html.replaces("atTitle");

if(!Meteor.user()) {
	Template.login_modal.onRendered( function() {
		// AccountsTemplates.setState('signUp');
		showModal();
	});
}

// Template.body.onCreated(function bodyOnCreated() {
// 	this.subscribe('absPrintOut');
// });

Template.user_dropdown.helpers({
	currentUserEmail: function() {
		const userEmail = Meteor.user().emails[0].address;
		return userEmail;
	},
});
Template.user_dropdown.events({
	
	'click #log_out': function(event) {
	event.preventDefault();
	AccountsTemplates.logout();
	},

});


Template.user_form.onRendered(function() {
	// if no user logged in, show modal of register info
	if ($('#signUpModal').length) {
		$('#signUpModal').modal('show');
	}

	// dataR is data from Router
	var dataR = this.data;
	console.log(dataR);
	// Title
	$('.js-abs_title').val( dataR.title );
	// Author
		// add author if more than 2
	for (var i=0; i<dataR.authors.length-2; i++) {
		$('.js-add_author').click();
	}
		// fill-in author names
	var authNameIndex = 0
	$('.js-auth').each(function() {
		if (dataR.authors[authNameIndex]) {
			$(this).val( dataR.authors[authNameIndex] );
		}
		// add afffiliation if more than 1
		// affilSuperscript: affilOfAuthor, // [ [1], [2, 3], [1, 2, 3] ]
		console.log(dataR.affilSuperscript);
		if(dataR.affilSuperscript[authNameIndex] && dataR.affilSuperscript[authNameIndex].length > 1) {
			for (var i=0; i<dataR.affilSuperscript[authNameIndex].length-1; i++) {
				$(this).siblings('.js-add_affil').click();
			}
		}
		authNameIndex += 1;
	});
		// transform [ [1], [2, 3], [1, 2, 3] ] => [1, 2, 3, 1, 2, 3]
	var affilS = dataR.affilSuperscript;
	var affilSArray = [];
	for (var i in affilS) {
		for (var j in affilS[i]) {
			affilSArray.push(affilS[i][j]);
		}
	}
	console.log('affilSArray: '+ affilSArray);
		// fill-in affiliations
	var affilNameIndex = 0
	$('.js-affil').each(function() {
		if (affilSArray[affilNameIndex]) {
			$(this).val( dataR.affiliations[affilSArray[affilNameIndex] -1] );
		}
		affilNameIndex += 1;
	});
	// Keywords
	$('.js-keywords').val( dataR.keywords );
	// Content
	$('.js-abs_content').val( dataR.absContent );
	$('body,html').scrollTop(0);
	// check if overflown
	setTimeout(function () {
		if ($('#abs_print').overflown()) {
			$('#overflown-warning').fadeIn();
			$('#hidden-next').addClass('disabled');
			$('#hidden-next a').attr("href", "#");
		} else {
			$('#overflown-warning').fadeOut();
			$('#hidden-next').removeClass('disabled');
			$('#hidden-next a').attr("href", "submit-complete");
		}
	}, 100);
});
Template.user_form.onDestroyed(function() {
	if ($('#signUpModal').length) {
		$('#signUpModal').modal('hide');
		$('.modal-backdrop').fadeOut(400, function(){
			$(this).remove();
		});
	}
});

Template.print_out.helpers({

	abs_printout: function() {
		// Meteor.subscribe('absPrintOut');
		console.log("abs collection: " + AbstractCollection.find().count());
		return AbstractCollection.find();
	},

	// the following two helpers take data from database and process them into proper format
	authAffilForm: function(){
		var text_authAffil = "";
		if (this.authors.length && this.affilSuperscript && this.useSuperscriptIndic !== undefined) {
			if (this.useSuperscriptIndic == true) {  // superscript is needed
				text_authAffil += "<u>" + this.authors[0]+"</u><sup>"+this.affilSuperscript[0].sort()+"</sup>, ";
				if (this.authors.length >= 2) {
					for ( var i=2; i<this.authors.length; i++ ) {
						text_authAffil += this.authors[i]+"<sup>"+this.affilSuperscript[i].sort()+"</sup>, ";
					}
					text_authAffil = text_authAffil.slice(0, -2) + " and " + this.authors[1]+"*<sup>,"+this.affilSuperscript[1].sort()+"</sup>, ";
				}
			} else {  // supercript is not needed
				text_authAffil += "<u>" + this.authors[0]+"</u>, ";
				if (this.authors.length >= 2) {
					for ( var i=2; i<this.authors.length; i++ ) {
						text_authAffil += this.authors[i]+", ";
					}
					text_authAffil = text_authAffil.slice(0, -2) + " and " + this.authors[1] + "*, ";
				}
			}
		}
		return text_authAffil.slice(0, -2);
	},
	affilForm: function(){
		text_affil = "";
		if (this.affiliations && this.useSuperscriptIndic !== undefined) {
			for ( var i=0; i<this.affiliations.length; i++ ) {
				if (this.useSuperscriptIndic == true) {
					text_affil += "<sup>"+(i+1)+"</sup>"+this.affiliations[i]+"<br />";
				} else {
					text_affil += this.affiliations[i]+"<br />";
				}

			}
		}
		
		// test = this.affiliations;
		// test2 = this.authAffilForm;

		// if (this.affiliations && this.affiliations.length == 1) {
		// 	text_affil = this.affiliations[0];
		// } 
		// if (this.affiliations && this.affiliations.length > 1) {
		// 	if (this.authors.length == 1) {
		// 		for ( i=0; i<this.affiliations.length; i++ ) {
		// 			text_affil += this.affiliations[i]+"<br />";	
		// 		}				
		// 	}
		// 	if (this.affiliations && this.authors.length > 1) {
		// 		function allSameAffils() {
		// 			console.log(this.affilSuperscript + "          !!!");
		// 			console.log('allSameAffils func outter');
		// 			if (this.affilSuperscript) {
		// 				console.log('allSameAffils func inner');
		// 				for ( i=0; i<this.affilSuperscript.length-1; i++ ) {
		// 					var one = this.affilSuperscript[i].slice(0).sort();
		// 					var two = this.affilSuperscript[i+1].slice(0).sort();
		// 					for ( j=0; j<one.length; j++ ) {
		//     					if (one[j] !== two[j]) {
		//     						return false;
		//     					} else {
		//     						return true;
		//     					}
		//  					}
		// 				}
		// 			}
		// 		}
		// 		if (this.affilSuperscript) {
		// 			if (allSameAffils()) {
		// 				for ( i=0; i<this.affiliations.length; i++ ) {
		// 					text_affil += this.affiliations[i]+"<br />";	
		// 				}	
		// 			}
		// 			else {
		// 				for ( i=0; i<this.affiliations.length; i++ ) {
		// 					text_affil += "<sup>"+(i+1)+"</sup>"+this.affiliations[i]+"<br />";		
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		return text_affil;
	},
});

var authorNumber = 2;
Template.user_form.events({

	'click .js-add_author': function (event){
		$(event.target).parent().before( "<p><span class='form_bullet'>Author:</span> <input class='js-auth js-hide-next' type='text' name='author_"+authorNumber+"'/> <span class='form_indent'>Affiliation:</span> <textarea class='text-affil js-affil js-hide-next' name='author_aff_"+authorNumber+"_1'/></textarea> <button type='button' class='js-add_affil btn btn-add_affil'>Add Affiliation</button></p>" );				
		authorNumber += 1;
		$(event.target).parent().prev().find($("input"))[0].focus();
	},

	'click .js-add_affil': function(event){			
		var test = $(event.target).prev().attr('name').split("_");
		var prefix = "";
		for ( var i=0; i<test.length-1; i++ ) {
			prefix += test[i]+"_";
		}
		var postNumber = Number(test[test.length-1]) + 1;
		$(event.target).before("<span class='form_indent'>Affiliation:</span> <textarea class='text-affil js-affil js-hide-next' name='"+prefix+postNumber+"'/></textarea>");
		$(event.target).prev().focus();
	},
	
	'click .js-preview': function(){
		$('form').submit();
	},
	'focus .js-hide-next': function(){
		$('#hidden-next').fadeOut('fast');
	},

	'submit form': function(event){
		event.preventDefault();

		$('#hidden-next').fadeIn('fast').css("display","inline-block").delay(600, 'fx').queue('fx', function (next){
			$('html, body').animate({
        		scrollTop: $("#abs_print").offset().top
    		}, 750);
    		next();
		});

		var animateWidth = $('#submit-wrapper').width();
		$('#submit-animate').animate({
			width: animateWidth+"px",
			height: animateWidth+"px",
			// top: "-74px", 
			top: -19-(0.5*animateWidth)+"px",
			opacity: "1",
		}, 400, function () {
			$(this).animate({
				width: 0.7*animateWidth+"px",
				height: 0.7*animateWidth+"px",
				// top: "-59px",
				top: -19-(0.35*animateWidth)+"px",
				opacity: "0",
			}, 120, function () {
				$(this).delay(600, 'fx').queue('fx', function (next){
					$(this).css({"width": "10px", "height": "10px", "top": "-24px",});
					next();
				});
			});
		});

		// check if the content is over one page
		if ( $(window).width() > 480) {
			var waitTime = 1350;
		} else {
			var waitTime = 100;
		}
		setTimeout(function () {
			if ($('#abs_print').overflown()) {
				$('#overflown-warning').fadeIn();
				$('#hidden-next').addClass('disabled');
				$('#hidden-next a').attr("href", "#");
			} else {
				$('#overflown-warning').fadeOut();
				$('#hidden-next').removeClass('disabled');
				$('#hidden-next a').attr("href", "submit-complete");
			}
		}, waitTime);


		// TITLE
		if (jQuery.trim(event.target.abs_title.value) === "") {
			var absTitle = 'Unknown Title';
		} else {
			var absTitle = jQuery.trim(event.target.abs_title.value).toTitleCase();
		}
		event.target.abs_title.value = absTitle;
		
		var authorNames = []; // Array: list of author names
		var affilNames = []; // Array: lis of affiliations
		var affilOfAuthor = [[1],]; // Array: list of affiliation superscripts for authors
		
		var absContent = $(".js-abs_content").val();
		var keyWords = "";

		// return false if empty or whitespace only
		function valiNotEmpty (text) {
			return /\S/.test(text);
		};

		// AUTHOR NAMES
		var affilArray = []; // helper array: raw affiliations
		var affilAuthorRefArray = []; // helper array: each index in affilArray belongs to which author
		$('.js-auth').each(function() {
			// withValue: indicates whether this author has affiliations
			var withValue = 0
			var authorNum = Number($(this).attr("name").split("_")[1]);
			$(this).siblings('.js-affil').each(function() {
				if (valiNotEmpty($(this).val())) {
					affilArray.push(jQuery.trim($(this).val()));
					affilAuthorRefArray.push(authorNum);
					withValue += 1;
				}
			});

			if (valiNotEmpty($(this).val())) {
				authorNames.push(jQuery.trim($(this).val()));
				if (!withValue) {
					affilArray.push('Unknown Affiliation');
					affilAuthorRefArray.push(authorNum);
					$($(this).siblings('.js-affil')[0]).val( 'Unknown Affiliation' );
				}
			} else {
				if (withValue) {
					authorNames.push('Unknown Author');
					$(this).val( 'Unknown Author' );
				}
			}

		});
		console.log(authorNames);
		console.log(affilArray);
		console.log(affilAuthorRefArray);
		// AFFILNAMES, AFFIL OF AUTHOR
		// var affilArray = []; // helper array: raw affiliations
		// var affilAuthorRefArray = []; // helper array: each index in affilArray belongs to which author
		// $('.js-affil').each(function() {
		// 	if (valiNotEmpty($(this).val())) { // if not empty or whitespace only string
		// 		var affilValue = jQuery.trim($(this).val());
		// 		var affilAuthorRef = Number($(this).attr("name").split("_")[2]);
		// 		affilArray.push(affilValue);
		// 		affilAuthorRefArray.push(affilAuthorRef);
		// 	}
		// });

		// WHETHER the value in affilArray are unique or not
		var affilNumArray = [ 1, ] // helper array: assign numbers to the values in the affilArray
		if (affilArray.length) {
		affilNames.push(affilArray[0]);
		}
		for ( var i=1; i<affilArray.length; i++ ) {
			var currentAffil = affilArray[i];
			var beforeCurrentAffilArray = affilArray.slice(0, i);
			// check if an affiliation already exist. 
			// if not, will return -1; if already exists, return the index of that in affilArray
			var alreadyExist = jQuery.inArray( currentAffil, beforeCurrentAffilArray, 0 );
			if ( alreadyExist == -1 ) {
				affilNumArray.push( Math.max.apply(Math,affilNumArray) + 1 );
				affilNames.push(currentAffil); // push unique affiliation name into affilNames
			} else {
				// var sameAs = affilNumArray[ affilArray.length - alreadyExist - 1 ];
				affilNumArray.push(affilNumArray[alreadyExist]);
			}
		}

		// WHICH affiliations belongs to which author
		for ( var i=1; i<affilAuthorRefArray.length; i++ ) {
			if ( affilAuthorRefArray[i]-affilAuthorRefArray[i-1] !== 0 ) {
				affilOfAuthor.push([]);
			} 
			affilOfAuthor[affilOfAuthor.length - 1].push(affilNumArray[i]);
		}
		console.log(affilNumArray);
		console.log(affilOfAuthor);

		// a boolean to indicate whether superscrips are needed
		function useSuperscript(listOfList, uniqueAffilList) {
			if (listOfList && uniqueAffilList) {
				if (uniqueAffilList.length == 1 || listOfList.length == 1) { return false; } 
				else {
					for ( var i=0; i<listOfList.length-1; i++ ) {
						var one = listOfList[i].slice(0).sort();
						var two = listOfList[i+1].slice(0).sort();
						if (one.length !== two.length) { return true; }
						else {
							for ( var j=0; j<one.length; j++ ) {
		    					if (one[j] !== two[j]) { return true; }
		 					}
		 					return false;
						}
							
					}
				}
			}
		}
		var useSuperscriptIndic = useSuperscript(affilOfAuthor, affilNames);
		console.log('useSuperscriptIndic: '+useSuperscriptIndic);

		//KEYWORDS
		var keyWordsArray = $(".js-keywords").val().split(",");
		for ( var i=0; i<keyWordsArray.length; i++ ) {
			if (/\S/.test(keyWordsArray[i])) {
				keyWords += jQuery.trim(keyWordsArray[i]) + ", ";
			}
		}

		//CONTNET
		var absContentMD = parseMarkdown( absContent );



		// var userID = event.target.temp_id.value;
		// var absTitle = event.target.abs_title.value;
		// var firstAuthor = event.target.author_1.value;
		// var corresAuthor = event.target.author_99.value;


		// var exampleMarkdownString = "We're using [Markdown](http://daringfireball.net/projects/markdown/)!";
		var currentUserId = Meteor.userId();

		Meteor.call('abs_collection.preview', absTitle, authorNames, affilNames, affilOfAuthor, useSuperscriptIndic, keyWords, absContent, absContentMD);

		// if (AbstractCollection.find({'userID': userID}).count()) {
		// AbstractCollection.update(
		// 	{ _id: currentUserId},
		// 	{ 
		// 		$set: {
		// 		title: absTitle,
		// 		authors: authorNames, // [authA, authB, authC
		// 		affiliations: affilNames, // [affilX, affilY, affilZ]
		// 		affilSuperscript: affilOfAuthor, // [ [1], [2, 3], [1, 2, 3] ]
		// 		keywords: keyWords.slice(0, -2), // "kw1, kw2, kw3, "
		// 		absContent: absContent,
		// 		absContentMD: absContentMD,

		// 		createdAt: new Date(),
		// 		email: Meteor.user().email,
		// 		presenter: authorNames[0],
		// 		preAffil: affilNames[0],
		// 		}
		// 	},
		// 	{ upsert: true }
		// );

					// var dbArray = AbstractCollection.find().fetch()
					// toExcelArray = []
					// for (i in dbArray) {
					// 	toExcelArray.push(["title", dbArray[i].title]);
					// 	var authOutput = ["authors", ]
					// 	for (j in dbArray[i].authors) {
					// 		authOutput.push(dbArray[i].authors[j]);
					// 		authOutput.push(dbArray[i].affilSuperscript[j]);
					// 	}
					// 	toExcelArray.push(authOutput);
					// 	toExcelArray.push(["affiliations"].concat(dbArray[i].affiliations));
					// 	toExcelArray.push(["keywords", dbArray[i].keywords]);

					// }

					// var csv = Papa.unparse(toExcelArray); // items is in JSON format, use Papa to convert JSON to CSV
					// // window.open(encodeURI('data:text/csv;charset=utf-8,' + csv));

					// var link = window.document.createElement("a");

					// link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv));
					// link.setAttribute("download", "export_invoices_" + "fileName" + ".csv");
					// link.click();
			return false;
		},
});

