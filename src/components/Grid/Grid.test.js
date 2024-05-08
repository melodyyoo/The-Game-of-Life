import {render, screen, fireEvent} from '@testing-library/react';
import Grid from '.';
import { act } from 'react';

describe('Grid component', ()=>{
    test('clicking a cell toggles its state', ()=>{
        render(<Grid/>);
        const cell = screen.getByTestId('cell-0-0');

        expect(cell).not.toHaveStyle(`backgroundColor: #FFFF96`);

        fireEvent.click(cell);

        expect(cell).toHaveStyle(`backgroundColor: #FFFF96`)
    })

    test('play button changes to pause onClick', ()=>{
        render(<Grid/>);
        const playButton = screen.getByRole('button', {name:"Run Simulation Button"});

        expect(screen.getByLabelText("Play Simulation")).toBeInTheDocument();

        fireEvent.click(playButton);

        expect(screen.getByLabelText('Pause Simulation')).toBeInTheDocument();

    })

    test('reset button resets the grid', ()=>{
        render(<Grid/>);

        const resetButton = screen.getByRole('button', {name:"Reset Button"});
        fireEvent.click(resetButton);

        const cells = screen.getAllByLabelText('cell');
        cells.forEach(cell=>{
            expect(cell).toHaveTextContent("");
        })
    })

    test('kills a live cell with fewer than two live neighbors', async()=>{
        render(<Grid/>);

        const targetCell = screen.getByTestId('cell-1-10');
        const neighborCell = screen.getByTestId('cell-1-11');

        fireEvent.click(targetCell);
        fireEvent.click(neighborCell);

        const runButton = screen.getByLabelText('Run Simulation Button');
        fireEvent.click(runButton);

        await act(async()=>{
            await new Promise(r=>setTimeout(r, 1000));
        })

        expect(targetCell).not.toHaveStyle(`backgroundColor: #FFFF96`)

    })

    test('kills live cell with more than three live neighbors', async()=>{
        render(<Grid/>);

        const targetCell = screen.getByTestId('cell-2-4');
        const neighborCell1 = screen.getByTestId('cell-2-5');
        const neighborCell2 = screen.getByTestId('cell-2-3');
        const neighborCell3 = screen.getByTestId('cell-1-4');
        const neighborCell4 = screen.getByTestId('cell-3-4');

        fireEvent.click(targetCell);
        fireEvent.click(neighborCell1);
        fireEvent.click(neighborCell2);
        fireEvent.click(neighborCell3);
        fireEvent.click(neighborCell4);

        const runButton = screen.getByLabelText('Run Simulation Button');
        fireEvent.click(runButton);

        await act(async()=>{
            await new Promise(r=>setTimeout(r, 1000));
        })

        expect(targetCell).not.toHaveStyle(`backgroundColor: #FFFF96`)
        expect(neighborCell1).toHaveStyle(`backgroundColor: #FFFF96`)
        expect(neighborCell2).toHaveStyle(`backgroundColor: #FFFF96`)
        expect(neighborCell3).toHaveStyle(`backgroundColor: #FFFF96`)
        expect(neighborCell4).toHaveStyle(`backgroundColor: #FFFF96`)


    })

    test('live cell with two live neighbors lives', async()=>{
        render(<Grid/>);

        const targetCell = await screen.findByTestId('cell-5-5');
        const neighborCell1 = await screen.findByTestId('cell-5-4');
        const neighborCell2 = await screen.findByTestId('cell-5-6');

        fireEvent.click(targetCell)
        fireEvent.click(neighborCell1);
        fireEvent.click(neighborCell2);

        const runButton = screen.getByLabelText('Run Simulation Button');
        fireEvent.click(runButton);

        await act(async()=>{
            await new Promise(r=>setTimeout(r, 1000));
        })

        expect(targetCell).toHaveStyle(`backgroundColor: rgb(255, 255, 150)`)
    })

    test('live cell with three live neighbors lives', async()=>{
        render(<Grid/>);
        const getCell = (row, col) => screen.getByTestId(`cell-${row}-${col}`);

        fireEvent.click(getCell(1,1))
        fireEvent.click(getCell(0,1))
        fireEvent.click(getCell(1,0))
        fireEvent.click(getCell(1,2))

        fireEvent.click(screen.getByLabelText("Run Simulation Button"));


        return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            const targetCell = getCell(1, 1);
            expect(targetCell).toHaveStyle(`backgroundColor: "#FFFF96"`);

            fireEvent.click(screen.getByLabelText("Run Simulation Button"));
          });

    })

    test('dead cell with three live neighbors becomes live', async()=>{
        render(<Grid/>);

        const getCell = (row, col) => screen.getByTestId(`cell-${row}-${col}`);

        fireEvent.click(getCell(0,1))
        fireEvent.click(getCell(1,0))
        fireEvent.click(getCell(1,2))

        fireEvent.click(screen.getByLabelText("Run Simulation Button"));


        return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            const targetCell = getCell(1, 1);
            expect(targetCell).toHaveStyle(`backgroundColor: "#FFFF96"`);

            fireEvent.click(screen.getByLabelText("Run Simulation Button"));
          });
    })
})
