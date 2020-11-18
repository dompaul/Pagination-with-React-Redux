export function incrementAction( pageNumber ) {
    return {
        type: 'INCREMENT_PAGE',
        payload: pageNumber
    }
}

export function decrementAction( pageNumber ) {
    return {
        type: 'DECREMENT_PAGE',
        payload: pageNumber
    }
}

export function maxPageAction( maxPage ) {
    return {
        type: 'SET_MAX_PAGE',
        payload: maxPage
    }
}
