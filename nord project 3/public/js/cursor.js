const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", e=>{
  cursor.style.left = e.clientX - 75 + "px";
  cursor.style.top = e.clientY - 75 + "px";
});