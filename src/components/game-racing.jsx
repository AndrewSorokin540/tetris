import React from 'react';
import './racing.css'

class Racing extends React.Component {
    
    state = {
        gameGoing: false,
        carLocation: 0,
        barriers: [{
            x: 0,
            y: Math.floor((Math.floor(Math.random()*this.props.canvasWidth))/this.props.cellSize)*this.props.cellSize
        }],
        acceleration: false,
        crash: false,
        carOnTheLeft: true,
        carOnTheRight: false,
        maxBarriersAmount: 20,
        carHeight: 4,
        carWidth: 2,
        speed: 5,
        playerScore: 0
    }

    moveBarriers = () => {
        const canvas = document.getElementById('canvas');
        const { barriers, acceleration, carLocation, carWidth, carHeight, speed, playerScore } = this.state;
        const { cellSize } = this.props;

        // определяем положение каджого барьера
        for (let i = 0; i < barriers.length; i++) {

            // если барьер доехал до нижнего края, перемещаем его наверх с новой случайной координатой Х
            if ( barriers[i].y > canvas.height) {
                this.setState({
                    playerScore: playerScore+1
                });
                console.log(this.state.playerScore);
                barriers[i].y = 0;
                barriers[i].x = Math.floor((Math.floor(Math.random()*canvas.width))/this.props.cellSize)*this.props.cellSize;
                
            }

            // определяем скорость движения (с ускорением или без) с помощью флага acceleration из state
            if ( !acceleration ) {
                barriers[i].y = barriers[i].y + speed;
            }
            else  {
                barriers[i].y = barriers[i].y + speed + 20;
            }
            
            // проверяем наезд машины на барьер
            if (
                    barriers[i].y >= canvas.height - carHeight * cellSize
                    && barriers[i].x >= carLocation 
                    && barriers[i].x < carLocation + carWidth * cellSize
                ) {
                this.setState({
                    crash: true
                })
            }
        }
        
        // ставим барьры в новые положения
        this.setState({
            barriers: barriers
        })
    }

    addBarrier = () => {
        const { barriers, maxBarriersAmount } = this.state;

        if( barriers.length < maxBarriersAmount ) {
            barriers.push(
                {
                    x: Math.floor((Math.floor(Math.random()*250))/10)*10,
                    y: 0
                }
            )
        }
    }

    upSpeed = () => {
        const { speed } = this.state;

        if( speed < 50 ) {
            this.setState({
                speed: speed + 1
            })
        }
    }

    steeringWheel = () => {
        const { cellSize } = this.props;
        document.onkeydown = (event) => {
            switch (event.keyCode) {
                case 37:
                    if ( !this.state.carOnTheLeft ) {
                        this.setState({
                            carLocation: this.state.carLocation - (+cellSize)
                        })
                    }
                break;

                case 39:
                    if ( !this.state.carOnTheRight ) {
                        this.setState({
                            carLocation: this.state.carLocation + (+cellSize)
                        })
                    }
                break;

                case 38:
                    this.setState({
                        acceleration: true
                    })
                break;
                
                default: 
                break;
            }
        };
        document.onkeyup = (event) => {
            switch (event.keyCode) {
                case 38:
                    this.setState({
                        acceleration: false
                    })
                break;

                default: 
                break;
            }
        };
        
    }

    drawFrame( carLocation, barriers ) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const canvasWidth = canvas.width;             // ширина канваса
        const canvasHeight = canvas.height;           // высота канваса
        const { cellSize } = this.props;              // размер ячейки
        const { carWidth, carHeight } = this.state;   // ширина/длина машины

        // очищаем канвас перед отрисовкой нового фрейма
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // рисуем машину
        ctx.fillRect( carLocation, canvasHeight - carHeight*cellSize, carWidth*cellSize, canvasHeight );

        // рисуем препятствия
        for (let i = 0; i < this.state.barriers.length; i++) {
            ctx.fillRect(barriers[i].x,barriers[i].y,cellSize,cellSize);
        }

        // проверка не у левого края ли стоит машина
        if (this.state.carLocation <= 0 && this.state.carOnTheLeft === false) {
            this.setState({
                carOnTheLeft: true
            })
        }
        else if ( this.state.carLocation > 0 && this.state.carOnTheLeft === true ) {
            this.setState({
                carOnTheLeft: false
            })
        }

        // проверка не у правого края ли стоит машина
        if (this.state.carLocation >= canvasWidth-carWidth*cellSize && this.state.carOnTheRight === false) {
            this.setState({
                carOnTheRight: true
            })
        }
        else if ( this.state.carLocation < canvasWidth-carWidth*cellSize && this.state.carOnTheRight === true ) {
            this.setState({
                carOnTheRight: false
            })
        }
    }

    letsGo = () => {
        this.setState({
            gameGoing: true,
            carLocation: 0,
            barriers: [],
            acceleration: false,
            crash: false,
            carOnTheLeft: true,
            carOnTheRight: false,
            maxBarriersAmount: 20,
            carHeight: 4,
            carWidth: 2,
            speed: 5,
            playerScore: 0,
        })
        this.steeringWheel();                                             // создаем "руль"
        this.intervalMove = setInterval(() => this.moveBarriers(), 50);   // запускаем двигатель барьеров
        this.intervalAdd = setInterval(() => this.addBarrier(), 6000);    // запускаем добавлятель барьеров
        this.intervalSpeed = setInterval(() => this.upSpeed(), 6000);     // увеличиваем скорость
    }

    crash() {
        // при аварии очищаем интервалы
        clearInterval(this.intervalMove);
        clearInterval(this.intervalAdd);
        clearInterval(this.intervalSpeed);

        // и рисуем на весь экран картинку аварии
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        var img = new Image();
        img.src = 'https://image.freepik.com/vector-gratis/bubble-pop-art-of-crash-icon-comunicacion-comica-retro-tema-expresion_18591-10094.jpg';

        img.onload = function(){
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
        };
    }

    componentDidUpdate() {
        const { carLocation, barriers } = this.state;

        if (!this.state.crash) {
            this.drawFrame( carLocation, barriers );
        }
        else {
            this.crash();
        }
    }

    render() {
        let btnClassName;

        if ( this.state.gameGoing ) {
            btnClassName = 'racing-button hidden';
        }
        else {
            btnClassName = 'racing-button';
        }

        return (
            <div className='game-container'>
                <span className='racing-score'>счет: {this.state.playerScore}</span>
                <button className={ btnClassName } onClick={this.letsGo}>GO!</button>
                <canvas id='canvas' className="game" ref="canvas" width={this.props.canvasWidth} height={this.props.canvasHeight} />
            </div>
        );
    }
}

export default Racing;