function resizeIframe(id, width, height) {
    let iframe = document.getElementById(id);
    
    if (iframe) {
        iframe.style.width = width + "px";
        iframe.style.height = height + "px";
    }
}
window.addEventListener("message", function(event) {
    if (event.data && event.data.id && event.data.width && event.data.height) {
        resizeIframe(event.data.id, event.data.width, event.data.height);
    }
}, false);
