var viewportWidth = document.documentElement.clientWidth;
var viewportHeight = document.documentElement.clientHeight;
var objects = [];
var canvasDiv = document.getElementById("canvasDiv");
var gravity = true;

var url = new URL(window.location.href);
var playgroundName1 = url.searchParams.get("name");
console.log("playgroundName1");
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
        background: 'FFFFFF'
    }
});


window.addEventListener('resize', function () {
  
    Engine.clear(engine);
    Render.stop(render);
    Engine.run(engine);
    Render.run(render);
    viewportWidth = document.documentElement.clientWidth;
    viewportHeight = document.documentElement.clientHeight;
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
var ground = Bodies.rectangle(viewportWidth / 2, viewportHeight+200, viewportWidth + 10, 500, { isStatic: true, render: { fillStyle: '#DDDDDD' } });
var leftWall = Bodies.rectangle(-250, viewportHeight / 2, 500, viewportHeight + 100, { isStatic: true, render: { fillStyle: '#00000000' } });
var rightWall = Bodies.rectangle(viewportWidth+250, viewportHeight / 2, 500, viewportHeight + 100, { isStatic: true, render: { fillStyle: '#00000000' } });
var ceiling = Bodies.rectangle(viewportWidth / 2, -250, viewportWidth + 10, 500, { isStatic: true, render: { fillStyle: '#00000000' } });

var ball = function () {

    let circle = Bodies.circle(viewportWidth / 2, 40, 40, {
        render: {
            fillStyle: '#FF00FF'
        }
    });
    return circle;
}

var ball2 = function () {

    let circle2 = Bodies.circle(viewportWidth / 2, 40, 40, {
        render: {
            fillStyle: '#0000FF'
        }
    });
    return circle2;
}

var imageSquare = function () {

    return Bodies.rectangle(viewportWidth / 2, viewportHeight / 2, 400, 240, {
        render: {
            sprite: {
                texture: 'resources/assets/image.jpg',
            }
        }
    });
}

function makeObj() {
    for (var i = 0; i < 10; i++) {
        World.add(engine.world, ball());
        objects.push(ball());
    }
}

function makeCircle() {
    World.add(engine.world, ball2());
    objects.push(ball2());
}

function makeImg() {
    World.add(engine.world, imageSquare());
    objects.push(ball2());
}

function gravToggle() {
    if(gravity == true) {
        engine.world.gravity.y = 0;
        gravity = false;
    }
    else if(gravity == false) {
        engine.world.gravity.y = 1;
        gravity = true;
    }
    else {
        console.log("Not working");
    }
}

// add all of the bodies to the world
World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);