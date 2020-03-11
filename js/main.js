let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")
const bgImage = new Image()
bgImage.src = "img/bg-canvas.png"
let holderH = 5
let holderW = 40
let holderX = (canvas.width - holderW)/2
let holderY = canvas.height - holderH
let ballX = canvas.width/2
let ballY = canvas.height
let dx = 4
let dy = -4
let ballRadius = 4
let isRightPressed = false
let isLeftPressed = false
let mousedown = false 
let x = 0
let brickRowCount = 3
let brickColumnCount = 6
let brickWidth = 40
let brickHeight = 10
let brickPadding = 5
let brickOffsetTop = 18
let brickOffsetLeft = 18
let bricks = []
let score = 0
let lives = 3;
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { 
            x: 0,
            y: 0,
            status: 1
        }
    }
}


// holder event mousedown 
canvas.addEventListener('mousedown', mouseDownHandler)
// holder event mouseup 
canvas.addEventListener('mouseup', mouseUpHandler)
// holder mousemove to stop 
canvas.addEventListener('mousemove', mouseMove)

function mouseDownHandler(e){
    // mouse state set to true 
    mousedown = true
    x = holderX - e.clientX
}

function mouseUpHandler (){
    // mouse state set to false 
    mousedown = false;
}

function mouseMove(e){
    // Is mouse pressed 
    if (mousedown) { 
    // Now we calculate the difference upwards
        holderX = e.clientX + x
        if(holderX < 0){
            holderX = 0
        }
        if(holderX + holderW > canvas.width){
            holderX = canvas.width - holderW
        }
    } 
}

document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        isRightPressed = true
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        isLeftPressed = true
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        isRightPressed = false
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        isLeftPressed = false
    }
}

// 
function bricksCollision() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r]
            if(b.status == 1) {
                if(ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    dy = -dy
                    b.status = 0
                    score++
                    if(score == brickRowCount*brickColumnCount) {
                        alert("CONGRATULATIONS, YOU WON!!")
                        document.location.reload()
                        clearInterval(setInterval(draw,30)) // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}


function wallHolderCollision(){
    // top wall logic if the ball hit the top dy = -dy
    if(ballY + dy < ballRadius) { 
        dy = -dy
    } // bottom wall logic if the ball hit the bottom
    else if(ballY + dy > canvas.height - ballRadius){ 
        //if the x axis of the ball greter than x axis of the holder
        if(ballX > holderX && ballX < holderX + holderW) {
            // check where the ball hit the holder
            let collidePoint = ballX - (holderX + holderW/2)
            
            // normalize the values
            collidePoint = collidePoint / (holderX/2)
            
            // calculate the angel of the ball
            let angle = collidePoint * (Math.PI)
                
            dx = 4 * Math.sin(angle)
            dy = -4 * Math.cos(angle)
        }else{ // this is when the ball touch the bottom wall
            lives--
            if(!lives) { //if no lives left the Game Over
                alert("GAME OVER ):")
                document.location.reload() //refresh the page if the player lose 
                clearInterval(setInterval(draw,30)) // Needed for Chrome to end game
            }
            else { // if there are lives refresh the variables of the ball and the holder to start from the middle
                ballX = canvas.width/2
                ballY = canvas.height - holderH
                dx = 4
                dy = -4
                holderX = (canvas.width-holderW)/2
            }
        }
    }
    // handle the left and right walles
    if(ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius){
        dx = -dx
    }
}


function drawScore() {
    ctx.font = "10px cursive"
    ctx.fillStyle = "rgb(21, 18, 78)"
    ctx.fillText("Score: " + score, 16,13)
}

function drawLives() {
    ctx.font = "10px cursive"
    ctx.fillStyle = "rgb(21, 18, 78)"
    ctx.fillText("Lives: "+ lives, canvas.width - 50, 13)
}

function drawBall(){
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.closePath()
    ballY += dy
    ballX += dx
}

function dwarRect(){
    ctx.beginPath()
    ctx.fillStyle = "rgb(21, 18, 78)"
    ctx.fillRect(holderX, holderY, holderW, holderH)
    ctx.closePath()
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = "rgb(255, 252, 94)"
                ctx.strokeStyle = "rgb(2,0,36)";
                ctx.stroke();
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bgImage, 0, 0)
    drawBricks()
    drawBall()
    dwarRect()
    drawScore()
    drawLives()
    bricksCollision()
    wallHolderCollision()

    if(isRightPressed) {
        holderX += 6
        if (holderX + holderW > canvas.width){ //handle the holder when click right arrow 
                                               //to make it stop in the right wall
            holderX = canvas.width - holderW
        }
    } else if(isLeftPressed) {
        holderX -= 6
        if (holderX < 0){ //handle the holder when click left arrow 
                          //to make it stop in the left wall
            holderX = 0
        }
    }
}

let start = document.getElementById("start")
start.addEventListener("click",function(){
    setInterval(draw,30)
})

