gsap.from(".logo", {
  y: -50,
  opacity: 0,
  duration: 1
})

gsap.from(".links a, .dash-btn", {
  y: -50,
  opacity: 0,
  stagger: 0.1,
  duration: 1
})

gsap.from(".title", {
  x: -100,
  opacity: 0,
  duration: 1,
  delay: 0.5
})

gsap.from(".subtitle", {
  x: -80,
  opacity: 0,
  delay: 0.8
})

gsap.from(".card", {
  scale: 0,
  opacity: 0,
  stagger: 0.2,
  delay: 1
})

gsap.from(".feature-box", {
  y: 100,
  opacity: 0,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".features",
    start: "top 80%"
  }
})

function goReact() {
  window.location.href = "http://localhost:5173"
}

gsap.from(".about-hero .title", {
  y: -80,
  opacity: 0,
  duration: 1
})

gsap.from(".stack-card", {
  scale: 0,
  opacity: 0,
  stagger: 0.2,
  delay: 0.5
})

gsap.from(".stat-box", {
  y: 50,
  opacity: 0,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".stats",
    start: "top 80%"
  }
})

gsap.from(".time-item", {
  x: -100,
  opacity: 0,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".timeline",
    start: "top 80%"
  }
})
// CONTACT PAGE ANIMATIONS
gsap.from(".contact-hero .title", {
  y: -80,
  opacity: 0,
  duration: 1
})

gsap.from(".contact-info", {
  x: -100,
  opacity: 0,
  delay: 0.5
})

gsap.from(".contact-form", {
  x: 100,
  opacity: 0,
  delay: 0.5
})

// FORM SUBMIT EFFECT
function submitForm(e) {
  e.preventDefault()

  const success = document.querySelector(".success")
  success.style.display = "block"

  gsap.fromTo(success, 
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5 }
  )
}