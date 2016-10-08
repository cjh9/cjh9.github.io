

var $ = function(v){
    return document.querySelector(v);
}

var streak = $('.streak');
var workout_time = $('.workout_time');
var rest_time = $('.rest_time');
var part = $('.part');
var today = $('#today');
var midpanel = $('.panel-mid');

var weight_label = $('.weight');
var exercise_label = $('.exercise');
var set_label = $('.set');

var increase_label = $('.inc');
var decrease_label = $('.dec');

$('body').addEventListener('touchmove', function(e) {
    e.preventDefault();
});


$('body').addEventListener('touchend', function(e) {
    e.preventDefault();
});


start_data = [
	{
		Benchpress:[90,2],
		Pulley_crunch:[90,4],
		Overhead_press:[90,4],
		Hanging_leg_raise:[90,4],
		Benchpress:[90,2],
		Front_raise:[90,4]
	},
	{
		Squat:[90,4],
		Oblique_twist:[90,4],
		Calf_raise:[90,4],
		Hamstrings_curls:[90,4],
		Deadlift:[90,4]
	},
	{
		Seated_pulley_row:[90,4],
		Lat_pulldown:[90,4],
		Triceps_pulldown:[90,2],
		Biceps_curl:[90,2],
		Triceps_pulldown:[90,2],
		Biceps_curl:[90,2]
	}
]

start_data = JSON.stringify(start_data)
var workoutDates = JSON.parse(localStorage.workoutDates || '[]');
var workoutData = JSON.parse(localStorage.workoutData || start_data);
var workoutIdx = workoutDates.length%3;
var exerciseIdx = 0;
var setIdx = 0;
var numExercises = Object.keys(workoutData[workoutIdx])


function current(){
	if(isFinised){
		return{exercise:"",weight:"",maxSet:""}
	}
	var currentExercise = Object.keys(workoutData[workoutIdx])[exerciseIdx];
	var exerciseObject = workoutData[workoutIdx][currentExercise]
	var currentWeight = exerciseObject[0];
	var currentMaxset = exerciseObject[1];

	return {
		exercise:currentExercise, 
		weight:currentWeight, 
		maxSet:currentMaxset,
		exerciseObject:exerciseObject
	}
}

increase_label.addEventListener('click', function(e) {
	var obj = current().exerciseObject;
	obj[0]+=1;
	localStorage.workoutData = JSON.stringify(workoutData);
	text();
});

decrease_label.addEventListener('click', function(e) {
	var obj = current().exerciseObject;
	obj[0] -=1;
	localStorage.workoutData = JSON.stringify(workoutData);
	text();
});

function incrementWorkout(){
	setIdx++;
	if(setIdx === current().maxSet){
		setIdx = 0;
		exerciseIdx++

		if(numExercises.length === exerciseIdx){
			isFinised = true;
			finish.play();
			updateWorkoutDates();
		}
	}
	text();
}
//Settings
var goTime = 5;
var workoutTimeCount = 0;

//Variable
var restTime = null;
var hasStarted = false;
var isResting = false;
var isGo = false;
var isFinised = false;
var isSoundOn = false;
var isAbs = false;

midpanel.addEventListener('click', function(e) {

	var X = e.pageX - this.offsetLeft
	var Y = e.pageY - this.offsetTop

	var width = this.offsetWidth;
	var height = this.offsetHeight

	if(! (isResting||isGo) ){
		if(Y<height/3){
			if(X<width/3){
				restTime = 5
			}
			if(X>=width/3 && X<2*width/3){
				restTime = 30
			}
			if(X>=2*width/3){
				restTime = 45
			}
		}

		if(Y>=height/3 && Y<2*height/3){
			if(X<width/3){
				restTime = 60
			}
			if(X>=width/3 && X<2*width/3){
				restTime = 85
			}
			if(X>=2*width/3){
				restTime = 90
			}
		}

		if(Y>2*height/3){
			if(X<width/3){
				restTime = 120
			}
			if(X>=width/3 && X<2*width/3){
				restTime = 150
			}
			if(X>=2*width/3){
				restTime = 180
			}
		}

		hasStarted = true;
		isResting = true;
		button.play();
		updateView();

		incrementWorkout();
	}
});



function isSameDate(d1,d2){
	return d1.getDate() == d2.getDate() && d1.getMonth() == d2.getMonth() && d1.getYear() == d2.getYear();
}


function formatedWorkoutTimeCount(){
	var add = "";
	if(workoutTimeCount<0){
		add += "+"
	}
	return add+Math.abs(workoutTimeCount/60 | 0) + ":" +  Math.abs(workoutTimeCount%60);
}

function colors(){
	if(isResting){
		document.body.style.background = "red";
	}
	else if(window.isGo){
		document.body.style.background = "green";
	}
	else{
		document.body.style.background = "black";
	}

	if(isAbs){
		document.body.style.background = "purple";
	}
	if(isFinised){
		document.body.style.background = "orange";
	}
	
}

function text(){
	//Ticks
	var time = isResting? restTime : restTime>-goTime? "Go" : '+' + Math.abs(restTime);
	rest_time.innerText = !hasStarted? "Start" : time;	
	workout_time.innerText = formatedWorkoutTimeCount();

	var day = new Date().getDay()
	var date = Math.floor(((new Date().getDate()-1)/7))
	streak.innerText = workoutDates.length;

	set_label.innerText = setIdx+1  + " / " + current().maxSet;
	exercise_label.innerText =  current().exercise.replace(/_/g, " ");
	weight_label.innerText = current().weight;

	if(isFinised){
		$('.weight-wrapper').style.display = "none";
		$('.exercise-wrapper').style.display = "none";
		increase_label.style.display = "none";
		decrease_label.style.display = "none";
	}
	
}



function updateView(){
	colors();
	text();
}
updateView();


function restingTick(){
	if(hasStarted){
		restTime--;
		if(restTime == 0){
			go.play();
			isResting = false;
			isGo = true;
		}
		if(restTime <=-goTime){
			isGo = false;
		}
	}
}

function updateWorkoutDates(){
	//Check if already added
	var filtered = workoutDates.filter(function(a){
		return isSameDate(new Date(a),new Date());
	})
	if(filtered.length === 0){
		workoutDates.push(new Date().toString());
	}
	localStorage.workoutDates = JSON.stringify(workoutDates);
}

function workoutTick(){
	if(hasStarted){
		workoutTimeCount++;
	}
}


setInterval(function(){
	restingTick();
	workoutTick()
	updateView();
},1000);


var button = new Howl({urls:['button.mp3']});
var go = new Howl({urls:['go.mp3']}); 
var finish = new Howl({urls:['finish.mp3']});  
var click = new Howl({urls:['click.wav']}); 
var beep = new Howl({urls:['beep.mp3']}); 








