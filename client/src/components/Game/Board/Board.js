
import React from 'react';
import { Cell } from './Cell';

function Board({ matrix }) {
    // console.log(matrix);

    return (
        <div >
            <table height='500px' width='500px'><tbody>
                {
                    matrix.map((row, r) => <tr key={r}>{
                        row.map((cell, c) => <Cell key={[r, c]} cellObj={cell} />)
                    }</tr>)
                }
            </tbody></table>
        </div>
    );
}


export default Board;
