import React from "react";
import ReactDOM from "react-dom";
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );

}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        rowNum: 0,
        colNum: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  _getColumn(num) {
    if (num === 0 || num === 3 || num === 6) {
      return 1;
    } else if (num === 1 || num === 4 || num === 7) {
      return 2;
    }
    return 3;
  }

  _getRow(num) {
    if (num < 3) return 1;
    else if (num < 6) return 2;
    return 3;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const col = this._getColumn(i);
    const row = this._getRow(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        rowNum: row,
        colNum: col,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  _changeBackground(el) {
    if(el === 0) return;

    let elRowNum = this.state.history[el].rowNum;
    let elColNum = this.state.history[el].colNum;
    let elemntIdx = this._calcElementIdx(elRowNum, elColNum);
    const squares = document.getElementsByClassName("square");

    Array.from(squares).map((square) => square.style.backgroundColor = "");

    let squareElement = squares[elemntIdx];

    squareElement.style.backgroundColor = "aquamarine";
  }

  _calcElementIdx(row, col) {
    let currentIdx = 0;
    
    if(row === 1) {
      currentIdx += col;
    } else if(row === 2) {
      currentIdx = 3 + col;
    } else if(row === 3) {
      currentIdx = 6 + col;
    }

    return currentIdx - 1;
  }

  jumpTo(step) {
    this._changeBackground(step)

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Перейти к ходу #${move} колонка: ${step.colNum}, строка: ${step.rowNum}` :
        'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = `Выиграл ${winner}`;
    } else {
      status = `Следующий ход: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);