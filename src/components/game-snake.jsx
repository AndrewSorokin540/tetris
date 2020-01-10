import React from 'react';

import { getRandom } from '../methods'

export default class Snake extends React.Component {

    cellSize = 10; // размер ячейки
    canvasWidth = this.props.canvasWidth;
    canvasHeight = this.props.canvasHeight;
    cellNumberHorizont = this.canvasWidth/this.cellSize;    // кол-во клеток по горизонтали
    cellNumberVertical = this.canvasHeight/this.cellSize;   // кол-во клеток по вертикали

    state = {
        gameGoing: false,
        body: [
            { x: 1, y: 0 },
            { x: 0, y: 0 },
        ],
        apple: {},
        moveDirection: 'toRight',
        moveDirectionChanged: false,
        speed: 1,
        playerScore: 0,
        crash: false,
        uroboros: false,
    }

    drawFrame() {

        const ctx = document.getElementById('canvas').getContext('2d');

        const { body, apple, playerScore } = this.state;
        const { cellSize, canvasWidth, canvasHeight } = this;

        // очищаем канвас
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // рисуем змею
        for (let item of body) {
            if (item === body[0]) {
                ctx.fillStyle = 'black';
            }
            else {
                ctx.fillStyle = 'brown';
            }
            ctx.fillRect(item.x * cellSize, item.y * cellSize, cellSize, cellSize);
        }

        /* 
            если голова попадает на яблоко - пушим в body дополнительную клетку
            и ставим яблоко на новое место
            и увеличиваем счет игрока
        */
        if (body[0].x === apple.x && body[0].y === apple.y) {
            let newBody = body.slice();
            let newBodyPart = newBody[newBody.length - 1]
            newBody.push(newBodyPart)

            this.setState({
                playerScore: playerScore + 1,
                body: newBody
            })
            this.setApple();
        }

        // рисуем яблоко
        ctx.fillStyle = 'green';
        ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);


        // проверки на аварии

        // врезался сам в себя
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

        // голова вышла за пределы канваса
        if (head.x >= canvasWidth / 10 ||
            head.x < 0 ||
            head.y < 0 ||
            head.y >= canvasHeight / 10) {
            this.setState({
                crash: true,
                gameGoing: false
            })
        }
    }

    changeMoveDirection = (event) => {
        if (!event) {
            return
        }
        if (!this.state.moveDirectionChanged) { // сменить направление можно только 1 раз за кадр
            switch (event.keyCode) {
                case 37:
                    if (this.state.moveDirection !== 'toRight') {
                        this.setState({ moveDirection: 'toLeft' })
                    }
                    break;

                case 38:
                    if (this.state.moveDirection !== 'toBottom') {
                        this.setState({ moveDirection: 'toTop' })
                    }
                    break;

                case 39:
                    if (this.state.moveDirection !== 'toLeft') {
                        this.setState({ moveDirection: 'toRight' })
                    }
                    break;

                case 40:
                    if (this.state.moveDirection !== 'toTop') {
                        this.setState({ moveDirection: 'toBottom' })
                    }
                    break;

                default:
                    break;
            }
            this.setState({
                moveDirectionChanged: true  // ставим стейт что направление было изменено (ставим обратно при отрисовке нового кадра)
            })
        }
    }

    moveSnake = () => {
        const { body, moveDirection } = this.state;

        const prevBody = body;
        let newBody = [];

        switch (moveDirection) {
            case 'toRight':
                const toRight_headX = prevBody[0].x + 1;  // в каждом кейсе нельзя создавать переменные с одним именем (?)
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
                const toTop_headY = prevBody[0].y - 1;
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
                const toLeft_headX = prevBody[0].x - 1;
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
                const toBottom_headY = prevBody[0].y + 1;
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

            default:
                break;
        }
        this.setState({
            moveDirectionChanged: false // теперь можно снова сменить направление движения
        })
    }

    setApple() {
        const { cellNumberHorizont } = this;
        this.setState({
            apple: {
                x: getRandom(0, cellNumberHorizont - 1),
                y: getRandom(0, cellNumberHorizont - 1),
            }
        })
    }

    letsGo = () => {
        this.setState({
            gameGoing: true,
            body: [
                { x: 1, y: 0 },
                { x: 0, y: 0 },
            ],
            moveDirection: 'toRight',
            playerScore: 0,
            crash: false,
            uroboros: false
        })
        this.setApple();
        this.intervalAdd = setInterval(() => this.moveSnake(), 100);
        this.changeMoveDirection();
    }

    crash() {
        const { uroboros, playerScore } = this.state;
        clearInterval(this.intervalAdd);

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "24px arial";

        if (uroboros) {
            const img = new Image();
            img.src = 'https://cdn1.radikalno.ru/uploads/2020/1/7/1b7f7d18cc6f6e4d6c13401e8c2c6cfe-full.png';

            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        }

        let evaluation;
        if (playerScore >= 0 && playerScore < 10) {
            evaluation = 'мало...'
        }
        else if (playerScore >= 10 && playerScore < 20) {
            evaluation = 'Нормально'
        }
        else if (playerScore >= 20 && playerScore < 30) {
            evaluation = 'Неплохо!'
        }
        else if (playerScore >= 30) {
            evaluation = 'Круто!'
        }

        const txt = `Ваш счет: ${playerScore}`
        ctx.fillText(txt, canvas.width / 2 - ctx.measureText(txt).width / 2, canvas.height / 2)
        ctx.fillText(evaluation, canvas.width / 2 - ctx.measureText(evaluation).width / 2, canvas.height / 2 + 20)
    }

    componentDidMount() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.font = "18px arial";
        const startText = 'Для начала нажмите "GO!"'
        const textPositionHorizintally = canvas.width / 2 - ctx.measureText(startText).width / 2
        ctx.fillText(startText, textPositionHorizintally, canvas.height / 2);
        
        window.addEventListener('keydown', this.changeMoveDirection);
    }

    componentDidUpdate() {
        if (!this.state.crash) {
            this.drawFrame();
        }
        else {
            this.crash();
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalAdd);
        window.removeEventListener('keydown', this.changeMoveDirection);
    }

    render() {
        let btnClassName;
        let canvasClassName;

        if (this.state.gameGoing) {
            btnClassName = 'start-button hidden';
            canvasClassName = 'game no-cursor';
        }
        else {
            btnClassName = 'start-button';
            canvasClassName = 'game';
        }


        return (
            <React.Fragment>
                <div className='game-header'>
                    <span>Игра: Змейка</span>
                    <span className="player-score">Ваш счет: {this.state.playerScore}</span>
                </div>
                <canvas id='canvas' className={canvasClassName} ref="canvas" width={this.props.canvasWidth} height={this.props.canvasHeight} />
                <button className={btnClassName} onClick={this.letsGo}>GO!</button>
            </React.Fragment>
        );
    }
}
