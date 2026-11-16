import {blurRGBA} from './blur.mjs?v=3';
import {ContactSound} from './sound.js?v=3';
import {clamp,normalizePoints,reconcile,stage,validState} from './interaction.mjs?v=3';
const $=id=>document.getElementById(id),phone=document.body.classList.contains('phone');
const sound=new ContactSound();
const broker='wss://broker.emqx.io:8084/mqtt';
const fragment=new URLSearchParams(location.hash.slice(1));
const newRoom=()=>Array.from(crypto.getRandomValues(new Uint8Array(12)),n=>n.toString(16).padStart(2,'0')).join('');
let room=new URLSearchParams(location.search).get('sala')||fragment.get('sala');
if(!phone&&!/^[a-f0-9]{24}$/.test(room||'')){room=newRoom();const u=new URL(location.href);u.searchParams.set('sala',room);history.replaceState(null,'',u.href);}
if(!phone){const u=new URL(location.href);u.searchParams.set('sala',room);history.replaceState(null,'',u.href);}
if(phone)window.addEventListener('hashchange',()=>{if(new URLSearchParams(location.hash.slice(1)).get('sala')!==room)location.reload();});
const device=(phone?'tel-':'mesa-')+newRoom().slice(0,10),base=`agotar-tacto/${room}`,canvas=$('surface'),ctx=canvas.getContext('2d');
let manifest=[],state={letter:'1985',page:3,blur:8,delay:1.8,radius:9},image=null,blurred=document.createElement('canvas'),contacts=[],trails=[],lastTouch=0,lastPhone=0,mouseMode=false,client=null,remoteOwner=null,stateVersion=0,loadToken=0,points=new Map(),seq=0,lastSeq=-1;
const status=t=>$('connection').textContent=t;
canvas.addEventListener('contextmenu',e=>e.preventDefault());
const send=(suffix,payload,retain=false)=>{if(client?.connected)client.publish(base+'/'+suffix,JSON.stringify(payload),{qos:0,retain});};
const clear=()=>{contacts=[];trails=[];points.clear();sound.update([],performance.now(),state.delay);};
function receivePoints(p){const now=performance.now();const normalized=normalizePoints(p);for(const old of contacts)if(!normalized.some(n=>n.id===old.id))trails.push({...old,released:now});contacts=reconcile(contacts,normalized,now,canvas.width/canvas.height);lastTouch=now;}
function makeBlur(){if(!image)return;blurred.width=canvas.width;blurred.height=canvas.height;const b=blurred.getContext('2d');b.drawImage(image,0,0,canvas.width,canvas.height);const pixels=b.getImageData(0,0,canvas.width,canvas.height);pixels.data.set(blurRGBA(pixels.data,canvas.width,canvas.height,state.blur));b.putImageData(pixels,0,0);}

async function loadPage(){const token=++loadToken,l=manifest.find(l=>l.id===state.letter);if(!l)return;clear();$('letterTitle').textContent=l.title;const img=new Image();img.onload=()=>{if(token!==loadToken)return;image=img;const scale=Math.min(1,1000/img.naturalWidth);canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);makeBlur();};img.onerror=()=>status('No se pudo cargar la carta. Revisa que la carpeta letters esté subida.');img.src=l.pages[state.page].file;if(!phone){$('description').textContent=`${l.date} · ${l.origin} → ${l.destination}. ${l.description}`;$('page').replaceChildren(...l.pages.map((p,i)=>new Option(p.label,i,false,i===state.page)));document.querySelectorAll('.card').forEach(b=>b.setAttribute('aria-pressed',b.dataset.id===l.id));}}

function broadcast(){send('state',{...state,owner:device,version:++stateVersion},true);}
function setState(s){if(!validState(s,manifest))return;const changed=s.letter!==state.letter||s.page!==state.page;state={letter:s.letter,page:s.page,blur:s.blur,delay:s.delay,radius:s.radius};if(changed||!image)loadPage();else makeBlur();}
function connect(){if(!window.mqtt){status('No se cargó MQTT. Revisa la carpeta vendor.');return;}status('Conectando con MQTT…');client=mqtt.connect(broker,{clientId:'aa-'+device,clean:true,connectTimeout:12000,reconnectPeriod:2500,keepalive:15,will:{topic:base+'/'+(phone?'phone':'desk'),payload:JSON.stringify({online:false,id:device}),qos:0,retain:false}});
 client.on('connect',()=>{status('Conectado');client.subscribe([base+'/state',base+'/touch',base+'/phone',base+'/desk',base+'/hello']);send(phone?'phone':'desk',{online:true,id:device});if(phone)send('hello',{id:device});else broadcast();});
 client.on('reconnect',()=>{status('Reconectando con MQTT…');clear();});client.on('offline',()=>{status('Sin conexión. Intentando reconectar…');clear();});client.on('error',()=>status('No se pudo conectar. Revisa internet o espera la reconexión.'));
 client.on('message',(topic,buffer)=>{let data;try{data=JSON.parse(new TextDecoder().decode(buffer));}catch{return;}const type=topic.slice(base.length+1);if(type==='state'&&phone&&validState(data,manifest)){remoteOwner=data.owner;setState(data);}
 if(type==='hello'&&!phone)broadcast();
 if(type==='touch'&&!phone&&Array.isArray(data.points)&&typeof data.id==='string'&&Number.isInteger(data.seq)&&data.version===stateVersion){if(remoteOwner!==data.id){lastSeq=-1;remoteOwner=data.id;}if(data.seq<=lastSeq)return;lastSeq=data.seq;lastPhone=performance.now();receivePoints(data.points);}
 if(type==='phone'&&!phone){if(data.online){lastPhone=performance.now();$('presence').textContent='Teléfono conectado';}else{clear();$('presence').textContent='Teléfono desconectado';}}
 if(type==='desk'&&phone&&!data.online){clear();status('El computador se desconectó. Vuelve a abrir su página.');}
 // The phone acknowledges the current desktop revision, preventing delayed touches on another page.
 if(type==='state'&&phone&&validState(data,manifest))stateVersion=data.version;
 });}
function publishTouch(){const p=[...points.values()];receivePoints(p);send('touch',{id:device,seq:++seq,version:stateVersion,points:p});}
canvas.addEventListener('pointerdown',e=>{if(!phone&&!mouseMode)return;if(phone&&!remoteOwner){status('Espera a que el computador esté conectado.');return;}canvas.setPointerCapture(e.pointerId);pointer(e);});
function pointer(e){if(!phone&&!mouseMode)return;if(e.type==='pointermove'&&!points.has(e.pointerId))return;e.preventDefault();const r=canvas.getBoundingClientRect();points.set(e.pointerId,{id:e.pointerId,x:clamp((e.clientX-r.left)/r.width),y:clamp((e.clientY-r.top)/r.height)});if(phone)publishTouch();else receivePoints([...points.values()]);}
canvas.addEventListener('pointermove',pointer);for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,e=>{points.delete(e.pointerId);if(phone)publishTouch();else receivePoints([...points.values()]);});
function lift(){points.clear();if(phone)publishTouch();else clear();}
document.addEventListener('visibilitychange',()=>{if(document.hidden)lift();});window.addEventListener('pagehide',()=>{lift();send(phone?'phone':'desk',{online:false,id:device});client?.end();});
const patch=document.createElement('canvas');
function render(now){requestAnimationFrame(render);if(!image)return;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(blurred,0,0);if(!phone&&!mouseMode&&now-lastTouch>1700&&contacts.length){receivePoints([]);}if(!phone&&lastPhone&&now-lastPhone>4500)$('presence').textContent='Esperando contacto del teléfono';
 if(!phone)sound.update(contacts,now,state.delay);
 trails=trails.filter(t=>now-t.released<220);
 const all=[...trails,...contacts];let maxAge=0;
 for(const p of all){const age=(now-p.start)/1000;maxAge=Math.max(maxAge,age);const fade=p.released?clamp(1-(now-p.released)/220):clamp((now-(p.born??p.start))/70);const radius=canvas.width*state.radius/100;const size=Math.ceil(radius*2);if(patch.width!==size){patch.width=size;patch.height=size;}const c=patch.getContext('2d');const x=p.x*canvas.width,y=p.y*canvas.height,left=x-radius,top=y-radius;c.clearRect(0,0,size,size);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.drawImage(image,0,0,image.naturalWidth,image.naturalHeight,-left,-top,canvas.width,canvas.height);
 const distortion=clamp((age-state.delay)/.85);if(distortion>0){c.clearRect(0,0,size,size);const strip=4;for(let sy=0;sy<size;sy+=strip){const yy=top+sy;if(yy<0||yy>=canvas.height)continue;const offset=(Math.sin(sy*.19+now*.003)+Math.sin(sy*.057-now*.001))*distortion*radius*.65;const sourceY=yy/canvas.height*image.naturalHeight;const sourceH=Math.min(strip/canvas.height*image.naturalHeight,image.naturalHeight-sourceY);c.drawImage(image,0,sourceY,image.naturalWidth,sourceH,-left+offset,sy,canvas.width,strip);}
 c.globalAlpha=distortion*.32;c.drawImage(blurred,-left+distortion*12,-top);c.globalAlpha=1;}
 c.globalCompositeOperation='destination-in';const mask=c.createRadialGradient(radius,radius,radius*.45,radius,radius,radius);mask.addColorStop(0,`rgba(0,0,0,${fade})`);mask.addColorStop(1,'transparent');c.fillStyle=mask;c.fillRect(0,0,size,size);c.globalCompositeOperation='source-over';ctx.drawImage(patch,left,top);}
 $('gesture').textContent=contacts.length?stage(maxAge,state.delay):'Sin contacto.';if(!phone)$('progress').style.width=(contacts.length?clamp(maxAge/(state.delay+.85))*100:0)+'%';}
async function init(){try{manifest=await fetch('letters-manifest.json').then(r=>{if(!r.ok)throw Error();return r.json();});}catch{status('No se pudo cargar el catálogo. Abre desde un servidor o GitHub Pages.');return;}
 if(phone&&!/^[a-f0-9]{24}$/.test(room||'')){$('error').textContent='Falta la sala. Escanea el QR que aparece en el computador.';status('Sin sala');return;}
 if(!phone){$('audioToggle').onclick=async()=>{const b=$('audioToggle');if(sound.active){sound.mute();b.textContent='Activar sonido';b.setAttribute('aria-pressed','false');return;}b.disabled=true;try{await sound.enable();b.textContent='Silenciar sonido';b.setAttribute('aria-pressed','true');$('audioStatus').textContent='Sonido listo. El contacto lo activa; la insistencia lo altera.';}catch{$('audioStatus').textContent='No se pudo cargar el sonido. Revisa la carpeta audio y vuelve a intentarlo.';}finally{b.disabled=false;}};$('letters').replaceChildren(...manifest.map(l=>{const b=document.createElement('button');b.className='card';b.dataset.id=l.id;b.setAttribute('aria-pressed',l.id===state.letter);const im=new Image();im.src=l.cover;im.alt='Detalle de '+l.title;const wrap=document.createElement('span'),strong=document.createElement('strong'),text=document.createElement('span');strong.textContent=l.year;text.textContent=l.date;wrap.append(strong,text);b.append(im,wrap);b.onclick=()=>{setState({...state,letter:l.id,page:l.initial});broadcast();};return b;}));
 $('page').onchange=()=>{setState({...state,page:Number($('page').value)});broadcast();};$('demo').onclick=()=>{mouseMode=!mouseMode;$('demo').setAttribute('aria-pressed',mouseMode);$('demo').textContent=mouseMode?'Salir de prueba local':'Probar con el ratón';clear();};
 const url=new URL('telefono.html',location.href);url.search='';url.hash='sala='+room;$('phoneLink').href=url.href;$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(url.href);$('copy').textContent='Enlace copiado';}catch{$('copy').textContent='Mantén pulsado el enlace para copiar';}};if(window.qrcode){const qr=qrcode(0,'M');qr.addData(url.href);qr.make();$('qr').innerHTML=qr.createSvgTag({cellSize:3,margin:3,scalable:true});}loadPage();}else status('Esperando el documento del computador…');
 connect();requestAnimationFrame(render);setInterval(()=>{if(phone){send('phone',{online:true,id:device});if(points.size)publishTouch();}else send('desk',{online:true,id:device});},500);}
init();
