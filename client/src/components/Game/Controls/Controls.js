import React from 'react';

import './Controls.css'

const Arrow = ({clickHandler}) => (
    <button id="arrowAnim" onClick={clickHandler}>
{/* <div id="arrowAnim"> */}
<div className="arrowSliding">
    <div className="arrow"></div>
</div>
<div className="arrowSliding delay1">
    <div className="arrow"></div>
</div>
<div className="arrowSliding delay2">
    <div className="arrow"></div>
</div>
{/* {</div>} */}
</button>
);

function Controls({changeDirection}) {


    const moveUp = () => {changeDirection('Up')}
    const moveDown = () => {changeDirection('Down')}
    const moveLeft = () => {changeDirection('Left')}
    const moveRight = () => {changeDirection('Right')}

    return(
        <span>
            <table className="base"><tbody >
                <tr>
                    <td className="cell base-left" > <Arrow clickHandler={moveLeft}/></td>
                    <td className="cell base-up" > <Arrow clickHandler={moveUp}/></td>
                </tr>
                <tr>
                    <td className="cell base-down" > <Arrow clickHandler={moveDown}/></td>
                    <td className="cell base-right" > <Arrow clickHandler={moveRight}/></td>
                </tr>
            </tbody></table>
            
        </span>
    )
}

export default Controls;
