/************************************
Header colors
************************************/
const colors = document.querySelectorAll(".color");
const colorSelector = document.querySelector(".color-selector");

function unselectColor(){
    colors.forEach((c) => {
        c.classList.remove("color-selected");
    });
    colorSelector.classList.remove("color-selected");
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("color")) {
        unselectColor();
        event.target.classList.add("color-selected");
    }
});

colorSelector.addEventListener("click", () => {
    unselectColor();
    colorSelector.classList.add("color-selected");
});

/************************************
Header brushes
************************************/
const brushes = document.querySelectorAll(".brush");

function unselectBrush(){
    brushes.forEach((b) => {
        b.classList.remove("brush-selected");
    });
}

brushes.forEach((b) => {
    b.addEventListener("click", () =>{
        unselectBrush();
        b.classList.add("brush-selected");
    });
});

/************************************
Footer pointer
************************************/
const position = document.querySelector(".position");

window.addEventListener("mousemove", (event) => {
    if (event.target.classList.contains("canvas")) {
        position.textContent = `${event.clientX}, ${Math.max(0, event.clientY - 90)} px`
    } else {
        position.textContent = `-, - px`
    }
});