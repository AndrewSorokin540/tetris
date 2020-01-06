state = {
    // позиция машины
    // барьеры
    // ускорение
    // авария
    // крайние положения машины
}

moveBarriers = () => {
    двигает существующие барьеры;
    если машина наезжает на барьер: state.crash => true
}

addBarrier = () => {
    добавляет новые барьеры (макс. 3 штуки)
}

drawFrame( carLocation, barriers ) {
    рисует текущий кадр

    проверка на крайние положения
}

crash() {
    рисует картинку аварии
}

componentDidMount() {
    this.drawRace( this.state.carLocation, this.state.barriers );
    setInterval(() => this.letsGo(), 100);
    setInterval(() => this.addBarrier(), 3000);

    делает слушатель для клавиш со стрелками
}

componentDidUpdate() {
    if ( нет аварии ) {
        рисуем кадр
    }
    else {
        this.crash();
    }
}





// таймеры
moveBarriers
addBarrier
upSpeed

// руль
steeringWheel

componentDidUpdate
    drawFrame   // таймеры создают update, и происходит новая отрисовка
    crash       


letsGo  // по кнопке запускает таймеры