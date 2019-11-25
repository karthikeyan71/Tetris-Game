import React, { Component } from 'react';
import TetrisHolder from './tetris';
import './wrapper.scss';

export default class Wrapper extends Component {
  render() {
    return (
      <div>
        <TetrisHolder />
      </div>
    )
  }
}
