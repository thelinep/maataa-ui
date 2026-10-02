import fs from "node:fs";
import zlib from "node:zlib";

function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
export function decodePng(file){
  const buf=fs.readFileSync(file);
  const sig=Buffer.from([137,80,78,71,13,10,26,10]);
  if(!buf.subarray(0,8).equals(sig))throw new Error(`PNG_SIGNATURE:${file}`);
  let off=8,width,height,bitDepth,colorType,interlace;const idat=[];
  while(off<buf.length){const len=buf.readUInt32BE(off);const type=buf.toString("ascii",off+4,off+8);const data=buf.subarray(off+8,off+8+len);off+=12+len;
    if(type==="IHDR"){width=data.readUInt32BE(0);height=data.readUInt32BE(4);bitDepth=data[8];colorType=data[9];interlace=data[12];}
    else if(type==="IDAT")idat.push(data); else if(type==="IEND")break;
  }
  if(bitDepth!==8||![2,6].includes(colorType)||interlace!==0)throw new Error(`PNG_UNSUPPORTED:${bitDepth}:${colorType}:${interlace}`);
  const bpp=colorType===6?4:3,stride=width*bpp,raw=zlib.inflateSync(Buffer.concat(idat)),rgba=Buffer.alloc(width*height*4);let pos=0;let prev=Buffer.alloc(stride);
  for(let y=0;y<height;y++){const filter=raw[pos++];const scan=Buffer.from(raw.subarray(pos,pos+stride));pos+=stride;for(let x=0;x<stride;x++){const left=x>=bpp?scan[x-bpp]:0,up=prev[x]??0,ul=x>=bpp?prev[x-bpp]:0;if(filter===1)scan[x]=(scan[x]+left)&255;else if(filter===2)scan[x]=(scan[x]+up)&255;else if(filter===3)scan[x]=(scan[x]+Math.floor((left+up)/2))&255;else if(filter===4)scan[x]=(scan[x]+paeth(left,up,ul))&255;else if(filter!==0)throw new Error(`PNG_FILTER:${filter}`);}for(let x=0;x<width;x++){const s=x*bpp,d=(y*width+x)*4;rgba[d]=scan[s];rgba[d+1]=scan[s+1];rgba[d+2]=scan[s+2];rgba[d+3]=colorType===6?scan[s+3]:255;}prev=scan;}
  return{width,height,rgba};
}
export function comparePng(aFile,bFile,{channelTolerance=8,maxPixelRatio=0.002}={}){const a=decodePng(aFile),b=decodePng(bFile);if(a.width!==b.width||a.height!==b.height)return{ok:false,reason:"DIMENSIONS",a:[a.width,a.height],b:[b.width,b.height],ratio:1};let bad=0,total=a.width*a.height;for(let p=0;p<total;p++){let different=false;for(let c=0;c<4;c++)if(Math.abs(a.rgba[p*4+c]-b.rgba[p*4+c])>channelTolerance){different=true;break;}if(different)bad++;}const ratio=bad/total;return{ok:ratio<=maxPixelRatio,ratio,bad,total};}
