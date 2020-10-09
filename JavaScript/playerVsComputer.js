const canvas = document.getElementById("pong");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const paddleHeight = 100;
const paddleWidth = 10;

let computerLevel = .1;
function setComputerLevel()
{
    let level = document.getElementById("computerLevelSelect").value;
    computerLevel = level/10;
    paused = false;
    document.getElementById("pongLevelInput").style.display = "none";
    document.getElementById("pong").style.cursor = "none";
}

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

const computer = {
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

let randomDirectionX = Math.floor(Math.random() * 5) + 2;
randomDirectionX *= Math.floor(Math.random() * 2) === 1 ? 1 : -1
let randomDirectionY = Math.floor(Math.random() * 9) + 2;
randomDirectionY *= Math.floor(Math.random() * 2) === 1 ? 1 : -1
const ball = {
    x: canvasWidth/2,
    y: canvasHeight/2,
    radius: 10,
    speed: 0,
    velocityX: randomDirectionX,
    velocityY: randomDirectionY,
    color: "red"
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
    if(ballCollision(headingTo))
    {
        ball.velocityX *= -1.1;
    }
    else if(ball.x + ball.radius >= canvasWidth || ball.x - ball.radius <= 0)
    {
        score(headingTo === user ? computer : user);
    }
    if(ball.y + ball.radius >= canvasHeight || ball.y - ball.radius <= 0)
    {
        ball.velocityY *= -1;
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
        if(paddle.isPlayer === true && ball.x - ball.radius + ball.velocityX < paddleTemp.side)
        {
            return true;
        }
        else if(paddle.isPlayer === false && ball.x + ball.radius + ball.velocityX > paddleTemp.side)
        {
            return true;
        }
    }
    return false;
}
function score(player)
{
    randomDirectionX = Math.floor(Math.random() * 5) + 2;
    randomDirectionX *= Math.floor(Math.random() * 2) === 1 ? 1 : -1
    randomDirectionY = Math.floor(Math.random() * 9) + 2;
    randomDirectionY *= Math.floor(Math.random() * 2) === 1 ? 1 : -1
    ball.velocityX = randomDirectionX;
    ball.velocityY = randomDirectionY;
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

function computerMovement()
{
    computer.y += (ball.y - (computer.y + paddleHeight/2)) * computerLevel;
    if(computer.y < 0)
    {
        computer.y = 0;
    }
    if(computer.y + paddleHeight > canvasHeight)
    {
        computer.y = canvasHeight - paddleHeight;
    }
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
drawText(computer.score, canvasWidth* 3/4, canvasHeight/5)
drawRect(user.x, user.y, user.width, user.height, user.color);
drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
drawCircle(ball.x, ball.y, ball.radius, ball.color);

// RENDERING CODE
let headingTo = null;
function render()
{
    if(!paused)
    {
        headingTo = ball.velocityX > 0 ? computer : user;
        fillBackground();
        drawText(user.score, canvasWidth* 1/4, canvasHeight/5);
        drawText(computer.score, canvasWidth* 3/4, canvasHeight/5)
        drawRect(user.x, user.y, user.width, user.height, user.color);
        computerMovement();
        drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
        drawCircle(ball.x, ball.y, ball.radius, ball.color);
        moveCircle();
    }
}

const framesPerSecond = 50;
setInterval(render, 1000/framesPerSecond)
