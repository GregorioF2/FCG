// Cohete y fondo
var rocket = {
    positionX : 0,
    positionY : 0,
    rotation  : 0,
    scale     : 1,
    speed     : 0,
};

var background = {
    positionX : 0,
    positionY : 0,
};

let meteoriteCurrentId = 0;
let height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
let width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

let meteorites = [];
let updateBackgroundInterval;
let creationOfMeteoritesInterval;


// Listeners para el mouse y el teclado
document.addEventListener("keydown", KeyDown, false);
document.addEventListener("wheel", WheelZoom);

// Zoom in/out
function WheelZoom(e) 
{
    if (e.deltaY < 0) 
    {
        rocket.scale    *= 1.05; // Factor
    }
    else if (e.deltaY > 0)
    {
        rocket.scale    *= 0.95; // Factor
    }
}

const deleteFirstMeteorite = () => {
    console.log('deleting first');
    const meteorite = meteorites.shift();
    const imageId = `meteorite-${meteorite.id}`;
    let mi = document.getElementById(imageId);
    document.body.removeChild(mi);
}

// Teclado
function KeyDown(e)
{
    var keyCode = e.key;
    switch ( e.key ) {
        case "a": case "ArrowLeft" : rocket.rotation -= 5;    break;
        case "d": case "ArrowRight": rocket.rotation += 5;    break;
        case "w": case "ArrowUp"    : rocket.speed += 1; if ( rocket.speed > 100 ) rocket.speed = 100; break;
        case "s": case "ArrowDown"  : rocket.speed -= 1; if ( rocket.speed <   0 ) rocket.speed =   0; break;
        case "p": 
            clearInterval(creationOfMeteoritesInterval);
            clearInterval(updateBackgroundInterval);
            break;
        case "r":
            startIntervals();
            break;
        case "o":
            deleteFirstMeteorite();
            break;
        case "n":
            updateBackground();
            break;
        case "h":
            var d = document.getElementById('controls');
            d.style.display = d.style.display=="" ? "none" : "";
            break;
    }
    UpdateTrans();
}

// Mover el cohete
function MoveRocket()
{
    rocket.positionX = event.clientX;
    rocket.positionY = event.clientY;
   // UpdateTrans();
}

// Actualizar las transformaciones y los propulsores del cohete
function UpdateTrans()
{	
    // Cohete
    var a = rocket.speed * rocket.scale;
    var m = BuildTransform( rocket.positionX, rocket.positionY, rocket.rotation, rocket.scale );
    var b = document.getElementById('rocket');
    b.style.transform = "matrix(" + m[0] + "," + m[1] + "," + m[3] + "," + m[4] + "," + m[6] + "," + m[7] + ")";

    // Propulsores
    var offset = Array(
        { x:-30, y: 60 },
        { x: 30, y: 60 },
        { x:  0, y: 75 });

    for ( var i=0; i<3; ++i ) {
        var p = document.getElementById('propeller'+i);
        var r = 180;
        var s = rocket.speed / 100;
        var t = BuildTransform( offset[i].x, offset[i].y, r, s );
        t = ComposeTransforms( t, m );
        p.style.transform = "matrix(" + t[0] + "," + t[1] + "," + t[3] + "," + t[4] + "," + t[6] + "," + t[7] + ")";
    }

    var px = background.positionX * rocket.scale;
    var py = background.positionY * rocket.scale;

    document.body.style.backgroundPosition = px + "px " + py + "px";
    document.body.style.backgroundSize     = (rocket.scale * 1600) + "px";

    for (const meteorite of meteorites) {
        const imageId = `meteorite-${meteorite.id}`;
        let mi = document.getElementById(imageId);
        if (!mi) {
            mi = document.createElement('img');
            mi.src = 'meteorite.png';
            mi.id = `meteorite-${meteorite.id}`;
            mi.className = 'meteorite';
            document.body.appendChild(mi);
        }
        if (meteorite.positionY > height + 100) {
            deleteFirstMeteorite();
        } else {
            let mm = BuildTransform( meteorite.positionX, meteorite.positionY, meteorite.rotation, rocket.scale );
            mi.style.transform = "matrix(" + mm[0] + "," + mm[1] + "," + mm[3] + "," + mm[4] + "," + mm[6] + "," + mm[7] + ")";
        }
    } 
}


const prettyPrint = (m) =>{
	console.log(`
	${m[0]} | ${m[3]} | ${m[6]}
	${m[1]} | ${m[4]} | ${m[7]}
	${m[2]} | ${m[5]} | ${m[8]}
	`);
}

// Game loop -> https://www.w3schools.com/jsref/met_win_setinterval.asp
const updateBackground = () => {
    height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var speed = rocket.speed * 0.25;
    var angle = rocket.rotation * Math.PI/180;
    var velX  = -Math.sin(angle) * speed;
    var velY  =  Math.cos(angle) * speed;
    background.positionX += velX;
    background.positionY += velY;
    var sx = 1600;
    var sy = sx;
    if ( background.positionX < 0  ) background.positionX += sx;
    if ( background.positionY < 0  ) background.positionY += sy;
    if ( background.positionX > sx ) background.positionX -= sx;
    if ( background.positionY > sy ) background.positionY -= sy;

    for (const meteorite of meteorites) {
        meteorite.positionY += 3;
        meteorite.positionX += velX;
        meteorite.positionY += velY;
    }

    UpdateTrans();
}


const throwMeteorite = () => {
    const xpos = Math.floor(Math.random() * width) + 1
    const meteorite = {
        id: meteoriteCurrentId+=1,
        positionX: xpos,
        positionY: -200,
        scale: 1,
        rotation: 0
    }
    meteorites.push(meteorite);
}

const startIntervals = () => {
    updateBackgroundInterval = setInterval( updateBackground, 15);
    creationOfMeteoritesInterval = setInterval(function() {
        throwMeteorite();
    }, 3000);
}

startIntervals();
