import React from 'react';
import './game-snake.css'

class Snake extends React.Component {

    state = {
        gameGoing: false,
        cellSize: 10,
        body: [],
        apple: {
            x: Math.floor((Math.floor(Math.random()*this.props.canvasWidth))/10),
            y: Math.floor((Math.floor(Math.random()*this.props.canvasWidth))/10),
        },
        moveDirection: 'toRight',
        moveDirectionChanged: false,
        speed: 1,
        playerScore: 0,
        crash: false,
        uroboros: false,
    }

    drawFrame() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const canvasWidth = canvas.width;             // ширина канваса
        const canvasHeight = canvas.height;           // высота канваса
        const { body, cellSize, apple, playerScore } = this.state;

        // очищаем канвас
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // рисуем змею
        for (let item of body) {
            if (item === body[0]){
                ctx.fillStyle = 'black';
            }
            else{
                ctx.fillStyle = 'brown';
            }
            ctx.fillRect( item.x*cellSize,item.y*cellSize,cellSize,cellSize );
        }

        /* 
            если голова попадает на яблоко - пушим в body дополнительную клетку
            и ставим яблоко на новое место
            и увеличиваем счет игрока
        */
        if ( body[0].x === apple.x && body[0].y === apple.y) {
            let newBody = body;
            let newBodyPart = newBody[newBody.length-1]
            newBody.push(newBodyPart)
            
            this.setState({
                apple: {
                    x: Math.floor((Math.floor(Math.random()*this.props.canvasWidth))/10),
                    y: Math.floor((Math.floor(Math.random()*this.props.canvasWidth))/10),
                },
                playerScore: playerScore + 1
            })
        }

        // рисуем яблоко
        ctx.fillStyle = 'green';
        ctx.fillRect( apple.x*cellSize,apple.y*cellSize,cellSize,cellSize );


        // проверки на аварии
        
        let head = body[0];
        let bodyWithoutHead = body.slice(1);
        let crash_uroboros = bodyWithoutHead.find(item => item.x === head.x && item.y === head.y);
        if (crash_uroboros) {
            this.setState({
                crash: true,
                uroboros: true,
                gameGoing: false
            })
        }

        if (head.x >= canvasWidth/10 ||
            head.x < 0 ||
            head.y < 0 ||
            head.y >= canvasHeight/10 ) {
                this.setState({
                    crash: true,
                    gameGoing: false
                })
            }
        
    }

    changeMoveDirection() {
        document.onkeydown = (event) => {
            if ( !this.state.moveDirectionChanged ) {
                switch (event.keyCode) {
                    case 37:
                        if (this.state.moveDirection !== 'toRight'){
                            this.setState({moveDirection: 'toLeft'})
                        }
                    break;
    
                    case 38:
                        if (this.state.moveDirection !== 'toBottom'){
                            this.setState({moveDirection: 'toTop'})
                        }
                    break;
    
                    case 39:
                        if (this.state.moveDirection !== 'toLeft'){
                            this.setState({moveDirection: 'toRight'})
                        }
                    break;
    
                    case 40:
                        if (this.state.moveDirection !== 'toTop'){
                            this.setState({moveDirection: 'toBottom'})
                        }
                    break;
                    
                    default: 
                    break;
                }
                this.setState({
                    moveDirectionChanged: true
                })
            }
        };
    }

    moveSnake = () => {
        const { body, moveDirection } = this.state;

        const prevBody = body;
        let newBody = [];

        switch ( moveDirection ) {
            case 'toRight':
                const toRight_headX = prevBody[0].x+1;
                const toRight_headY = prevBody[0].y;
                newBody[0] = {
                    x: toRight_headX,
                    y: toRight_headY
                }
                for (let i = 1; i < body.length; i++) {
                    newBody[i] = prevBody[i - 1]
                }
                this.setState({
                    body: newBody
                })
            break;
            case 'toTop':
                const toTop_headX = prevBody[0].x;
                const toTop_headY = prevBody[0].y-1;
                newBody[0] = {
                    x: toTop_headX,
                    y: toTop_headY
                }
                for (let i = 1; i < body.length; i++) {
                    newBody[i] = prevBody[i - 1]
                }
                this.setState({
                    body: newBody
                })
            break;
            case 'toLeft':
                const toLeft_headX = prevBody[0].x-1;
                const toLeft_headY = prevBody[0].y;
                newBody[0] = {
                    x: toLeft_headX,
                    y: toLeft_headY
                }
                for (let i = 1; i < body.length; i++) {
                    newBody[i] = prevBody[i - 1]
                }
                this.setState({
                    body: newBody
                })
            break;
            case 'toBottom':
                const toBottom_headX = prevBody[0].x;
                const toBottom_headY = prevBody[0].y+1;
                newBody[0] = {
                    x: toBottom_headX,
                    y: toBottom_headY
                }
                for (let i = 1; i < body.length; i++) {
                    newBody[i] = prevBody[i - 1]
                }
                this.setState({
                    body: newBody
                })
            break;
        }
        this.setState({
            moveDirectionChanged: false
        })
    }

    letsGo = () => {
        this.setState({
            gameGoing: true,
            body: [
                {x: 1, y: 0},
                {x: 0, y: 0},
            ],
            moveDirection: 'toRight',
            speed: 1,
            playerScore: 0,
            crash: false,
            uroboros: false
        })
        this.intervalAdd = setInterval(() => this.moveSnake(), 100); 
        this.changeMoveDirection();
    }

    crash() {
        const { uroboros } = this.state;
        clearInterval(this.intervalAdd);

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "24px serif";

        if (uroboros) {
            console.log('уроборос')
            const img = new Image();
            img.src = 'https://cdn1.radikalno.ru/uploads/2020/1/7/1b7f7d18cc6f6e4d6c13401e8c2c6cfe-full.png';
    
            img.onload = function(){
                ctx.drawImage(img,0,0,canvas.width,canvas.height);
            };
        }

        let evaluation;
        if ( this.state.playerScore < 10 ) {
            evaluation = 'мало...'
        }
        else if ( this.state.playerScore >= 10 && this.state.playerScore < 20 ) {
            evaluation = 'Нормально'
        }
        else if ( this.state.playerScore >= 20 && this.state.playerScore < 30) {
            evaluation = 'Неплохо!'
        }
        else if ( this.state.playerScore >= 30 ) {
            evaluation = 'Круто!'
        }

        const txt = `Ваш счет: ${this.state.playerScore}`
        ctx.fillText(txt ,canvas.width/2 - ctx.measureText(txt).width/2, canvas.height/2)
        ctx.fillText(evaluation ,canvas.width/2 - ctx.measureText(evaluation).width/2, canvas.height/2+20)
    }

    componentDidUpdate() {
        if (!this.state.crash) {
            this.drawFrame();
        }
        else {
            this.crash();
        }
    }

    render() {
        let btnClassName;
        let gameClassName;

        if ( this.state.gameGoing ) {
            btnClassName = 'racing-button hidden';
            gameClassName = 'game-container no-cursor'
        }
        else {
            btnClassName = 'racing-button';
            gameClassName = 'game-container'
        }

        
        return (
            <div className={gameClassName}>
                <span className="player-score">Ваш счет: {this.state.playerScore}</span>
                <canvas id='canvas' className="game" ref="canvas" width={this.props.canvasWidth} height={this.props.canvasHeight} />
                <button className={ btnClassName } onClick={this.letsGo}>GO!</button>
            </div>
        );
    }
}

export default Snake;