var viewportWidth = document.documentElement.clientWidth;
var viewportHeight = document.documentElement.clientHeight;
var objects = [];
var playgroundCanvas = document.querySelector("canvas");
var gravity;
var bouncy;
var backgroundIMG = "";
var bouncefriction = 0.1,
    bouncefrictionAir = 0.001,
    bouncerestitution = 0;
var newImgHeight,
    newImgWidth,
    newImageURL;
var PlaygroundDoc = db.collection("Playground").doc("Grounds");

//puts all playgrounds into array
var groundArray = [];
PlaygroundDoc.get().then((doc) => {
    doc.data().groundList.forEach(doc => {
        if(doc.name!=playgroundName1){
            groundArray.push(doc);
        }
       
    })
}).catch((error) => {
    console.log("Error getting document:", error);
});




//groundArray CONTAINS ALL PLAYGROUNDS IN AN ARRAY, groundData CONTAINS DATA FOR CURRENTLY SELECTED PLAYGROUND IN AN OBJECT

//take name from url and use it to pull correct data from firebase
var url = new URL(window.location.href);
var playgroundName1 = url.searchParams.get("thumb");
var groundData = new Object;
var gravityButton = document.getElementById("gravity");
var bouncyButton = document.getElementById("bouncy");

PlaygroundDoc.get().then((doc) => {
    doc.data().groundList.forEach(doc => {
        if(doc.name == playgroundName1){
            groundData.gravity = doc.gravity;
            groundData.gravityMultiplier = doc.gravityMultiplier;
            groundData.itemArray = doc.itemArray;
            groundData.name = doc.name;
            groundData.public = doc.public;
            groundData.bouncy = doc.bouncy;
        }
    })
    function pageLoaded(){
        if(groundData.gravity==false){
                engine.world.gravity.y = 0;
                gravityButton.setAttribute("style", "color: #818181");
                gravity = false;
                groundData.gravity = false;
            }
            else if (groundData.gravity == true) {
                engine.world.gravity.y = 1;
                gravityButton.setAttribute("style", "color: #66C8FF");
                gravity = true;
                groundData.gravity = true;
            }
            else {
                console.log("Not working");
            }
        }

        if (groundData.bouncy == false) {
            bouncefriction = 0.1;
            bouncefrictionAir = 0.001;
            bouncerestitution = 0;
            bouncyButton.setAttribute("style", "color: #818181");
            bouncy = false;
            groundData.bouncy = false;
        }
        else if (groundData.bouncy == true) {
            bouncefriction = 0.0;
            bouncefrictionAir = 0.000;
            bouncerestitution = 1.001;
            bouncyButton.setAttribute("style", "color: #36E25C");
            bouncy = true;
            groundData.bouncy = true;
        }
        else {
            console.log("Not working");
        }

        for(var i=0; i< groundData.itemArray.length; i++){
            if(groundData.itemArray[i].name=="ball"){
                smallCircle();
            }
            if(groundData.itemArray[i].name=="ball2"){
                makeCircle();
            }
            if(groundData.itemArray[i].name=="square1"){
                makeSquare();
            }
            if(groundData.itemArray[i].name=="rectangle1"){
                makeRectangle();
            }
        }
    pageLoaded();
}).catch((error) => {
    console.log("Error getting document:", error);
});

function getAllCoords(){
    groundData.itemArray = [];
    for(var i=0; i<engine.world.bodies.length; i++){
        var object = {};
        object.position = engine.world.bodies[i].position; 
        object.name = engine.world.bodies[i].render.name;
        

        groundData.itemArray.push(object);
    }
    groundData.itemArray.splice(0,4);
    console.log(groundData);
}


// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

// create an engine
var engine = Engine.create(),
    world = engine.world;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: viewportWidth,
        height: viewportHeight,
        wireframes: false,
        background: backgroundIMG,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }
});

// create mouse controls
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// create ground
var ground = Bodies.rectangle(viewportWidth / 2, viewportHeight + 200, viewportWidth + 10, 500, { isStatic: true, render: { fillStyle: '#DDDDDD' } });
var leftWall = Bodies.rectangle(-250, viewportHeight / 2, 500, viewportHeight + 100, { isStatic: true, render: { fillStyle: '#00000000' } });
var rightWall = Bodies.rectangle(viewportWidth + 250, viewportHeight / 2, 500, viewportHeight + 100, { isStatic: true, render: { fillStyle: '#00000000' } });
var ceiling = Bodies.rectangle(viewportWidth / 2, -250, viewportWidth + 10, 500, { isStatic: true, render: { fillStyle: '#00000000' } });

var ball = function () {
    let circle = Bodies.circle(viewportWidth / 2, 20, 20, {
        render: {
            fillStyle: '#00FFFF',
            name: "ball",
        },
        friction: bouncefriction,
        frictionAir: bouncefrictionAir,
        restitution: bouncerestitution
    });
    return circle;
}

var ball2 = function () {
    let circle2 = Bodies.circle(viewportWidth / 2, 40, 40, {
        render: {
            fillStyle: '#0000FF',
            name: "ball2",
        },
        friction: bouncefriction,
        frictionAir: bouncefrictionAir,
        restitution: bouncerestitution
    });
    return circle2;
}

var square1 = function () {
    let square = Bodies.rectangle(viewportWidth / 2, viewportHeight / 2, 40, 40, {
        render: {
            fillStyle: '#FF0000',
            name: "square1",
        },
        friction: bouncefriction,
        frictionAir: bouncefrictionAir,
        restitution: bouncerestitution
    });
    return square;
}

var rectangle1 = function () {
    let rectangle = Bodies.rectangle(viewportWidth / 2, viewportHeight / 2, 300, 50, {
        render: {
            fillStyle: '#DDDDDD',
            name: "rectangle1",

        },
        friction: bouncefriction,
        frictionAir: bouncefrictionAir,
        restitution: bouncerestitution
    });
    return rectangle;
}

var newImage = function () {
    return Bodies.rectangle(viewportWidth / 2, viewportHeight / 2, newImgWidth, newImgHeight, {
        render: {
            sprite: {
                texture: newImageURL,
            }
        },
        friction: bouncefriction,
        frictionAir: bouncefrictionAir,
        restitution: bouncerestitution
    });
}

function makeMultiple() {
    for (var i = 0; i < 10; i++) {
        World.add(engine.world, ball());
        objects.push(ball());
    }
}


function smallCircle() {
    World.add(engine.world, ball());
    objects.push(ball());
}

function makeCircle() {
    World.add(engine.world, ball2());
    objects.push(ball2());
}

function makeSquare() {
    World.add(engine.world, square1());
    objects.push(square1());
}

function makeRectangle() {
    World.add(engine.world, rectangle1());
    objects.push(rectangle1());
}

function importImage(event) {
    newImageURL = URL.createObjectURL(event.target.files[0]);
    image = new Image();
    image.src = newImageURL;
    image.onload = function () {
        newImgHeight = this.height;
        newImgWidth = this.width;
        console.log(newImgHeight, newImgWidth, newImageURL);
        World.add(engine.world, newImage());
        console.log("Done!");
        objects.push(newImage());
        newImageURL = null;
        newImgHeight = null;
        newImgWidth = null;
        event.target.value = null;
    };
}

function gravToggle(gravButton) {
    if (gravity == true) {
        engine.world.gravity.y = 0;
        gravButton.setAttribute("style", "color: #818181");
        gravity = false;
        groundData.gravity = false;
    }
    else if (gravity == false) {
        engine.world.gravity.y = 1;
        gravButton.setAttribute("style", "color: #66C8FF");
        gravity = true;
        groundData.gravity = true;
    }
    else {
        console.log("Not working");
    }
}

function bouncify(bouncyButton) {
    if (bouncy == true) {
        bouncefriction = 0.1;
        bouncefrictionAir = 0.001;
        bouncerestitution = 0;
        bouncyButton.setAttribute("style", "color: #818181");
        bouncy = false;
        groundData.bouncy = false;
    }
    else if (bouncy == false) {
        bouncefriction = 0.0;
        bouncefrictionAir = 0.000;
        bouncerestitution = 1.001;
        bouncyButton.setAttribute("style", "color: #36E25C");
        bouncy = true;
        groundData.bouncy = true;
    }
    else {
        console.log("Not working");
    }
}

function saveCoords() {
    getAllCoords();
    console.log(engine.world);
    groundArray.push(groundData);
    PlaygroundDoc.update({
        groundList: groundArray,
    })
    groundArray.pop();
}

function reset() {
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
    Matter.Render.stop(render);
    Matter.World.clear(world);
    Matter.Engine.clear(engine);
    bouncefriction = 0.1;
    bouncefrictionAir = 0.001;
    bouncerestitution = 0;
    document.querySelector("#bouncy").setAttribute("style", "color: #818181");
    bouncy = false;
    objects = [];
    backgroundIMG = "";
    Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;
    engine = Engine.create(),
        world = engine.world;
    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: viewportWidth,
            height: viewportHeight,
            wireframes: false,
            background: backgroundIMG,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }
    });
    mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);
    World.add(engine.world, [ground, leftWall, rightWall, ceiling]);
    Engine.run(engine);
    engine.timing.timeScale = 1;
    engine.world.gravity.y = 1;
    document.querySelector("#gravity").setAttribute("style", "color: #66C8FF");
    Render.run(render);
    playgroundCanvas = document.querySelector("canvas");

}

var changeBackground = function (event) {
    playgroundCanvas = document.querySelector("canvas");
    backgroundIMG = URL.createObjectURL(event.target.files[0]);
    playgroundCanvas.setAttribute("style", "background: url('" + backgroundIMG + "') 50% 50% / cover;");
}

// add all of the bodies to the world
World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);