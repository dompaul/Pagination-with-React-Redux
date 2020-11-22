import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import Button from '../components/Button';

/**
 * Tests that the pagination buttons render correctly
 */
it( 'Renders correctly', () => {
    const { queryByTestId } = render(<Button />);
    expect( queryByTestId( 'button' ) ).toBeTruthy();
} );

/**
 * Tests that the callback function to the increment/decrement functions
 * are called correctly on click
 */
describe( 'Pagination Button', () => {
    it( 'Triggers a page callback', () => {
        const onClick = jest.fn();
        const { queryByTestId } = render( <Button callback={ onClick } /> );
        const button = queryByTestId( 'button' );
        fireEvent.click( button );
        expect( onClick ).toHaveBeenCalled();
    } );
} );