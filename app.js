(() => {
 const config=window.EVENT_CONFIG,canvas=document.getElementById("flyerCanvas"),ctx=canvas.getContext("2d");
 const photoInput=document.getElementById("photoInput"),nameInput=document.getElementById("nameInput"),locationInput=document.getElementById("locationInput");
 const previewButton=document.getElementById("previewButton"),downloadButton=document.getElementById("downloadButton"),shareButton=document.getElementById("shareButton"),whatsappButton=document.getElementById("whatsappButton"),emptyOverlay=document.getElementById("emptyOverlay"),errorMessage=document.getElementById("errorMessage");
 let photo=null,generated=false;
 document.getElementById("brandChurch").textContent=config.churchName;document.querySelector(".brand small").textContent=config.churchSubname;
 const text=(value,x,y,font,color,align="left")=>{ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y)};
 function fit(value,max,font,min=18){let s=font;ctx.font=`700 ${s}px 'DM Sans'`;while(ctx.measureText(value).width>max&&s>min){s--;ctx.font=`700 ${s}px 'DM Sans'`;}return s;}
 function draw(){
 const C=config.colors;ctx.clearRect(0,0,1080,1350);
 const bg=ctx.createLinearGradient(0,0,1080,1350);bg.addColorStop(0,C.deep);bg.addColorStop(.58,"#173b31");bg.addColorStop(1,"#0b211c");ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);
 // restrained architectural framing
 ctx.strokeStyle="rgba(197,164,92,.22)";ctx.lineWidth=2;for(let r=150;r<420;r+=48){ctx.beginPath();ctx.arc(1050,260,r,0,Math.PI*2);ctx.stroke();}
 ctx.strokeStyle=C.gold;ctx.lineWidth=2;ctx.strokeRect(28,28,1024,1294);ctx.strokeStyle="rgba(246,242,232,.25)";ctx.lineWidth=1;ctx.strokeRect(42,42,996,1266);
 // Church identity is the first thing guests see
 text(config.churchName,76,91,"800 31px 'DM Sans'",C.cream);
 text(config.churchSubname,77,123,"700 19px 'DM Sans'","#d6c89f");
 ctx.fillStyle=C.gold;ctx.fillRect(76,151,72,4);
 // Programme and theme have their own clear space, separate from portrait
 text(config.programmeName,76,208,"700 21px 'DM Sans'",C.gold);
 text("TIME TO",76,324,"700 88px 'DM Sans'",C.cream);
 text("GATHER",76,416,"italic 700 104px 'Playfair Display'",C.gold);
 text("ONE PEOPLE. ONE PURPOSE.",80,456,"600 16px 'DM Sans'","#d7ded6");
 // Portrait sits in its own right-hand column and never crosses the theme
 const px=625,py=250,pw=379,ph=520;
 if(photo){ctx.save();ctx.beginPath();ctx.roundRect(px,py,pw,ph,8);ctx.clip();const scale=Math.max(pw/photo.width,ph/photo.height),sw=pw/scale,sh=ph/scale;ctx.drawImage(photo,(photo.width-sw)/2,(photo.height-sh)/2,sw,sh,px,py,pw,ph);ctx.restore();}
 else{ctx.fillStyle="#24483c";ctx.beginPath();ctx.roundRect(px,py,pw,ph,8);ctx.fill();text("YOUR PORTRAIT",px+pw/2,py+ph/2,"700 20px 'DM Sans'","#c5a45c","center");}
 ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.strokeRect(px,py,pw,ph);ctx.strokeStyle="rgba(246,242,232,.65)";ctx.lineWidth=1;ctx.strokeRect(px+11,py+11,pw-22,ph-22);
 // Personalised attendee details
 ctx.fillStyle=C.cream;ctx.fillRect(76,820,928,135);ctx.fillStyle=C.gold;ctx.fillRect(76,820,9,135);
 const attendee=(nameInput.value.trim()||"YOUR NAME").toUpperCase();text(attendee,112,882,`700 ${fit(attendee,840,43)}px 'DM Sans'`,C.deep);
 text((locationInput.value.trim()||"YOUR LOCATION").toUpperCase(),114,922,"600 18px 'DM Sans'","#77735f");
 // Date and venue are large, high-contrast event information
 text("DATE",76,1018,"700 13px 'DM Sans'","#d7c28f");
 text(config.date,76,1064,`800 ${fit(config.date,925,34,24)}px 'DM Sans'`,C.cream);
 ctx.fillStyle="rgba(197,164,92,.55)";ctx.fillRect(76,1090,928,2);
 text("VENUE",76,1130,"700 13px 'DM Sans'","#d7c28f");
 text(config.venueName,76,1170,`800 ${fit(config.venueName,925,23,16)}px 'DM Sans'`,C.cream);
 const addr=config.venueAddress;text(addr,76,1208,`500 ${fit(addr,925,18,13)}px 'DM Sans'`,"#d0d6cf");
 ctx.fillStyle="rgba(197,164,92,.25)";ctx.fillRect(76,1242,928,1);
 text("YOU ARE INVITED. COME EXPECTANT.",76,1280,"700 15px 'DM Sans'","#e2d4ad");
 }
 function err(message){errorMessage.textContent=message;}
 function setReady(){generated=true;emptyOverlay.hidden=true;downloadButton.disabled=shareButton.disabled=whatsappButton.disabled=false;}
 function render(){draw();setReady();}
 function flyerBlob(){return new Promise(resolve=>canvas.toBlob(resolve,"image/png"));}
 function filename(){return `Covenant-Summit-2026-${(nameInput.value.trim()||"attendee").replace(/[^a-z0-9]+/gi,"-")}.png`;}
 photoInput.addEventListener("change",()=>{err("");const file=photoInput.files&&photoInput.files[0];if(!file)return;if(!file.type.startsWith("image/")){err("Please choose an image file.");return;}if(file.size>12*1024*1024){err("Please choose a photo smaller than 12 MB.");return;}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{photo=img;document.getElementById("uploadTitle").textContent=file.name;document.getElementById("uploadHint").textContent="Your portrait is ready";render();URL.revokeObjectURL(url);};img.onerror=()=>{err("We couldn't read that image. Please try another photo.");URL.revokeObjectURL(url);};img.src=url;});
 previewButton.addEventListener("click",()=>{err("");if(!photo){err("Please add your portrait first.");photoInput.focus();return;}if(!nameInput.value.trim()){err("Please enter your name.");nameInput.focus();return;}if(!locationInput.value.trim()){err("Please enter your location.");locationInput.focus();return;}render();});
 [nameInput,locationInput].forEach(el=>el.addEventListener("input",()=>{if(generated)draw();}));
 downloadButton.addEventListener("click",()=>{if(!generated)return;const a=document.createElement("a");a.download=filename();a.href=canvas.toDataURL("image/png");a.click();});
 shareButton.addEventListener("click",async()=>{if(!generated)return;err("");const blob=await flyerBlob();if(!blob){err("Could not prepare the flyer. Please download it instead.");return;}const file=new File([blob],filename(),{type:"image/png"});if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){try{await navigator.share({files:[file],title:config.programmeName,text:`I'm attending ${config.programmeName} — ${config.theme}! Join me, ${nameInput.value}, from ${locationInput.value}.`});}catch(e){if(e.name!=="AbortError")err("Sharing was interrupted. You can still download the PNG.");}}else{err("This browser cannot share image files directly. Download the PNG, then attach it in your social app.");document.getElementById("shareNote").textContent="Tip: Download the PNG, open WhatsApp, Instagram, Facebook or any other social app, and attach the image from your gallery."; }});
 whatsappButton.addEventListener("click",async()=>{if(!generated)return;const blob=await flyerBlob();if(!blob)return;const file=new File([blob],filename(),{type:"image/png"});const message=`I'm attending ${config.programmeName} — ${config.theme}! Join me from ${locationInput.value}. ${config.date} at ${config.venueName}.`;if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:config.programmeName,text:message});return;}catch(e){if(e.name==="AbortError")return;}}
 const a=document.createElement("a");a.href="https://wa.me/?text="+encodeURIComponent(message+" I'll attach my personalised flyer.");a.target="_blank";a.rel="noopener";a.click();err("WhatsApp opened with your invitation message. Attach the downloaded flyer image before sending.");});
 draw();
})();