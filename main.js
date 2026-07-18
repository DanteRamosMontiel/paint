/************************************
Global variables
************************************/
let canvas = document.querySelector(".canvas");
let previewCanvas = document.querySelector(".preview-canvas");
let ctx = canvas.getContext("2d");
let previewCtx = previewCanvas.getContext("2d");
let color = "black";
let brush = "circle";
let weight = 1;
let fill = true;
let drawing = false;

/************************************
Canvas size
************************************/
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 136;

previewCanvas.width = window.innerWidth;
previewCanvas.height = window.innerHeight - 136;

/************************************
Header colors
************************************/
const colors = document.querySelectorAll(".color");
const colorSelector = document.querySelector(".color-selector");

function unselectColor() {
    colors.forEach((c) => {
        c.classList.remove("color-selected");
    });
    colorSelector.classList.remove("color-selected");
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("color")) {
        unselectColor();
        event.target.classList.add("color-selected");
        color = event.target.dataset.color;
    }
});

colorSelector.addEventListener("click", () => {
    unselectColor();
    colorSelector.classList.add("color-selected");
});

colorSelector.addEventListener("input", (e) => {
    color = e.target.value;
});

/************************************
Header line weight selector
************************************/
const select = document.querySelector("select");

select.addEventListener("change", (e) => {
    weight = e.target.value;
});

/************************************
Header brushes
************************************/
const brushes = document.querySelectorAll(".brush");

function unselectBrush() {
    brushes.forEach((b) => {
        b.classList.remove("brush-selected");
    });
}

brushes.forEach((b) => {
    b.addEventListener("click", () => {
        unselectBrush();
        b.classList.add("brush-selected");
        brush = b.dataset.brushtype;
    });
});


/************************************
Header fill selectors
************************************/
const fillSelectors = document.querySelectorAll(".fill-item");

function unselectFillItem() {
    fillSelectors.forEach((f) => {
        f.classList.remove("fill-selected");
    });
}

fillSelectors.forEach((b) => {
    b.addEventListener("click", () => {
        unselectFillItem();
        b.classList.add("fill-selected");
        fill = Boolean(b.dataset.fill);
    });
});

/************************************
Canvas paintzone
************************************/
canvas.addEventListener("mousedown", (e) => {if (brush != "line"){drawing = true; draw(e);}});
canvas.addEventListener("mouseup", () => {if (brush != "line") drawing = false});
canvas.addEventListener("mouseout", () => {drawing = false});
canvas.addEventListener("mousemove", (e) => {if (brush != "line") draw(e)});

function drawCircle(x, y) {
    if (!drawing) return;
    ctx.beginPath();
    ctx.arc(x, y, weight * 3, 0, Math.PI * 2, false);
    if(fill){
        ctx.fillStyle = color;
        ctx.fill();
    }else{
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

function drawSquare(x, y) {

    if (!drawing) return;

    const side = weight * 9;
    if (fill) {
        ctx.fillStyle = color;
        ctx.fillRect(x - side / 2, y - side / 2, side, side);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeRect(x - side / 2, y - side / 2, side, side);
        ctx.strokeRect(x - side / 2, y - side / 2, side, side);
    }
}

let from = undefined;
canvas.addEventListener("mousedown", (e) => {
    if(brush === "line"){
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        from = {x:x, y:y};
        drawing = true;
    }
});

canvas.addEventListener("mouseup", (e) => {
    if(brush === "line"){
        previewCtx.clearRect(0,0,previewCanvas.width, previewCanvas.height);
        draw(e);
    }
});

canvas.addEventListener("mousemove", (e) => {
    if(brush === "line" && drawing){
        const rect = previewCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        previewCtx.clearRect(0,0,previewCanvas.width, previewCanvas.height);
        previewCtx.beginPath();
        previewCtx.moveTo(from.x, from.y);
        previewCtx.lineTo(x,y);
        previewCtx.strokeStyle = color;
        previewCtx.lineWidth = weight * 2;
        previewCtx.stroke();
    }
});

function drawLine(x, y){
    if (!drawing || from === undefined) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = weight * 2;
    ctx.stroke();

    drawing = false;
    from = undefined;
}

function draw(e){
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (brush) {
        case "circle":
            drawCircle(x, y);
            break;
        case "square":
            drawSquare(x, y);
            break;
        case "line":
            drawLine(x, y);
            break;
        default:
            break;
    }
}



/************************************
Footer pointer
************************************/
const position = document.querySelector(".position");

window.addEventListener("mousemove", (event) => {
    if (event.target.classList.contains("canvas")) {
        position.textContent = `${event.clientX}, ${Math.max(0, event.clientY - 106)} px`
    } else {
        position.textContent = `-, - px`
    }
});
