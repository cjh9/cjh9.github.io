

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



start_data = [
	[
		["Benchpress",85,2],
		["Pulley crunch",90,4],
		["Overhead press",45,4],
		["Hanging leg raise",15,4],
		["Benchpress",85,2],
		["Front raise",12,4],
		["Rear Cable",12,4]
	], //5
	[
		["Squat", 80, 4],
		["Calf raise", 80, 4],
		["Hamstrings curls", 40, 4],
		["Deadlift", 90, 4],
	], //4
	[

		["Seated pulley row", 45, 4],
		["Lat pulldown", 70, 4],
		["Triceps pulldown", 35, 2],
		["Biceps curl", 40, 2],
		["Triceps pulldown", 35, 2],
		["Biceps curl", 40, 2],
	] //4
]



// start_dates = [new Date("October 13, 2014 11:13:00"),new Date("October 14, 2014 11:13:00")]

start_dates = []
start_dates = JSON.stringify(start_dates);
start_data = JSON.stringify(start_data);

var workoutDates = JSON.parse(localStorage.workoutDates || start_dates);
var workoutData = JSON.parse(localStorage.workoutData || start_data);


var workoutIdx = workoutDates.length%3;
var exerciseIdx = 0;
var setIdx = 0;
var numExercises = workoutData[workoutIdx].length

function current(){
	if(isFinised){
		return{exercise:"",weight:"",maxSet:""}
	}

	var workout = workoutData[workoutIdx]
	var exercise = workout[exerciseIdx];
	return {
		name:exercise[0], 
		weight:exercise[1], 
		maxSet:exercise[2],
		workout:workout,
		exercise:exercise
	}
}

function change(amount){
	for(var i = 0 ; i < numExercises ; i++){
		if(current().workout[i][0] === current().name){
			current().workout[i][1]+=amount;
		}
	}
	localStorage.workoutData = JSON.stringify(workoutData);
	text();
}

increase_label.addEventListener('click', function(e) {
	change(1);
	
});

decrease_label.addEventListener('click', function(e) {
	change(-1);
});

function incrementWorkout(){
	setIdx++;
	if(setIdx === current().maxSet){
		setIdx = 0;
		exerciseIdx++		
	}
}
//Settings
var goTime = 0;
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

	incrementWorkout();
	if(exerciseIdx === numExercises){
		isFinised = true;
		finish.play();
		updateWorkoutDates();
		exerciseIdx++
		updateView();
		return
	}


	var X = e.pageX - this.offsetLeft
	var Y = e.pageY - this.offsetTop

	var width = this.offsetWidth;
	var height = this.offsetHeight

	resttimes = [1,120,135,150,165,180,195,210,225]

	if(! (isResting||isGo) ){
		if(Y<height/3){
			if(X<width/3){
				restTime = resttimes[0]
			}
			if(X>=width/3 && X<2*width/3){
				restTime = resttimes[1]
			}
			if(X>=2*width/3){
				restTime = resttimes[2]
			}
		}

		if(Y>=height/3 && Y<2*height/3){
			if(X<width/3){
				restTime = resttimes[3]
			}
			if(X>=width/3 && X<2*width/3){
				restTime = resttimes[4]
			}
			if(X>=2*width/3){
				restTime = resttimes[5]
			}
		}

		if(Y>2*height/3){
			if(X<width/3){
				restTime = resttimes[6]
			}
			if(X>=width/3 && X<2*width/3){
				restTime = resttimes[7]
			}
			if(X>=2*width/3){
				restTime = resttimes[8]
			}
		}

		hasStarted = true;
		isResting = true;
		button.play();
		updateView();

		
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
	exercise_label.innerText =  current().name;
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








