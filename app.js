(() => {
 const config=window.EVENT_CONFIG,canvas=document.getElementById("flyerCanvas"),ctx=canvas.getContext("2d");
 const photoInput=document.getElementById("photoInput"),nameInput=document.getElementById("nameInput"),locationInput=document.getElementById("locationInput");
 const previewButton=document.getElementById("previewButton"),downloadButton=document.getElementById("downloadButton"),whatsappButton=document.getElementById("whatsappButton"),emptyOverlay=document.getElementById("emptyOverlay"),errorMessage=document.getElementById("errorMessage");
 let photo=null,generated=false,cropImage=null,cropZoom=1,cropOffsetX=0,cropOffsetY=0,cropDragging=false,cropPointerX=0,cropPointerY=0;
 const cropModal=document.getElementById("cropModal"),cropCanvas=document.getElementById("cropCanvas"),cropCtx=cropCanvas.getContext("2d"),cropZoomInput=document.getElementById("cropZoom"),cropApply=document.getElementById("cropApply"),cropCancel=document.getElementById("cropCancel");
 document.getElementById("brandChurch").textContent=config.churchName;document.querySelector(".brand small").textContent=config.churchSubname;
 const text=(value,x,y,font,color,align="left")=>{ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y)};
 const trackedText=(value,x,y,font,color,spacing=2,align="left")=>{ctx.font=font;ctx.fillStyle=color;const chars=[...value];const width=chars.reduce((n,ch)=>n+ctx.measureText(ch).width,0)+Math.max(0,chars.length-1)*spacing;let px=align==="center"?x-width/2:align==="right"?x-width:x;ctx.textAlign="left";for(const ch of chars){ctx.fillText(ch,px,y);px+=ctx.measureText(ch).width+spacing;}};
 function fit(value,max,font,min=18){let s=font;ctx.font=`700 ${s}px 'DM Sans'`;while(ctx.measureText(value).width>max&&s>min){s--;ctx.font=`700 ${s}px 'DM Sans'`;}return s;}
 function draw(){
 const C=config.colors;ctx.clearRect(0,0,1080,1350);
 const bg=ctx.createLinearGradient(0,0,1080,1350);bg.addColorStop(0,C.deep);bg.addColorStop(.58,"#173b31");bg.addColorStop(1,"#0b211c");ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);
 // restrained architectural framing
 ctx.strokeStyle="rgba(197,164,92,.22)";ctx.lineWidth=2;for(let r=150;r<420;r+=48){ctx.beginPath();ctx.arc(1050,260,r,0,Math.PI*2);ctx.stroke();}
 ctx.strokeStyle=C.gold;ctx.lineWidth=2;ctx.strokeRect(28,28,1024,1294);ctx.strokeStyle="rgba(246,242,232,.25)";ctx.lineWidth=1;ctx.strokeRect(42,42,996,1266);
 // Church identity is presented as a prominent, centered masthead
 trackedText(config.churchName,540,108,`800 ${fit(config.churchName,940,68,48)}px 'Playfair Display'`,C.cream,4,"center");
 trackedText(config.churchSubname,540,151,`800 ${fit(config.churchSubname,940,31,23)}px 'DM Sans'`,C.gold,4,"center");
 ctx.fillStyle=C.gold;ctx.fillRect(430,171,220,4);
 // Theme label points directly to the message
 const themeCenter=298;
 ctx.fillStyle="rgba(197,164,92,.16)";ctx.fillRect(themeCenter-65,220,130,34);
 ctx.strokeStyle=C.gold;ctx.lineWidth=1.5;ctx.strokeRect(themeCenter-65,220,130,34);
 text("THEME",themeCenter,243,"700 16px 'DM Sans'",C.gold,"center");
 ctx.fillStyle=C.gold;ctx.fillRect(themeCenter-108,236,36,2);
 ctx.fillRect(themeCenter+72,236,36,2);
 // A proper clock face: twelve markers, distinct hands and a clear centre pin
 const cx=themeCenter,cy=316,cr=39;
 ctx.save();
 ctx.shadowColor="rgba(197,164,92,.25)";ctx.shadowBlur=14;
 ctx.strokeStyle=C.gold;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.stroke();
 ctx.restore();
 ctx.strokeStyle="rgba(197,164,92,.65)";ctx.lineWidth=1;
 ctx.beginPath();ctx.arc(cx,cy,cr-7,0,Math.PI*2);ctx.stroke();
 for(let a=0;a<12;a++){
   const ang=a*Math.PI/6,major=a%3===0,inner=major?cr-13:cr-10,outer=cr-5;
   ctx.strokeStyle=major?C.cream:C.gold;ctx.lineWidth=major?2.5:1.4;
   ctx.beginPath();ctx.moveTo(cx+Math.sin(ang)*inner,cy-Math.cos(ang)*inner);ctx.lineTo(cx+Math.sin(ang)*outer,cy-Math.cos(ang)*outer);ctx.stroke();
 }
 // Hands are set as a visual symbol of the moment to gather, not an event-time claim
 ctx.lineCap="round";ctx.strokeStyle=C.cream;ctx.lineWidth=4;
 ctx.beginPath();ctx.moveTo(cx,cy+3);ctx.lineTo(cx-1,cy-20);ctx.stroke();
 ctx.strokeStyle=C.gold;ctx.lineWidth=3.5;
 ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+19,cy+11);ctx.stroke();
 ctx.fillStyle=C.cream;ctx.beginPath();ctx.arc(cx,cy,4.5,0,Math.PI*2);ctx.fill();
 ctx.lineCap="butt";
 // Three-line headline, optically centred in the space beside the portrait
 text("TIME",themeCenter,430,`800 ${fit("TIME",390,76,66)}px 'DM Sans'`,C.cream,"center");
 text("TO",themeCenter,510,`800 ${fit("TO",390,76,66)}px 'DM Sans'`,C.cream,"center");
 text("GATHER",themeCenter,602,`italic 700 ${fit("GATHER",420,91,76)}px 'Playfair Display'`,C.gold,"center");
 
 // Portrait sits in its own right-hand column and never crosses the theme
 const px=560,py=225,pw=444,ph=570;
 if(photo){ctx.save();ctx.beginPath();ctx.rect(px,py,pw,ph);ctx.clip();const scale=Math.max(pw/photo.width,ph/photo.height),sw=pw/scale,sh=ph/scale;ctx.drawImage(photo,(photo.width-sw)/2,(photo.height-sh)/2,sw,sh,px,py,pw,ph);ctx.restore();}
 else{ctx.fillStyle="#24483c";ctx.beginPath();ctx.rect(px,py,pw,ph);ctx.fill();text("YOUR PORTRAIT",px+pw/2,py+ph/2,"700 20px 'DM Sans'","#c5a45c","center");}
 ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.strokeRect(px,py,pw,ph);ctx.strokeStyle="rgba(246,242,232,.65)";ctx.lineWidth=1;ctx.strokeRect(px+11,py+11,pw-22,ph-22);
 // Personalised attendee details
 ctx.fillStyle=C.cream;ctx.fillRect(76,810,928,160);ctx.fillStyle=C.gold;ctx.fillRect(76,810,9,160);
 // Centre the attendee statement and use distinct accent colours for the name and event
 const attendeeName=(nameInput.value.trim()||"YOUR NAME").toUpperCase();
 const firstParts=[{value:"I, ",color:C.deep},{value:attendeeName,color:"#a77b32"},{value:" from",color:C.deep}];
 ctx.font=`700 ${fit("I "+attendeeName+" from",850,43,25)}px 'DM Sans'`;
 let firstX=540-firstParts.reduce((sum,p)=>sum+ctx.measureText(p.value).width,0)/2;
 ctx.textAlign="left";firstParts.forEach(p=>{ctx.fillStyle=p.color;ctx.fillText(p.value,firstX,875);firstX+=ctx.measureText(p.value).width;});
 const attendeePlace=(locationInput.value.trim()||"YOUR LOCATION").toUpperCase()+" is attending ";
 const eventTitle=config.programmeName.toUpperCase();
 const secondFont=`700 ${fit(attendeePlace+eventTitle,850,27,16)}px 'DM Sans'`;
 ctx.font=secondFont;
 let secondX=540-(ctx.measureText(attendeePlace).width+ctx.measureText(eventTitle).width)/2;
 ctx.textAlign="left";ctx.fillStyle="#315b49";ctx.fillText(attendeePlace,secondX,932);
 secondX+=ctx.measureText(attendeePlace).width;ctx.fillStyle="#a77b32";ctx.fillText(eventTitle,secondX,932);
 // Date and daily time sit side by side in a balanced two-column row
 text("DATE",76,1018,"700 13px 'DM Sans'","#d7c28f");
 text(config.date,76,1064,`800 ${fit(config.date,500,32,23)}px 'DM Sans'`,C.cream);
 ctx.fillStyle="rgba(197,164,92,.55)";ctx.fillRect(610,1004,2,76);
 text("TIME",656,1018,"700 13px 'DM Sans'","#d7c28f");
 trackedText(config.eventTime || "5:00 PM DAILY",656,1064,"800 27px 'DM Sans'",C.cream,2);
 ctx.fillStyle="rgba(197,164,92,.55)";ctx.fillRect(76,1090,928,2);
 text("VENUE",76,1130,"700 13px 'DM Sans'","#d7c28f");
 trackedText(config.venueName,76,1180,`800 ${fit(config.venueName,925,27,19)}px 'DM Sans'`,C.cream,1.5);
 const addr=config.venueAddress;trackedText(addr,76,1220,`600 ${fit(addr,925,18,14)}px 'DM Sans'`,"#d0d6cf",.8);
 text("YOU ARE INVITED. COME EXPECTANT.",76,1280,"700 15px 'DM Sans'","#e2d4ad");
 }
 function err(message){errorMessage.textContent=message;}
 function setReady(){generated=true;emptyOverlay.hidden=true;downloadButton.disabled=whatsappButton.disabled=false;}
 function render(){draw();setReady();}
 function flyerBlob(){return new Promise(resolve=>canvas.toBlob(resolve,"image/png"));}
 function filename(){return `Covenant-Summit-2026-${(nameInput.value.trim()||"attendee").replace(/[^a-z0-9]+/gi,"-")}.png`;}
 function drawCrop(){if(!cropImage)return;const w=cropCanvas.width,h=cropCanvas.height,scale=Math.max(w/cropImage.width,h/cropImage.height)*cropZoom,rw=cropImage.width*scale,rh=cropImage.height*scale;cropOffsetX=Math.min(0,Math.max(w-rw,cropOffsetX));cropOffsetY=Math.min(0,Math.max(h-rh,cropOffsetY));cropCtx.clearRect(0,0,w,h);cropCtx.drawImage(cropImage,cropOffsetX,cropOffsetY,rw,rh);}
 function openCrop(img,file){cropImage=img;cropZoom=1;const scale=Math.max(cropCanvas.width/img.width,cropCanvas.height/img.height);cropOffsetX=(cropCanvas.width-img.width*scale)/2;cropOffsetY=(cropCanvas.height-img.height*scale)/2;cropZoomInput.value="1";document.getElementById("uploadTitle").textContent=file.name;document.getElementById("uploadHint").textContent="Adjust your portrait, then confirm the crop";drawCrop();cropModal.hidden=false;}
 cropZoomInput.addEventListener("input",()=>{const factor=Number(cropZoomInput.value)/cropZoom,cx=cropCanvas.width/2,cy=cropCanvas.height/2;cropZoom=Number(cropZoomInput.value);cropOffsetX=cx-(cx-cropOffsetX)*factor;cropOffsetY=cy-(cy-cropOffsetY)*factor;drawCrop();});
 cropCanvas.addEventListener("pointerdown",e=>{cropDragging=true;cropPointerX=e.clientX;cropPointerY=e.clientY;cropCanvas.setPointerCapture(e.pointerId);});
 cropCanvas.addEventListener("pointermove",e=>{if(!cropDragging)return;const rect=cropCanvas.getBoundingClientRect();cropOffsetX+=(e.clientX-cropPointerX)*cropCanvas.width/rect.width;cropOffsetY+=(e.clientY-cropPointerY)*cropCanvas.height/rect.height;cropPointerX=e.clientX;cropPointerY=e.clientY;drawCrop();});
 cropCanvas.addEventListener("pointerup",()=>cropDragging=false);cropCanvas.addEventListener("pointercancel",()=>cropDragging=false);
 cropCancel.addEventListener("click",()=>{cropModal.hidden=true;photoInput.value="";});
 cropApply.addEventListener("click",()=>{const result=new Image();result.onload=()=>{photo=result;cropModal.hidden=true;document.getElementById("uploadHint").textContent="Your cropped portrait is ready";render();};result.src=cropCanvas.toDataURL("image/png");});
 photoInput.addEventListener("change",()=>{err("");const file=photoInput.files&&photoInput.files[0];if(!file)return;if(!file.type.startsWith("image/")){err("Please choose an image file.");return;}if(file.size>12*1024*1024){err("Please choose a photo smaller than 12 MB.");return;}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{openCrop(img,file);URL.revokeObjectURL(url);};img.onerror=()=>{err("We couldn't read that image. Please try another photo.");URL.revokeObjectURL(url);};img.src=url;}); previewButton.addEventListener("click",()=>{err("");if(!photo){err("Please add your portrait first.");photoInput.focus();return;}if(!nameInput.value.trim()){err("Please enter your name.");nameInput.focus();return;}if(!locationInput.value.trim()){err("Please enter your location.");locationInput.focus();return;}render();});
 [nameInput,locationInput].forEach(el=>el.addEventListener("input",()=>{if(generated)draw();}));
 downloadButton.addEventListener("click",()=>{if(!generated)return;const a=document.createElement("a");a.download=filename();a.href=canvas.toDataURL("image/png");a.click();});
 whatsappButton.addEventListener("click",async()=>{if(!generated)return;const blob=await flyerBlob();if(!blob)return;const file=new File([blob],filename(),{type:"image/png"});const message=`I'm attending ${config.programmeName} — ${config.theme}! Join me from ${locationInput.value}. ${config.date} at ${config.venueName}.`;if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:config.programmeName,text:message});return;}catch(e){if(e.name==="AbortError")return;}}
 const a=document.createElement("a");a.href="https://wa.me/?text="+encodeURIComponent(message+" I'll attach my personalised flyer.");a.target="_blank";a.rel="noopener";a.click();err("WhatsApp opened with your invitation message. Attach the downloaded flyer image before sending.");});
 draw();
})();