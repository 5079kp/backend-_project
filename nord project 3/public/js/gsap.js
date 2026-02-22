// Navbar scroll shrink (Mercedes style)
gsap.to(".navbar", {
  scrollTrigger:{
    trigger:"body",
    start:"top -100",
    scrub:true
  },
  padding:"10px 60px",
  background:"rgba(0,0,0,0.6)"
});

// 3D Text animation
gsap.from(".title3d",{
  y:100,
  opacity:0,
  duration:2,
  ease:"power4.out"
});