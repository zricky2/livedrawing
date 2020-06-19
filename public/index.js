//client code
var mousePressed = false;
var lastX, lastY;
var c;
var ctx;
var socket;

function initialize() {
    c = document.getElementById("myCanvas");
    //The getContext() is a built-in HTML object, with properties and methods for drawing
    ctx = c.getContext("2d");
    //or addeventlistener("mousedown", func)
    c.onmousedown = e => {
        mousePressed = true;
        drawAndSend(e.pageX - c.offsetLeft, e.pageY - c.offsetTop, false);
    };

    c.onmousemove = function (e) {
        if (mousePressed) { //mouse click position - canvas offset
            drawAndSend(e.pageX - c.offsetLeft, e.pageY - c.offsetTop, true);
        }
    };

    c.onmouseup = function (e) {
        mousePressed = false;
       
    };

    c.onmouseleave = function (e) {
        mousePressed = false;
  
    };
    // Start a socket connection to the server
    // Some day we would run this server somewhere else
    socket = io.connect('http://localhost:8080');
    //listens for event from server
    // We make a named event called 'mouse' and write an
    // anonymous callback function
    socket.on('mouse',
        // When we receive data
        (data) => {
            // Draw a blue circle
            receiveDraw(data.x, data.y, data.style, data.width, data.lx, data.ly);
        }
    );
    socket.on('click', () => {
        // Use the identity matrix while clearing the ctx
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    })
}

function receiveDraw(x, y, style, width, lastx, lasty) {
    //Begins a path, or resets the current path
    ctx.beginPath();
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    //Sets or returns the type of corner created, when two lines meet
    ctx.lineJoin = "round";
    //Moves the path to the specified point in the canvas, without creating a line
    ctx.moveTo(lastx, lasty);
    //Adds a new point and creates a line to that point from the last specified point in the canvas
    ctx.lineTo(x, y);
    //Creates a path from the current point back to the starting point
    ctx.closePath();
    //Actually draws the path you have defined
    ctx.stroke();
    
}

function drawAndSend(x, y, isDown) {
    if (isDown) {
        //Begins a path, or resets the current path
        ctx.beginPath();
        ctx.strokeStyle = document.querySelector('#selColor').value;
        ctx.lineWidth = document.querySelector('#selWidth').value;
        //Sets or returns the type of corner created, when two lines meet
        ctx.lineJoin = "round";
        //Moves the path to the specified point in the canvas, without creating a line
        ctx.moveTo(lastX, lastY);
        //Adds a new point and creates a line to that point from the last specified point in the canvas
        ctx.lineTo(x, y);
        //Creates a path from the current point back to the starting point
        ctx.closePath();
        //Actually draws the path you have defined
        ctx.stroke();
        sendmouse(x, y, ctx.strokeStyle, ctx.lineWidth, lastX, lastY);
    }
    
    lastX = x;
    lastY = y;
    
}

// Function for sending to the socket
function sendmouse(xpos, ypos, stroke, linewidth, lastx, lasty) {

    // data object
    var data = {
        x: xpos,
        y: ypos,
        style: stroke,
        width: linewidth,
        lx: lastx,
        ly: lasty
    };

    // Send that object to the socket emits an event then the server listens for the event
    socket.emit('mouse', data);
}

function clearArea() {
    // Use the identity matrix while clearing the ctx
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    socket.emit('click');
}

