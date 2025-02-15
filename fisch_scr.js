const allFishsCommon = ["Salmon","Tuna","Bubble Fish","Cat Fish","Dog Fish","Mouthbass","Moonfish","Mudfish","Flying Fish","Magma Fish","Fishy :D","Horse Fish","FisHorse","Oiled up fish","Fish Fish","fish Fish FISH!","Block Fish","Some fish lol"]
const allFishsRare = ["Colossal Squid","Pufferfish","Femboy shark","Hammerhead shark","Diddy Shark","Mommy Shark","Baby Shark","Mommy Whale","Stingray","Titanic chunk","Millionaire","Rare fish"]


let fischs = document.getElementById("galery")
let capt = ""
let button = document.getElementById("click")
let progress = document.getElementById("prog")
let progVal = 0
let isRare = false


const temp1 = localStorage.getItem('stor');
fischs.innerHTML = JSON.parse(temp1);


setInterval(function(){ if(progVal > 0){progVal-=0.5}; if(progVal <= 0){capt=""}; 
progress.innerHTML = progVal;
if(progVal <= 5){
capt = ""
isRare = false
progVal = 0
button.innerHTML = "Pesque"
};},500)


function click(){
if (!capt){
let r = Math.random()
button.style.left = Math.random()*60+"%"
button.style.top = Math.random()*400

if (r < 0.2 && r > 0.05){
capt = allFishsCommon[Math.floor(Math.random() * allFishsCommon.length - 1)]
button.style.left = 10
button.style.top = 10
button.innerHTML = "CATCHING!!"
progress.innerHTML = progVal
progVal = 40
isRare = false
}
if(r < 0.05){
capt = allFishsRare[Math.floor(Math.random() * allFishsCommon.length - 1)]
button.style.left = 10
button.style.top = 10
button.innerHTML = "CATCHING!!"
progress.innerHTML = progVal
progVal = 25
isRare = true
}
}

if(capt){
if(!isRare) {progVal += Math.round(Math.random() * 10)} else progVal += Math.round(Math.random() * 5)

if(progVal >= 100){
let li = document.createElement("li")
li.innerHTML = capt + ` - ${Math.round(Math.random() * 150)} Kg / ${Math.round(Math.random() * 50)} M`
if(isRare){li.classList.add("rare")}
fischs.appendChild(li)
capt = ""
progVal = 0
isRare = false
button.innerHTML = "Fish"
}

}


  const stor = JSON.stringify(fischs.innerHTML);
  localStorage.setItem('stor', stor);

}

button.addEventListener("click", click)
document.getElementById("delete").addEventListener("click", function(){
  localStorage.setItem('stor', "\"\"");
fischs.innerHTML = ""

})

document.addEventListener("keydown", function(e){
if(e.key == "Tab"|| e.key == "Enter" || e.key == " "){
window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
});
