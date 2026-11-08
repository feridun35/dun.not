"use strict";
(function(){
  var main=document.getElementById("main"),nav=document.getElementById("nav"),prog=document.getElementById("prog");
  var done=store("done")||{},lastGrp=null,links={};
  var intro=h("section",{class:"sec"},
    h("h2",{},"Nasıl kullanılır"),
    h("p",{class:"lead"},"Okuduğun slayt konularını burada canlandır: kaydırıcıları oynat, ne değiştiğini izle. Her bölümün altında \"sınavda nasıl çıkıyor\" kutusu var, orada hangi sorularla bağlantılı olduğu yazıyor (Q = çözümlü problemler, Ö = örnek problemler)."),
    h("div",{class:"say",html:"<b>Sıra önerisi:</b> Bölüm 1 → 2 → Mohr → Hooke. Sonunda <b>Soru atölyesi</b>ni çöz, <b>Formül atlası</b>nı ezberden yazmaya çalış. Hocanın notları: formül kağıdı yok, Mohr yaklaşık 4 soru, 3 çubuklu termik ve üç eksenli Mohr sorulmaz."}));
  main.appendChild(intro);
  SECTIONS.forEach(function(sc,i){
    if(sc.group!==lastGrp){lastGrp=sc.group;nav.appendChild(h("div",{class:"grp"},sc.group));}
    var dot=h("span",{class:"dot"+(done[sc.id]?" done":"")});
    var a=h("a",{href:"#"+sc.id},dot,sc.title);links[sc.id]=a;nav.appendChild(a);
    var sec=h("section",{class:"sec",id:sc.id},h("h2",{},sc.title));
    var body;
    try{body=sc.build();}catch(e){body=h("div",{class:"note"},"Bu bölüm yüklenemedi: "+e.message);if(window.console)console.error(sc.id,e);}
    sec.appendChild(body);
    var cb=h("input",{type:"checkbox"});cb.checked=!!done[sc.id];
    cb.addEventListener("change",function(){done[sc.id]=cb.checked;store("done",done);dot.className="dot"+(cb.checked?" done":"");count();});
    sec.appendChild(h("div",{class:"done-row"},h("label",{},cb," Bu bölümü anladım")));
    main.appendChild(sec);
  });
  function count(){var n=0;SECTIONS.forEach(function(s){if(done[s.id])n++;});prog.textContent="Anlaşılan: "+n+" / "+SECTIONS.length;}
  count();
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){Object.keys(links).forEach(function(k){links[k].className="";});if(links[e.target.id])links[e.target.id].className="on";}});},{rootMargin:"-20% 0px -70% 0px"});
    document.querySelectorAll("section.sec[id]").forEach(function(s){io.observe(s);});
  }
})();
