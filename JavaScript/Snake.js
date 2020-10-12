const canvas = document.getElementById("snake");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let snakeSize = 20;
let fps = 20;
let paused = true;
const ctx = canvas.getContext("2d");

// Interval
let interval;
// Snake object
let snake = [newSnake()]
// Apple object
let apple = newApple();

function applySettings()
{
    fps = document.getElementById("difficultyInput").value;
    clearInterval(interval);
    interval = setInterval(render, 1000/fps);
}

function start()
{
    paused = !paused;
    document.getElementById("snakeStartButton").style.display = "none";
}

function fillBackground()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawApple()
{
    ctx.fillStyle = "red";
    ctx.fillRect(apple[0], apple[1], snakeSize, snakeSize);
}
function newApple()
{
    let randomAppleX = snakeSize * Math.floor(Math.random() * (canvasWidth/(snakeSize)) + 1);
    let randomAppleY = snakeSize * Math.floor(Math.random() * (canvasHeight/(snakeSize)) + 1);
    if(randomAppleX == canvasWidth)
    {
        randomAppleX -= snakeSize;
    }
    if(randomAppleY == canvasHeight)
    {
        randomAppleY -= snakeSize;
    }
    let check = [randomAppleX, randomAppleY];
    while(check in snake)
    {
        randomAppleX = snakeSize * Math.floor(Math.random() * (canvasWidth/(snakeSize * 1.5)) + 1)
        randomAppleY = snakeSize * Math.floor(Math.random() * (canvasHeight/(snakeSize * 1.5)) + 1)
    }
    return check;
}
function newSnake()
{
    let randomSnakeX = snakeSize * Math.floor(Math.random() * (canvasWidth/(snakeSize)) + 1);
    let randomSnakeY = snakeSize * Math.floor(Math.random() * (canvasHeight/(snakeSize)) + 1);
    if(randomSnakeX == canvasWidth)
    {
        randomSnakeX -= snakeSize;
    }
    if(randomSnakeY == canvasHeight)
    {
        randomSnakeY -= snakeSize;
    }
    return [randomSnakeX, randomSnakeY];
}

function drawSnake()
{
    for(let i = 0; i < snake.length; i++)
    {
        ctx.fillStyle = "white";
        ctx.fillRect(snake[i][0], snake[i][1], snakeSize, snakeSize);
    }
}
function resetSnake()
{
    paused = true;
    snake = [newSnake()]
    fillBackground();
    apple = newApple();
    drawApple();
    drawSnake();
    document.getElementById("snakeStartButton").style.display = "initial";
}

let keyMap = {"w": false, "a": false, "s": false, "d": true}
function canMove(key)
{
    switch(key)
    {
        case "w":
            if(snake.length == 1 || snake[0][1] - snakeSize != snake[1][1])
            {
                return true;
            }
            else{
                return false
            }
        case "a":
            if(snake.length == 1 ||  snake[0][0] - snakeSize != snake[1][0])
            {
                return true;
            }
            else{
                return false
            }
        case "s":
            if(snake.length == 1 ||  snake[0][1] + snakeSize != snake[1][1])
            {
                return true;
            }
            else{
                return false
            }
        case "d":
            if(snake.length == 1 ||  snake[0][0] + snakeSize != snake[1][0])
            {
                return true;
            }
            else{
                return false
            }
    }

}
onkeydown = function(event)
{
    console.log(canMove(event.key));
    if(canMove(event.key))
    {
        if(event.key ==="w")
        {
            keyMap["w"] = true;
            keyMap["a"] = false;
            keyMap["s"] = false;
            keyMap["d"] = false;
        }
        if(event.key === "a")
        {
            keyMap["w"] = false;
            keyMap["a"] = true;
            keyMap["s"] = false;
            keyMap["d"] = false;
        }
        if(event.key === "s")
        {
            keyMap["w"] = false;
            keyMap["a"] = false;
            keyMap["s"] = true;
            keyMap["d"] = false;
        }
        if(event.key === "d")
        {
            keyMap["w"] = false;
            keyMap["a"] = false;
            keyMap["s"] = false;
            keyMap["d"] = true;
        }
    }
    if(event.key === " ")
    {
        paused = !paused;
    }
}

function collisionHandler()
{
    if(apple.toString() === snake[0].toString())
    {
        console.log("apple");
        return "apple";
    }
    if(snake[0][0] >= canvasWidth || snake[0][0] < 0)
    {
        return "end";
    }
    if(snake[0][1] >= canvasHeight || snake[0][1] < 0)
    {
        return "end";
    }
    if(snake.length > 1)
    {
        for(let i = 1; i < snake.length; i++)
        {
            if(snake[0].toString() === snake[i].toString())
            {
                return "end";
            }
        }
    }
}

function moveSnake()
{
    if(!paused)
    {
        let breakValue = false;
        let iterateTo = snake.length;
        fillBackground();
        let tempHolder = snake[0].slice();
        let tempHolder2 = [];
        if(keyMap["w"] === true)
        {
            snake[0][1] -= snakeSize;
        }
        if(keyMap["a"] === true)
        {
            snake[0][0] -= snakeSize;
        }
        if(keyMap["s"] === true)
        {
            snake[0][1] += snakeSize;
        }
        if(keyMap["d"] === true)
        {
            snake[0][0] += snakeSize;
        }
        if(collisionHandler() === "apple")
        {
            iterateTo += 1;
            apple = newApple();
        }
        else if(collisionHandler() === "end")
        {
            resetSnake();
            breakValue = true;
        }

        if(!breakValue)
        {
            moveSnakeHelper(snake[0]);
            for(let i = 1; i < iterateTo; i++)
            {
                tempHolder2 = snake[i]
                snake[i] = tempHolder
                tempHolder = tempHolder2;
                moveSnakeHelper(snake[i]);
            }
        }
    }
}
function moveSnakeHelper(piece)
{
    ctx.fillStyle = "white";
    ctx.fillRect(piece[0], piece[1], snakeSize, snakeSize);
}

// debugging code
function debuggingMove()
{
    fillBackground();
    let tempHolder = snake[0].slice();
    let tempHolder2 = [];
    if(keyMap["w"] === true)
    {
        snake[0][1] -= snakeSize;
    }
    if(keyMap["a"] === true)
    {
        snake[0][0] -= snakeSize
    }
    if(keyMap["s"] === true)
    {
        snake[0][1] += snakeSize;
    }
    if(keyMap["d"] === true)
    {
        snake[0][0] += snakeSize
    }
    moveSnakeHelper(snake[0]);
    for(let i = 1; i < snake.length; i++)
    {
        tempHolder2 = snake[i]
        snake[i] = tempHolder
        tempHolder = tempHolder2;
        moveSnakeHelper(snake[i]);
    }

}

function debugRender()
{
    fillBackground();
    drawSnake();
    drawApple();
}

function render()
{
    moveSnake();
    drawApple();
}

fillBackground();
drawSnake();

interval = setInterval(render, 1000/fps);