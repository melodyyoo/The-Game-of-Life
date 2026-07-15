import './Rules.css';

export default function Rules() {
  return (
    <div className="rules-container">
      <div className="rules-title">
        Rules
      </div>
      <ol className="rules-list">
        <li>Any live cell with fewer than two live neighbors dies, as if by underpopulation.</li>
        <li>Any live cell with two or three live neighbors lives on to the next generation.</li>
        <li>Any live cell with more than three live neighbors dies, as if by overpopulation.</li>
        <li>Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.</li>
      </ol>
    </div>
  );
}
