import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(new URL("../dist",import.meta.url).pathname);
const port=Number(process.env.MAATAA_PORT||4173);
const types={".html":"text/html; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".svg":"image/svg+xml"};
http.createServer((req,res)=>{
  const u=new URL(req.url,"http://x");
  if(u.pathname==="/__health"){res.writeHead(200,{"content-type":"application/json"});return res.end(JSON.stringify({ok:true,version:"0.4.1",root:"dist"}));}
  let p=path.join(root,decodeURIComponent(u.pathname));
  if(p.endsWith(path.sep))p=path.join(p,"index.html");
  if(!p.startsWith(root)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);return res.end("Not found");}
  res.writeHead(200,{"content-type":types[path.extname(p)]||"text/plain; charset=utf-8","cache-control":"no-store"});
  fs.createReadStream(p).pipe(res);
}).listen(port,"127.0.0.1",()=>console.log(`MAATAA V4 build preview http://127.0.0.1:${port}/`));
