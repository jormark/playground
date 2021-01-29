var viewportWidth = document.documentElement.clientWidth;
var viewportHeight = document.documentElement.clientHeight;
var objects = [];

window.addEventListener('resize', function () {
    viewportWidth = document.documentElement.clientWidth;
    viewportHeight = document.documentElement.clientHeight;
    Engine.clear(engine);
    Render.stop(render);
    Engine.run(engine);
    Render.run(render);
});

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
var ground = Bodies.rectangle(viewportWidth / 2, viewportHeight, viewportWidth + 10, 100, { isStatic: true, render: { fillStyle: '#DDDDDD' } });
var leftWall = Bodies.rectangle(0, viewportHeight / 2, 5, viewportHeight + 10, { isStatic: true, render: { fillStyle: '#00000000' } });
var rightWall = Bodies.rectangle(viewportWidth, viewportHeight / 2, 5, viewportHeight + 10, { isStatic: true, render: { fillStyle: '#00000000' } });
var ceiling = Bodies.rectangle(viewportWidth / 2, 0, viewportWidth + 10, 5, { isStatic: true, render: { fillStyle: '#00000000' } });

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
                texture: 'image.jpg',
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

// add all of the bodies to the world
World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);