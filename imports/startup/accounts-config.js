// THIS MIGHT NOT BE NEEDED!!!!


// import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import '../ui/functions.js'
// Accounts.ui.config({
//   passwordSignupFields: 'EMAIL_ONLY',
// });

var userOnCreateFunc = function(error, state) {
	if(!error) {
		Meteor.call('abs_collection.submit', 'absTitle', ['authorNames'], ['affilNames'], [[1]], 'keyWords', 'absContentMD');
	}
};
var userOnSubmitFunc = function(error, state) {
	if(!error) {
		if(state === 'signIn') {
			hideModal();
		}
		if(state === 'signUp') {
			Meteor.call('abs_collection.submit', 'TITLE FROM SERVER', ['authorNames'], ['affilNames'], [[1]], 'keyWords', 'absContentMD');
			hideModal();

		}
		
	}
};

AccountsTemplates.configure({
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