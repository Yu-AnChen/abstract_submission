import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import { AbstractCollection } from '../../api/abstract_s.js';

import '../../ui/pages/abs_root.html';
import '../../ui/at_form_ttba_2016.js';


Router.configure({
    layoutTemplate: 'main'
});

var titleCommon = "Abstract Submission | TTBA Symposium 2016";
Router.route('/', {
	name: 'abs_root',
	template: 'abs_root',
    title: '1. Guide | ' + titleCommon,
    // onAfterAction: function () { document.title = '1. Guide | ' + titleCommon; }
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/sign-in',
    template: 'accounts_form',
    // layoutTemplate: 'myLayout',
    redirect: '/submit-form',
    title: '2. Sign In | ' + titleCommon,
    // onAfterAction: function () { document.title = '2. Sign In | ' + titleCommon; }
});
AccountsTemplates.configureRoute('signUp', {
    name: 'signup',
    path: '/sign-up',
    template: 'accounts_form',
    // layoutTemplate: 'myLayout',
    redirect: '/submit-form',
    title: '2. Sign Up | ' + titleCommon,
    // onAfterAction: function () { document.title = '2. Sign Up | ' + titleCommon; }

});
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd', {redirect: '/submit-form'});
AccountsTemplates.configureRoute('resendVerificationEmail');

Router.route('/submit-form', {
	name: 'abs_submit_form',
	template: 'user_form',
	waitOn: function () {
		return Meteor.subscribe('absPrintOut');
	},
	data: function() {
		var currentUser = Meteor.userId();
		console.log("inside router data");
		return AbstractCollection.findOne( {_id: currentUser} );
	},
	action: function () {
	// 	console.log(AbstractCollection.find().count()+ " router");
		this.render('user_form');
	},
    title: '3. Submit Form | ' + titleCommon,
    // onAfterAction: function () { document.title = '3. Submit Form | ' + titleCommon; }
});

Router.route('/submit-complete', {
    name: 'confirm_print',
    template: 'confirm_print',
    waitOn: function () {
        return Meteor.subscribe('absPrintOut');
    },
    data: function() {
        var currentUser = Meteor.userId();
        console.log("inside router data");
        return AbstractCollection.findOne( {_id: currentUser} );
    },
    title: '4. Submit Completed | ' + titleCommon,
    // onAfterAction: function () { document.title = '4. Submit Completed | ' + titleCommon; }
});

var ABS_SUBMIT_BeforeHooks = {
    submitFlag: function() {
        console.log('ONBEFOREACTION');
        completeSubmit = true
        Meteor.call('abs_collection.submit', true);
        this.next();
    },
    scrollUp: function() {
        $('body,html').scrollTop(0);
        this.next();
    },
}
// function myHook () {
//     console.log('ONBEFOREACTION');
//     completeSubmit = true
//     Meteor.call('abs_collection.submit', true);
//     this.next();
// }
Router.onBeforeAction(ABS_SUBMIT_BeforeHooks.scrollUp);
Router.onBeforeAction(ABS_SUBMIT_BeforeHooks.submitFlag, { only: ['confirm_print'] });

Router.route('/templateName', {
    waitOn: function () {
        return Meteor.subscribe('collectionName');
    },
    action: function () {
        // render all templates and regions for this route
        this.render();
    }
});


