const fetchReducer = ( state = {
    items: null,
    isFetching: true,
    error: false,
    page: 1,
    pageSize: 20,
    maxPage: 0,
    count: 0,
    search: false
}, action ) => {
    switch ( action.type ) {
        case 'FINISHED_FETCHING':
            state = {
                ...state,
                items: action.payload,
                isFetching: false,
                page: action.payload.page
            }
            break;
        case 'FINISHED_SEARCH':
            state = {
                ...state,
                isFetching: false,
                search: true,
                items: action.payload,
                page: action.payload.page,
                searchValue: action.payload.searchValue
            }
            break;
        case 'SET_COUNT':
            state = {
                ...state,
                count: action.payload
            }
            break;
        case 'SET_MAX_PAGE':
            state = {
                ...state,
                maxPage: action.payload
            }
            break;
        case 'IS_FETCHING':
            state = {
                ...state,
                isFetching: action.payload
            }
            break;
        case 'UNSET_SEARCH':
            state = {
                ...state,
                search: action.payload,
                searchValue: null
            }
            break;
        case 'ERROR':
            state = {
                ...state,
                error: true
            }
            break;
        case 'INCREMENT_PAGE':
            state = {
                ...state,
                page: action.payload + 1
            }
            break;
        case 'DECREMENT_PAGE':
            let prevPage = 1;
            if ( action.payload !== 1 ) {
                prevPage = action.payload - 1;
            }
            state = {
                ...state,
                page: prevPage
            }
            break;
        default:
            state = {
                ...state
            }
    }
    return state;
}

export default fetchReducer;
