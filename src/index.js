import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ------------ SQUARE -------------
function Square(props) {
  return (
    <button className="square"
    onClick={props.onClick}
    style={{
      backgroundColor: props.color
    }} >
      {props.value}
    </button>
  );
}

// ------------ BOARD -------------
class Board extends React.Component {
  chooseColor(i) {
    if(this.props.squares[i] === "X") {
      return "lightgreen";
    } else if (this.props.squares[i] === "O") {
      return "lightpink";
    } else {
      return "rgb(116, 192, 255)";
    }
  }

  renderSquare(i) {
    return <Square
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
    color={this.chooseColor(i)} />;
  }

  renderBoard() {
    const row = [];
    for (let i = 10; i < 18; i++) {
      row.push(<div className="board-row">);
      row.push(this.renderSquare(i));
      row.push(</div>);
    }
    return row;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderBoard()}
        </div>
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

// ------------- GAME -------------
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      col: "x",
      row: "y",
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let x = i % 3 + 1;
    let y = Math.floor(i / 3 + 1);
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      col: x,
      row: y
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const bold = this.state.stepNumber === move ? "bold-text" : "";
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button
          className={bold}
          onClick={() => this.jumpTo(move)}>
          {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div className="status">Col: {this.state.col} Row: {this.state.row}</div>
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
