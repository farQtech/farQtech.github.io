const DoodleJs = new function () {
    //canvas element
    var canvas;
    //canvas context  
    var ctx;
    // last known position
    var pos = { x: 0, y: 0 };

    // In-memory global state for drawings
    var pointsToSave = [];

    /**
     * Returns all drawings done on the canvas
     * @returns Drawings[]
     */
    this.getDrawings = function(){
        return pointsToSave;
    }

    /**
     * Sets required event handlers to appropriate events
     */
    this.setEventHandlers = function () {
        window.addEventListener('resize', this.resize);
        document.addEventListener('mousemove', this.draw);
        document.addEventListener('mousedown', this.setPosition);
        document.addEventListener('mouseenter', this.setPosition);
        document.addEventListener('contextmenu', this.reDraw);
    }


    // set cursor positions.
    this.setPosition = function (event) {
        pos.x = event.clientX;
        pos.y = event.clientY;
    }

    // resize canvas
    this.resize = function () {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    /**
     * initializes pencil tool
     * Sets cursor to draw with pencil freely
     * @param {*} mouseEvent 
     * @returns 
     */
    this.draw = function (mouseEvent) {
        pointsToSave.push({ x: pos.x, y: pos.y, mouseEvent: mouseEvent });

        event.preventDefault();

        // mouse left button must be pressed
        // if (mouseEvent.buttons !== 1) return;

        ctx.beginPath(); // begin

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#2196f3';

        ctx.moveTo(pos.x, pos.y); // from
        DoodleJs.setPosition(mouseEvent);
        ctx.lineTo(pos.x, pos.y); // to

        ctx.stroke(); // draw it!
    }
    
    /**
     * Redraws given drwaing based on given Drawings
     * @param {*} Drawings
     */
    this.reDraw = function (Drawings) {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // redraw
        pointsToSave.forEach(point => {
            // mouse left button must be pressed
            // if (point.mouseEvent.buttons !== 1) return;

            ctx.beginPath(); // begin

            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#2196f3';


            ctx.moveTo(point.x, point.y); // from
            DoodleJs.setPosition(point.mouseEvent);
            ctx.lineTo(point.x, point.y); // to

            ctx.stroke(); // draw it!
        });
    }

    /**
     * Creates a new transparent canvas and attaches on top of body element
     */
    this.createCanvas = function () {
        canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        // document.body.style.margin = 0;
        canvas.style.position = 'fixed';
        canvas.style.background = 'transparent';
        canvas.style.top = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        canvas.style.left = 0;
        canvas.style.zIndex = 1000;

        // get canvas 2D context and set him correct size
        ctx = canvas.getContext('2d');
    }


    /**
     * Renders btnsArray on top of canvas element
     * @param {*} btnsArray 
     */
    this.renderButtons = function (btnsArray) {
        btnsArray.forEach(btn => this.renderBtn(btn));
    }

    /**
     * Removes btnsArray on top of canvas element
     * @param {*} btnsArray 
     */
    this.removeButtons = function (btnsArray) {
        btnsArray.forEach(btn => document.getElementById(btn).remove());
    }

    /**
     * renders buttons on the UI
     * @param {*} ButtonOptions 
     * ButtonOptions: {
     *  name: string,
     *  handler?: Function
     * }
     */
    this.renderBtn = function (ButtonOptions) {
        let button = document.createElement('button');
        document.body.appendChild(button);
        button.style.color = 'white';
        button.style.backgroundColor = '#2196f3';
        button.style.borderRadius = '64px';
        button.style.border = '1px solid #4054c5';
        button.style.marginTop = ButtonOptions.marginTop;
        button.style.position = 'absolute';
        button.style.width = '63px';
        button.style.height = '30px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.right = 0;
        button.style.top = 0;
        button.style.zIndex = 4000;
        button.innerHTML = ButtonOptions.name;
        button.onclick = ButtonOptions.handler;
        button.setAttribute('id', ButtonOptions.id);
    }

    /**
     * Initializes oval tool
     * Sets cursor to draw ovals
     * @param {*} e 
     */
    this.drawOval = function (e) {
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        e.preventDefault();
        e.stopPropagation();
        ctx.strokeStyle = '#2196f3';
        let startX = parseInt(e.clientX - 1);
        let startY = parseInt(e.clientY - 1);

        ctx.beginPath();
        ctx.moveTo(startX, startY + (pos.y - startY) / 2);
        ctx.bezierCurveTo(startX, startY, pos.x, startY, pos.x, startY + (pos.y - startY) / 2);
        ctx.bezierCurveTo(pos.x, pos.y, startX, pos.y, startX, startY + (pos.y - startY) / 2);
        ctx.closePath();
        ctx.stroke();

    }

    
   
    /**
     * Binds given handler to onclick event of canvas
     * @param {*} handler 
     */
    this.bindhandlerOnCanvasClick = function (handler) {
        canvas.onclick = handler;
    }

    /**
     * Test function used for unit testing only
     * @param {Number} n 
     * @returns 
     */
    this.testFunc = function (n) {
        return n % 2 == 0;
    }

    /**
     * Removes canvas and resets page
     */
    this.reset = function () {
        // canvas.remove();
        let canvases = document.getElementsByTagName('canvas');//.forEach(c => c.remove());//.remove();
        for (let c of canvases) { c.remove(); }
        DoodleJs.removeButtons(['djsRst','djsOvl','djsPncl','djsRdrw']);
    }
}

/**
 * Initializes DoodleJs library
 */
function init() {
    DoodleJs.createCanvas();
    DoodleJs.resize();
    DoodleJs.setEventHandlers();
    DoodleJs.renderButtons([
        {
            id: 'djsRst',
            name: 'Reset',
            handler: DoodleJs.reset,
            marginTop: '60px'

        },
        {
            id: 'djsOvl',
            name: 'Oval',
            handler: drawOval,
            marginTop: '95px',
        },
        {
            id: 'djsPncl',
            name: 'Pencil',
            handler: drawPencil,
            marginTop: '130px'
        },
        {
            id: 'djsRdrw',
            name: 'ReDraw',
            handler: reDraw,
            marginTop: '165px'
        }
    ]);
}

/**
 * Invokes DoodleJs's reDraw() with drawing
 * @param {*} drawing 
 */
function reDraw(drawing) {
    DoodleJs.reDraw(drawing);
}

/**
 * Set cursor to oval tool
 */
function drawOval() {
    document.removeEventListener('mousemove', DoodleJs.draw);
    DoodleJs.bindhandlerOnCanvasClick(DoodleJs.drawOval);
}

/**
 * Set cursor to pencil tool
 */
function drawPencil() {
    document.addEventListener('mousemove', DoodleJs.draw);
}


module.exports = {
    DoodleJs,
    init
};