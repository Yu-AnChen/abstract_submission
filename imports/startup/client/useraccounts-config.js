import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import '/imports/ui/functions.js'

// var userOnCreateFunc = function(error, state) {
// 	if(!error) {
// 		Meteor.call('abs_collection.submit', 'The Title, Ideally in Title Case.', ['Firstname Lastname', 'Christopher Nolan'], ['Department of Biophysics, University of Texas Southwestern Medical Center, Dallas, TX', 'Department of Radiology, University of Texas Southwestern Medical Center, Dallas, TX'], [[1][1,2]], 'keyword, seperate, by, comma', 'absContentMD');
// 	}
// };
var contentStartup = "### Please read on before you delete the following and paste in your abstract.\n\nIf the bottom part of your abstract doesn't show up, that indicates the content is _too long_. Please trim it. While we are very open to the format, it must be single page print out.\n\nFor multiple paragraphs, place an empty line between every paragraph. So that they will be separated nicely.\n\nMarkdown runs in this box. _Italic text_ and **bold text** are made possible.";



var userOnSubmitFunc = function(error, state) {
	if(!error) {
		if(state === 'signIn') {
			hideModal();
		}
		if(state === 'signUp') {
			Meteor.call('abs_collection.preview', 'The Title, Ideally in Title Case.', ['Firstname Lastname', 'Christopher Nolan'], ['Department of Biophysics, University of Texas Southwestern Medical Center, Dallas, TX', 'Department of Radiology, University of Texas Southwestern Medical Center, Dallas, TX'], [[1], [1,2]], true, 'keyword, seperate, by, comma, ', contentStartup, parseMarkdown(contentStartup));
			hideModal();

		}
		
	}
};

AccountsTemplates.configure({
	defaultLayout: 'main',
	defaultState: "signUp",
	enablePasswordChange: true,
	overrideLoginErrors: false,

	showForgotPasswordLink: true,
	
	// Client-side Validation (did not listen to mouse click event!)
	continuousValidation: true,
	negativeValidation: true,
	positiveValidation: true,
	positiveFeedback: true,

	texts: {
    	button: {
        	signUp: "Sign Up and Continue"
        },
    	title: {
    		signUp: "Please Sign Up<span>So we can securely deliver your contents</span>",
    		signIn: "Sign In<span>Update your abstract before September 30th</span>",
    	},
    },
    
    onSubmitHook: userOnSubmitFunc,
    // postSignUpHook: userOnCreateFunc,

});


AccountsTemplates.configureRoute('changePwd');

AccountsTemplates.addField({
    _id: 'Affiliation',
    type: 'text',
    required: true,
    displayName: 'Affiliation',
    placeholder: {
        signUp: "Primary Affiliation"
    },
    errStr: 'Affiliation is required. N/A if not applicable.',
});