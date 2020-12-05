import React from 'react';
import './Cell.css';


import Color from 'color';

class CellType {
  constructor() {
    this.type = 'empty';
    this.color = undefined;
    this.head = false;
  }
  makeSnake(color, pos, slength, alive) {
    if(pos === 0) {
      this.type = 'head';
    } else {
      this.type = 'body';
    }
    color = Color(color)
    // this.color = color.alpha(1-0.8*(pos)/(slength-1));
    this.color = alive ? color : color.alpha(0.2);
  }
  makeFood(color) {
    this.type = 'food';
    color = Color(color)
    this.color = color;
  }
}


function Cell({cellObj}) {
  let classTypes = [];
  let bgColor = '';

  if (cellObj.type !== 'empty') {
    classTypes.push(cellObj.type);
    bgColor = cellObj.color.rgb().string();
  }

  // if (cellObj.head) {
  //   classTypes.push('head');
  // } else if (cellObj.type === 'snake') {
  //   classTypes.push(cellObj.type);
  //   bgColor = cellObj.color.rgb().string();
  // } else if (cellObj.type === 'food') {
  //   classTypes.push(cellObj.type);
  //   bgColor = cellObj.color.rgb().string();
  // } else {
  //   classTypes.push(cellObj.type);
    
  // }
  return(
    <td>
    <span className={classTypes.join(' ')} style={{
      backgroundColor: bgColor,
    }}
    />
    </td>
  )
}

export {Cell, CellType};
