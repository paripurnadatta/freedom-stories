const UA="FreedomStories/1.0 (paripurna.dutta@gmail.com)";
const body=new URLSearchParams({action:"query",format:"json",prop:"imageinfo",iiprop:"extmetadata|size",titles:process.argv.slice(2).join("|")});
const r=await fetch("https://commons.wikimedia.org/w/api.php",{method:"POST",body,headers:{"User-Agent":UA}});
for (const p of Object.values((await r.json()).query.pages)) { const i=p.imageinfo?.[0]; const m=i?.extmetadata||{}; const g=k=>(m[k]?.value||"").replace(/<[^>]+>/g,"").slice(0,250);
 console.log("==",p.title,i?.width+"x"+i?.height,"|",g("LicenseShortName"),"|",g("DateTimeOriginal"),"|",g("Artist"),"|",g("ImageDescription")); }
