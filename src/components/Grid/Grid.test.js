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

    test('kills a live cell with more than three live neighbors', async()=>{
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

})
