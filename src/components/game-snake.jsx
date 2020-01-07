import React from 'react';
import './game-snake.css'

class Snake extends React.Component {

    state = {
        gameGoing: false,
        cellSize: 10,
        body: [
            {x: 12, y: 15},
            {x: 11, y: 15},
            {x: 10, y: 15},
            {x: 9, y: 15},
        ],
        moveDirection: 'toTop',
        speed: 1,
        score: 0,
    }

    drawFrame() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const canvasWidth = canvas.width;             // ширина канваса
        const canvasHeight = canvas.height;           // высота канваса
        const { body, cellSize } = this.state;

        // очищаем канвас
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // рисуем змею
        for (let item of body) {
            ctx.fillRect( item.x*cellSize,item.y*cellSize,cellSize,cellSize );
        }
        
    }

    changeMoveDirection() {
        document.onkeydown = (event) => {
            switch (event.keyCode) {
                case 37:
                   this.setState({moveDirection: 'toLeft'})
                break;

                case 38:
                    this.setState({moveDirection: 'toTop'})
                break;

                case 39:
                    this.setState({moveDirection: 'toRight'})
                break;

                case 40:
                    this.setState({moveDirection: 'toBottom'})
                break;
                
                default: 
                break;
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
    }

    letsGo = () => {
        this.setState({
            gameGoing: true
        })
        this.intervalAdd = setInterval(() => this.moveSnake(), 100); 
        this.moveSnake();
        this.changeMoveDirection();
    }

    componentDidUpdate() {
        this.drawFrame();
    }


    
    render() {
        let btnClassName;

        if ( this.state.gameGoing ) {
            btnClassName = '';
        }
        else {
            btnClassName = '';
        }

        return (
            <div className='game-container'>
                <canvas id='canvas' className="game" ref="canvas" width={this.props.canvasWidth} height={this.props.canvasHeight} />
                <button className={ btnClassName } onClick={this.letsGo}>GO!</button>
            </div>
        );
    }
}

export default Snake;