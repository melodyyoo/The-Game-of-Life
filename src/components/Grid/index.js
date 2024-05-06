import { useCallback, useRef, useState } from "react";
import "./Grid.css";
import { produce } from "immer";

export default function Grid() {
  const numRows = 20;
  const numCols = 20;

  const operations = [
    [0, 1],
    [0, -1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, 0],
    [1, 0],
  ];

  const newGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  };

  const [grid, setGrid] = useState(newGrid());

  const [running, setRunning] = useState(false);

  const [error, setError] = useState("");

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = x + i;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 500);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <h1 style={{ color: "white" }}>THE GAME OF LIFE</h1>
        <div>
          <button
            className="button"
            onClick={() => {
              setRunning(!running);
              if (!running) {
                setError("");
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? (
              <i class="fa-solid fa-pause" style={{ color: "#9bb5f4" }} />
            ) : (
              <i class="fa-solid fa-play" style={{ color: "#9bb5f4" }} />
            )}
          </button>
          <button
            className="button"
            onClick={() => {
              setError("");
              setGrid(newGrid());
              setRunning(false);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div style={{marginBottom:'150px'}}>
        <div className="grid">
          {grid.map((rows, rowIdx) =>
            rows.map((col, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[rowIdx][colIdx] ? "#FFFF96" : undefined,
                  border: "solid 1px #387DCF",
                }}
                onClick={() => {
                  if (running) {
                    setError("OOPS! PLEASE PAUSE THE GAME TO CLICK ON MORE CELLS");
                  } else {
                    setError("");
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[rowIdx][colIdx] = grid[rowIdx][colIdx] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }
                }}
              />
            ))
          )}
        </div>
        {error && <div style={{ color: "white", marginBottom:'5px', marginTop: "5px" }}>{error}</div>}
      </div>
    </div>
  );
}
