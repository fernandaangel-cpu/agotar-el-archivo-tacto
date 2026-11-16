import test from 'node:test';import assert from 'node:assert/strict';import {normalizePoints,reconcile,stage,validState} from './interaction.mjs';
test('el contacto permanece si el dedo apenas tiembla; recorrer reinicia la insistencia',()=>{let p=reconcile([],[{id:1,x:.4,y:.5}],100,1);p=reconcile(p,[{id:1,x:.405,y:.5}],1100,1);assert.equal(p[0].start,100);p=reconcile(p,[{id:1,x:.6,y:.5}],1200,1);assert.equal(p[0].start,1200);assert.deepEqual(reconcile(p,[],1300),[])});
test('sin fuerza: la etapa depende del tiempo y del ajuste elegido',()=>{assert.equal(stage(.02,3),'Acercarse.');assert.equal(stage(2,3),'Leer.');assert.equal(stage(3,3),'La insistencia deforma.');assert.equal(stage(3,6),'Leer.')});
test('mensajes inválidos y páginas ajenas al catálogo se rechazan',()=>{assert.deepEqual(normalizePoints([{id:1,x:NaN,y:.2}]),[]);assert.equal(normalizePoints([{id:1,x:2,y:-3}])[0].x,1);const m=[{id:'1985',pages:[{}]}];assert.equal(validState({letter:'1985',page:0,blur:6,delay:3,radius:11},m),true);assert.equal(validState({letter:'1985',page:9,blur:6,delay:3,radius:11},m),false)});
import {soundIndex} from './sound.js';
test('las diez muestras son alcanzables por posición y el borde no sale del banco',()=>{const choices=new Set();for(let y of [.25,.75])for(let x of [.1,.3,.5,.7,.9])choices.add(soundIndex(x,y));assert.equal(choices.size,10);assert.equal(soundIndex(1,1),9);assert.equal(soundIndex(0,0),0)});

import {blurRGBA} from './blur.mjs';
test('desenfoque por píxeles funciona sin filtros del navegador',()=>{const a=new Uint8ClampedArray(5*5*4);for(let i=3;i<a.length;i+=4)a[i]=255;a[(2*5+2)*4]=255;const b=blurRGBA(a,5,5,1);assert.ok(b[(2*5+2)*4]<255);assert.ok(b[(2*5+1)*4]>0);assert.equal(b[3],255)});
test('deslizar reinicia la insistencia sin reiniciar la nitidez',()=>{let p=reconcile([],[{id:1,x:.4,y:.5}],0,1);p=reconcile(p,[{id:1,x:.5,y:.5}],200,1);assert.equal(p[0].start,200);assert.equal(p[0].born,0);assert.equal(stage(.56,.55),'La insistencia deforma.')});
