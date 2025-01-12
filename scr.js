const starts = ["Era uma vez, uma pessoa chamada", "Certo dia, uma pessoa chamada ", "Uma vez, um alguém cujo nome era ", "Jazia debaixo de sua pedra, ", "Vou te contar a historia de "];


let name = document.getElementById('name').value;

let ul = document.getElementById('ul')


const middle = [", que tinha o sonho de ser o rei de ",", que sempre foi apaixonado por ",", que perdeu há muito tempo atrás seu/sua(s) ",", que tinha o poder de invocar "]

let thing = document.getElementById('thing').value;

let preend = [", Então subiu uma montanha para buscar este objeto e fazer uma festança", ",Após isso, percorreu os sete mares para cumprir sua profecia", ",Então.... uh.... é.... esqueci'-'... ", ", Então chegou na sua maẽ e disse: \"Tem café?\", e para sua tristeza não tinha...",", Determinado por tal, foi até o tumulo de seu pai morto que foi comprar cigarro mas morreu de diarreia e perguntou: \"Jah podi ao mossar?\"... ", " então subiu no seu cavalo e cavalgou até o reino dos retardados e disse: \"Eu caí num golpe na pagina oficial\", o rei Ycro, que lá de cima vinha, pegou a coroa enterrada em seu orgão defecante e enfiou na boca dele e disse: \"Lhe nomeio o mais retardado do mundo\"... ", "aí "+name+" disse: \" MEU NOME É "+name+"!!!\"... absolute cinema",", aí uma vân coloridinha chegou perto dele e sequestrou ele, quando ele acordou viu que se tornou um furry, aí disserom pra ele: \""+name+"... agora você é um de nós\", depois voltaram ele pra casa dele e "+name+"fingiu que nada aconteceu", "... "+name+" "+name+" "+name+" fodase esqueci '-'"]


let end = [", Então todos viveram felizes para sempre"+", Então todos viveram cagando para sempre"+", daí esuqeci fim akskaskkskaska"+", daí todos foram condenados a jogar regretevator",", daí ele virou femboi e deu por dindin pq era pobre, fim"+", então todos morreram... fim",", ABSOLUTE CINEMAAAA",", daí "+name+" enfiou o/a "+thing+" no Cooler e morreu... fim",", daí todos morreram pro warden",", daí ele explodiu '-'",", depois di- This video is sponsored by OperaGX, The one and only browser made for gaymers, Y- *AD BLOCKED*"]


function gstg(array){
  return array[Math.round((array.length - 1) * Math.random())]
}

function create() {
thing = document.getElementById('thing').value;
name = document.getElementById('name').value; 
  
preend = [", Então subiu uma montanha para buscar este objeto e fazer uma festança", ",Após isso, percorreu os sete mares para cumprir sua profecia", ", Então.... uh.... é.... esqueci'-'... ", ", Então chegou na sua maẽ e disse: \"Tem café?\", e para sua tristeza não tinha...",", Determinado por tal, foi até o tumulo de seu pai morto que foi comprar cigarro mas morreu de diarreia e perguntou: \"Jah podi ao mossar?\", daí ele disse: \"Sim meu filho\"...", " então subiu no seu cavalo e cavalgou até o reino dos retardados e disse: \"Eu caí num golpe na pagina oficial\", o rei Ycro, que lá de cima vinha, pegou a coroa enterrada em seu orgão defecante e enfiou na boca dele e disse: \"Lhe nomeio o mais retardado do mundo\"... ", " aí "+name+" disse: \" MEU NOME É "+name+"!!!\"... absolute cinema",", aí uma vân coloridinha chegou perto dele e sequestrou ele, quando ele acordou viu que se tornou um furry, aí disseram pra ele: \""+name+"... agora você é um de nós\", depois voltaram ele pra casa dele e "+name+"fingiu que nada aconteceu", "... "+name+" "+name+" "+name+" fodase esqueci '-'"," ent- Pelo jeito ela tq querendo hãnn.. Pelo jeito ela tq querendo hãnn.. Pelo jeito ela tq querendo quem?... FAZENDEIRO ela se amarra no cowboi pq playboi n tem dinheiro, FAZENDEIRO..."]

end = [", Então todos viveram felizes para sempre"+", Então todos viveram cagando para sempre"+", daí esuqeci fim akskaskkskaska"+", daí todos foram condenados a jogar regretevator",", daí ele virou femboi e deu por dindin pq era pobre, fim"+", então todos morreram... fim",", ABSOLUTE CINEMAAAA",", daí "+name+" enfiou o/a "+thing+" no Cooler e morreu... fim",", daí todos morreram pro warden",", daí ele explodiu '-'",", depois di- This video is sponsored by OperaGX, The one and only browser made for gaymers, Y- *AD BLOCKED*"]


let myLi = document.createElement("li")
myLi.innerHTML = gstg(starts)+name+gstg(middle)+thing+gstg(preend)+gstg(end)
ul.appendChild(myLi)
ul.appendChild(document.createElement("br"))
}

