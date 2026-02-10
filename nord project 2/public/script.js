// 🔥 GSAP HOVER ANIMATION ONLY

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mouseenter", () => {

        gsap.to(card,{
            y:-10,
            scale:1.03,
            duration:0.3,
            ease:"power2.out"
        });

    });

    card.addEventListener("mouseleave", () => {

        gsap.to(card,{
            y:0,
            scale:1,
            duration:0.3
        });

    });

});


// 🔥 OPEN MODAL

function openModal(id,text){

    const modal = document.getElementById("modal");
    const overlay = document.getElementById("overlay");

    document.getElementById("editInput").value = text;
    document.getElementById("editForm").action = "/update/"+id;

    modal.classList.add("modal-show");
    overlay.classList.add("overlay-show");

    gsap.from("#modal",{
        scale:0,
        duration:0.3
    });
}


// 🔥 CLOSE MODAL

function closeModal(){

    document.getElementById("modal").classList.remove("modal-show");
    document.getElementById("overlay").classList.remove("overlay-show");

}


// overlay click close

document.addEventListener("click",function(e){

    if(e.target.id === "overlay"){
        closeModal();
    }

    if(e.target.id === "cancelBtn"){
        closeModal();
    }

});
