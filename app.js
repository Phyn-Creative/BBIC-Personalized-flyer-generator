(() => {
  const config = window.EVENT_CONFIG;
  const canvas = document.getElementById("flyerCanvas");
  const ctx = canvas.getContext("2d");
  const photoInput = document.getElementById("photoInput");
  const nameInput = document.getElementById("nameInput");
  const locationInput = document.getElementById("locationInput");
  const previewButton = document.getElementById("previewButton");
  const downloadButton = document.getElementById("downloadButton");
  const shareButton = document.getElementById("shareButton");
  const emptyOverlay = document.getElementById("emptyOverlay");
  const errorMessage = document.getElementById("errorMessage");
  let photo = null;
  let generated = false;

  document.getElementById("brandChurch").textContent = config.churchName;
  document.querySelector(".brand small").textContent = config.churchSubname;

  function roundedRect(x,y,w,h,r,fill,stroke=null,line=1){
    ctx.beginPath(); ctx.roundRect(x,y,w,h,r);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.lineWidth=line;ctx.strokeStyle=stroke;ctx.stroke();}
  }
  function fitText(text,maxWidth,fontSize,fontFamily,weight="600"){
    let size=fontSize;
    do { ctx.font=`${weight} ${size}px ${fontFamily}`; size-=1; }
    while(ctx.measureText(text).width>maxWidth && size>18);
    return size;
  }
  function drawPhoto(){
    const x=76,y=240,w=928,h=690;
    ctx.save();
    ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.clip();
    const scale=Math.max(w/photo.width,h/photo.height);
    const sw=w/scale,sh=h/scale;
    const sx=(photo.width-sw)/2,sy=(photo.height-sh)/2;
    ctx.drawImage(photo,sx,sy,sw,sh,x,y,w,h);
    const shade=ctx.createLinearGradient(0,y+440,0,y+h);
    shade.addColorStop(0,"rgba(8,24,20,0)");
    shade.addColorStop(1,"rgba(8,24,20,.24)");
    ctx.fillStyle=shade;ctx.fillRect(x,y,w,h);
    ctx.restore();
    roundedRect(x,y,w,h,8,null,"#c5a45c",3);
  }
  function draw(){
    const C=config.colors;
    ctx.clearRect(0,0,1080,1350);
    ctx.fillStyle=C.cream;ctx.fillRect(0,0,1080,1350);
    ctx.strokeStyle=C.gold;ctx.lineWidth=3;ctx.strokeRect(22,22,1036,1306);
    ctx.strokeStyle="#d8c89e";ctx.lineWidth=1;ctx.strokeRect(34,34,1012,1282);
    ctx.fillStyle=C.deep;ctx.font="700 24px 'DM Sans'";ctx.fillText(config.churchName,76,92);
    ctx.fillStyle="#6f745f";ctx.font="600 15px 'DM Sans'";ctx.fillText(config.churchSubname,77,119);
    ctx.textAlign="right";ctx.fillStyle=C.gold;
    ctx.font="700 31px 'DM Sans'";ctx.fillText("COVENANT",1004,83);
    ctx.font="700 22px 'DM Sans'";ctx.fillText("SUMMIT 2026",1004,112);
    ctx.textAlign="left";
    ctx.strokeStyle=C.gold;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(76,151);ctx.lineTo(1004,151);ctx.stroke();
    ctx.fillStyle=C.deep;ctx.font="600 21px 'DM Sans'";ctx.textAlign="center";
    ctx.fillText("A DIVINE GATHERING",540,198);
    ctx.fillStyle=C.gold;ctx.font="700 43px 'Playfair Display'";ctx.fillText(config.theme,540,228);
    ctx.textAlign="left";
    if(photo) drawPhoto();
    else {
      roundedRect(76,240,928,690,8,"#e8e1d1","#c5a45c",3);
      ctx.fillStyle="#a58b54";ctx.textAlign="center";ctx.font="600 26px 'DM Sans'";
      ctx.fillText("YOUR PHOTOGRAPH",540,580);ctx.textAlign="left";
    }
    const name=(nameInput.value||"YOUR NAME").trim().toUpperCase();
    const location=(locationInput.value||"YOUR LOCATION").trim();
    ctx.textAlign="center";ctx.fillStyle=C.deep;
    const nsize=fitText(name,920,46,"'Playfair Display'","700");
    ctx.font=`700 ${nsize}px 'Playfair Display'`;ctx.fillText(name,540,1000);
    ctx.fillStyle="#7a6b49";ctx.font="500 23px 'DM Sans'";ctx.fillText(location,540,1043);
    ctx.strokeStyle="#d8c89e";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(180,1080);ctx.lineTo(900,1080);ctx.stroke();
    ctx.fillStyle=C.gold;ctx.font="700 32px 'DM Sans'";ctx.fillText(config.date,540,1140);
    ctx.fillStyle=C.deep;ctx.font="700 19px 'DM Sans'";ctx.fillText(config.venueName,540,1192);
    ctx.fillStyle="#5d675e";ctx.font="500 17px 'DM Sans'";
    const addrSize=fitText(config.venueAddress,900,17,"'DM Sans'","500");
    ctx.font=`500 ${addrSize}px 'DM Sans'`;ctx.fillText(config.venueAddress,540,1224);
    ctx.fillStyle=C.gold;ctx.font="600 16px 'Playfair Display'";
    ctx.fillText("WE LOOK FORWARD TO GATHERING WITH YOU",540,1275);
    ctx.textAlign="left";
  }
  function showError(msg){errorMessage.textContent=msg;}
  photoInput.addEventListener("change",()=>{
    showError("");
    const file=photoInput.files && photoInput.files[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){showError("Please choose an image file.");return;}
    if(file.size>12*1024*1024){showError("Please choose a photo smaller than 12 MB.");return;}
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{photo=img;document.getElementById("uploadTitle").textContent=file.name;document.getElementById("uploadHint").textContent="Photo added successfully";renderPreview();URL.revokeObjectURL(url);};
    img.onerror=()=>showError("We couldn't read that image. Please try another photo.");
    img.src=url;
  });
  function renderPreview(){
    draw();generated=true;emptyOverlay.hidden=true;
    downloadButton.disabled=false;shareButton.disabled=false;
  }
  previewButton.addEventListener("click",()=>{
    showError("");
    if(!photo){showError("Please upload your photograph first.");return;}
    if(!nameInput.value.trim()){showError("Please enter your full name.");nameInput.focus();return;}
    if(!locationInput.value.trim()){showError("Please enter your location.");locationInput.focus();return;}
    renderPreview();
  });
  [nameInput,locationInput].forEach(el=>el.addEventListener("input",()=>{if(generated)draw();}));
  downloadButton.addEventListener("click",()=>{
    if(!generated)return;
    const link=document.createElement("a");
    link.download=`Covenant-Summit-2026-${(nameInput.value.trim()||"attendee").replace(/[^a-z0-9]+/gi,"-")}.png`;
    link.href=canvas.toDataURL("image/png");link.click();
  });
  shareButton.addEventListener("click",async()=>{
    if(!generated)return;
    canvas.toBlob(async blob=>{
      if(!blob)return;
      const file=new File([blob],"covenant-summit-flyer.png",{type:"image/png"});
      if(navigator.canShare && navigator.canShare({files:[file]})){
        try{await navigator.share({files:[file],title:config.programmeName,text:`${nameInput.value} — ${config.theme}`});}
        catch(e){if(e.name!=="AbortError")showError("Sharing was not available. Please download your flyer instead.");}
      }else{
        showError("Direct image sharing isn't supported on this browser. Please download your flyer and share it from your gallery.");
      }
    },"image/png");
  });
  draw();
})();