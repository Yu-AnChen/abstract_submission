import { Template } from 'meteor/templating';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import './at_form_ttba_2016.html';

Template.atFormTtba2016.replaces("atForm");

Template.atFormPagination.events({
	'click #at_form_submit_alt': function(event){
		// $('#at-btn').click();
		event.preventDefault();
		console.log("NEXT clicked");
		$('#at-btn').submit();
	},
});

Template.atFormPagination.helpers(AccountsTemplates.atPwdFormBtnHelpers);

