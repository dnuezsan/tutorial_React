import React from 'react';
import ReactDOM from 'react-dom';
import { unstable_conactualAct } from 'react-dom/cjs/react-dom-test-utils.production.min';
import './index.css';

function Casilla(props) {
    return (
      <button className="casilla" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderizarCasilla(i) {
      return (
        <Casilla
          value={this.props.casilla[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="fila-tablero">
            {this.renderizarCasilla(0)}
            {this.renderizarCasilla(1)}
            {this.renderizarCasilla(2)}
          </div>
          <div className="fila-tablero">
            {this.renderizarCasilla(3)}
            {this.renderizarCasilla(4)}
            {this.renderizarCasilla(5)}
          </div>
          <div className="fila-tablero">
            {this.renderizarCasilla(6)}
            {this.renderizarCasilla(7)}
            {this.renderizarCasilla(8)}
          </div>
        </div>
      );
    }
  }
  
  class Juego extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        historico: [
          {
            casilla: Array(9).fill(null)
          }
        ],
        numeroPaso: 0,
        xEsSiguiente: true
      };
    }
  
    handleClick(i) {
      const historico = this.state.historico.slice(0, this.state.numeroPaso + 1);
      const actual = historico[historico.length - 1];
      const casilla = actual.casilla.slice();
      if (calcularGanador(casilla) || casilla[i]) {
        return;
      }
      casilla[i] = this.state.xEsSiguiente ? "X" : "O";
      this.setState({
        historico: historico.concat([
          {
            casilla: casilla
          }
        ]),
        numeroPaso: historico.length,
        xEsSiguiente: !this.state.xEsSiguiente
      });
    }
  
    saltarHacia(paso) {
      this.setState({
        numeroPaso: paso,
        xEsSiguiente: (paso % 2) === 0
      });
    }
  
    render() {
      const historico = this.state.historico;
      const actual = historico[this.state.numeroPaso];
      const ganador = calcularGanador(actual.casilla);
  
      const movimientos = historico.map((paso, movimiento) => {
        const desc = movimiento ?
          'Ir al movimiento #' + movimiento :
          'Empezar juego';
        return (
          <li key={movimiento}>
            <button onClick={() => this.saltarHacia(movimiento)}>{desc}</button>
          </li>
        );
      });
  
      let estado;
      if (ganador) {
        estado = "ganador: " + ganador;
      } else {
        estado = "Siguiente jugador: " + (this.state.xEsSiguiente ? "X" : "O");
      }
  
      return (
        <div className="juego">
          <div className="tablero-juego">
            <Board
              casilla={actual.casilla}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="info-juego">
            <div>{estado}</div>
            <ol>{movimientos}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Juego />, document.getElementById("root"));
  
  function calcularGanador(casilla) {
    const lineas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lineas.length; i++) {
      const [a, b, c] = lineas[i];
      if (casilla[a] && casilla[a] === casilla[b] && casilla[a] === casilla[c]) {
        return casilla[a];
      }
    }
    return null;
  }
  