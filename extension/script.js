var hour = (new Date()).getHours()

var picture_urls = []
var messages = ["Good morning", "God förmiddag", "God lunch", "God eftermiddag", "God kväll", "God natt"]
var currentIdx = 0

var name = "Erik"

if(hour >= 5 && hour < 9) {
    currentIdx = 0
}
else if(hour >= 9 && hour < 12) {
    currentIdx = 1
}
else if(hour >= 12  && hour < 14) {
    currentIdx = 2
}
else if(hour >= 14 && hour < 18) {
    currentIdx = 3
}
else if(hour >= 18 && hour < 21) {
    currentIdx = 4
}
else if(hour >= 21 && hour < 12) {
    currentIdx = 5
}

var txt = document.getElementById('text')

txt.innerText = messages[currentIdx] + ', ' + name+'.'