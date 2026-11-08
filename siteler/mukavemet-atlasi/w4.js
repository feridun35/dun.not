"use strict";
/* Bölüm 5: soru atölyesi, soru tipi tanıma, formül atlası */

function rnd(a){return a[Math.floor(Math.random()*a.length)];}
function nf(x,d){return f(x,d===undefined?2:d);}

var GEN=[
 {id:"emniyet",name:"Emniyetli yük",make:function(){
   var S=rnd([80,100,120,150,200]),Re=rnd([240,300,360]),n=rnd([1.5,2,2.5,3]),se=Re/n,Fm=se*S/1000;
   return {text:"S = "+S+" mm² kesitli çubuğun akma sınırı R<sub>e</sub> = "+Re+" N/mm², emniyet katsayısı n = "+nf(n,1)+". (a) Emniyet gerilmesi? (b) Çubuğun güvenle taşıyabileceği en büyük kuvvet?",
     parts:[["σ<sub>e</sub>",se,"MPa"],["F<sub>max</sub>",Fm,"kN"]],
     steps:"σ<sub>e</sub> = R<sub>e</sub>/n = "+Re+"/"+nf(n,1)+" = <b>"+nf(se)+" MPa</b>.<br>Emniyetli en büyük yük σ<sub>e</sub> ile bulunur (R<sub>e</sub> ile değil): F = σ<sub>e</sub>·S = "+nf(se)+"·"+S+" = "+nf(se*S,0)+" N = <b>"+nf(Fm)+" kN</b>."};}},
 {id:"kesim",name:"Parçalı çubuk (kesim)",make:function(){
   var PB=rnd([10,15,20,25]),PC=rnd([5,10]),L1=rnd([400,500]),L2=rnd([200,300]),S=rnd([50,100]),E=2e5;
   var RA=PB-PC,N1=-RA,N2=PC,dl=(N1*1000*L1+N2*1000*L2)/(S*E);
   return {text:"Sol ucu duvara bağlı, S = "+S+" mm², E = 200 GPa çubukta A–B arası "+L1+" mm, B–C arası "+L2+" mm. B'de <b>"+PB+" kN sola</b>, C'de <b>"+PC+" kN sağa</b> kuvvet var. (a) Duvar tepkisi R<sub>A</sub> (sağa +)? (b) Toplam boy değişimi (işaretli, kısalma −)?",
     parts:[["R<sub>A</sub>",RA,"kN"],["Δl toplam",dl,"mm"]],
     steps:"Denge: R<sub>A</sub> − "+PB+" + "+PC+" = 0 ⇒ R<sub>A</sub> = <b>"+nf(RA,0)+" kN</b> (sağa).<br>A–B: sol parçada duvar sağa itiyor ⇒ basma, N₁ = −"+nf(RA,0)+" kN. B–C: sağ parçada C'deki kuvvet dışarı ⇒ çekme, N₂ = +"+PC+" kN.<br>Δl = (N₁L₁ + N₂L₂)/(S·E) = ("+nf(N1*1000*L1,0)+" + "+nf(N2*1000*L2,0)+")/("+S+"·200000) = <b>"+nf(dl,3)+" mm</b>."};}},
 {id:"paralel",name:"Beton–çelik paylaşımı",make:function(){
   var Ac=rnd([50,100,150]),Ab=rnd([300,350,400]),F=rnd([60,80,100,120]),kc=Ac*2e5,kb=Ab*1e5,Fc=F*kc/(kc+kb);
   return {text:"Rijit plaka altında A<sub>ç</sub> = "+Ac+" mm², E<sub>ç</sub> = 2·10⁵ N/mm² çelik ile A<sub>b</sub> = "+Ab+" mm², E<sub>b</sub> = 1·10⁵ N/mm² beton paralel çalışıyor. F = "+F+" kN yük var. Çeliğin ve betonun taşıdığı kuvvetler?",
     parts:[["F<sub>ç</sub>",Fc,"kN"],["F<sub>b</sub>",F-Fc,"kN"]],
     steps:"Denge: F<sub>ç</sub> + F<sub>b</sub> = "+F+". Uygunluk (plaka rijit, L sadeleşir): F<sub>ç</sub>/(A<sub>ç</sub>E<sub>ç</sub>) = F<sub>b</sub>/(A<sub>b</sub>E<sub>b</sub>).<br>A·E: çelik "+nf(kc,0)+", beton "+nf(kb,0)+" ⇒ F<sub>b</sub> = "+nf(kb/kc,2)+"·F<sub>ç</sub>.<br>F<sub>ç</sub> = F·kç/(kç+kb) = <b>"+nf(Fc)+" kN</b>, F<sub>b</sub> = <b>"+nf(F-Fc)+" kN</b>."};}},
 {id:"bosluk",name:"Boşluklu termik",make:function(){
   var gap=rnd([2,3,4,6]),Tc=10+(gap/2)/(12e-6*5000),T=Tc+rnd([10,15,20,25]),sg=2e5*12e-6*(T-Tc);
   T=Math.round(T);Tc=10+(gap/2)/(12e-6*5000);sg=2e5*12e-6*(T-Tc);
   return {text:"İki ankastre çelik çubuğun her biri 5 m boyunda (α = 12·10⁻⁶ 1/°C, E = 2·10⁵ N/mm²). 10 °C'de aralarında "+gap+" mm boşluk var. (a) Kaç °C'de uçlar değer? (b) Sıcaklık "+T+" °C olunca gerilme (basma, büyüklük)?",
     parts:[["T<sub>temas</sub>",Tc,"°C"],["σ",sg,"MPa"]],
     steps:"Her çubuk boşluğun yarısını kapatır: "+nf(gap/2,1)+" = 12·10⁻⁶·5000·(T−10) ⇒ T = 10 + "+nf(gap/2,1)+"/0,06 = <b>"+nf(Tc)+" °C</b>.<br>Temastan sonra kalan ΔT = "+T+" − "+nf(Tc)+" = "+nf(T-Tc)+" °C. σ = E·α·ΔT = 2,4·"+nf(T-Tc)+" = <b>"+nf(sg)+" MPa</b>."};}},
 {id:"yay",name:"Çubuk + yay (termik)",make:function(){
   var dT=rnd([30,40,55,60]),k=rnd([10,20,40]),free=12e-6*200*dT,f1=200/(2*2e7),F=free/(f1+1/(k*1000)),dy=F/(k*1000);
   return {text:"Sol ucu duvara bağlı çelik çubuk (l = 200 cm, S = 2 cm², E = 2·10⁷ N/cm², α = 12·10⁻⁶) sağ ucunda k = "+k+" kN/cm'lik yaya dayanıyor, yayın öbür ucu duvarda. Çubuk "+dT+" °C ısınıyor. Çubuktaki kuvvet ve yayın kısalması?",
     parts:[["F",F,"N"],["yay kısalması",dy,"cm"]],
     steps:"Serbest uzama α·l·ΔT = 12·10⁻⁶·200·"+dT+" = "+nf(free,3)+" cm.<br>Uygunluk: çubuğun ezilmesi + yayın sıkışması = serbest uzama ⇒ F·l/(S·E) + F/k = "+nf(free,3)+".<br>F·("+nf(f1,7)+" + "+nf(1/(k*1000),7)+") = "+nf(free,3)+" ⇒ F = <b>"+nf(F,0)+" N</b>. Yay kısalması F/k = <b>"+nf(dy,4)+" cm</b>."};}},
 {id:"kap",name:"İnce cidarlı kap",make:function(){
   var P=rnd([1,1.5,2,3]),r=rnd([250,400,500]),t=rnd([4,5,8,10]);
   return {text:"İç basıncı P = "+P+" MPa, yarıçapı r = "+r+" mm, et kalınlığı t = "+t+" mm olan ince cidarlı silindirik kapta çevresel gerilme σ<sub>t</sub> ve boyuna gerilme σ<sub>l</sub>?",
     parts:[["σ<sub>t</sub>",P*r/t,"MPa"],["σ<sub>l</sub>",P*r/(2*t),"MPa"]],
     steps:"σ<sub>t</sub> = P·r/t = "+P+"·"+r+"/"+t+" = <b>"+nf(P*r/t)+" MPa</b>. σ<sub>l</sub> = P·r/(2t) = <b>"+nf(P*r/(2*t))+" MPa</b> (çevresel, boyunanın 2 katı)."};}},
 {id:"mohr",name:"Mohr çemberi",make:function(){
   var pr=rnd([[30,40],[40,30],[60,80],[80,60],[50,120],[120,50]]),OM=rnd([-40,-20,0,20,25,40,50]),a=pr[0],tau=pr[1],sx=OM+a,sy=OM-a,R=Math.sqrt(a*a+tau*tau);
   return {text:"Düzlem gerilme durumu: σ<sub>x</sub> = "+sx+" MPa, σ<sub>y</sub> = "+sy+" MPa, τ<sub>xy</sub> = "+tau+" MPa. Asal gerilmeler σ<sub>max</sub>, σ<sub>min</sub> ve maksimum kayma gerilmesi τ<sub>max</sub>?",
     parts:[["σ<sub>max</sub>",OM+R,"MPa"],["σ<sub>min</sub>",OM-R,"MPa"],["τ<sub>max</sub>",R,"MPa"]],
     steps:"OM = (σx+σy)/2 = <b>"+nf(OM,0)+"</b>. R = √(((σx−σy)/2)² + τ²) = √("+a+"² + "+tau+"²) = <b>"+nf(R,1)+"</b>.<br>σ<sub>max</sub> = OM + R = <b>"+nf(OM+R)+"</b>, σ<sub>min</sub> = OM − R = <b>"+nf(OM-R)+"</b>, τ<sub>max</sub> = R = <b>"+nf(R)+" MPa</b>."};}},
 {id:"hooke",name:"Genel Hooke",make:function(){
   var sx=rnd([100,150,200,300,400]),sy=rnd([0,50,100,150]),nu=rnd([0.25,0.3]),ex=(sx-nu*sy)/2e5*1e4;
   return {text:"İnce levhada σ<sub>x</sub> = "+sx+" MPa, σ<sub>y</sub> = "+sy+" MPa, σ<sub>z</sub> = 0, E = 2·10⁵ N/mm², ν = "+nu+". x yönündeki birim uzama ε<sub>x</sub> (×10⁻⁴ cinsinden)?",
     parts:[["ε<sub>x</sub>",ex,"×10⁻⁴"]],
     steps:"ε<sub>x</sub> = [σ<sub>x</sub> − ν(σ<sub>y</sub>+σ<sub>z</sub>)]/E = ["+sx+" − "+nu+"·("+sy+"+0)]/200000 = <b>"+nf(ex)+"×10⁻⁴</b>."};}},
 {id:"halka",name:"İç içe halka",make:function(){
   var tb=rnd([10,20,30,40]),dt=rnd([50,100,150]),tC=10,sC=(16e-6-12e-6)*dt/(1/2e5+tC/(tb*1e5)),sB=-sC*tC/tb;
   return {text:"İç içe geçmiş ince cidarlı bakır (içte, t<sub>b</sub> = "+tb+" mm, α = 16·10⁻⁶, E = 100 GPa) ve çelik (dışta, t<sub>ç</sub> = 10 mm, α = 12·10⁻⁶, E = 200 GPa) borular "+dt+" °C ısıtılıyor. Çelikteki ve bakırdaki gerilme (çekme +, basma −)?",
     parts:[["σ<sub>ç</sub>",sC,"MPa"],["σ<sub>b</sub>",sB,"MPa"]],
     steps:"(1) Kuvvet eşit: σ<sub>ç</sub>·"+tC+" = −σ<sub>b</sub>·"+tb+" ⇒ σ<sub>b</sub> = −σ<sub>ç</sub>·"+nf(tC/tb,2)+".<br>(2) ε eşit: "+nf(16e-6*dt*1000,3)+"‰ + σ<sub>b</sub>/10⁵ = "+nf(12e-6*dt*1000,3)+"‰ + σ<sub>ç</sub>/(2·10⁵).<br>Çözüm: σ<sub>ç</sub> = <b>"+nf(sC)+" MPa</b>, σ<sub>b</sub> = <b>"+nf(sB)+" MPa</b>."};}},
 {id:"kafes",name:"İki çubuklu kafes",make:function(){
   var P=rnd([9,12,15,18,24]),FAB=P*5/3,FBC=-P*4/3,sg=FAB*1000/500;
   return {text:"B düğümünden P = "+P+" kN düşey kuvvet asılı. AB eğik (3-4-5 üçgeni: 3 m düşey, 4 m yatay, 5 m boy), BC yatay. Kesitler S = 500 mm². F<sub>AB</sub>, F<sub>BC</sub> (çekme +, basma −) ve σ<sub>AB</sub>?",
     parts:[["F<sub>AB</sub>",FAB,"kN"],["F<sub>BC</sub>",FBC,"kN"],["σ<sub>AB</sub>",sg,"MPa"]],
     steps:"ΣF<sub>y</sub>: F<sub>AB</sub>·3/5 = P ⇒ F<sub>AB</sub> = <b>"+nf(FAB)+" kN</b> (çekme).<br>ΣF<sub>x</sub>: −F<sub>BC</sub> − F<sub>AB</sub>·4/5 = 0 ⇒ F<sub>BC</sub> = <b>"+nf(FBC)+" kN</b> (basma).<br>σ<sub>AB</sub> = F/S = "+nf(FAB*1000,0)+"/500 = <b>"+nf(sg,1)+" MPa</b>."};}}
];

function parse(v){return parseFloat(String(v).replace(",",".").replace("−","-"));}

section({id:"atolye", group:"5 · Pekiştir", title:"Soru atölyesi: rastgele sayılarla çöz", build:function(){
  return widget(null,
    "Aynı soru tipinin her seferinde yeni sayılarla gelir. Kendi çöz, cevabı yaz, kontrol et. Tutmazsa adım adım çözüm açılır.",
    "<b>Nasıl çalış:</b> önce kağıtta çöz, sonra yaz. \"Çözümü göster\" demeden önce bir kere dene. Tip seçilmezse karışık gelir.",
    function(box){
      var sel=h("select",{style:"font:inherit;padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--ink)"},h("option",{value:"karisik"},"Karışık"));
      GEN.forEach(function(g){sel.appendChild(h("option",{value:g.id},g.name));});
      var scoreEl=h("span",{class:"note"}),area=h("div",{});
      var newb=h("button",{class:"btn pri",onclick:function(){make();}},"Yeni soru");
      box.append(h("div",{class:"tabs",style:"align-items:center"},sel,newb,scoreEl),area);
      var sc=store("score")||{ok:0,all:0};
      function upd(){scoreEl.textContent="Doğru: "+sc.ok+" / "+sc.all;store("score",sc);}
      function make(){
        var g=sel.value==="karisik"?rnd(GEN):GEN.filter(function(x){return x.id===sel.value;})[0];
        var q=g.make(),inputs=[],res=h("div",{}),shown=false;
        clear(area);
        var card=h("div",{class:"q"});
        card.appendChild(h("div",{html:"<b>"+g.name+".</b> "+q.text}));
        q.parts.forEach(function(p){
          var inp=h("input",{type:"text",placeholder:"cevap"});inputs.push(inp);
          card.appendChild(h("div",{class:"ans"},h("span",{html:p[0]+" ="}),inp,h("span",{class:"note"},p[2])));
        });
        var chk=h("button",{class:"btn pri",onclick:function(){
          var good=0,msg=[];
          q.parts.forEach(function(p,i){
            var v=parse(inputs[i].value),tol=Math.max(Math.abs(p[1])*0.02,0.02);
            var ok=!isNaN(v)&&Math.abs(v-p[1])<=tol;if(ok)good++;
            msg.push((ok?"<span class='ok-t'>✓ ":"<span class='bad-t'>✗ ")+p[0]+" = "+nf(p[1],Math.abs(p[1])<1?4:2)+" "+p[2]+"</span>");
          });
          sc.all++;if(good===q.parts.length)sc.ok++;upd();
          res.innerHTML=msg.join("<br>");
          if(good<q.parts.length&&!shown){shown=true;res.appendChild(h("div",{class:"steps",html:q.steps}));}
        }},"Kontrol et");
        var show=h("button",{class:"btn",onclick:function(){if(!shown){shown=true;res.appendChild(h("div",{class:"steps",html:q.steps}));}}},"Çözümü göster");
        card.append(h("div",{class:"tabs"},chk,show),res);
        area.appendChild(card);
      }
      upd();make();
    },
    "Bu tiplerin hepsi çözümlü sorularda (Q) ve örnek problemlerde (Ö) var; sayılar değişse de yöntem aynı kalıyor.");
}});

var CUES=[
 ["\"Emniyetli mi / taşır mı / izin verilen\"","σ = F/A hesapla, <b>σ<sub>e</sub></b> ile karşılaştır (σ ≤ σ<sub>e</sub>). n için n = R<sub>e</sub>/σ<sub>e</sub>.","Sl.62–63"],
 ["\"Boy değişimi / uzama / kısalma\"","Δl = F·L/(A·E). Kuvvet değişiyorsa kesim yöntemi, parça parça topla.","Sl.68–69"],
 ["İki ucu duvara sabit, yük arada","Denge + toplam boy değişmez: Σ R·L/(A·E) = 0.","Q1 Q2 Q13 Ö5 Ö6"],
 ["Rijit plaka altında iki malzeme yan yana (boru+çubuk, beton+çelik)","F₁+F₂ = F ve ΔL₁ = ΔL₂ ⇒ yük A·E oranında paylaşılır.","Q3 Q9 Q10 Sl.70"],
 ["Somun sıkıldı, civata + boru","δ<sub>ç</sub> + δ<sub>boru</sub> = somun ilerlemesi. Dış yük gelirse paylaşılır.","Q4 Q5 Ö7"],
 ["\"ΔT kadar ısıtılıyor\", uçlar sabit","σ = E·α·ΔT (boy yok). Boşluk varsa önce T<sub>temas</sub>.","Q7 Q16 Sl.81"],
 ["Isınan çubuk yaya / ikinci malzemeye dayanıyor","Serbest uzama = ezilme + yay sıkışması.","Sl.83 Q8 Q15"],
 ["İç içe iki boru/halka ısınıyor","σ·t eşit (zıt işaret) + α·ΔT + σ/E eşit. Çok genleşen basılır.","Q12 Q18 Sl.85"],
 ["\"İnce cidarlı kap, iç basınç\"","σ<sub>t</sub> = P·r/t, σ<sub>l</sub> = P·r/(2t).","Q11 Sl.77"],
 ["Rijit kiriş mafsallı, çubuk/yay bağlı","Yer değiştirme mafsala uzaklıkla orantılı (benzer üçgen); ΣM_A = 0.","Q19 Q22 Q24 Q43 Q47 Ö4 Ö8"],
 ["Kafes/iki çubuk, düğümden yük asılı","Düğümü izole et, ΣFx = ΣFy = 0, çubukları çekme varsay.","Q39 Q40 Sl.66"],
 ["\"Asal gerilmeler, düzlemleri, taralı düzlem\"","Mohr: OM, R, σ = OM ± R, tan2α = 2τ/(σx−σy), C düzlemi.","Q27–Q38 GA 44"],
 ["Levha, kenarlardan gerilme, uzama/ kalınlık değişimi","ε<sub>x</sub> = [σ<sub>x</sub> − ν(σ<sub>y</sub>+σ<sub>z</sub>)]/E; Δl = ε·l. Kısıtlıysa ε=0.","Q45b–Q54b"],
 ["Cıvata, pim, sıyrılma, çatal","τ = F/A_kayma: çift kesitte 2·πd²/4, sıyrılmada π·d·L. Delikli parçada net alan.","Q20 Q42 Ö1–Ö3"],
 ["Kesit, kiriş, eğilme (<i>vize dışı olabilir</i>)","σ = M·y/I, τ<sub>max</sub> = 3V/2A. Slaytlarda yok, hocaya teyit.","Q38k Q41 Q44"]
];

section({id:"tip", group:"5 · Pekiştir", title:"Bu soru hangi tip? İpucu cümleleri", build:function(){
  return widget(null,
    "Sınavda soruyu okuyunca ilk bir dakikada tipi tanımak yarı yolu bitirir.",
    "<b>Çalışma önerisi:</b> sağ sütunu kapatıp soldaki cümleye bakarak yöntemi hatırlamaya çalış, sonra kontrol et.",
    function(box){
      var rows=h("table",{class:"ft"});
      var hide=h("label",{class:"note"},h("input",{type:"checkbox",onchange:function(){rows.className=this.checked?"ft hide-f":"ft";}})," Sağ sütunu bulanıklaştır (kendini sına, tıklayınca açılır)");
      rows.appendChild(h("tr",{},h("th",{},"Soruda gördüğün"),h("th",{class:"f"},"Yöntem"),h("th",{},"Örnek")));
      CUES.forEach(function(c){
        var fx=h("span",{class:"fx",html:c[1],onclick:function(){this.classList.toggle("show");}});
        rows.appendChild(h("tr",{},h("td",{html:c[0]}),h("td",{class:"f"},fx),h("td",{},chips(c[2]))));
      });
      box.append(hide,rows);
    },
    "Hocanın notları: formül kağıdı yok; üç çubuklu termik (Sl.97, Q25) ve üç eksenli Mohr sorulmaz; Mohr ~4 soru.");
}});

var FORM=[
 ["Gerilme","σ = F/A &nbsp; τ = F/A<sub>kayma</sub>","Q2 Q3 Q20 Q42 Ö1 Ö2 Ö3"],
 ["Hooke","σ = E·ε &nbsp; ε = Δl/l","Q21 Sl.43"],
 ["Uzama","Δl = F·l/(A·E)","Q1 Q2 Q17 Q19 Ö4 Ö5 Sl.69"],
 ["Poisson","ν = −ε<sub>yanal</sub>/ε<sub>eksenel</sub>","Q21"],
 ["Emniyet","σ<sub>e</sub> = R<sub>e</sub>/n","Q11 Sl.63"],
 ["Alan","π/4·(D²−d²), π·d·L, 2·π d²/4, (b−d)·t","Q20 Q42 Ö1 Ö3"],
 ["Paralel çubuk","F<sub>i</sub> = F·(A<sub>i</sub>E<sub>i</sub>)/Σ(A·E)","Q3 Q9 Q10 Sl.71"],
 ["İki ucu sabit","Σ R·L/(A·E) = 0","Q1 Q2 Q13 Ö5 Ö6"],
 ["Termik","Δl = α·l·ΔT &nbsp; σ = E·α·ΔT &nbsp; ε = α(T<sub>son</sub>−T<sub>ilk</sub>)","Q7 Q16 Sl.81–82"],
 ["İnce cidarlı","σ<sub>t</sub> = P·r/t &nbsp; σ<sub>l</sub> = P·r/2t &nbsp; ΔD = D·α·ΔT","Q11 Q12 Q18 Sl.77–78"],
 ["Yay","F = k·x","Q17 Q19 Q43 Q47 Ö8 Sl.84"],
 ["Mohr","OM = (σx+σy)/2 &nbsp; R = √(((σx−σy)/2)²+τ²) &nbsp; σ = OM ± R &nbsp; tan2α = 2τ/(σx−σy) &nbsp; τ<sub>max</sub> = R","Q27–Q38 GA 25–35"],
 ["Düzlemde dönüşüm","σ<sub>n</sub> = OM + ((σx−σy)/2)cos2θ + τ sin2θ &nbsp; τ<sub>n</sub> = −((σx−σy)/2)sin2θ + τ cos2θ","GA 24 GA 41"],
 ["Tek eksenli","σ<sub>n</sub> = σx cos²θ &nbsp; τ<sub>n</sub> = (σx/2) sin2θ","Q28 Q33 GA 7"],
 ["Genel Hooke","ε<sub>x</sub> = [σx − ν(σy+σz)]/E &nbsp; Δl = ε·l","Q45b–Q54b"],
 ["Kayma","G = E/(2(1+ν)) &nbsp; τ = G·γ","Q45"],
 ["Sorulmaz (hoca)","3 çubuklu termik sonuç (Q25); üç eksenli Mohr","Sl.97 GA 36"]
];

section({id:"formul", group:"5 · Pekiştir", title:"Formül atlası: çağırma modu", build:function(){
  return widget(null,
    "Formül kağıdı olmadığı için hepsini kağıda ezberden yazabilmen lazım. Burada önce kendin yaz, sonra aç.",
    "<b>Yöntem:</b> kutuyu işaretle, formüller bulanıklaşır. Kağıda yaz, sonra tıkla ve karşılaştır. Yanlışını bir yere not et.",
    function(box){
      var t=h("table",{class:"ft"}),hide=h("label",{class:"note"},h("input",{type:"checkbox",onchange:function(){t.className=this.checked?"ft hide-f":"ft";}})," Formülleri bulanıklaştır (tıklayınca açılır)");
      t.appendChild(h("tr",{},h("th",{},"Konu"),h("th",{class:"f"},"Formül"),h("th",{},"Hangi sorularda")));
      FORM.forEach(function(r){
        var dead=r[0].indexOf("Sorulmaz")===0;
        t.appendChild(h("tr",{class:dead?"dead":""},h("td",{class:"n",html:r[0]}),h("td",{class:"f"},h("span",{class:"fx",html:r[1],onclick:function(){this.classList.toggle("show");}})),h("td",{},chips(r[2]))));
      });
      box.append(hide,t,h("div",{class:"note"},"Ayrıntılı derleme: Mukavemet Formül Derlemesi.pdf (aynı klasörde)."));
    });
}});
