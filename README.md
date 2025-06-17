# Pages

[Avatar Test](https://tinyvirtual.github.io/projects.io/EduSync%20Avatar%20Creation/index.html)<br>
[More Soon](https://tinyvirtual.github.io/projects.io/soon.html)<br>

# Bookmarklets

## Enable Ctrl+C/V/ and selection
```javascript
javascript:(function() {  document.addEventListener('contextmenu', e => e.stopPropagation(), true);  document.oncontextmenu = null;  document.onselectstart = null;  document.body.style.userSelect = 'auto';  document.body.style.webkitUserSelect = 'auto';  document.body.style.MozUserSelect = 'auto';  document.body.style.msUserSelect = 'auto';  ['keydown', 'keypress', 'keyup'].forEach(type => {    document.addEventListener(type, e => e.stopPropagation(), true);    document['on' + type] = null;  });  ['copy', 'paste', 'cut'].forEach(type => {    document.addEventListener(type, e => e.stopPropagation(), true);    document['on' + type] = null;  });  document.querySelectorAll('*').forEach(el => {    el.oncontextmenu = null;    el.onselectstart = null;    el.oncopy = null;    el.oncut = null;    el.onpaste = null;    el.onkeydown = null;    el.onkeypress = null;    el.onkeyup = null;  });  alert("%F0%9F%94%93 Default browser behaviors re-enabled!");})();)
```
## Password viaibility
```javascript
javascript:(function(){if(typeof window.isOn==='undefined'){window.isOn=false}window.isOn=!window.isOn;const n=document.getElementById('___notif_pswd');if(n){n.remove()}const d=document.createElement('div');d.id='___notif_pswd';d.style='background:#1144aa;position:fixed;top:20px;left:50%;transform:translateX(-50%);width:80%;height:60px;text-align:center;border-radius:20px;color:white;line-height:60px;font-family:sans-serif;z-index:9999;cursor:pointer;transition:opacity 0.3s;';d.innerHTML='ℹ Passwords are now <b>'+ (window.isOn?'Visible':'Hidden') +'</b>.';document.body.appendChild(d);d.onclick=()=>{d.style.opacity='0';setTimeout(()=>d.remove(),300)};setTimeout(()=>{d.click()},3000);const a=document.querySelectorAll('input[type="password"],input[data-original-type="password"]');for(let i of a){let bg=i.style.backgroundColor;if(window.isOn){i.setAttribute('data-original-type',i.type);i.type='text';}else if(i.getAttribute('data-original-type')){i.type=i.getAttribute('data-original-type');}i.style.backgroundColor='#88ff88';setTimeout(()=>{i.style.backgroundColor=bg},3000);}})();
```


## Custom Alerts
```javascript
javascript:(function(){  if(window.customModalInjected)return;window.customModalInjected=true;  function createModal(type,message,callback){    document.querySelectorAll('.custom-modal').forEach(e=>e.remove());    const overlay=document.createElement('div');    overlay.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:99999;font-family:sans-serif";    overlay.className='custom-modal';    const box=document.createElement('div');    box.style.cssText="background:rgb(0,44,77);padding:20px;border-radius:12px;max-width:90%;width:400px;position:absolute;cursor:grab;box-shadow:0 0 10px rgba(0,105,183,0.6)";    const closeBtn=document.createElement('div');    closeBtn.textContent='×';    closeBtn.style.cssText="position:absolute;top:8px;right:12px;font-size:20px;color:#fff;cursor:pointer";    closeBtn.onclick=()=>{overlay.remove();if(callback)callback(null);};    const header=document.createElement('h1');    header.textContent='Info';    header.style.cssText="color:#FFFFFF;margin:0 0 15px 0;font-size:24px";    const messageText=document.createElement('a');    messageText.textContent=message;    messageText.style.cssText="display:block;color:#FFFFFF;margin-bottom:15px;white-space:pre-wrap";    box.appendChild(closeBtn);    box.appendChild(header);    box.appendChild(messageText);    if(type==='prompt'){      const input=document.createElement('input');      input.type='text';      input.style.cssText="width:100%;padding:8px;border:none;border-radius:8px;background:rgb(0,105,183);color:#000000;margin-bottom:15px;box-sizing:border-box";      box.appendChild(input);    }    const btnBox=document.createElement('div');    btnBox.style.cssText="text-align:right";    const okBtn=document.createElement('button');    okBtn.textContent='OK';    okBtn.style.cssText="background:rgb(0,105,183);color:#000000;padding:8px 16px;border:none;border-radius:8px;margin-left:10px;cursor:pointer";    const cancelBtn=document.createElement('button');    cancelBtn.textContent='Cancel';    cancelBtn.style.cssText=okBtn.style.cssText;    okBtn.onclick=()=>{const result=type==='prompt'?box.querySelector('input').value:true;overlay.remove();if(callback)callback(result);};    cancelBtn.onclick=()=>{overlay.remove();if(callback)callback(type==='confirm'?false:null);};    btnBox.appendChild(okBtn);    if(type!=='alert')btnBox.appendChild(cancelBtn);    box.appendChild(btnBox);    overlay.appendChild(box);    document.body.appendChild(overlay);    if(type==='prompt')box.querySelector('input').focus();    let isDragging=false,offsetX=0,offsetY=0;    box.onmousedown=e=>{isDragging=true;offsetX=e.clientX-box.offsetLeft;offsetY=e.clientY-box.offsetTop;box.style.cursor='grabbing';e.preventDefault();};    document.onmousemove=e=>{if(isDragging){box.style.left=e.clientX-offsetX+'px';box.style.top=e.clientY-offsetY+'px';}};    document.onmouseup=()=>{isDragging=false;box.style.cursor='grab';};  }  window.alert=msg=>new Promise(resolve=>createModal('alert',msg,()=>resolve()));  window.confirm=msg=>new Promise(resolve=>createModal('confirm',msg,res=>resolve(res)));  window.prompt=(msg,def='')=>new Promise(resolve=>{createModal('prompt',msg,res=>resolve(res));document.querySelector('.custom-modal input').value=def;});})();
```

# Wallpapers
<details>
  <summary>Show</summary>
  <img src="https://raw.githubusercontent.com/TinyVirtual/projects.io/refs/heads/main/images/background_home.png" width="300">
  <img src="https://raw.githubusercontent.com/TinyVirtual/projects.io/refs/heads/main/images/background_lock.png" width="300">
</details>

# Windows Optimization
## Registry Shortcuts
```powershell
$envVars = @{
    "MINECRAFT" = "%USERPROFILE%\AppData\Roaming\.minecraft"
    "DESKTOP"   = "%USERPROFILE%\Desktop"
    "DOWNLOADS" = "%USERPROFILE%\Downloads"
    "RBX"       = "%USERPROFILE%\AppData\Local\Roblox"
    "DOCS"      = "%USERPROFILE%\Documents"
    "IMGS"      = "%USERPROFILE%\Images"
    "VIDS"      = "%USERPROFILE%\Videos"
    "ME"        = "%USERPROFILE%"
}

$regPath = "HKCU:\Environment"

foreach ($name in $envVars.Keys) {
    Set-ItemProperty -Path $regPath -Name $name -Value $envVars[$name] -Type ExpandString
}

$signature = @"
[DllImport("user32.dll", SetLastError = true)]
public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam,
    uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
"@
Add-Type -MemberDefinition $signature -Name NativeMethods -Namespace Win32

$HWND_BROADCAST = [intptr]0xffff
$WM_SETTINGCHANGE = 0x1A
$SMTO_ABORTIFHUNG = 0x2
[UIntPtr]$result = [UIntPtr]::Zero

[Win32.NativeMethods]::SendMessageTimeout($HWND_BROADCAST, $WM_SETTINGCHANGE, [uintptr]::Zero, "Environment", $SMTO_ABORTIFHUNG, 5000, [ref]$result)

Write-Host "Environment variables set successfully."
```

<br><br><br><br><br> Check my [profile](https://github.com/TinyVirtual/)
