import { useCallback, useRef, useState } from "react";
import "./Grid.css";
import { produce } from "immer";
import Rules from "../Rules";

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
      <h1 style={{ color: "white" }}>THE GAME OF LIFE</h1>
      <div style={{ marginBottom: "150px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr" }}>
          <Rules />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="grid">
              {grid.map((rows, rowIdx) =>
                rows.map((col, colIdx) => (
                  <div
                    aria-label='cell'
                    data-testid={`cell-${rowIdx}-${colIdx}`}
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
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              aria-label="Run Simulation Button"
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
                <i className="fa-solid fa-pause" aria-label="Pause Simulation" style={{ color: "#5ab2cf" }} />
              ) : (
                <i className="fa-solid fa-play" aria-label="Play Simulation" style={{ color: "#5ab2cf" }} />
              )}
            </button>
            <button
              aria-label="Reset Button"
              className="button"
              onClick={() => {
                setError("");
                setGrid(newGrid());
                setRunning(false);
              }}
              style={{ marginRight: "100px" }}
            >
              <i className="fa-solid fa-rotate-right" style={{ color: "#5ab2cf" }}></i>
            </button>
          </div>
        </div>
            {error && <div style={{ color: "black", marginBottom: "5px", marginTop: "5px", fontSize:'20px'}}>{error}</div>}
      </div>
    </div>
  );
}
