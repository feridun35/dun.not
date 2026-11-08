"use strict";
/* Bölüm 1: gerilme, Hooke, emniyet, kesim yöntemi */

section({id:"gerilme", group:"1 · Temel", title:"Gerilme: kuvvet ÷ alan", build:function(){
  return widget(null,
    "Aynı kuvvet ince çubukta çok, kalın çubukta az zorlar. Bu zorlanma miktarına gerilme diyoruz.",
    "<b>Tek cümle:</b> gerilme = kuvvet ÷ kesit alanı. Kuvvet kesite <b>dik</b> ise normal gerilme σ (çekme +, basma −), kesite <b>paralel</b> ise kayma gerilmesi τ. Birim: N/mm² = MPa.",
    function(box){
      var mode=0,F=40,A=100,n=1;
      var cF=ctl("Kuvvet F",0,100,1,40,"kN",function(v){F=v;draw();});
      var cA=ctl("Kesit alanı A",50,600,10,100,"mm²",function(v){A=v;draw();});
      var cN=ctl("Kesilen kesit sayısı",1,2,1,1,"",function(v){n=v;draw();});
      var tb=tabs(["Normal gerilme σ (çekme)","Kayma gerilmesi τ (cıvata)"],function(i){mode=i;cN.style.display=i?"":"none";draw();});
      var svg=svgBox(640,250), stage=h("div",{class:"stage"},svg);
      var m1=metric("Gerilme"),m2=metric("Hesap"),m3=metric("Ne olur?");
      box.append(tb,cF,cA,cN,stage,h("div",{class:"cards"},m1,m2,m3));
      function draw(){
        clear(svg);
        var sig=F*1000/(A*(mode?n:1)), col=heat(sig/250), len=10+F*0.5, red="#c0392b";
        if(mode===0){
          var w=16+Math.sqrt(A)*3;
          svg.appendChild(s("rect",{x:200-w/2,y:50,width:w,height:150,fill:col,stroke:"currentColor","stroke-width":1.2}));
          arrow(svg,200,50,200,50-len,red,3.5); arrow(svg,200,200,200,200+len,red,3.5);
          txt(svg,200,238,"çubuk (yandan)",{size:12});
          var side=Math.sqrt(A)*2.2;
          svg.appendChild(s("rect",{x:470-side/2,y:125-side/2,width:side,height:side,fill:col,stroke:"currentColor"}));
          txt(svg,470,125+side/2+20,"kesit: A = "+A+" mm²",{size:13});
          txt(svg,470,125-side/2-10,"üstten bakış",{size:12});
          m2.set(f(F*1000,0)+" N ÷ "+A+" mm²");
          m3.set(sig<150?"rahat":sig<250?"zorlanıyor":"akma bölgesi",sig<150?"ok":sig<250?"warn":"bad");
        } else {
          var bw=6+Math.sqrt(A)*1.4, y1=0;
          if(n===1){
            svg.appendChild(s("rect",{x:80,y:90,width:300,height:30,fill:"#9fc3ee",stroke:"currentColor"}));
            svg.appendChild(s("rect",{x:200,y:120,width:300,height:30,fill:"#f0c9a6",stroke:"currentColor"}));
            svg.appendChild(s("rect",{x:290-bw/2,y:75,width:bw,height:90,fill:col,stroke:"currentColor"}));
            svg.appendChild(s("line",{x1:250,y1:120,x2:330,y2:120,stroke:red,"stroke-width":2.5,"stroke-dasharray":"5 3"}));
            arrow(svg,80,105,80-len,105,red,3.5); arrow(svg,500,135,500+len,135,red,3.5);
            txt(svg,350,200,"kırmızı kesik çizgi: cıvatanın kesileceği yüzey",{size:12});
          } else {
            svg.appendChild(s("rect",{x:80,y:65,width:300,height:28,fill:"#9fc3ee",stroke:"currentColor"}));
            svg.appendChild(s("rect",{x:200,y:93,width:300,height:50,fill:"#f0c9a6",stroke:"currentColor"}));
            svg.appendChild(s("rect",{x:80,y:143,width:300,height:28,fill:"#9fc3ee",stroke:"currentColor"}));
            svg.appendChild(s("rect",{x:290-bw/2,y:55,width:bw,height:126,fill:col,stroke:"currentColor"}));
            [93,143].forEach(function(y){svg.appendChild(s("line",{x1:250,y1:y,x2:330,y2:y,stroke:red,"stroke-width":2.5,"stroke-dasharray":"5 3"}));});
            arrow(svg,80,79,80-len,79,red,3.5); arrow(svg,80,157,80-len,157,red,3.5); arrow(svg,500,118,500+len,118,red,3.5);
            txt(svg,350,215,"çift kesit: cıvata iki yerden kesilir, alan 2 katı sayılır",{size:12});
          }
          m2.set(f(F*1000,0)+" N ÷ ("+n+" × "+A+" mm²)");
          m3.set(sig<100?"rahat":sig<180?"zorlanıyor":"tehlikeli",sig<100?"ok":sig<180?"warn":"bad");
        }
        m1.set((mode?"τ = ":"σ = ")+f(sig,1)+" MPa");
      }
      tb.sel(0);
    },
    "Hemen her soruda önce gerilmeyi <code>F/A</code> ile bulursun. Alan tuzağı: borada <code>π/4·(D²−d²)</code> (Sl.65), delikli parçada net alan (Ö1, Ö3), cıvata/pimde çift kesit <code>2·πd²/4</code> (Q20, Ö3), sıyrılan yüzeyde <code>π·d·L</code> (Sl.64–65, Q42, Ö2). Etiketler: " + "Q2 Q3 Q20 Q42 Ö1 Ö2 Ö3 Sl.37 Sl.38 Sl.65");
}});

section({id:"hooke", group:"1 · Temel", title:"Hooke ve çekme diyagramı", build:function(){
  return widget(null,
    "Çubuğu çekince önce yaylı gibi davranır (bırakınca geri döner), sonra kalıcı uzar, en sonunda kopar.",
    "<b>Tek cümle:</b> elastik bölgede <b>σ = E·ε</b>. E diyagramın başlangıç eğimidir (malzemenin sertliği). ε = Δl/l birim uzamadır. Akma gerilmesi kalıcı şekil değişiminin başladığı noktadır.",
    function(box){
      var Re=250,E=200000,ey=Re/E,eu=0.15,ebr=0.22,eps=0.0008,unload=false;
      function sig(e){
        if(e<=ey) return E*e;
        if(e<=0.02) return Re;
        if(e<=eu){var t=(eu-e)/(eu-0.02);return Re+150*(1-t*t);}
        var u=(e-eu)/(ebr-eu);return 400-60*u*u;
      }
      var X=function(e){return 50+Math.sqrt(e/ebr)*520;}, Y=function(sg){return 210-sg/420*180;};
      var ce=ctl("Uzama ε",0,22,0.05,0.08,"%",function(v){eps=v/100;draw();},2);
      var cu=h("label",{class:"note"},h("input",{type:"checkbox",onchange:function(){unload=this.checked;draw();}})," Yükü kaldır (geri döner mi?)");
      var svg=svgBox(640,260), stage=h("div",{class:"stage"},svg);
      var m1=metric("Bölge"),m2=metric("Gerilme"),m3=metric("Kalıcı uzama (yük kalkınca)");
      box.append(ce,cu,stage,h("div",{class:"cards"},m1,m2,m3),h("div",{class:"note",html:"Yatay eksen karekök ölçekli çizilmiştir, yoksa dik başlayan Hooke bölgesi görünmezdi. Sayılar örnek çelik: Re=250, Rm=400 MPa, E=200 GPa."}));
      function draw(){
        clear(svg);
        svg.appendChild(s("line",{x1:50,y1:210,x2:620,y2:210,stroke:"currentColor"}));
        svg.appendChild(s("line",{x1:50,y1:210,x2:50,y2:20,stroke:"currentColor"}));
        txt(svg,60,18,"σ (MPa)",{size:12,anchor:"start"}); txt(svg,620,230,"ε",{size:13});
        var pts=[],i;
        for(i=0;i<=200;i++){var e=ebr*i/200;pts.push(X(e)+","+Y(sig(e)));}
        svg.appendChild(s("polyline",{points:pts.join(" "),fill:"none",stroke:"var(--acc)","stroke-width":2.5}));
        [[ey,"akma",Re],[0.1,"pekleşme",sig(0.1)],[eu,"çekme dayanımı Rm",400],[ebr,"kopma",340]].forEach(function(p,k){
          svg.appendChild(s("circle",{cx:X(p[0]),cy:Y(p[2]),r:3.5,fill:"var(--warn)"}));
          if(k!==1) txt(svg,X(p[0])+(k===0?44:k===2?0:-6),Y(p[2])-8-(k===0?0:0),p[1],{size:12,fill:"var(--warn)"});
        });
        var sg=sig(eps), zone=eps<=ey?"elastik (Hooke)":eps<=0.02?"akma (Lüders)":eps<=eu?"pekleşme":"boyun verme";
        var ep=Math.max(0,eps-sg/E);
        if(unload){
          svg.appendChild(s("line",{x1:X(eps),y1:Y(sg),x2:X(ep),y2:Y(0),stroke:"var(--bad)","stroke-width":2,"stroke-dasharray":"5 3"}));
          svg.appendChild(s("circle",{cx:X(ep),cy:Y(0),r:5,fill:"var(--bad)"}));
        }
        svg.appendChild(s("circle",{cx:X(eps),cy:Y(sg),r:6,fill:"var(--acc)",stroke:"var(--card)","stroke-width":2}));
        var bx=50,by=244,L=420,w=14;
        var L1=L*(1+eps*(unload?0:1)+(unload?ep:0)),neck=eps>eu&&!unload;
        svg.appendChild(s("rect",{x:bx,y:by-w/2-2,width:L,height:w,fill:"var(--soft)",stroke:"var(--muted)","stroke-dasharray":"3 3"}));
        var lat=eps<=ey?0.3:0.5, wn=w*(1-lat*(unload?ep:eps)*1.2);
        var xs=[],ys=[];
        for(i=0;i<=40;i++){var x=bx+L1*i/40;var ww=wn;if(neck){var u=(i-20)/20;ww=wn*(1-0.55*((eps-eu)/(ebr-eu))*Math.exp(-u*u*6));}xs.push(x);ys.push(ww);}
        var top=xs.map(function(x,k){return x+","+(by-2-ys[k]/2);}),bot=xs.map(function(x,k){return x+","+(by-2+ys[k]/2);}).reverse();
        svg.appendChild(s("polygon",{points:top.concat(bot).join(" "),fill:heat(sg/420),stroke:"currentColor"}));
        m1.set(zone); m2.set(f(sg,0)+" MPa");
        m3.set(eps<=ey?"0 (tamamen geri döner)":f(ep*100,2)+" %", eps<=ey?"ok":"warn");
      }
      draw();
    },
    "Çekme deneyi ve Poisson: <code>σ=Eε</code>, <code>Δl=FL/AE</code>, <code>ν=−ε<sub>yanal</sub>/ε<sub>eksenel</sub></code> (0 ≤ ν ≤ 0,5). Q21 yanal daralmadan boy uzamasını bulduruyor. Etiketler: Q21 Sl.43 Sl.50 Sl.51");
}});

section({id:"emniyet", group:"1 · Temel", title:"Emniyet gerilmesi ve katsayısı", build:function(){
  return widget(null,
    "Malzemenin gerçek sınırına (akma) kadar yüklemeyiz. Aradaki payı güvenlik için bırakırız.",
    "<b>Tek cümle:</b> σ<sub>e</sub> = R<sub>e</sub> / n. Soru \"emniyetle / güvenle / izin verilen\" diyorsa <b>σ<sub>e</sub></b> ile, \"ne zaman akar\" diyorsa <b>R<sub>e</sub></b> ile çalış.",
    function(box){
      var S=100,Re=240,n=2,F=10;
      var cS=ctl("Kesit alanı S",50,300,10,100,"mm²",function(v){S=v;draw();});
      var cR=ctl("Akma sınırı R<sub>e</sub>".replace(/<[^>]+>/g,""),150,400,10,240,"MPa",function(v){Re=v;draw();});
      var cn=ctl("Emniyet katsayısı n",1,3,0.1,2,"",function(v){n=v;draw();});
      var cF=ctl("Kuvvet F",0,60,0.5,10,"kN",function(v){F=v;draw();});
      var svg=svgBox(640,170), stage=h("div",{class:"stage"},svg);
      var m1=metric("σ<sub>e</sub> = R<sub>e</sub>/n"),m2=metric("Çubuktaki σ = F/S"),m3=metric("En büyük emniyetli F"),m4=metric("Akma yükü");
      var msg=h("div",{class:"say"});
      box.append(cS,cR,cn,cF,stage,msg,h("div",{class:"cards"},m1,m2,m3,m4));
      function draw(){
        clear(svg);
        var se=Re/n,sg=F*1000/S,mx=Re*1.4,X=function(v){return 30+Math.min(v,mx)/mx*580;};
        svg.appendChild(s("rect",{x:30,y:60,width:X(se)-30,height:26,fill:"#8fd0a4"}));
        svg.appendChild(s("rect",{x:X(se),y:60,width:X(Re)-X(se),height:26,fill:"#f2c476"}));
        svg.appendChild(s("rect",{x:X(Re),y:60,width:610-X(Re),height:26,fill:"#ee9f95"}));
        txt(svg,X(se)/2+15,78,"güvenli",{size:12});
        txt(svg,(X(se)+X(Re))/2,78,"pay",{size:12}); txt(svg,(X(Re)+610)/2,78,"akma",{size:12});
        txt(svg,X(se),50,"σe = "+f(se,0),{size:12,fill:"var(--ok)",bold:true}); txt(svg,X(Re),50,"Re = "+f(Re,0),{size:12,fill:"var(--bad)",bold:true});
        var nx=X(sg);
        svg.appendChild(s("polygon",{points:nx+",94 "+(nx-7)+",112 "+(nx+7)+",112",fill:"var(--acc)"}));
        txt(svg,nx,130,"σ = "+f(sg,0)+" MPa",{size:13,bold:true,fill:"var(--acc)"});
        txt(svg,320,160,"gerilme ekseni (MPa)",{size:11,fill:"var(--muted)"});
        m1.set(f(se,0)+" MPa"); m2.set(f(sg,0)+" MPa",sg<=se?"ok":sg<=Re?"warn":"bad");
        m3.set(f(se*S/1000,1)+" kN"); m4.set(f(Re*S/1000,1)+" kN");
        if(sg<=se) msg.innerHTML="<b>Emniyetli.</b> σ ≤ σ<sub>e</sub>: çubuk güvenle taşır.";
        else if(sg<=Re) msg.innerHTML="<b>Emniyetli değil.</b> Çubuk henüz akmıyor ama güvenlik payını yedik. Sınavda cevap: emniyetli değil.";
        else msg.innerHTML="<b>Akma başladı.</b> σ &gt; R<sub>e</sub>: kalıcı şekil değişimi.";
      }
      draw();
    },
    "Sl.62–63: F=10 000 N, S=100 → σ=100 ≤ σ<sub>e</sub>=120 emniyetli; n=R<sub>e</sub>/σ<sub>e</sub>=2. Alıştırmamız: n=1,5 iken en büyük emniyetli F = (240/1,5)·100 = 16 000 N. Etiketler: Q11 Q42 Q48 Q49 Q51 Ö3 Sl.57 Sl.63");
}});

section({id:"kesim", group:"1 · Temel", title:"Kesim yöntemi: parça parça iç kuvvet", build:function(){
  return widget(null,
    "Kuvvet çubuğun boyunca değişiyorsa çubuğu hayali bir bıçakla keser, her bölgeye ayrı bakarız.",
    "<b>Tek cümle:</b> kes, bir parçaya bak, dengesini yaz. Kesim yüzeyindeki kuvvet parçadan <b>dışarı</b> bakıyorsa çekme (+), <b>içeri</b> bakıyorsa basma (−). Sonra her bölgede Δl = N·L/(S·E) ve hepsini işaretiyle topla.",
    function(box){
      var pB=-15,pC=5,L1=500,L2=300,S=50,E=200000;
      var cB=ctl("B'deki kuvvet (+ sağa, − sola)",-30,30,1,-15,"kN",function(v){pB=v;draw();});
      var cC=ctl("C'deki kuvvet (+ sağa, − sola)",-30,30,1,5,"kN",function(v){pC=v;draw();});
      var svg=svgBox(640,365), stage=h("div",{class:"stage"},svg);
      var mRA=metric("Duvar tepkisi R<sub>A</sub>"),mN1=metric("N₁ (A–B)"),mN2=metric("N₂ (B–C)"),mD=metric("Toplam Δl");
      var steps=h("div",{class:"steps"});
      box.append(cB,cC,stage,h("div",{class:"cards"},mRA,mN1,mN2,mD),steps,h("div",{class:"note"},"Sayfa 68–69: L₁=500 mm, L₂=300 mm, S=50 mm², E=200 GPa. Kaydırıcılar B'de 15 kN sola, C'de 5 kN sağa ile açılır."));
      function draw(){
        clear(svg);
        var RA=-(pB+pC),N1=-RA,N2=pC;
        var d1=N1*1000*L1/(S*E),d2=N2*1000*L2/(S*E),sc=0.55,xA=70,xB=xA+L1*sc,xC=xB+L2*sc,y0=60;
        for(var i=0;i<7;i++) svg.appendChild(s("line",{x1:xA,y1:y0-8+i*8,x2:xA-12,y2:y0+i*8,stroke:"currentColor"}));
        svg.appendChild(s("line",{x1:xA,y1:y0-8,x2:xA,y2:y0+48,stroke:"currentColor","stroke-width":3}));
        function seg(x1,x2,N,y){svg.appendChild(s("rect",{x:x1,y:y,width:x2-x1,height:32,fill:N>0.01?"#f2b3aa":N<-0.01?"#a9c8ee":"var(--soft)",stroke:"currentColor"}));}
        seg(xA,xB,N1,y0);seg(xB,xC,N2,y0);
        txt(svg,(xA+xB)/2,y0+21,"A–B",{size:13});txt(svg,(xB+xC)/2,y0+21,"B–C",{size:13});
        txt(svg,xA,y0-14,"A",{size:13,bold:true});txt(svg,xB,y0-14,"B",{size:13,bold:true});txt(svg,xC,y0-14,"C",{size:13,bold:true});
        var ya=y0+16;
        if(pB) arrow(svg,xB,ya,xB+Math.sign(pB)*(14+Math.abs(pB)*2.2),ya,"#c0392b",3.5);
        if(pC) arrow(svg,xC,ya,xC+Math.sign(pC)*(14+Math.abs(pC)*2.2),ya,"#c0392b",3.5);
        if(RA) arrow(svg,xA,y0+52,xA+Math.sign(RA)*(14+Math.abs(RA)*2.2),y0+52,"#2f7d4f",3.5);
        txt(svg,xA+Math.abs(RA)*2.2+30,y0+56,"R_A = "+fa(RA,0)+" kN",{size:12,anchor:"start",fill:"var(--ok)"});
        var k=60,xB2=xB+d1*k,xC2=xB2+(xC-xB)+d2*k,y1=190;
        svg.appendChild(s("text",{x:xA,y:y1-6,"font-size":12,fill:"currentColor"})).textContent="şekil değişimi (60 kat büyütülmüş)";
        svg.appendChild(s("rect",{x:xA,y:y1,width:xB2-xA,height:32,fill:"none",stroke:"var(--acc)","stroke-width":2}));
        svg.appendChild(s("rect",{x:xB2,y:y1,width:xC2-xB2,height:32,fill:"none",stroke:"var(--acc)","stroke-width":2}));
        [xB,xC].forEach(function(x){svg.appendChild(s("line",{x1:x,y1:y1-4,x2:x,y2:y1+36,stroke:"var(--muted)","stroke-dasharray":"4 3"}));});
        var yb=310,u=4;
        svg.appendChild(s("line",{x1:xA,y1:yb,x2:xC+10,y2:yb,stroke:"currentColor"}));
        txt(svg,xA-6,yb-22,"N",{size:12,anchor:"end"});
        function bar(x1,x2,N){var hh=N*u;svg.appendChild(s("rect",{x:x1,y:hh>=0?yb-hh:yb,width:x2-x1,height:Math.abs(hh),fill:N>=0?"#f2b3aa":"#a9c8ee",stroke:"currentColor"}));
          txt(svg,(x1+x2)/2,hh>=0?yb-hh-5:yb-hh+14,fa(N,1)+" kN",{size:12,bold:true});}
        bar(xA,xB,N1);bar(xB,xC,N2);
        txt(svg,xC+16,yb+4,"çekme +, basma −",{size:11,anchor:"start",fill:"var(--muted)"});
        mRA.set(fa(RA,1)+" kN");mN1.set(fa(N1,1)+" kN",N1<0?"warn":"");mN2.set(fa(N2,1)+" kN",N2<0?"warn":"");
        var dt=d1+d2;mD.set(fa(dt,3)+" mm",dt<0?"warn":"ok");
        steps.innerHTML="<b>1)</b> Tüm çubuk dengede: R<sub>A</sub> + ("+pB+") + ("+pC+") = 0 ⇒ R<sub>A</sub> = "+fa(RA,0)+" kN.<br><b>2)</b> A–B'yi kes, sol parçaya bak: duvar "+(RA>=0?"sağa itiyor":"sola çekiyor")+" ⇒ N₁ = "+fa(N1,1)+" kN ("+(N1<0?"basma":N1>0?"çekme":"yok")+").<br><b>3)</b> B–C'yi kes, sağ parçaya bak: C'deki kuvvet N₂ = "+fa(N2,1)+" kN ("+(N2<0?"basma":N2>0?"çekme":"yok")+").<br><b>4)</b> Δl₁ = N₁L₁/(SE) = "+fa(d1,3)+" mm, Δl₂ = "+fa(d2,3)+" mm, toplam "+fa(dt,3)+" mm.";
      }
      draw();
    },
    "Parçalı yük, ΔL toplamı: Sl.68–69 (−0,35 mm). Aynı mantık iki malzemeli parçalarda da: Q15, Q17, Q50, Ö5. Etiketler: Q1 Q2 Q13 Q15 Q17 Q50 Ö5 Ö6 Sl.69");
}});
