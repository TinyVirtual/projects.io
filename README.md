# Pages

[Avatar Test](https://tinyvirtual.github.io/projects.io/EduSync%20Avatar%20Creation/index.html)
[More Soon](https://tinyvirtual.github.io/projects.io/soon.html)

# Bookmarklets

## Enable Ctrl+C/V/ and selection
```javascript
javascript:(function() {  document.addEventListener('contextmenu', e => e.stopPropagation(), true);  document.oncontextmenu = null;  document.onselectstart = null;  document.body.style.userSelect = 'auto';  document.body.style.webkitUserSelect = 'auto';  document.body.style.MozUserSelect = 'auto';  document.body.style.msUserSelect = 'auto';  ['keydown', 'keypress', 'keyup'].forEach(type => {    document.addEventListener(type, e => e.stopPropagation(), true);    document['on' + type] = null;  });  ['copy', 'paste', 'cut'].forEach(type => {    document.addEventListener(type, e => e.stopPropagation(), true);    document['on' + type] = null;  });  document.querySelectorAll('*').forEach(el => {    el.oncontextmenu = null;    el.onselectstart = null;    el.oncopy = null;    el.oncut = null;    el.onpaste = null;    el.onkeydown = null;    el.onkeypress = null;    el.onkeyup = null;  });  alert("%F0%9F%94%93 Default browser behaviors re-enabled!");})();)
```

## Custom Alerts
```javascript
javascript:(function(){  if(window.customModalInjected)return;window.customModalInjected=true;  function createModal(type,message,callback){    document.querySelectorAll('.custom-modal').forEach(e=>e.remove());    const overlay=document.createElement('div');    overlay.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:99999;font-family:sans-serif";    overlay.className='custom-modal';    const box=document.createElement('div');    box.style.cssText="background:rgb(0,44,77);padding:20px;border-radius:12px;max-width:90%;width:400px;position:absolute;cursor:grab;box-shadow:0 0 10px rgba(0,105,183,0.6)";    const closeBtn=document.createElement('div');    closeBtn.textContent='×';    closeBtn.style.cssText="position:absolute;top:8px;right:12px;font-size:20px;color:#fff;cursor:pointer";    closeBtn.onclick=()=>{overlay.remove();if(callback)callback(null);};    const header=document.createElement('h1');    header.textContent='Info';    header.style.cssText="color:#FFFFFF;margin:0 0 15px 0;font-size:24px";    const messageText=document.createElement('a');    messageText.textContent=message;    messageText.style.cssText="display:block;color:#FFFFFF;margin-bottom:15px;white-space:pre-wrap";    box.appendChild(closeBtn);    box.appendChild(header);    box.appendChild(messageText);    if(type==='prompt'){      const input=document.createElement('input');      input.type='text';      input.style.cssText="width:100%;padding:8px;border:none;border-radius:8px;background:rgb(0,105,183);color:#000000;margin-bottom:15px;box-sizing:border-box";      box.appendChild(input);    }    const btnBox=document.createElement('div');    btnBox.style.cssText="text-align:right";    const okBtn=document.createElement('button');    okBtn.textContent='OK';    okBtn.style.cssText="background:rgb(0,105,183);color:#000000;padding:8px 16px;border:none;border-radius:8px;margin-left:10px;cursor:pointer";    const cancelBtn=document.createElement('button');    cancelBtn.textContent='Cancel';    cancelBtn.style.cssText=okBtn.style.cssText;    okBtn.onclick=()=>{const result=type==='prompt'?box.querySelector('input').value:true;overlay.remove();if(callback)callback(result);};    cancelBtn.onclick=()=>{overlay.remove();if(callback)callback(type==='confirm'?false:null);};    btnBox.appendChild(okBtn);    if(type!=='alert')btnBox.appendChild(cancelBtn);    box.appendChild(btnBox);    overlay.appendChild(box);    document.body.appendChild(overlay);    if(type==='prompt')box.querySelector('input').focus();    let isDragging=false,offsetX=0,offsetY=0;    box.onmousedown=e=>{isDragging=true;offsetX=e.clientX-box.offsetLeft;offsetY=e.clientY-box.offsetTop;box.style.cursor='grabbing';e.preventDefault();};    document.onmousemove=e=>{if(isDragging){box.style.left=e.clientX-offsetX+'px';box.style.top=e.clientY-offsetY+'px';}};    document.onmouseup=()=>{isDragging=false;box.style.cursor='grab';};  }  window.alert=msg=>new Promise(resolve=>createModal('alert',msg,()=>resolve()));  window.confirm=msg=>new Promise(resolve=>createModal('confirm',msg,res=>resolve(res)));  window.prompt=(msg,def='')=>new Promise(resolve=>{createModal('prompt',msg,res=>resolve(res));document.querySelector('.custom-modal input').value=def;});})();
```

# Wallpapers
<details>
  <summary>Show</summary>
  <img src="https://github.com/TinyVirtual/projects.io/blob/main/images/background_home.png" width="300">
  <img src="https://github.com/TinyVirtual/projects.io/blob/main/images/background_lock.png" width="300">
</details>



<br><br><br><br><br> Check my [profile](https://github.com/TinyVirtual/)
