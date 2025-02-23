const key = "earlyTinyVirtual022025_cardboard"
let access

function verifyAccess() {
    if(localStorage.getItem("keyValue") != key) {
        access = prompt("Please enter key for early access below:")      
    }  
    if (access != key && typeof access == "string") {
        verifyAccess()
    } else localStorage.setItem("keyValue", key);
}
//console.warn("The error below is not an error and is a security feature, just ignore cuz works as intended")

if (Math.random() <= 0.15){
    let e = new RangeError("Uncaught Index at line 82: \"Never gonna give you up, Never gonna let you...\"")
    console.error(e)
}
verifyAccess()
