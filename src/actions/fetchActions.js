import CONSTANTS from '../common/constants';

export function fetchAction( pageNumber, pageSize ) {
    return dispatch => {
        fetch( CONSTANTS.API, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( { 'page' : pageNumber, 'itemsPerPage': pageSize } )
        } )
        .then( response => {
            if ( response.status === CONSTANTS.STATUS.OK ) {
                return response.json();
            }
            throw new Error( 'Something went wrong' );
        } )
        .then( json => {
            if ( !json.books.length ) {
                throw new Error( "Sorry, we couldn't find any results " );
            }
            setTimeout( () => {
                dispatch( {
                    type: 'FINISHED_FETCHING',
                    payload: { page: pageNumber, ...json }
                } );
            }, CONSTANTS.DELAY );
        } )
        .catch( error => {
            dispatch( {
                type: 'ERROR',
                payload: error
            } );
        } );
    }
}

export function searchAction( value, pageNumber ) {
    return dispatch => {
        fetch( CONSTANTS.API, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( { 'page': pageNumber, 'filters' : [ { 'type': 'all', 'values': [ value ] } ] } )
        } )
        .then( response => {
            if ( response.status === CONSTANTS.STATUS.OK ) {
                return response.json();
            }
            throw new Error( 'Something went wrong' );
        } )
        .then( json => {
            if ( !json.books.length ) {
                throw new Error( "Sorry, we couldn't find any results " );
            }
            dispatch( {
                type: 'FINISHED_SEARCH',
                payload: { page: pageNumber, ...json, searchValue: value }
            } );
        } )
        .catch( error => {
            dispatch( {
                type: 'ERROR',
                payload: error
            } );
        } );
    }
}

export function fetchingStateAction( loadingState ) {
    return {
        type: 'IS_FETCHING',
        payload: loadingState
    }
}

export function unsetSearchAction() {
    return {
        type: 'UNSET_SEARCH',
        payload: false
    }
}
