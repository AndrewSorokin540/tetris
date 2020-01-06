import React from 'react';
import './game-snake.css'

class Snake extends React.Component {

    state = {
        gameGoing: false,
        cellSize: 10,
        headPosition: {x: 0, y: 0},
        // body: [
        //     {x: 0, y: 0},
        //     {x: 1, y: 0}
        // ],
        totalLength: 2,
        moveDirection: 'toRight',
        speed: 1,
        score: 0,
    }

    drawFrame() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const canvasWidth = canvas.width;             // ширина канваса
        const canvasHeight = canvas.height;           // высота канваса
        const { headPosition, body, cellSize } = this.state;

        // очищаем канвас
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // рисуем голову
        ctx.fillRect( headPosition.x*cellSize,headPosition.y*cellSize,cellSize,cellSize );
        // рисуем тело
        // ctx.fillStyle = 'brown';
        // for( let item of body ){
        //     ctx.fillRect( item.x*cellSize,item.y*cellSize,cellSize,cellSize );
        // }
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
        const { headPosition, moveDirection } = this.state;
        const canvas = document.getElementById('canvas');

        switch ( moveDirection ) {
            case 'toRight':
                if ( headPosition.x >= canvas.width/10 ) {
                    this.setState({
                        headPosition: {x: 0, y: headPosition.y }
                    })
                }
                else{
                    this.setState({
                        headPosition: {x: headPosition.x+1, y: headPosition.y }
                    })
                }
            break;
            case 'toTop':
                if ( headPosition.y <= 0 ) {
                    this.setState({
                        headPosition: {x: headPosition.x, y: canvas.height/10 }
                    })
                }
                else{
                    this.setState({
                        headPosition: {x: headPosition.x, y: headPosition.y-1 }
                    })
                }
            break;
            case 'toLeft':
                if ( headPosition.x <= 0 ) {
                    this.setState({
                        headPosition: {x: canvas.width/10, y: headPosition.y }
                    })
                }
                else{
                    this.setState({
                        headPosition: {x: headPosition.x-1, y: headPosition.y }
                    })
                }
            break;
            case 'toBottom':
                if ( headPosition.y >= canvas.height/10 ) {
                    this.setState({
                        headPosition: {x: headPosition.x, y: 0 }
                    })
                }
                else{
                    this.setState({
                        headPosition: {x: headPosition.x, y: headPosition.y+1 }
                    })
                }
            break;
        }
    }

    letsGo = () => {
        this.setState({
            gameGoing: true
        })
        this.intervalAdd = setInterval(() => this.moveSnake(), 50); 
        this.changeMoveDirection();
    }

    componentDidUpdate() {
        this.drawFrame();
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
                <canvas id='canvas' className="game" ref="canvas" width={this.props.canvasWidth} height={this.props.canvasHeight} />
                <button className={ btnClassName } onClick={this.letsGo}>GO!</button>
            </div>
        );
    }
}

export default Snake;