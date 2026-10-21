import sharp from "sharp";
const UA="FreedomStories/1.0 (paripurna.dutta@gmail.com)";
for (const [file,out,w] of JSON.parse(process.argv[2])){
  const r=await fetch(`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`,{headers:{"User-Agent":UA}});
  console.log(r.status, out);
  if(r.ok) await sharp(Buffer.from(await r.arrayBuffer())).resize({width:w,withoutEnlargement:true}).webp({quality:82}).toFile(out);
  await new Promise(z=>setTimeout(z,2000));
}
