const canvas = document.getElementById("pong");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let paddleHeight = 100;
const paddleWidth = 10;
let ballSpeedMultiplier = 1.1;

const ctx = canvas.getContext("2d");

canvas.addEventListener("mousemove", function(mousePosition)
{
    user.y = mousePosition.offsetY - paddleHeight/2
    if(user.y < 0)
    {
        user.y = 0;
    }
    if(user.y + paddleHeight > canvasHeight)
    {
        user.y = canvasHeight - paddleHeight;
    }
})

const user = {
    isPlayer: true,
    x: 0,
    y: canvas.height/2 + paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    color: "white",
    score: 0
}

const user2 = {
    isPlayer: false,
    x: canvas.width - paddleWidth,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    color: "white",
    score: 0
}

const net = {
    x: canvas.width/2 - 2/2,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
}

let randomInitialSpeed = Math.floor((Math.random() * 5) + 3);
let randomYMultiplier = randomInitialSpeed * Math.random();
const ball = {
    x: canvasWidth/2,
    y: canvasHeight/2,
    radius: 10,
    speed: randomInitialSpeed,
    velocityX: randomInitialSpeed,
    velocityY: randomYMultiplier,
    color: "red"
}

function applySettings()
{
    ballSpeedMultiplier = document.getElementById("speedModifier").value;
}

// FUNCTIONS TO DRAW COMPONENTS
function fillBackground()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
    // Draws the net.
    for(let i = 0; i < canvasHeight; i += 15)
    {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawRect(x, y, w, h, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360, false);
    ctx.closePath();
    ctx.fill();
}

function moveCircle()
{
    let paddle = (ball.x < canvasWidth/2) ? user: user2;
    if(ball.x + ball.radius + ball.speed/2 >= canvasWidth || ball.x - ball.radius <= 0)
    {
        score(headingTo === user ? user2 : user);
    }
    if(ball.y + ball.radius + ball.speed/2 >= canvasHeight || ball.y - ball.radius <= 0)
    {
        ball.velocityY *= -1;
    }
    if(ballCollision(headingTo))
    {
        let collisionPoint = (ball.y - (paddle.y + paddle.height/2));
        collisionPoint /= paddle.height/2;
        let angle = (Math.PI/4) * collisionPoint;
        let direction = (ball.x < canvasWidth/2) ? 1 : -1;

        ball.velocityX = ball.speed * Math.cos(angle) * direction;
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += ballSpeedMultiplier;
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
}
function ballCollision(paddle)
{
    let paddleTemp = {
        top: null,
        bottom: null,
        side: null
    }
    paddleTemp.top = paddle.y;
    paddleTemp.bottom = paddle.y + paddle.height;

    if(paddle.isPlayer === true)
    {
        paddleTemp.side = paddle.width
    }
    else
    {
        paddleTemp.side = paddle.x
    }

    if(ball.y > paddleTemp.top && ball.y < paddleTemp.bottom)
    {
        if(paddle.isPlayer === true && ball.x - ball.radius - ball.speed < paddleTemp.side)
        {
            return true;
        }
        else if(paddle.isPlayer === false && ball.x + ball.radius + ball.speed > paddleTemp.side)
        {
            return true;
        }
    }
    return false;
}
function score(player)
{
    ball.velocityX = 5;
    ball.velocityY = 5;
    ball.speed = 5;
    ball.x = canvasWidth/2;
    ball.y = canvasHeight/2;
    player.score += 1;
}

function drawText(text, x, y, color)
{
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// DEBUGGING CODE
let velocityXHolder = 0;
let velocityYHolder = 0;
function pause()
{
    velocityXHolder = ball.velocityX;
    velocityYHolder = ball.velocityY;
    ball.velocityX = 0;
    ball.velocityY = 0;
    document.getElementById("pong").style.cursor = "initial";
}
function resume()
{
    ball.velocityX = velocityXHolder;
    ball.velocityY = velocityYHolder;
    document.getElementById("pong").style.cursor = "none";
}
function nextFrame()
{
    ball.x += velocityXHolder;
    ball.y += velocityYHolder;
}
let paused = true;
document.addEventListener("keydown", function(event)
{
    if(event.key === " ")
    {
        if(paused === false)
        {
            pause();
        }
        else
        {
            resume();
        }
        paused = !paused;
    }
    if(event.key === "Enter")
    {
        nextFrame();
    }
    if(event.key === "Backspace")
    {
        printBallVector();
    }
})
function printBallVector()
{
    console.log("ball.x: " + ball.velocityX);
    console.log("ball.y: " + ball.velocityY);
}

fillBackground();
drawText(user.score, canvasWidth* 1/4, canvasHeight/5);
drawText(user2.score, canvasWidth* 3/4, canvasHeight/5)
drawRect(user.x, user.y, user.width, user.height, user.color);
drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
drawCircle(ball.x, ball.y, ball.radius, ball.color);

// RENDERING CODE
let headingTo = null;
function render()
{
    if(!paused)
    {
        headingTo = ball.velocityX > 0 ? user2 : user;
        fillBackground();
        drawText(user.score, canvasWidth* 1/4, canvasHeight/5);
        drawText(user2.score, canvasWidth* 3/4, canvasHeight/5)
        drawRect(user.x, user.y, user.width, user.height, user.color);
        drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
        drawCircle(ball.x, ball.y, ball.radius, ball.color);
        moveCircle();
        // ADD CODE HERE THAT WILL MOVE THE TWO PADDLES.
    }
}

const framesPerSecond = 50;
setInterval(render, 1000/framesPerSecond)
