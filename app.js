//
// UI logic
//

$(function() {
	var gender   = value("#gender");
	var age      = number("#age");
	var weight   = number("#weight-kg"); // TODO: Merge weightLbs
	var height   = number("#height-cm"); // TODO: Merge heightFt and heightIn
	var activity = number("#activity");
	var bodyfat  = number("#bodyfat");

	var mifflin = Bacon.combineWith(mifflinCalc,
		gender, weight, height, age, activity);
	var katch = Bacon.combineWith(katchCalc,
		weight, bodyfat, activity);

	mifflin.assign($("#mifflin"), "text");
	katch.assign($("#katch"), "text");
});

//
// Bacon helpers
//

function isNumeric(x) {
	return !isNaN(parseFloat(x)) && isFinite(x);
}

function value(e) {
	return $(e)
		.asEventStream("input")
		.map(".target.value")
		.toProperty($(e).val());
};

function number(e) {
	return value(e)
		.filter(isNumeric)
		.map(Number);
};

//
// TDEE calculation
//

function commonBMR(weight, height, age) {
	return (10 * weight) + (6.25 * height) - (5 * age);
}

function activityFactor(bmr, activity) {
	return (bmr * activity).toFixed(0);
}

function mifflinBmr(gender, weight, height, age, activity) {
	var diff = 0;
	if (gender === "M") {
		diff = +5;
	} else if (gender === "F") {
		diff = -161;
	} else {
		// Should not happen
		console.err("Invalid gender");
	}
	return commonBMR(weight, height, age) + diff;
}

function mifflinCalc(gender, weight, height, age, activity) {
	var bmr = mifflinBmr(gender, weight, height, age);
	return activityFactor(bmr, activity);
};

function katchCalc(weight, bodyfat, activity) {
	var leanMass = (weight * ((100 - bodyfat)/100));
	var bmr = 370 + 21.6 * leanMass;
	return activityFactor(bmr, activity);
}

//
// Old code wasteland
//

(function() { return;

	// TODO: Add these
	const KiloToPounds = 2.20462262;
	const InchesToCentimeters = 2.54;
	const FeetToInches = 12;
	function ft2in(feet) { return feet * 12; }
	function in2ft(inches) { return inches / 12; }
	function cm2in(cm) { return cm / 2.54; }
	function kg2lbs(kg) { return kg * KiloToPounds; }
	function lbs2kg(lbs) { return lbs / KiloToPounds; }

	function cm2ftin(cm) {
		var inches = (cm / InchesToCentimeters).toFixed(0);
		var feet = Math.floor(in2ft(inches));
		var remInches = inches % FeetToInches;
		return [feet, remInches];
	}

	function ftin2cm(feet, inches) {
		var inches = ft2in(feet) + inches;
		return inches * InchesToCentimeters;
	}

});
