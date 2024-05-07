export default function Rules() {
  return (
    <div style={{marginLeft:'3rem', display:'flex', flexDirection:'column', justifyContent:'center'}}>
      <div style={{textDecoration:'underline', color:'white'}}>
        Rules
      </div>
      <ol>
        <li style={{color:'white', marginBottom:'10px'}}>Any live cell with fewer than two live neighbors dies, as if by underpopulation.</li>
        <li style={{color:'white', marginBottom:'10px'}}>Any live cell with two or three live neighbors lives on to the next generation.</li>
        <li style={{color:'white', marginBottom:'10px'}}>Any live cell with more than three live neighbors dies, as if by overpopulation.</li>
        <li style={{color:'white', marginBottom:'10px'}}>Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.</li>
      </ol>
    </div>
  );
}
