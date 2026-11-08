"use strict";
/* Bölüm 2: hiperstatik, termik, halka, kap, rijit kiriş, kafes */

section({id:"hiper", group:"2 · Çubuk sistemleri", title:"Hiperstatik: denge yetmez, şekle bakarız", build:function(){
  return widget(null,
    "Bilinmeyen sayısı denklem sayısından fazlaysa tek başına statik yetmez. Eksik denklemi şekil değiştirmeden alırız.",
    "<b>Tek cümle:</b> birbirine bağlı parçalar <b>birlikte şekil değiştirir</b> (uygunluk). Yük, parçaların <b>A·E</b> değeri (sertlik) oranında paylaşılır: sert olan çok yük alır.",
    function(box){
      var tb=tabs(["Beton–çelik kolon (Sl.70)","İki ucu duvara sabit çubuk (Q1, Q2)"],function(i){p0.style.display=i?"none":"";p1.style.display=i?"":"none";(i?draw1:draw0)();});
      var p0=h("div",{}),p1=h("div",{});
      box.append(tb,p0,p1);
      // --- kolon
      var Ac=50,Ab=350,F=100,L=3000,Ec=2e5,Eb=1e5;
      var c1=ctl("Çelik alanı A<sub>ç</sub>".replace(/<[^>]+>/g,""),20,200,5,50,"mm²",function(v){Ac=v;draw0();});
      var c2=ctl("Beton alanı A<sub>b</sub>".replace(/<[^>]+>/g,""),100,600,10,350,"mm²",function(v){Ab=v;draw0();});
      var c3=ctl("Yük F",20,200,5,100,"kN",function(v){F=v;draw0();});
      var sv0=svgBox(640,300),st0=h("div",{class:"stage"},sv0);
      var mc=metric("Çelik taşır"),mb=metric("Beton taşır"),ms=metric("Kısalma (ikisi aynı)"),mp=metric("A·E oranı");
      var tx0=h("div",{class:"steps"});
      p0.append(c1,c2,c3,st0,h("div",{class:"cards"},mc,mb,ms,mp),tx0);
      function draw0(){
        clear(sv0);
        var kc=Ac*Ec,kb=Ab*Eb,Fc=F*kc/(kc+kb),Fb=F-Fc,dl=F*1000*L/(kc+kb);
        var wc=Math.sqrt(Ac)*5,wb=Math.sqrt(Ab)*5,x0=110,y0=110,H=150,sh=Math.min(30,dl*60);
        sv0.appendChild(s("rect",{x:x0,y:y0+sh,width:wb,height:H-sh,fill:"#c9c6bd",stroke:"currentColor"}));
        sv0.appendChild(s("rect",{x:x0+wb,y:y0+sh,width:wc,height:H-sh,fill:"#6fa8e6",stroke:"currentColor"}));
        sv0.appendChild(s("rect",{x:x0-14,y:y0-10+sh,width:wb+wc+28,height:12,fill:"#888780",stroke:"currentColor"}));
        sv0.appendChild(s("line",{x1:x0-30,y1:y0+H,x2:x0+wb+wc+30,y2:y0+H,stroke:"currentColor","stroke-width":3}));
        sv0.appendChild(s("line",{x1:x0-20,y1:y0-10,x2:x0+wb+wc+20,y2:y0-10,stroke:"var(--muted)","stroke-dasharray":"4 3"}));
        arrow(sv0,x0+(wb+wc)/2,y0-60+sh,x0+(wb+wc)/2,y0-12+sh,"#c0392b",4);
        txt(sv0,x0+(wb+wc)/2,y0-66+sh,"F = "+F+" kN",{size:13,bold:true});
        txt(sv0,x0+wb/2,y0+H+18,"beton",{size:12});txt(sv0,x0+wb+wc/2,y0+H+18,"çelik",{size:12});
        txt(sv0,x0+wb+wc+50,y0-4,"plaka düz iner (rijit)",{size:11,anchor:"start",fill:"var(--muted)"});
        var bx=380,by=240,mx=F;
        function bar(y,v,col,lab){sv0.appendChild(s("rect",{x:bx,y:y,width:v/mx*220,height:22,fill:col,stroke:"currentColor"}));txt(sv0,bx-8,y+16,lab,{size:12,anchor:"end"});txt(sv0,bx+v/mx*220+6,y+16,f(v,1)+" kN",{size:12,anchor:"start",bold:true});}
        txt(sv0,bx,by-72,"yükün paylaşımı",{size:12,anchor:"start",fill:"var(--muted)"});
        bar(by-60,Fb,"#c9c6bd","beton");bar(by-30,Fc,"#6fa8e6","çelik");
        mc.set(f(Fc,1)+" kN ("+f(Fc/F*100,0)+"%)");mb.set(f(Fb,1)+" kN ("+f(Fb/F*100,0)+"%)");ms.set(f(dl,3)+" mm");mp.set(f(kb/kc,2)+" : 1");
        tx0.innerHTML="<b>Denge:</b> F<sub>ç</sub> + F<sub>b</sub> = "+F+" kN.<br><b>Uygunluk (plaka rijit):</b> ΔL<sub>ç</sub> = ΔL<sub>b</sub> ⇒ F<sub>ç</sub>L/(A<sub>ç</sub>E<sub>ç</sub>) = F<sub>b</sub>L/(A<sub>b</sub>E<sub>b</sub>) (L sadeleşir) ⇒ F<sub>b</sub> = "+f(kb/kc,2)+"·F<sub>ç</sub>.<br><b>Sonuç:</b> F<sub>ç</sub> = "+f(Fc,1)+" kN, F<sub>b</sub> = "+f(Fb,1)+" kN.";
      }
      // --- iki ucu sabit
      var a=750,P=4,A1=250,A2=500;
      var d1=ctl("C'nin A'dan uzaklığı a",100,900,50,750,"mm",function(v){a=v;draw1();});
      var d2=ctl("A–C kesiti A₁",100,1000,50,250,"mm²",function(v){A1=v;draw1();});
      var d3=ctl("C–B kesiti A₂",100,1000,50,500,"mm²",function(v){A2=v;draw1();});
      var d4=ctl("Yük P (C'de)",1,10,0.5,4,"kN",function(v){P=v;draw1();});
      var sv1=svgBox(640,220),st1=h("div",{class:"stage"},sv1);
      var mA=metric("A duvarının tepkisi"),mB=metric("B duvarının tepkisi"),mS1=metric("σ A–C"),mS2=metric("σ C–B");
      var tx1=h("div",{class:"steps"});
      p1.append(d1,d2,d3,d4,st1,h("div",{class:"cards"},mA,mB,mS1,mS2),tx1);
      function draw1(){
        clear(sv1);
        var E=2e5,f1=a/(A1*E),f2=(1000-a)/(A2*E),N1=P*1000*f2/(f1+f2),N2=-P*1000*f1/(f1+f2);
        var xA=50,xB=590,sc=(xB-xA)/1000,xC=xA+a*sc,y=90;
        var hh1=Math.sqrt(A1)*1.6,hh2=Math.sqrt(A2)*1.6;
        sv1.appendChild(s("line",{x1:xA,y1:30,x2:xA,y2:150,stroke:"currentColor","stroke-width":4}));
        sv1.appendChild(s("line",{x1:xB,y1:30,x2:xB,y2:150,stroke:"currentColor","stroke-width":4}));
        sv1.appendChild(s("rect",{x:xA,y:y-hh1/2,width:xC-xA,height:hh1,fill:"#f2b3aa",stroke:"currentColor"}));
        sv1.appendChild(s("rect",{x:xC,y:y-hh2/2,width:xB-xC,height:hh2,fill:"#a9c8ee",stroke:"currentColor"}));
        arrow(sv1,xC-48,y-52,xC-2,y-52,"#c0392b",4);
        txt(sv1,xC-48,y-60,"P = "+f(P,1)+" kN",{size:13,bold:true,anchor:"end"});
        txt(sv1,xC,y+Math.max(hh1,hh2)/2+16,"C",{size:13,bold:true});txt(sv1,xA,22,"A",{size:13,bold:true});txt(sv1,xB,22,"B",{size:13,bold:true});
        txt(sv1,(xA+xC)/2,y+4,"çekme",{size:12});txt(sv1,(xC+xB)/2,y+4,"basma",{size:12});
        txt(sv1,(xA+xC)/2,180,"a = "+a+" mm",{size:12,fill:"var(--muted)"});txt(sv1,(xC+xB)/2,180,(1000-a)+" mm",{size:12,fill:"var(--muted)"});
        mA.set(f(N1,0)+" N");mB.set(f(-N2,0)+" N");mS1.set(fa(N1/A1,2)+" MPa");mS2.set(fa(N2/A2,2)+" MPa");
        tx1.innerHTML="<b>Denge:</b> N₁ − N₂ = P (C düğümü). Tek denklem, iki bilinmeyen.<br><b>Uygunluk:</b> toplam boy değişmez: N₁·a/(A₁E) + N₂·(1000−a)/(A₂E) = 0.<br><b>Sonuç:</b> N₁ = P·f₂/(f₁+f₂) = "+f(N1,0)+" N, N₂ = −P·f₁/(f₁+f₂) = "+f(N2,0)+" N. Esnek (uzun/ince) kısım az, rijit (kısa/kalın) kısım çok yük alır. Varsayılan değerler Q1/Ö5(a): R<sub>A</sub>=571 N, R<sub>B</sub>=3429 N.";
      }
      tb.sel(0);
    },
    "İki yaklaşım çıkar: yük iki parçaya <b>paralel</b> biniyorsa ΔL eşit (beton–çelik, boru–çubuk), <b>iki ucu sabit</b> çubukta ΔL toplamı 0. Etiketler: Q1 Q2 Q3 Q4 Q8 Q9 Q10 Q13 Q14 Q15 Q46 Q53 Ö5 Ö6 Sl.70 Sl.71");
}});

section({id:"termik", group:"2 · Çubuk sistemleri", title:"Termik gerilme: ısınınca uzar, engellenirse zorlanır", build:function(){
  return widget(null,
    "Isınan metal uzamak ister. Uzaması engellenirse içinde kuvvet, yani gerilme doğar.",
    "<b>Tek cümle:</b> serbest uzama Δl = α·l·ΔT. Engellenmişse σ = E·α·ΔT ve <b>boydan bağımsızdır</b>. Boşluk varsa önce boşluk kapanır (gerilme yok), sonra kalan ΔT gerilme üretir.",
    function(box){
      var tb=tabs(["Serbest ya da engelli","Aralıklı iki çubuk (Sl.81)","Çubuk + yay (Sl.83)"],function(i){[q0,q1,q2].forEach(function(x,j){x.style.display=j===i?"":"none";});[d0,d1,d2][i]();});
      var q0=h("div",{}),q1=h("div",{}),q2=h("div",{});
      box.append(tb,q0,q1,q2);
      var al=12e-6,E=2e5;
      // 0
      var dT=50,Lm=2,fixed=false;
      var e1=ctl("Sıcaklık artışı ΔT",0,100,5,50,"°C",function(v){dT=v;d0();});
      var e2=ctl("Boy l",0.5,5,0.5,2,"m",function(v){Lm=v;d0();});
      var e3=h("label",{class:"note"},h("input",{type:"checkbox",onchange:function(){fixed=this.checked;d0();}})," Uçlar duvara sabit (engelli)");
      var s0=svgBox(640,180),g0=h("div",{class:"stage"},s0),mA=metric("Serbest uzama"),mB=metric("Gerilme σ"),mC=metric("Not");
      q0.append(e1,e2,e3,g0,h("div",{class:"cards"},mA,mB,mC));
      function d0(){
        clear(s0);var ext=al*Lm*1000*dT,sig=E*al*dT,x0=70,wd=Lm/5*420+60;
        s0.appendChild(s("line",{x1:x0-10,y1:30,x2:x0-10,y2:150,stroke:"currentColor","stroke-width":4}));
        var xend=x0+wd,k=fixed?0:Math.min(40,ext*10);
        if(fixed) s0.appendChild(s("line",{x1:xend+10,y1:30,x2:xend+10,y2:150,stroke:"currentColor","stroke-width":4}));
        s0.appendChild(s("rect",{x:x0,y:70,width:wd,height:40,fill:"none",stroke:"var(--muted)","stroke-dasharray":"4 3"}));
        s0.appendChild(s("rect",{x:x0,y:70,width:wd+k,height:40,fill:fixed?heat(sig/200):heat(dT/200),stroke:"currentColor"}));
        txt(s0,x0+wd/2,95,"l = "+f(Lm,1)+" m",{size:13});
        if(!fixed&&k>0){txt(s0,xend+k+10,130,"Δl",{size:13,anchor:"start",fill:"var(--bad)"});}
        mA.set(f(ext,2)+" mm");mB.set(fixed?"−"+f(sig,1)+" MPa (basma)":"0 (serbest)",fixed?"bad":"ok");
        mC.set(fixed?"l'ye bağlı değil":"duvar yok, uzar");
      }
      // 1
      var gap=3,T=50;
      var g1=ctl("Boşluk (toplam, 10 °C'de)",0,6,0.5,3,"mm",function(v){gap=v;d1();});
      var g2=ctl("Son sıcaklık T",10,100,5,50,"°C",function(v){T=v;d1();});
      var s1=svgBox(640,190),gg1=h("div",{class:"stage"},s1),m1=metric("Temas sıcaklığı"),m2=metric("Kalan ΔT"),m3=metric("Gerilme σ"),tx1=h("div",{class:"steps"});
      q1.append(g1,g2,gg1,h("div",{class:"cards"},m1,m2,m3),tx1);
      function d1(){
        clear(s1);var Lb=5000,Tc=10+(gap/2)/(al*Lb),free=al*Lb*(T-10),mv=Math.min(free,gap/2),rest=Math.max(0,T-Tc),sig=E*al*rest;
        var xl=50,xm=320,pxm=22,gx=gap*pxm/2;
        s1.appendChild(s("line",{x1:xl-6,y1:40,x2:xl-6,y2:150,stroke:"currentColor","stroke-width":4}));
        s1.appendChild(s("line",{x1:2*xm-xl+6,y1:40,x2:2*xm-xl+6,y2:150,stroke:"currentColor","stroke-width":4}));
        var wl=xm-gx-xl,hot=heat((T-10)/90);
        s1.appendChild(s("rect",{x:xl,y:80,width:wl+mv*pxm,height:36,fill:rest>0?heat(Math.min(1,sig/150)):hot,stroke:"currentColor"}));
        s1.appendChild(s("rect",{x:2*xm-xl-wl-mv*pxm,y:80,width:wl+mv*pxm,height:36,fill:rest>0?heat(Math.min(1,sig/150)):hot,stroke:"currentColor"}));
        var rem=(gap/2-mv)*pxm;
        txt(s1,xm,70,gap-2*mv>0.001?"boşluk "+f(gap-2*mv,2)+" mm":"değdi",{size:13,bold:true,fill:rest>0?"var(--bad)":"currentColor"});
        txt(s1,xm,150,"her çubuk 5 m",{size:12,fill:"var(--muted)"});
        if(rest>0){arrow(s1,xm-70,98,xm-12,98,"#c0392b",3);arrow(s1,xm+70,98,xm+12,98,"#c0392b",3);}
        m1.set(f(Tc,2)+" °C");m2.set(f(rest,2)+" °C",rest>0?"warn":"ok");m3.set(rest>0?"−"+f(sig,1)+" MPa (basma)":"0 (gerilme yok)",rest>0?"bad":"ok");
        tx1.innerHTML="<b>a)</b> Her çubuk boşluğun yarısını kapatır: gap/2 = α·l·(T<sub>t</sub>−10) ⇒ T<sub>t</sub> = 10 + "+f(gap/2,2)+"/(12·10⁻⁶·5000) = <b>"+f(Tc,2)+" °C</b>.<br><b>b)</b> Değdikten sonra iki çubuk iki ucu sabit tek çubuk gibi: σ = E·α·(T − T<sub>t</sub>) = 2·10⁵·12·10⁻⁶·"+f(rest,2)+" = <b>"+f(sig,1)+" MPa</b>. Boy girmedi. Sl.81–82: boşluk 3 mm, T=50 ⇒ 35 °C ve 36 MPa.";
      }
      // 2
      var dT2=55,kk=20;
      var y1=ctl("Çubuğun ısınması ΔT",0,100,5,55,"°C",function(v){dT2=v;d2();});
      var y2=ctl("Yay sabiti k",2,100,1,20,"kN/cm",function(v){kk=v;d2();});
      var s2=svgBox(640,240),gg2=h("div",{class:"stage"},s2),n1=metric("Kuvvet F"),n2=metric("Çubuk gerilmesi"),n3=metric("Yay kısalması"),tx2=h("div",{class:"steps"});
      q2.append(y1,y2,gg2,h("div",{class:"cards"},n1,n2,n3),tx2);
      function d2(){
        clear(s2);
        var l=200,S=2,Ec=2e7,k=kk*1000,free=al*l*dT2,f1=l/(S*Ec),F=free/(f1+1/k),sg=F/S,dy=F/k,ds=F*f1;
        var xl=50,xb=330,xr=590,sc=600;
        s2.appendChild(s("line",{x1:xl-6,y1:30,x2:xl-6,y2:130,stroke:"currentColor","stroke-width":4}));
        s2.appendChild(s("line",{x1:xr+6,y1:30,x2:xr+6,y2:130,stroke:"currentColor","stroke-width":4}));
        var xe=xb+(free-0)*sc*0.5*0+ (free)*sc*0.12;
        var xend=xb+ (free-dy)*sc*0.12-0;
        s2.appendChild(s("rect",{x:xl,y:60,width:xb-xl,height:40,fill:"none",stroke:"var(--muted)","stroke-dasharray":"4 3"}));
        s2.appendChild(s("rect",{x:xl,y:60,width:xb-xl+(free-dy)*sc*0.12,height:40,fill:heat(Math.min(1,sg/1500)),stroke:"currentColor"}));
        var xs=xb+(free-dy)*sc*0.12,xe2=xr,n=10,pts=[xs+","+80];
        for(var i=0;i<n;i++){pts.push((xs+(xe2-xs)*(i+0.5)/n)+","+(i%2?66:94));}
        pts.push(xe2+","+80);
        s2.appendChild(s("polyline",{points:pts.join(" "),fill:"none",stroke:"var(--cu)","stroke-width":2.5}));
        txt(s2,(xl+xb)/2,85,"çubuk 200 cm",{size:12});
        txt(s2,(xs+xe2)/2,50,"yay",{size:12,fill:"var(--cu)"});
        var by=170,w0=free*400;
        txt(s2,xl,by-12,"serbest uzama = çubuğun ezilmesi + yayın sıkışması",{size:12,anchor:"start",fill:"var(--muted)"});
        s2.appendChild(s("rect",{x:xl,y:by,width:ds/free*450,height:20,fill:"#6fa8e6",stroke:"currentColor"}));
        s2.appendChild(s("rect",{x:xl+ds/free*450,y:by,width:dy/free*450,height:20,fill:"#e8996d",stroke:"currentColor"}));
        txt(s2,xl+ds/free*225,by+36,"çubuk "+f(ds,4)+" cm",{size:11});txt(s2,xl+ds/free*450+dy/free*225,by+36,"yay "+f(dy,4)+" cm",{size:11});
        txt(s2,xl+470,by+14,f(free,3)+" cm",{size:12,anchor:"start",bold:true});
        n1.set(f(F,0)+" N");n2.set(f(sg,1)+" N/cm² ("+f(sg/100,2)+" MPa)");n3.set(f(dy,4)+" cm");
        tx2.innerHTML="<b>Serbest uzama:</b> α·l·ΔT = "+f(free,3)+" cm.<br><b>Uygunluk:</b> çubuğun ezilmesi + yayın sıkışması = serbest uzama ⇒ F·l/(S·E) + F/k = "+f(free,3)+".<br><b>Sonuç:</b> F = "+f(F,0)+" N, σ = F/S = "+f(sg,1)+" N/cm², yay kısalması = F/k = "+f(dy,3)+" cm. Sl.83–84: ΔT=55, k=20 kN/cm ⇒ F=2400 N, σ=1200 N/cm². Slayttaki yay kısalması 0,2 cm yazıyor, hesap 0,12 cm çıkar.";
      }
      tb.sel(0);
    },
    "Üç tip var: serbest/engelli (σ=EαΔT), boşluklu (önce T<sub>temas</sub>), yaylı/iki malzemeli (uygunluk). El notu: ε=α(T<sub>son</sub>−T<sub>ilk</sub>), σ=Eε. Etiketler: Q1 Q2 Q6 Q7 Q8 Q14 Q15 Q16 Q23 Q50 Q54 Ö5 Ö6 Sl.81 Sl.82 Sl.84");
}});

section({id:"halka", group:"2 · Çubuk sistemleri", title:"İç içe bakır–çelik halka", build:function(){
  return widget(null,
    "İki halka birbirine geçmiş. Isınınca bakır çelikten fazla büyümek ister ama çelik izin vermez.",
    "<b>Tek cümle:</b> iki fikirle çözülür. <b>(1)</b> Halkaların taşıdığı kuvvet eşit: σ<sub>ç</sub>·t<sub>ç</sub> = −σ<sub>b</sub>·t<sub>b</sub>. <b>(2)</b> Toplam şekil değişimi eşit: α·ΔT + σ/E iki halkada aynı.",
    function(box){
      var aB=16e-6,aC=12e-6,EB=1e5,EC=2e5,tC=10,D=2000,state=1;
      var cdt=ctl("Sıcaklık artışı ΔT",0,200,10,100,"°C",function(){draw();});
      var ctb=ctl("Bakır et kalınlığı",10,40,5,20,"mm",function(){draw();});
      var tb=tabs(["1 · Engel olmasa","2 · Gerçekte"],function(i){state=i+1;draw();});
      var svg=svgBox(300,300),st=h("div",{class:"stage"},svg),bars=h("div",{});
      var mC=metric("Çelik gerilmesi"),mB=metric("Bakır gerilmesi"),msg=h("div",{class:"say"}),chk=h("div",{class:"note"});
      box.append(cdt,ctb,tb,h("div",{class:"two"},st,h("div",{},msg,bars,h("div",{class:"cards"},mC,mB),chk)));
      function ring(r,sw,col,op,dash){return s("circle",{cx:150,cy:150,r:r,fill:"none",stroke:col,"stroke-width":sw,opacity:op,"stroke-dasharray":dash?"4 4":"none"});}
      function draw(){
        var dt=cdt.get(),tbv=ctb.get(),sC=(aB-aC)*dt/(1/EC+tC/(tbv*EB)),sB=-sC*tC/tbv,eBf=aB*dt,eCf=aC*dt,eF=aC*dt+sC/EC;
        clear(svg);var R0=85,K=150,swB=tbv*0.5,swC=tC*0.5;
        svg.appendChild(ring(R0,1,"#888780",1,true));
        if(state===1){svg.appendChild(ring(R0*(1+K*eCf),swC,"#378add",0.8));svg.appendChild(ring(R0*(1+K*eBf),swB,"#d85a30",0.8));}
        else{var r=R0*(1+K*eF);svg.appendChild(ring(r+swC/2,swC,"#378add",1));svg.appendChild(ring(r-swB/2,swB,"#d85a30",1));}
        txt(svg,150,292,"çizim büyütülmüştür",{size:11,fill:"var(--muted)"});
        var mx=aB*200*D;
        bars.innerHTML="";
        [["Bakır büyümek ister",eBf*D,"#d85a30"],["Çelik büyümek ister",eCf*D,"#378add"]].forEach(function(b){
          bars.appendChild(h("div",{class:"note",style:"margin:6px 0 2px"},b[0]+": "+f(b[1],2)+" mm"));
          bars.appendChild(h("div",{style:"background:var(--soft);border-radius:4px;height:14px"},h("div",{style:"height:14px;border-radius:4px;background:"+b[2]+";width:"+(b[1]/mx*100)+"%"})));
        });
        if(state===1){msg.innerHTML="Bakır çeliğe göre <b>"+f((eBf-eCf)*D,2)+" mm</b> fazla büyümek ister. İç içe sıkışık olduğu için olmaz, bakır çeliği dışarı iter.";mC.set("—");mB.set("—");chk.textContent="Gerilmeleri görmek için 2. sekmeye geç.";}
        else{msg.innerHTML="Bakır geri çekilir (basma), çelik zorla açılır (çekme). İkisi aynı çapta buluşur: <b>"+f(eF*D,2)+" mm</b>.";
          mC.set(fa(sC,1)+" MPa","warn");mB.set(fa(sB,1)+" MPa","bad");
          chk.innerHTML="Kuvvet eşit mi? σ·t: çelik "+f(sC*tC,0)+", bakır "+f(Math.abs(sB*tbv),0)+".<br>ε eşit mi? bakır "+f((aB*dt+sB/EB)*1000,3)+" ‰, çelik "+f((aC*dt+sC/EC)*1000,3)+" ‰.";}
      }
      tb.sel(0);
    },
    "Sl.85–86: t<sub>b</sub>=20, t<sub>ç</sub>=10, ΔT=100 ⇒ σ<sub>ç</sub>=+40, σ<sub>b</sub>=−20 MPa. Çok genleşen malzeme sıkışır (basma), az genleşen gerilir. Etiketler: Q11 Q12 Q18 Sl.85 Sl.86");
}});

section({id:"kap", group:"2 · Çubuk sistemleri", title:"İnce cidarlı kap: çevresel ve boyuna gerilme", build:function(){
  return widget(null,
    "İçerideki basınç kabı hem çevresinden yırtmaya hem uzunlamasına koparmaya çalışır.",
    "<b>Tek cümle:</b> σ<sub>t</sub> = P·r/t (çevresel) ve σ<sub>l</sub> = P·r/(2t) (boyuna). Çevresel gerilme boyunadan <b>2 kat</b> büyüktür, bu yüzden kap <b>eksene paralel</b> yırtılır. Geçerlilik: t/r &lt; 0,1, yalnız iç basınç.",
    function(box){
      var cp=ctl("İç basınç P",0.5,8,0.1,2,"MPa",function(){draw();});
      var cr=ctl("Yarıçap r",100,500,10,250,"mm",function(){draw();});
      var ct=ctl("Et kalınlığı t",2,25,1,5,"mm",function(){draw();});
      var svg=svgBox(640,240),st=h("div",{class:"stage"},svg);
      var m1=metric("σ<sub>t</sub> çevresel"),m2=metric("σ<sub>l</sub> boyuna"),m3=metric("t / r"),msg=h("div",{class:"say"});
      box.append(cp,cr,ct,st,msg,h("div",{class:"cards"},m1,m2,m3));
      function draw(){
        clear(svg);var P=cp.get(),r=cr.get(),t=ct.get(),st1=P*r/t,sl=st1/2,lim=150;
        var cx=150,cy=120,R=80,tw=Math.max(3,t/25*18);
        svg.appendChild(s("circle",{cx:cx,cy:cy,r:R,fill:"none",stroke:"var(--st)","stroke-width":tw}));
        for(var i=0;i<12;i++){var an=i*Math.PI/6;arrow(svg,cx+Math.cos(an)*15,cy+Math.sin(an)*15,cx+Math.cos(an)*(R-tw/2-4),cy+Math.sin(an)*(R-tw/2-4),"#c0392b",1.8);}
        txt(svg,cx,cy+4,"P",{size:15,bold:true,fill:"var(--bad)"});
        arrow(svg,cx+R+tw/2+2,cy,cx+R+tw/2+2,cy-34,"#2f7d4f",3);arrow(svg,cx-R-tw/2-2,cy,cx-R-tw/2-2,cy+34,"#2f7d4f",3);
        txt(svg,cx,cy+R+tw+16,"kesit: çevresel σ_t",{size:12});
        var x0=330,x1=600,y0=50,y1=190,burst=st1>lim;
        svg.appendChild(s("rect",{x:x0,y:y0,width:x1-x0,height:y1-y0,rx:16,fill:"var(--soft)",stroke:"var(--st)","stroke-width":tw*0.6}));
        arrow(svg,x1+4,120,x1+36,120,"#2f7d4f",3);arrow(svg,x0-4,120,x0-36,120,"#2f7d4f",3);
        txt(svg,(x0+x1)/2,y1+24,"yandan görünüş: boyuna σ_l",{size:12});
        if(burst){svg.appendChild(s("polyline",{points:(x0+30)+",120 "+(x0+80)+",114 "+(x0+130)+",126 "+(x0+190)+",118 "+(x1-30)+",122",fill:"none",stroke:"var(--bad)","stroke-width":3}));
          txt(svg,(x0+x1)/2,108,"patlak eksene paralel",{size:12,fill:"var(--bad)",bold:true});}
        m1.set(f(st1,1)+" MPa",burst?"bad":"");m2.set(f(sl,1)+" MPa");m3.set(f(t/r,3),t/r<0.1?"ok":"bad");
        msg.innerHTML=(t/r<0.1?"İnce cidar koşulu sağlanıyor (t/r &lt; 0,1). ":"<b>t/r ≥ 0,1:</b> kap ince cidarlı sayılmaz, formül geçerli değil. ")+(burst?"σ<sub>t</sub> örnek sınırı 150 MPa'yı aştı: kap çevresel gerilmeden <b>eksene paralel</b> yırtılır.":"σ<sub>t</sub> = P·r/t, σ<sub>l</sub> = σ<sub>t</sub>/2. Kayma gerilmesi yok.");
      }
      draw();
    },
    "Direkt hesap Sl.77–78'de; sorularda genelde halkanın sıkışıklık/ısınma problemi içinde geçer (σ = pD/2t). Etiketler: Q11 Q12 Q18 Sl.76 Sl.77 Sl.78");
}});

section({id:"rijit", group:"2 · Çubuk sistemleri", title:"Rijit kiriş + yay ya da çubuk", build:function(){
  return widget(null,
    "Rijit kiriş eğilmez, sadece mafsalı etrafında döner. Üzerine bağlı çubuk ve yaylar dönmeye göre şekil değiştirir.",
    "<b>Tek cümle:</b> yer değiştirmeler mafsala uzaklıkla orantılı (benzer üçgenler): δ<sub>i</sub> = θ·x<sub>i</sub>. Kuvvetler F<sub>i</sub> = k<sub>i</sub>δ<sub>i</sub>. Moment dengesi (mafsala göre) θ'yı verir.",
    function(box){
      var cx1=ctl("Çubuğun mafsala uzaklığı",0.5,4,0.5,1,"m",function(){draw();});
      var ck1=ctl("Çubuk rijitliği EA/l",1,100,1,56,"kN/mm",function(){draw();});
      var cx2=ctl("Yayın mafsala uzaklığı",0.5,4,0.5,3,"m",function(){draw();});
      var ck2=ctl("Yay sabiti k",0,100,0.5,5,"kN/mm",function(){draw();},1);
      var cxp=ctl("Yükün mafsala uzaklığı",1,5,0.5,5,"m",function(){draw();});
      var cP=ctl("Yük P",1,20,1,5,"kN",function(){draw();});
      var svg=svgBox(640,260),st=h("div",{class:"stage"},svg);
      var m1=metric("Dönme θ"),m2=metric("δ çubuk"),m3=metric("δ yay"),m4=metric("Çubuk kuvveti"),m5=metric("Yay kuvveti"),tx=h("div",{class:"steps"});
      box.append(cx1,ck1,cx2,ck2,cxp,cP,st,h("div",{class:"cards"},m1,m2,m3,m4,m5),tx);
      function draw(){
        clear(svg);
        var x1=cx1.get(),k1=ck1.get(),x2=cx2.get(),k2=ck2.get(),xp=cxp.get(),P=cP.get();
        var th=P*xp/(1000*(k1*x1*x1+k2*x2*x2)),d1=th*x1*1000,d2=th*x2*1000,F1=k1*d1,F2=k2*d2;
        var xa=60,yb=130,pm=100,ang=Math.min(0.2,th*350);
        function pos(x){return {x:xa+x*pm*Math.cos(ang),y:yb+x*pm*Math.sin(ang)};}
        svg.appendChild(s("line",{x1:xa-20,y1:20,x2:xa+530,y2:20,stroke:"currentColor","stroke-width":3}));
        svg.appendChild(s("line",{x1:xa-20,y1:235,x2:xa+530,y2:235,stroke:"currentColor","stroke-width":3}));
        svg.appendChild(s("polygon",{points:xa+","+yb+" "+(xa-9)+","+(yb+16)+" "+(xa+9)+","+(yb+16),fill:"var(--soft)",stroke:"currentColor"}));
        svg.appendChild(s("line",{x1:xa,y1:yb,x2:xa+5*pm,y2:yb,stroke:"var(--muted)","stroke-dasharray":"5 4"}));
        var e=pos(5);svg.appendChild(s("line",{x1:xa,y1:yb,x2:e.x,y2:e.y,stroke:"var(--acc)","stroke-width":6,"stroke-linecap":"round"}));
        var pa=pos(x1);svg.appendChild(s("line",{x1:xa+x1*pm,y1:20,x2:pa.x,y2:pa.y,stroke:"var(--st)","stroke-width":5}));
        txt(svg,xa+x1*pm,12,"çubuk",{size:12,fill:"var(--st)"});
        var pb=pos(x2),xs=pb.x,ys0=pb.y,ys1=235,n=8,pts=[xs+","+ys0];
        for(var i=0;i<n;i++){pts.push((xs+(i%2?-10:10))+","+(ys0+(ys1-ys0)*(i+0.5)/n));}
        pts.push(xs+","+ys1);svg.appendChild(s("polyline",{points:pts.join(" "),fill:"none",stroke:"var(--cu)","stroke-width":2.5}));
        txt(svg,xa+x2*pm,250,"yay",{size:12,fill:"var(--cu)"});
        var pp=pos(xp);arrow(svg,pp.x,pp.y-60,pp.x,pp.y-4,"#c0392b",4);txt(svg,pp.x,pp.y-68,"P = "+P+" kN",{size:13,bold:true});
        txt(svg,xa,yb+34,"mafsal A",{size:12});
        m1.set(f(th*1e4,3)+" ×10⁻⁴ rad");m2.set(f(d1,3)+" mm");m3.set(f(d2,3)+" mm");m4.set(f(F1,2)+" kN");m5.set(f(F2,3)+" kN");
        tx.innerHTML="<b>Geometri:</b> δ<sub>çubuk</sub> = θ·"+x1+" m, δ<sub>yay</sub> = θ·"+x2+" m (kiriş eğilmez, düz kalır, sadece döner).<br><b>Denge (A'ya göre moment):</b> F<sub>çubuk</sub>·"+x1+" + F<sub>yay</sub>·"+x2+" = P·"+xp+" ⇒ "+f(F1*x1,2)+" + "+f(F2*x2,2)+" = "+f(P*xp,2)+" kN·m ✓.<br>Çubuk yaydan çok sertse yükün neredeyse tamamını çubuk taşır (Ö8, Q19).";
      }
      draw();
    },
    "Rijit kirişe bağlı iki elemanlı sorular: kiriş döner, δ'lar oranlanır. Etiketler: Q19 Q22 Q24 Q43 Q47 Ö4 Ö8 Sl.84 Sl.89");
}});

section({id:"kafes", group:"2 · Çubuk sistemleri", title:"İki çubuklu kafes: düğüm dengesi", build:function(){
  return widget(null,
    "Çubuklar sadece boyuna kuvvet taşır. B düğümünü izole edip üç kuvvetin dengesini yazarız.",
    "<b>Tek cümle:</b> çubuk kuvvetlerini önce <b>çekme</b> varsay (düğümü çubuğa doğru çeker). Eksi çıkarsa basmadır. Eğik çubukta bileşenler 3-4-5 gibi üçgenden gelir.",
    function(box){
      var ch=ctl("Düşey mesafe h (A ile C arası)",1.5,6,0.5,3,"m",function(){draw();});
      var cP=ctl("Yük P",1,30,1,10,"kN",function(){draw();});
      var svg=svgBox(640,300),st=h("div",{class:"stage"},svg);
      var m1=metric("F<sub>AB</sub> (eğik)"),m2=metric("F<sub>BC</sub> (yatay)"),m3=metric("σ<sub>AB</sub> (S=500)"),m4=metric("Δl<sub>AB</sub>"),tx=h("div",{class:"steps"});
      box.append(ch,cP,st,h("div",{class:"cards"},m1,m2,m3,m4),tx);
      function draw(){
        clear(svg);var hh=ch.get(),P=cP.get(),w=4,L=Math.sqrt(w*w+hh*hh),FAB=P*L/hh,FBC=-P*w/hh,sc=48;
        var ax=70,ay=40,cy=ay+hh*sc,bx=ax+w*sc,by=cy;
        for(var i=0;i<8;i++)svg.appendChild(s("line",{x1:ax,y1:20+i*((cy-ay+30)/7),x2:ax-12,y2:30+i*((cy-ay+30)/7),stroke:"currentColor"}));
        svg.appendChild(s("line",{x1:ax,y1:20,x2:ax,y2:cy+10,stroke:"currentColor","stroke-width":3}));
        svg.appendChild(s("line",{x1:ax,y1:ay,x2:bx,y2:by,stroke:"#d85a30","stroke-width":6,"stroke-linecap":"round"}));
        svg.appendChild(s("line",{x1:ax,y1:cy,x2:bx,y2:by,stroke:"#378add","stroke-width":6,"stroke-linecap":"round"}));
        txt(svg,ax-18,ay+4,"A",{size:13,bold:true});txt(svg,ax-18,cy+4,"C",{size:13,bold:true});txt(svg,bx+14,by+16,"B",{size:13,bold:true});
        txt(svg,(ax+bx)/2+14,(ay+by)/2-10,"AB  "+f(L,2)+" m",{size:12,fill:"#d85a30"});txt(svg,(ax+bx)/2,cy+18,"BC  "+w+" m",{size:12,fill:"#378add"});
        arrow(svg,bx,by,bx,by+16+P*2.6,"#c0392b",4);txt(svg,bx+34,by+30,"P",{size:13,bold:true,fill:"var(--bad)"});
        var ox=420,oy=70,v=Math.min(4,150/Math.max(FAB,Math.abs(FBC),P));
        var p1=[ox,oy+P*v*0+0],q1=[ox,oy+P*v],q2=[ox+Math.abs(FBC)*v,oy+P*v];
        txt(svg,ox+60,40,"kuvvet üçgeni (B düğümü)",{size:12,fill:"var(--muted)"});
        arrow(svg,ox,oy,ox,oy+P*v,"#c0392b",3);
        arrow(svg,ox,oy+P*v,q2[0],q2[1],"#378add",3);
        arrow(svg,q2[0],q2[1],ox,oy,"#d85a30",3);
        txt(svg,ox-10,oy+P*v/2,"P",{size:12,anchor:"end",fill:"var(--bad)"});txt(svg,(ox+q2[0])/2,oy+P*v+16,"|F_BC|",{size:12,fill:"#378add"});txt(svg,q2[0]+8,(oy+q2[1])/2,"F_AB",{size:12,anchor:"start",fill:"#d85a30"});
        txt(svg,ox+50,oy+P*v+44,"üç kuvvet uç uca eklenince kapanır = denge",{size:11,fill:"var(--muted)"});
        var sg=FAB*1000/500,dl=FAB*1000*L*1000/(500*2e5);
        m1.set(fa(FAB,2)+" kN");m2.set(fa(FBC,2)+" kN","warn");m3.set(f(sg,1)+" MPa");m4.set(f(dl,3)+" mm");
        tx.innerHTML="<b>ΣF<sub>y</sub> = 0:</b> F<sub>AB</sub>·(h/L) − P = 0 ⇒ F<sub>AB</sub> = P·L/h = "+f(FAB,2)+" kN (çekme).<br><b>ΣF<sub>x</sub> = 0:</b> −F<sub>BC</sub> − F<sub>AB</sub>·(4/L) = 0 ⇒ F<sub>BC</sub> = −P·4/h = "+f(FBC,2)+" kN (basma). Eğik çubuk B'yi yukarı ve sola çeker, yatay çubuk B'yi sağa iter.<br>h = 3 m, P = 10 kN ⇒ 16,67 ve −13,33 kN (Sl.66–67).";
      }
      draw();
    },
    "Kuvvet hesaplayıp gerilme hesabı (basit) tipi: \"önce çubuk kuvveti, sonra σ=F/S\" (GA 1 notu). Etiketler: Q39 Q40 Q41 Q46 Sl.66 Sl.67");
}});
