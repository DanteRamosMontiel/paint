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
let lastX = null;
let lastY = null;
let undoStack = [];
let redoStack = [];

/************************************
Function to save the state of the
canvas before each change
************************************/
function saveState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoStack = [];
}

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
        brush === "text" ? canvas.style.cursor = "text" : canvas.style.cursor = "crosshair";
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
canvas.addEventListener("mousedown", (e) => {
    if (brush != "line" && brush != "text") {
        saveState();
        drawing = true;
        lastX = null;
        lastY = null;
        draw(e);
    }
});
canvas.addEventListener("mouseup", () => {
    if (brush != "line" && brush != "text") {
        drawing = false;
        lastX = null;
        lastY = null;
    }
});
canvas.addEventListener("mouseout", () => {
    drawing = false;
    lastX = null;
    lastY = null;
});
canvas.addEventListener("mousemove", (e) => {
    if (brush != "line" && brush != "text") draw(e)
});

function drawCircle(x, y) {
    if (!drawing) return;
    ctx.beginPath();
    ctx.arc(x, y, weight * 3, 0, Math.PI * 2, false);
    if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
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

function drawEraser(x, y) {

    if (!drawing) return;

    const side = weight * 9;

    ctx.fillStyle = "white";
    ctx.fillRect(x - side / 2, y - side / 2, side, side);

}

/* Start line drawing logic */
let from = undefined;
canvas.addEventListener("mousedown", (e) => {
    if (brush === "line") {
        saveState();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        from = { x: x, y: y };
        drawing = true;
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (brush === "line") {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        draw(e);
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (brush === "line" && drawing) {
        const rect = previewCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.beginPath();
        previewCtx.moveTo(from.x, from.y);
        previewCtx.lineTo(x, y);
        previewCtx.strokeStyle = color;
        previewCtx.lineWidth = weight * 2;
        previewCtx.stroke();
    }
});

function drawLine(x, y) {
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
/* Finish line drawing logic */


/* Start text drawing logic */
let text = "";

canvas.addEventListener("click", (e) => {
    if (brush != "text") return;
    text = prompt("Write the text: ");
    if (text != null) draw(e);
});

function drawText(x, y) {
    ctx.font = `${weight * 12}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}
/* Finish text drawing logic */

/* funct to interpolate 2 points and fill all the way between that 2 points (last point and new point)*/
function interpolateAndDraw(x, y, drawFn, spacing = 4) {
    if (lastX === null || lastY === null) {
        drawFn(x, y);
    } else {
        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.max(Math.ceil(dist / spacing), 1);
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            drawFn(lastX + (x - lastX) * t, lastY + (y - lastY) * t);
        }
    }
    lastX = x;
    lastY = y;
}

function draw(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (brush) {
        case "circle":
            interpolateAndDraw(x, y, drawCircle, Math.max(weight * 1.5, 2));
            break;
        case "square":
            interpolateAndDraw(x, y, drawSquare, Math.max(weight * 3, 2));
            break;
        case "line":
            drawLine(x, y);
            break;
        case "eraser":
            interpolateAndDraw(x, y, drawEraser, Math.max(weight * 3, 2));
            break;
        case "text":
            drawText(x, y);
            break;
        default:
            break;
    }
}

/************************************
All header functions
************************************/
/* Delete button */
const dlt = document.querySelector('[data-tooltip="Delete"]');
dlt.addEventListener("click", () => {
    if (confirm("This will erase your entire drawing. Continue?")){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redoStack = [];
        undoStack = [];
    }
});

/* Save button */
const save = document.querySelector('[data-tooltip="Save"]')
function saveCanvas() {
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "mi-draw.png"
    link.click();
}
save.addEventListener("click", saveCanvas);

/* Print button */

const pr = document.querySelector('[data-tooltip="Print"]');
function printCanvas() {
    const dataURL = canvas.toDataURL("image/png");
    const win = window.open("");

    const img = win.document.createElement("img");
    img.src = dataURL;
    img.style.maxWidth = "100%";

    img.onload = () => {
        win.focus();
        win.print();
    };

    win.document.body.appendChild(img);
}
pr.addEventListener("click", printCanvas);

/* Undo button */
const undobutton = document.querySelector('[data-tooltip="Undo"]');
function undo() {
    if (undoStack.length === 0) return;

    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    const previousState = undoStack.pop();

    ctx.putImageData(previousState, 0, 0);
}
undobutton.addEventListener("click", undo);

/* Redo button */
const redobutton = document.querySelector('[data-tooltip="Redo"]');
function redo() {
    if (redoStack.length === 0) return;

    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    const nextState = redoStack.pop();

    ctx.putImageData(nextState, 0, 0);
}
redobutton.addEventListener("click", redo);

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