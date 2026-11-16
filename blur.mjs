// Pixel blur independent of CanvasRenderingContext2D.filter (not available on some iPhones).
export function blurRGBA(data,width,height,radius){
 const a=new Uint8ClampedArray(data),b=new Uint8ClampedArray(a.length),r=Math.max(1,Math.round(radius)),diameter=r*2+1;
 function pass(src,dst,horizontal){const outer=horizontal?height:width,inner=horizontal?width:height,stride=horizontal?4:width*4;
 for(let line=0;line<outer;line++){const base=horizontal?line*width*4:line*4;for(let ch=0;ch<4;ch++){let sum=0;for(let k=-r;k<=r;k++)sum+=src[base+Math.max(0,Math.min(inner-1,k))*stride+ch];for(let x=0;x<inner;x++){dst[base+x*stride+ch]=sum/diameter;sum+=src[base+Math.min(inner-1,x+r+1)*stride+ch]-src[base+Math.max(0,x-r)*stride+ch];}}}}
 for(let i=0;i<3;i++){pass(a,b,true);pass(b,a,false);}return a;
}
