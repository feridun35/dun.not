"use strict";
/* Bölüm 3: Mohr, genelleştirilmiş Hooke, kayma */

section({id:"mohr", group:"3 · Gerilme analizi", title:"Mohr çemberi: elemanı döndür, çemberde izle", build:function(){
  return widget(null,
    "Aynı malzeme noktası farklı açılarla kesilirse gerilme değişir. Mohr çemberi bu değişimin haritasıdır.",
    "<b>Tek cümle:</b> elemanı θ kadar döndürmek, çemberde noktayı <b>2θ</b> kadar döndürmektir. Çemberin σ eksenini kestiği iki nokta asal gerilmeler (τ=0), en tepe ve en alt nokta ±τ<sub>max</sub> = ±R.",
    function(box){
      var sx=100,sy=-50,tau=75,th=30;
      var cx=ctl("σ<sub>x</sub>".replace(/<[^>]+>/g,""),-150,150,5,100,"MPa",function(v){sx=v;draw();});
      var cy=ctl("σy",-150,150,5,-50,"MPa",function(v){sy=v;draw();});
      var ct=ctl("τxy",-100,100,5,75,"MPa",function(v){tau=v;draw();});
      var cth=ctl("Kesen düzlemin açısı θ",-90,180,1,30,"°",function(v){th=v;draw();});
      var presets=[["Sl.45 örneği",100,-50,75],["Q27",100,0,50],["Q28/Q33 tek eksenli",100,0,0],["Q29",-100,50,40],["Q30",150,-60,75],["Q31",-120,80,60],["Q35",100,-60,30],["Q36",-50,80,40],["Q37",100,-50,40],["Q38",-80,0,50]];
      var pw=h("div",{class:"tabs"});
      presets.forEach(function(p){pw.appendChild(h("button",{onclick:function(){sx=p[1];sy=p[2];tau=p[3];cx.set(sx);cy.set(sy);ct.set(tau);draw();}},p[0]));});
      var jump=h("div",{class:"tabs"},
        h("button",{onclick:function(){var R2=Math.atan2(tau,(sx-sy)/2)*90/Math.PI;th=Math.round(R2);cth.set(th);draw();}},"θ → asal düzlem (σ max)"),
        h("button",{onclick:function(){var R2=Math.atan2(tau,(sx-sy)/2)*90/Math.PI;th=Math.round(R2-45);cth.set(th);draw();}},"θ → maks. kayma düzlemi"),
        h("button",{onclick:function(){th=0;cth.set(0);draw();}},"θ = 0"));
      var sv=svgBox(300,280),sv2=svgBox(340,280);
      var st=h("div",{class:"two"},h("div",{class:"stage"},sv),h("div",{class:"stage"},sv2));
      var m1=metric("σ<sub>n</sub> (bu düzlemde)"),m2=metric("τ<sub>n</sub> (bu düzlemde)"),m3=metric("σ<sub>max</sub>"),m4=metric("σ<sub>min</sub>"),m5=metric("τ<sub>max</sub> = R"),m6=metric("Asal düzlem açısı α");
      var tx=h("div",{class:"steps"});
      box.append(h("div",{class:"note"},"Hazır sorular:"),pw,cx,cy,ct,cth,jump,st,h("div",{class:"cards"},m1,m2,m3,m4,m5,m6),tx);
      function draw(){
        var OM=(sx+sy)/2,a=(sx-sy)/2,R=Math.sqrt(a*a+tau*tau),phi=Math.atan2(tau,a),t2=th*Math.PI/90;
        var sn=OM+a*Math.cos(t2)+tau*Math.sin(t2),tn=-a*Math.sin(t2)+tau*Math.cos(t2);
        clear(sv);clear(sv2);
        // eleman
        var X=150,Y=140,hf=42,k=0.45;
        sv.appendChild(s("rect",{x:X-hf,y:Y-hf,width:2*hf,height:2*hf,fill:"var(--soft)",stroke:"currentColor","stroke-width":1.5}));
        function nrm(v,x1,y1,dx,dy){if(Math.abs(v)<1)return;var L=12+Math.abs(v)*k,sg=v>0?1:-1;
          if(sg>0)arrow(sv,x1,y1,x1+dx*L,y1+dy*L,"#c0392b",3);else arrow(sv,x1+dx*L,y1+dy*L,x1,y1,"#c0392b",3);}
        nrm(sx,X+hf,Y,1,0);nrm(sx,X-hf,Y,-1,0);nrm(sy,X,Y-hf,0,-1);nrm(sy,X,Y+hf,0,1);
        function sh(x1,y1,dx,dy){if(Math.abs(tau)<1)return;var L=10+Math.abs(tau)*0.3,sg=tau>0?1:-1;arrow(sv,x1,y1,x1+sg*dx*L,y1+sg*dy*L,"#2f7d4f",2.5);}
        sh(X+hf+6,Y+hf*0.45,0,-1);sh(X-hf-6,Y-hf*0.45,0,1);sh(X-hf*0.45,Y-hf-6,1,0);sh(X+hf*0.45,Y+hf+6,-1,0);
        txt(sv,X,22,"σy = "+sy,{size:12});txt(sv,X+hf+62,Y-4,"σx = "+sx,{size:12});
        var nx=Math.cos(th*Math.PI/180),ny=-Math.sin(th*Math.PI/180);
                var tx1=X+ny*95,ty1=Y-nx*95,tx2=X-ny*95,ty2=Y+nx*95;
        sv.appendChild(s("line",{x1:tx1,y1:ty1,x2:tx2,y2:ty2,stroke:"var(--acc)","stroke-width":4,"stroke-linecap":"round",opacity:0.9}));
        arrow(sv,X,Y,X+nx*70,Y+ny*70,"var(--acc)",3);
        txt(sv,X+nx*86,Y+ny*86+4,"n",{size:13,bold:true,fill:"var(--acc)"});
        sv.appendChild(s("path",{d:"M "+(X+30)+" "+Y+" A 30 30 0 0 "+(th>0?0:1)+" "+(X+30*Math.cos(th*Math.PI/180))+" "+(Y-30*Math.sin(th*Math.PI/180)),fill:"none",stroke:"var(--acc)"}));
        txt(sv,X+46,Y-8,"θ="+th+"°",{size:12,fill:"var(--acc)"});
        txt(sv,150,268,"eleman: kırmızı normal, yeşil kayma",{size:11,fill:"var(--muted)"});
        // çember
        var cxp=170,cyp=140,sc=Math.min(3,105/Math.max(R,15)),P=function(sg,tt){return [cxp+(sg-OM)*sc,cyp-tt*sc];};
        var z=P(0,0);
        sv2.appendChild(s("line",{x1:10,y1:cyp,x2:330,y2:cyp,stroke:"currentColor","stroke-width":1}));
        sv2.appendChild(s("line",{x1:z[0],y1:15,x2:z[0],y2:265,stroke:"currentColor","stroke-width":1}));
        txt(sv2,326,cyp-6,"σ",{size:13,anchor:"end"});txt(sv2,z[0]+8,24,"τ",{size:13,anchor:"start"});
        sv2.appendChild(s("circle",{cx:cxp,cy:cyp,r:R*sc,fill:"none",stroke:"var(--muted)","stroke-width":2}));
        var A=P(sx,tau),B=P(sy,-tau),C=P(sn,tn);
        sv2.appendChild(s("line",{x1:A[0],y1:A[1],x2:B[0],y2:B[1],stroke:"var(--muted)","stroke-dasharray":"4 3"}));
        sv2.appendChild(s("line",{x1:cxp,y1:cyp,x2:C[0],y2:C[1],stroke:"var(--acc)","stroke-width":2.5}));
        function dot(p,col,lab,dx,dy){sv2.appendChild(s("circle",{cx:p[0],cy:p[1],r:5,fill:col}));txt(sv2,p[0]+dx,p[1]+dy,lab,{size:12,fill:col,bold:true});}
        dot(P(OM+R,0),"#2f7d4f","σmax",0,18);dot(P(OM-R,0),"#2f7d4f","σmin",0,18);
        dot(P(OM,R),"#b4540a","τmax",24,4);dot(P(OM,-R),"#b4540a","τmin",24,4);
        dot(A,"#888","a",-10,-6);dot(B,"#888","b",10,14);
        sv2.appendChild(s("circle",{cx:C[0],cy:C[1],r:7,fill:"var(--acc)",stroke:"var(--card)","stroke-width":2}));
        txt(sv2,C[0]+14,C[1]-8,"C",{size:13,bold:true,fill:"var(--acc)"});
        txt(sv2,cxp,cyp+14,"M",{size:12});
        txt(sv2,170,274,"çemberde dönüş 2θ = "+(2*th)+"° (τ yukarı çizilince saat yönünde)",{size:10.5,fill:"var(--muted)"});
        var s1=OM+R,s2=OM-R,ap=0.5*phi*180/Math.PI;
        m1.set(fa(sn,1)+" MPa");m2.set(fa(tn,1)+" MPa");m3.set(f(s1,1)+" MPa");m4.set(f(s2,1)+" MPa");m5.set(f(R,1)+" MPa");m6.set(f(ap,1)+"°");
        tx.innerHTML="<b>1)</b> OM = (σx+σy)/2 = "+f(OM,1)+", R = √(((σx−σy)/2)² + τ²) = "+f(R,1)+".<br><b>2)</b> σ<sub>max,min</sub> = OM ± R = "+f(s1,1)+" ve "+f(s2,1)+" MPa. τ<sub>max</sub> = ±R = ±"+f(R,1)+" MPa (asal düzlemlerle 45° fark, ortalama gerilme OM).<br><b>3)</b> Asal düzlem: tan2α = 2τ/(σx−σy) ⇒ α = "+f(ap,1)+"°.<br><b>4)</b> θ düzleminde: σ<sub>n</sub> = OM + ((σx−σy)/2)cos2θ + τ sin2θ = "+f(sn,1)+", τ<sub>n</sub> = −((σx−σy)/2)sin2θ + τ cos2θ = "+f(tn,1)+" MPa.<br><span class='note'>Dikkat: Q/Ö çözümlerinde C için σ<sub>C</sub> = OM ± R·cos β, τ<sub>C</sub> = ∓R·sin β yazılır; β çember üzerinde ölçülen açıdır ve şeklin işaret kuralına bağlıdır. Burada GA 24 formülleri kullanılıyor, büyüklükler aynıdır.</span>";
      }
      draw();
    },
    "Hocanın notu: <b>Mohr çemberi 4 soru</b>, düzlemde gerilme dönüşümü 1 soru, GA 44 örneği \"bu tarz\" (a: asal gerilme ve düzlemler, b: taralı düzlemde σ ve τ, c: maks. kayma). Üç eksenli Mohr çıkmaz. Etiketler: Q27 Q28 Q29 Q30 Q31 Q32 Q33 Q34 Q35 Q36 Q37 Q38 GA 24 GA 27 GA 35 GA 44");
}});

section({id:"hooke2", group:"4 · Şekil değiştirme", title:"Genel Hooke: bir yöndeki yük diğer yönleri de etkiler", build:function(){
  return widget(null,
    "Çubuğu çekince uzar, aynı anda yanlardan incelir. Levhada üç yönün etkisi birbirine karışır.",
    "<b>Tek cümle:</b> ε<sub>x</sub> = [σ<sub>x</sub> − ν(σ<sub>y</sub> + σ<sub>z</sub>)]/E. Kendi yönündeki gerilme uzatır, diğer iki yönün gerilmesi ν kadar kısaltır. Bir yönde şekil değişimi engelliyse (ε=0) o yöndeki gerilme formülden bulunur.",
    function(box){
      var tb=tabs(["Levha: üç yönlü Hooke","Kayma: τ = G·γ"],function(i){a0.style.display=i?"none":"";a1.style.display=i?"":"none";});
      var a0=h("div",{}),a1=h("div",{});box.append(tb,a0,a1);
      var E=2e5;
      var cx=ctl("σx",-300,300,10,200,"MPa",function(){d0();}),cy=ctl("σy",-300,300,10,100,"MPa",function(){d0();}),cz=ctl("σz (kalınlık yönü)",-300,300,10,0,"MPa",function(){d0();}),cn=ctl("Poisson ν",0.1,0.5,0.05,0.25,"",function(){d0();},2);
      var lock=h("label",{class:"note"},h("input",{type:"checkbox",onchange:function(){d0();}})," Kalınlık yönü engelli (ε_z = 0)");
      var sv=svgBox(640,240),st=h("div",{class:"stage"},sv);
      var m1=metric("ε<sub>x</sub>"),m2=metric("ε<sub>y</sub>"),m3=metric("ε<sub>z</sub>"),m4=metric("Δl<sub>x</sub> (600 mm)"),m5=metric("Δl<sub>y</sub> (200 mm)"),m6=metric("Δt (10 mm)"),tx0=h("div",{class:"steps"});
      a0.append(cx,cy,cz,cn,lock,st,h("div",{class:"cards"},m1,m2,m3,m4,m5,m6),tx0);
      function d0(){
        clear(sv);var nu=cn.get(),sxv=cx.get(),syv=cy.get(),szv=cz.get(),lk=lock.querySelector("input").checked;
        if(lk){szv=nu*(sxv+syv);cz.set(Math.max(-300,Math.min(300,Math.round(szv))));}
        var ex=(sxv-nu*(syv+szv))/E,ey=(syv-nu*(sxv+szv))/E,ez=(szv-nu*(sxv+syv))/E,K=120;
        var X=250,Y=120,w=240,hh=100;
        sv.appendChild(s("rect",{x:X-w/2,y:Y-hh/2,width:w,height:hh,fill:"none",stroke:"var(--muted)","stroke-dasharray":"4 3"}));
        var w2=w*(1+K*ex),h2=hh*(1+K*ey);
        sv.appendChild(s("rect",{x:X-w2/2,y:Y-h2/2,width:w2,height:h2,fill:"#9fc3ee",stroke:"currentColor","stroke-width":1.5,opacity:0.9}));
        function nr(v,x,y,dx,dy){if(Math.abs(v)<2)return;var L=10+Math.abs(v)*0.18;if(v>0)arrow(sv,x,y,x+dx*L,y+dy*L,"#c0392b",3);else arrow(sv,x+dx*L,y+dy*L,x,y,"#c0392b",3);}
        nr(sxv,X+w2/2,Y,1,0);nr(sxv,X-w2/2,Y,-1,0);nr(syv,X,Y-h2/2,0,-1);nr(syv,X,Y+h2/2,0,1);
        txt(sv,X,Y+4,"x →  y ↑",{size:12});
        var tz=14*(1+K*ez);
        txt(sv,520,60,"kalınlık (yandan)",{size:12,fill:"var(--muted)"});
        sv.appendChild(s("rect",{x:490,y:80,width:60,height:14,fill:"none",stroke:"var(--muted)","stroke-dasharray":"3 3"}));
        sv.appendChild(s("rect",{x:490,y:87-tz/2,width:60,height:tz,fill:"#9fc3ee",stroke:"currentColor"}));
        txt(sv,520,125,"σz = "+f(szv,0),{size:12});
        txt(sv,320,228,"gri kesik: ilk hali, mavi: şekil değişimi (120 kat büyütülmüş)",{size:11,fill:"var(--muted)"});
        m1.set(f(ex*1e4,2)+" ×10⁻⁴");m2.set(f(ey*1e4,2)+" ×10⁻⁴");m3.set(f(ez*1e4,2)+" ×10⁻⁴");
        m4.set(f(ex*600,3)+" mm");m5.set(f(ey*200,3)+" mm");m6.set(f(ez*10,4)+" mm");
        tx0.innerHTML="ε<sub>x</sub> = ["+sxv+" − "+f(nu,2)+"·("+syv+" + "+f(szv,0)+")]/200000 = "+f(ex*1e4,2)+"×10⁻⁴.<br>Boy uzaması Δl = ε·l, çap değişimi ΔD = ε·D, kalınlık Δt = ε<sub>z</sub>·t.<br>"+(lk?"<b>ε<sub>z</sub> = 0 ⇒ σ<sub>z</sub> = ν(σ<sub>x</sub>+σ<sub>y</sub>) = "+f(szv,1)+" MPa</b> (Q53b, Q54b).":"Kutuyu işaretle: kalınlık engelliyse σ<sub>z</sub> otomatik bulunur.");
      }
      d0();
      // kayma
      var V=15,hy=20,Lk=500,tk=10,nu2=0.3;
      var k1=ctl("Kesme kuvveti V",1,40,1,15,"kN",function(){d1();}),k2=ctl("Yükseklik h",10,100,5,20,"mm",function(){d1();});
      var sv1=svgBox(640,220),st1=h("div",{class:"stage"},sv1);
      var n1=metric("τ = V/(t·h)"),n2=metric("G = E/(2(1+ν))"),n3=metric("γ = τ/G"),n4=metric("Uç kayması δ = γ·L"),tx1=h("div",{class:"steps"});
      a1.append(k1,k2,st1,h("div",{class:"cards"},n1,n2,n3,n4),tx1);
      function d1(){
        clear(sv1);var Vv=k1.get(),hh=k2.get(),tau=Vv*1000/(tk*hh),G=E/(2*(1+nu2)),g=tau/G,dl=g*Lk;
        var x0=70,y0=60,w=300,H=hh*1.5,sd=Math.min(60,dl*12);
        for(var i=0;i<8;i++)sv1.appendChild(s("line",{x1:x0,y1:y0+i*(H/7),x2:x0-10,y2:y0+i*(H/7)+8,stroke:"currentColor"}));
        sv1.appendChild(s("line",{x1:x0,y1:y0-6,x2:x0,y2:y0+H+10,stroke:"currentColor","stroke-width":3}));
        sv1.appendChild(s("polygon",{points:x0+","+y0+" "+(x0+w)+","+y0+" "+(x0+w)+","+(y0+H)+" "+x0+","+(y0+H),fill:"none",stroke:"var(--muted)","stroke-dasharray":"4 3"}));
        sv1.appendChild(s("polygon",{points:x0+","+y0+" "+(x0+w)+","+(y0+sd)+" "+(x0+w)+","+(y0+sd+H)+" "+x0+","+(y0+H),fill:"#9fc3ee",stroke:"currentColor","stroke-width":1.5,opacity:0.9}));
        arrow(sv1,x0+w+30,y0+sd-30,x0+w+30,y0+sd+H*0.5,"#c0392b",4);
        txt(sv1,x0+w+36,y0+sd-34,"V",{size:13,bold:true,anchor:"start",fill:"var(--bad)"});
        txt(sv1,x0+w/2,y0+H+40,"L = 500 mm",{size:12});
        n1.set(f(tau,1)+" MPa");n2.set(f(G,0)+" MPa");n3.set(f(g*1e3,3)+" ×10⁻³ rad");n4.set(f(dl,3)+" mm");
        tx1.innerHTML="Kayma gerilmesi τ = V/A (A = t·h = "+tk+"·"+hh+"). Hooke'un kayma hali τ = G·γ, G = E/(2(1+ν)) (E=200 GPa, ν=0,3). γ küçük açıdır: γ ≈ δ/L. Q45'te δ=5 mm ve V=15 kN biliniyor, h bulunuyor: V/(t·h) = G·δ/L.";
      }
      d1();
      tb.sel(0);
    },
    "Hooke sorularında tipik sıra: önce hangi gerilmelerin 0 olduğuna bak (levha ince: σz=0), sonra denklemi yaz, ε'yu boyla çarp. Etiketler: Q21 Q45 Q45b Q46b Q47b Q48b Q49b Q50b Q51b Q52b Q53b Q54b");
}});
