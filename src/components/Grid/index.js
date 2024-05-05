import { useCallback, useRef, useState } from "react";
import "./Grid.css";
import { produce } from "immer";

export default function Grid() {
  const numRows = 20;
  const numCols = 20;
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState();

  const runningRef = useRef(running =>{
    runningRef.current = running
  })

  const runSimulation = useCallback(() =>{
    if(!runningRef){
      return;
    }

    setTimeout(runSimulation, 1000);
  }, [])

  return (
    <div style={{display: 'flex', justifyContent:"center"}}>
      <div className="grid">
        {grid.map((rows, rowIdx) =>
          rows.map((col, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowIdx][colIdx] ? "pink" : undefined,
                border: "solid 1px black",
              }}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rowIdx][colIdx] = grid[rowIdx][colIdx] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
            />
          ))
        )}
      </div>
      <button className="start-button" onClick={()=> setRunning(!running)}>
        {running? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
