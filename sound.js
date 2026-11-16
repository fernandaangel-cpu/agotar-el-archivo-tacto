// Original T06 synthesized phoneme bank. No microphone or human voice recording.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function soundIndex(x,y,count=10){return Math.min(count-1,Math.floor(clamp(y,0,.999)*2)*5+Math.floor(clamp(x,0,.999)*5));}
export class ContactSound{
 constructor(){this.context=null;this.buffers=[];this.active=false;this.voices=new Map();this.volume=.35;this.lastCurve=-1;}
 async enable(){if(!this.context){this.context=new AudioContext();const c=this.context;this.master=c.createGain();this.master.gain.value=this.volume*.45;this.compressor=c.createDynamicsCompressor();this.compressor.threshold.value=-18;this.compressor.ratio.value=8;this.master.connect(this.compressor).connect(c.destination);}
 await this.context.resume();if(!this.buffers.length){const bank=await fetch('audio/manifest.json').then(r=>{if(!r.ok)throw Error();return r.json();});this.buffers=await Promise.all(bank.map(async s=>{const r=await fetch(s.file);if(!r.ok)throw Error('Falta '+s.file);return {meta:s,buffer:await this.context.decodeAudioData(await r.arrayBuffer())};}));}this.active=true;}
 mute(){this.active=false;for(const id of this.voices.keys())this.release(id);}
 release(id){const v=this.voices.get(id);if(!v)return;this.voices.delete(id);const t=this.context.currentTime;v.gain.gain.cancelScheduledValues(t);v.gain.gain.setTargetAtTime(0,t,.08);v.source.stop(t+.5);setTimeout(()=>{for(const n of Object.values(v))if(n?.disconnect)n.disconnect();},1100);}
 update(points,now,threshold){if(!this.active||!this.buffers.length)return;const c=this.context,t=c.currentTime;
 for(const id of this.voices.keys())if(!points.some(p=>p.id===id))this.release(id);
 for(const p of points){const index=soundIndex(p.x,p.y,this.buffers.length);let v=this.voices.get(p.id);if(v&&v.index!==index){this.release(p.id);v=null;}if(!v){const source=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter(),pan=c.createStereoPanner(),shaper=c.createWaveShaper(),delay=c.createDelay(.5),feedback=c.createGain();source.buffer=this.buffers[index].buffer;source.loop=true;filter.type='lowpass';gain.gain.value=0;source.connect(shaper).connect(filter).connect(gain).connect(pan).connect(this.master);filter.connect(delay).connect(feedback).connect(filter);feedback.gain.value=0;delay.delayTime.value=.12;source.start();v={index,source,gain,filter,pan,shaper,delay,feedback,lastCurve:-1};this.voices.set(p.id,v);}
 const seconds=(now-p.start)/1000,d=clamp((seconds-threshold)/.85),bucket=Math.round(d*12);if(bucket!==v.lastCurve){const curve=new Float32Array(1024),k=1+d*30;for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=Math.tanh(x*k)/Math.tanh(k);}v.shaper.curve=curve;v.lastCurve=bucket;}
 // Insistence bends pitch, muffles the phoneme and folds it back into a short echo.
 const pitch=1-d*.5+Math.sin(seconds*(2+d*18))*d*.16;
 v.source.playbackRate.setTargetAtTime(pitch,t,.06);v.filter.frequency.setTargetAtTime(8500-d*7800,t,.08);v.feedback.gain.setTargetAtTime(d*.32,t,.1);v.delay.delayTime.setTargetAtTime(.08+d*.16,t,.1);v.pan.pan.setTargetAtTime(p.x*2-1,t,.05);v.gain.gain.setTargetAtTime(.30/(Math.sqrt(points.length)||1),t,.07);
 }}
 setVolume(value){this.volume=clamp(value);if(this.master)this.master.gain.setTargetAtTime(this.volume*.45,this.context.currentTime,.08);}
}
