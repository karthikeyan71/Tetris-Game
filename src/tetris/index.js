import React, { Component } from 'react';
import './tetris.scss';
import sizes from '../config/default';

export default class TetrisHolder extends Component {

  constructor(props) {
    super(props);
    let board = [];
    const { height, width } = sizes;
    for (let xIndex = 0; xIndex < height; xIndex++) {
      for(let yIndex = 0; yIndex < width; yIndex++) {
        if (!board[xIndex])
          board[xIndex] = [];
          board[xIndex][yIndex] = 0;
      }
    }
    this.state = {
      board,
      height,
      width,
      positionX: 0,
      positionY: 0,
      startX:3,
      prevPositionX: 0,
      prevPositionY: 0,
      shape: '',
      timer: ''
    };
  }

  shapes = () => {
    const { board, startX, positionX, positionY, timer } = this.state;
    clearInterval(timer);
    const shape1 = [
                    [[1,0,0],[1,1,1]],
                    [[0,0,1],[1,1,1]],
                    [[1,1],[1,1]],
                    [[1,1,1],[0,1,0]],
                    [[1,1,1,1]],
                    [[0,1],[1,1],[1,0]],
                    [[1,0],[1,1],[0,1]]
                  ];

    const shape = shape1[Math.floor(Math.random() * Math.floor(shape1.length))];
    // const shape = shape1[4];
    const width = shape.length;

    shape.map((value, index) => {
      value.map((subValue, subIndex) => {
        const newPositionX = 0+index;
        const newPositionY = startX+subIndex;
        board[newPositionX][newPositionY] = subValue;
      });
    })

    const newTimer = setInterval( ()=> {
      this.moveDown();
    }, 1550);

    this.setState({
      board,
      positionX: startX,
      positionY: 0,
      updatedBoard: board,
      shape: shape,
      timer: newTimer
    });

  }

  clearUp() {
    const { board, height, width } = this.state;

    const newBoard = JSON.parse(JSON.stringify(board));

    for (let xIndex = 0; xIndex < height; xIndex++) {
      for(let yIndex = 0; yIndex < width; yIndex++) {
        if (newBoard[xIndex][yIndex] === 2) {
          continue;
        }
        newBoard[xIndex][yIndex] = 0;
      }
    }

    return newBoard;

  }

  componentDidMount() {
    window.addEventListener('keypress', this.navigate);
    this.shapes();
  }

  move = (updatedBoard, x, y) => {
    const { positionX, positionY, prevPositionX, shape } = this.state;
    // console.log('called the function');
    for (let index = 0; index < shape.length; index++) {
      for (let subIndex = 0; subIndex < shape[index].length; subIndex++ ) {
        const newPositionX = positionX+ x + subIndex;
        const newPositionY = positionY+ y + index;
        // console.log(newPositionY, newPositionX, shape[index][subIndex]);
        if (updatedBoard[newPositionY][newPositionX] === 2 && shape[index][subIndex] === 1) {
          return false;
        } else if (updatedBoard[newPositionY][newPositionX] === 2) {
          updatedBoard[newPositionY][newPositionX] = 2;
        } else {
          updatedBoard[newPositionY][newPositionX] = shape[index][subIndex];
        }

      }
    }

    // console.log(updatedBoard);

    this.setState({
      positionX: positionX + x,
      positionY: positionY + y
    })

    return updatedBoard;
  }

  rotation = () => {
    console.log('rotating the shape');

    const { shape, positionX, positionY } = this.state;

    const newShape = [];

    shape[0].map((value, index) => {
      newShape[index] = [];
    })

    for (let index = shape.length-1; index > -1; index--) {
      for (let subIndex = 0; subIndex < shape[index].length; subIndex++ ) {
        newShape[subIndex].push(shape[index][subIndex]);
      }
    }

    const updatedBoard = this.clearUp();

    newShape.map((value, index) => {
      value.map((subValue, subIndex) => {
        const newPositionX = positionX+ subIndex;
        const newPositionY = positionY+ index;
        updatedBoard[newPositionY][newPositionX] = subValue;
      });
    });

    // console.log(updatedBoard);

    this.setState({
      shape: newShape,
      board: updatedBoard
    });

  }

  updateBoard = () => {
    console.log('updating the board');
    const { board } = this.state;

    for (let index = 0; index < board.length; index++) {
      for(let subIndex = 0; subIndex < board[index].length; subIndex++) {
        if(board[index][subIndex] === 1) {
          board[index][subIndex] = 2;
        }
      }
    }

    this.setState({
      board
    })

  }

  dissolve = () => {
    console.log('checking dissolve');
    const { board, width } = this.state;
    let counter = 0;
    let deleted = -1
    for (let index = board.length-1; index > deleted; index-- ) {
      counter = 0;
      for (let subIndex = 0; subIndex < board[index].length || 0; subIndex++) {
        if( board[index][subIndex] === 2) {
          counter++;
        }
        console.log(counter,width);
        if(counter === width) {
          console.log('dissolve');
          board.splice(index,1);
          board.unshift([0,0,0,0,0,0,0,0,0,0]);
          deleted += 1;
          index = board.length;
        }
      }
    }
    console.log(board);
    this.setState({
      board
    })
  }

  moveDown = () => {
    // console.log('inside the moveDown function');

    const { board, positionX, positionY, shape, height, timer, startX } = this.state;
    if(positionY + shape.length > height-1) {
      this.updateBoard();
      this.dissolve();
      this.shapes();
      return;
    }

    const updatedBoard = JSON.parse(JSON.stringify(this.clearUp()));

    const newBoard = this.move(updatedBoard,0,1);

    if(newBoard === false) {
      console.log('inside the false case');
      this.setState({
        board,
        positionX: startX,
        positionY: 0
      });
      this.updateBoard();
      this.dissolve();
      this.shapes();
      clearInterval(timer);
      return;
    }

    this.setState({
      board: newBoard
    })
  }

  moveLeft = () => {
    // console.log('inside the moveLeft function');

    const { board, positionX, positionY, shape, width } = this.state;

    console.log(positionX - 1);

    if(positionX - 1 < 0) {
      console.log('came inside the full');
      return;
    }

    const updatedBoard = [...this.clearUp()];

    const newBoard = this.move(updatedBoard, -1,0);

    if(newBoard === false) {
      return;
    }

    this.setState({
      board: newBoard
    })
  }

  moveRight = () => {
    // console.log('inside the moveRight function');

    const { board, positionX, positionY, shape, width } = this.state;

    if(positionX + shape[0].length > width-1) {
      console.log('came inside the full');
      return;
    }

    const updatedBoard = [...this.clearUp()];

    const newBoard = this.move(updatedBoard,1,0);

    if(newBoard === false) {
      return;
    }

    this.setState({
      board: newBoard
    })
  }

  changeValue = () => {
    // console.log('inside the change value function');
    const { board } = this.state;

    const newBoard = board;

    newBoard[5][5] = 1;

    this.shapes();

    this.setState({
      board: newBoard
    })
  }

  navigate = ({keyCode}) => {
    if (keyCode === 97) {
      this.moveLeft();
    } else if (keyCode === 100) {
      this.moveRight();
    } else if (keyCode === 115) {
      this.moveDown();
    } else if (keyCode === 119) {
      this.rotation();
    }

  }

  render() {
    const { board } = this.state;
    const blocks = [];

    board.map((yIndex, index) => {
      yIndex.map((xIndex, subindex) => {
        if(board[index][subindex] === 0) {
          blocks.push(<div key={`${index.toString()}${subindex.toString()}`} className="tetris-block"></div>)
        } else {
          blocks.push(<div key={`${index.toString()}${subindex.toString()}`} className="tetris-block black"></div>)
        }
      });
    })

    return (
      <div>
        <div className="game-over">
          Game over
        </div>
        <br/>
        <button onClick={this.changeValue}> Change value </button>
        <button onClick={this.moveDown}> Move Down </button>
        <button onClick={this.moveLeft}> Move Left </button>
        <button onClick={this.moveRight}> Move Right </button>
        <button onClick={this.shapes}> Restart </button>
        <button onClick={this.rotation}> Rotate block </button>
        <br/>
        <div className="tetris-holder">
          { blocks }
        </div>

      </div>
    );
  }
}
