const UA="FreedomStories/1.0 (paripurna.dutta@gmail.com)";
for (const q of process.argv.slice(2)) {
  const body=new URLSearchParams({action:"query",format:"json",list:"search",srsearch:q,srnamespace:"6",srlimit:"12"});
  const r=await fetch("https://commons.wikimedia.org/w/api.php",{method:"POST",body,headers:{"User-Agent":UA}});
  const j=await r.json(); console.log("==",q); for (const s of j.query.search) console.log(s.title);
  await new Promise(r=>setTimeout(r,1500));
}
