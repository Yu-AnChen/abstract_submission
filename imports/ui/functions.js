// show sign up form
showModal = function() {
	var modal = $('#signUpModal').modal('show');
	$(modal).fadeIn( 800 );
};
hideModal = function() {
var modal = $('#signUpModal').modal('hide');
};

// check overflow on jQuery selector
$.fn.overflown = function () {
	var e = this[0];
	return e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth;
};

