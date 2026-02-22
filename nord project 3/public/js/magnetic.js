const btn = document.querySelector(".magnetic");

btn.addEventListener("mousemove", e=>{
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width/2;
  const y = e.clientY - rect.top - rect.height/2;

  gsap.to(btn,{x:x*0.3,y:y*0.3});
});

btn.addEventListener("mouseleave", ()=>{
  gsap.to(btn,{x:0,y:0});
});