/************************************
Document components
************************************/
const position = document.querySelector(".position");
const colors = document.querySelectorAll(".color");
const colorSelector = document.querySelector(".color-selector");

/************************************
Header colors
************************************/
function unselect(){
    colors.forEach((c) => {
        c.classList.remove("selected");
    });
    colorSelector.classList.remove("selected");
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("color")) {
        unselect();
        event.target.classList.add("selected");
    }
});

colorSelector.addEventListener("click", () => {
    unselect();
    colorSelector.classList.add("selected");
});

/************************************
Footer pointer
************************************/
window.addEventListener("mousemove", (event) => {
    if (event.target.classList.contains("board")) {
        position.textContent = `${event.clientX}, ${Math.max(0, event.clientY - 90)} px`
    } else {
        position.textContent = `-, - px`
    }
});