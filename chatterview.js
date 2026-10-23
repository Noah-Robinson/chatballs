let CHANNEL_NAME = "shketchupa"; // Variable that changes what channel to listen to messages from
let FILTER_BOTS = true; // Whether or not to remove bots from the chat

let FLOOR_THICKNESS = 90; // How thick the floor is
let SHOW_FLOOR = false; // Whether or not the floor is moved below the window
let WALL_THICKNESS = 300; // How thick the walls are
let SHOW_WALLS = false; // Whether or not the walls are moved outside the window
let WALL_BOUNCINESS = 0.85; // How bouncy the balls are from 0 (not bouncy) to 1 (completely bouncy)
let WALL_BONUS_HEIGHT = 2000; // Extra height given to the walls to prevent balls from going over the top of them offscreen
let SPAWN_BUFFER = 200; // The distance from either edge of the screen that balls cannot spawn in
let SPAWN_HEIGHT = 0; // The top of the screen is 0, probably leave this one alone
let CIRCLE_MAX = 20; // The maximum radius that the ball can be
let CIRCLE_MIN = 10; // The minimum radius that the ball can be

let STATIC_DELAY = 3; // The minimum length of time that a message stays on screen before being deleted in seconds
let VARIABLE_DELAY = 0.4; // The amount of time that is added per word in seconds
let MESSAGE_Y_OFFSET = 10; // Additional height given to the message text
let MAX_X_SPEED = 20; // The maximum horizontal speed that a ball will gain when a chat message is sent
let MAX_Y_SPEED = 30; // The maximum vertical speed that a ball will gain when a chat message is sent
let MIN_Y_SPEED = 10; // The minimum vertical speed that a ball will gain when a chat message is sent

let messageContainer = document.getElementById("messageContainer");
let canvasContainer = document.getElementById("canvasContainer");

chatters = {};

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
    Common = Matter.Common;
    Mouse = Matter.Mouse;
    MouseConstraint = Matter.MouseConstraint;
    Events = Matter.Events;

var engine = Engine.create();

var render = Render.create({
    element: canvasContainer,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent",
        wireframes: false,
        showAngleIndicator: false
    }
});

if (SHOW_WALLS == true) {
    var leftWall = Bodies.rectangle(0, 0, WALL_THICKNESS, window.innerHeight + WALL_BONUS_HEIGHT, {isStatic: true, restitution: WALL_BOUNCINESS});
    var rightWall = Bodies.rectangle(window.innerWidth, 0, WALL_THICKNESS, window.innerHeight + WALL_BONUS_HEIGHT, {isStatic: true, restitution: WALL_BOUNCINESS});
} else {
    var leftWall = Bodies.rectangle(0 - WALL_THICKNESS / 2, 0, WALL_THICKNESS, window.innerHeight + WALL_BONUS_HEIGHT, {isStatic: true, restitution: WALL_BOUNCINESS});
    var rightWall = Bodies.rectangle(window.innerWidth + WALL_THICKNESS / 2, 0, WALL_THICKNESS, window.innerHeight + WALL_BONUS_HEIGHT, {isStatic: true, restitution: WALL_BOUNCINESS});
}

if (SHOW_FLOOR == true) {
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, FLOOR_THICKNESS, {isStatic: true});
} else {
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + FLOOR_THICKNESS / 2, window.innerWidth, FLOOR_THICKNESS, {isStatic: true});
}


Composite.add(engine.world, [ground, leftWall, rightWall]);

Render.run(render);

var runner = Runner.create();

Runner.run(runner, engine);

var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

Composite.add(engine.world, mouseConstraint);
render.mouse = mouse;

ComfyJS.onChat = (user, message, flags, self, extra) => {
    if (Object.hasOwn(extra, "userBadges")) {
        if (extra.userBadges != null) {
            if ("bot-badge" in extra.userBadges && FILTER_BOTS == true) {
                return
            }
        }
    }
    if (user in chatters == false) {
        var newCircle = Bodies.circle(Common.random(0 + SPAWN_BUFFER, window.innerWidth - SPAWN_BUFFER), SPAWN_HEIGHT, Common.random(CIRCLE_MIN, CIRCLE_MAX), {restitution: WALL_BOUNCINESS})
        newCircle.render.fillStyle = extra.userColor;
        chatters[user] = newCircle.id;
        Composite.add(engine.world, newCircle)
        var forceVector = Matter.Vector.create(Common.random(-MAX_X_SPEED, MAX_X_SPEED), 0);
        Matter.Body.setVelocity(newCircle, forceVector);
    } else {
        var object = Composite.get(engine.world, chatters[user], "body")
        var forceVector = Matter.Vector.create(Common.random(-MAX_X_SPEED, MAX_X_SPEED), Common.random(-MIN_Y_SPEED, -MAX_Y_SPEED));
        Matter.Body.setVelocity(object, forceVector);
    };

    let previousMessage = document.getElementById(user);
    if (previousMessage != null) {
        previousMessage.remove();
    }
    let messageText = document.createElement("p");
    messageText.innerHTML = message;
    messageText.id = user;
    messageContainer.appendChild(messageText);
    messageText.style.transform = "translate(-50%, 0)"


    let messageLength = message.split(" ").length;
    setTimeout(function() {
    messageText.remove();
    }, STATIC_DELAY * 1000 + messageLength * VARIABLE_DELAY * 1000);
}
    

Events.on(engine, 'afterUpdate', function() {
    let messages = Array.from(messageContainer.children);
    messages.forEach(message => {
        let object = Composite.get(engine.world, chatters[message.id], "body");
        message.style.left = object.position.x + "px";
        message.style.top = (object.position.y - message.offsetHeight - MESSAGE_Y_OFFSET) + "px";
    });
})

ComfyJS.Init(CHANNEL_NAME);