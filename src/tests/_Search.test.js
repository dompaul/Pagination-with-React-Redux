import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import Search from '../components/Search';

/**
 * Tests that the Search component is rendered correctly
 */
it( 'Renders correctly', () => {
    const { queryByTestId } = render(<Search />);
    expect( queryByTestId( 'search' ) ).toBeTruthy();
} );

/**
 * Tests that the input element updates correctly on change
 */
describe( 'Input value', () => {
    it( 'Updates on change', () => {
        const { queryByTestId } = render( <Search /> );
        const searchInput = queryByTestId( 'search-input' );
        fireEvent.change( searchInput, { target: { value: 'test' } } );
        expect( searchInput.value ).toBe( 'test' );
    } );
} );

/**
 * Tests that submitting the search form correctly calls the callback function
 * to get search results
 */
describe( 'Search Button', () => {
    it( 'Triggers getSearch function', () => {
        const onSubmit = jest.fn();
        const { queryByTestId } = render( <Search onSearchCallback={ onSubmit } /> );
        const searchButton = queryByTestId( 'search-button' );
        fireEvent.submit( searchButton );
        expect( onSubmit ).toHaveBeenCalled();
    } );
} );