import React from 'react';
import Listing from '../components/Listing';
import Header from '../components/Header';
import Search from '../components/Search';
import CONSTANTS from '../common/constants';
import loader from '../assets/images/loader.png';
import '../assets/styles/index.scss';
import { connect } from 'react-redux';
import { fetchAction, searchAction, fetchingStateAction, unsetSearchAction } from '../actions/fetchActions';
import { incrementAction, decrementAction, maxPageAction, setCountAction } from '../actions/paginationActions';

class App extends React.Component {
    /**
     * App
     * 
     * This app queries a paginated endpoint, 
     * saves the results to Redux and print the results as a list on the page
     * 
     * @constructor 
     */
    constructor() {
        super();
        this.searchRef = React.createRef();
    }

    /**
     * componentDidMount
     * 
     * Runs after the component output has been rendered to the DOM
     * Used to inspect the URL search query and fire-off network requests based on the page number/ search query
     */
    componentDidMount() {
        const params = new URLSearchParams( window.location.search );
        const page = Number( this.getPageNumber( params ) );
        const search = this.getSearchQuery( params );

        this.props.setFetchingState( true );
        if ( search ) { this.props.getSearch( search, page );
        } else {
            this.props.fetchData( page, CONSTANTS.DEFAULT_PAGE_SIZE );
        }
    }

    /**
     * componentDidUpdate
     * 
     * Invoked immediately after updating occurs
     * Used to compare current props to previous props and based on the condition,
     * fire-off network requests
     * 
     * @param {Object} prevProps Previous state of props
     * @return {Boolean} Exits the function if error prop is true
     */
    componentDidUpdate( prevProps ) {
        const props = this.props;

        if ( props.error ) return;
        if ( props.page !== prevProps.page && !props.search ) this.getNewListing();
        if ( props.page !== prevProps.page && props.search ) this.getNewSearchListing();
        if ( this?.searchRef?.current && props.searchValue ) this.searchRef.current.value = props.searchValue;

        this.updatePageDetails();
        if ( prevProps.search && !props.search && props.searchValue === null ) {
            props.setFetchingState( true );
            props.fetchData( CONSTANTS.DEFAULT_PAGE, CONSTANTS.DEFAULT_PAGE_SIZE );
        }
    }

    /**
     * getPageNumber
     * 
     * Used to get the page number from the URL params
     * 
     * @param {Object} params 
     * @return {Number} Returns the page number stored in the URL
     */
    getPageNumber( params ) {
        return params.get( CONSTANTS.PARAMS.PAGE ) ? params.get( CONSTANTS.PARAMS.PAGE ) : CONSTANTS.DEFAULT_PAGE;
    }

    /**
     * getSearchQuery
     * 
     * Used to get the Search query from the URL params
     * 
     * @param {Object} params 
     * @return {String} returns the search text stored in the URL
     */
    getSearchQuery( params ) {
        return params.get( CONSTANTS.PARAMS.SEARCH ) ? params.get( CONSTANTS.PARAMS.SEARCH ) :  null;
    }

    /**
     * getNewListing
     * 
     * Used to fetch a filtered dataset based on the updated prop states (e.g page)
     */
    getNewListing() {
        this.props.setFetchingState( true );
        this.props.fetchData( this.props.page, CONSTANTS.DEFAULT_PAGE_SIZE );
        this.updateSearchQuery( this.props.page );
    }

    /**
     * getNewSearchListing
     * 
     * Used to fetch a filtered dataset based on the updated prop states (e.g search query)
     */
    getNewSearchListing() {
        this.props.setFetchingState( true );
        this.props.getSearch( this.props.searchValue, this.props.page );
        this.updateSearchQuery( this.props.page, this.props.searchValue );
    }

    /**
     * updatePageDetails
     * 
     * Fires-off actions to update the Max page and item count
     * These props are used in the header for calculating the pagination
     */
    updatePageDetails() {
        const limit = Math.ceil( this.props.items.count / CONSTANTS.DEFAULT_PAGE_SIZE );
        this.props.setMaxPage( limit );
        this.props.setCount( this.props.items.count );
    }

    /**
     * updateSearchQuery
     * 
     * Updates the URL search params with updated prop data
     * 
     * @param {Number} page Page number
     * @param {String} search Search query
     */
    updateSearchQuery( page, search = null ) {
        const params = new URLSearchParams( window.location.search );
        if ( search !== null ) params.set( CONSTANTS.PARAMS.SEARCH, search );
        params.set( CONSTANTS.PARAMS.PAGE, page );
        window.history.replaceState( {}, '', `${ window.location.pathname }?${ params }` );
    }

    /**
     * handleSearchChange
     * 
     * Handles updating the input value
     * 
     * @param {Event} event Event data 
     */
    handleSearchChange( event ) {
        this.inputValue = event.target.value;
    }

    /**
     * onSearch
     * 
     * Callback fired everytime the search form is submitted
     * Responsible for calling the getSearch function to obtain a search listing 
     * 
     * @param {Event} event Event data 
     * @return {Boolean} Exits the function if the input value is empty
     */
    onSearch( event ) {
        event.preventDefault();
        if ( !this?.inputValue ) return;
        this.props.setFetchingState( true );
        this.props.getSearch( this.inputValue, CONSTANTS.DEFAULT_PAGE );
        this.updateSearchQuery( CONSTANTS.DEFAULT_PAGE, this.inputValue );
    }

    /**
     * nextPage
     * 
     * Responsible for calling the redux action to increment the page number
     */
    nextPage() {
        this.props.incrementPage( this.props.page );
    }

    /**
     * prevPage
     * 
     * Responsible for calling the redux action to decrement the page number
     */
    prevPage() {
        this.props.decrementPage( this.props.page );
    }

    /**
     * resetSearch
     * 
     * Called 
     */
    resetSearch() {
        this.props.unsetSearch();
        const params = new URLSearchParams( window.location.search );
        params.delete( CONSTANTS.PARAMS.SEARCH );
        window.history.replaceState( {}, '', `${ window.location.pathname }?${ params }` );
    }

    /**
     * render
     * 
     * Examines props and state and returns a react element to render a DOM node
     */
    render() {
        const props = this.props;

        if ( props.error ) {
            return (
                <div className='u-overlay'>
                    <span className='u-overlay u-message'>{ CONSTANTS.LABELS.ERROR }</span>
                </div>
            )
        }

        if ( props.isFetching ) {
            return (
                <div className='u-overlay'>
                    <img src={ loader } className="loading__image" alt="Loader" />
                    <p className='u-message loading'>{ CONSTANTS.LABELS.LOADING }</p>
                </div>
            )
        }

        return (
            <div className='app'>
                <Search
                    ref={ this.searchRef }
                    error={ props.error }
                    onChangeCallback={ this.handleSearchChange.bind( this ) }
                    onSearchCallback={ this.onSearch.bind( this ) }>
                </Search>
                <Header
                    page={ props.page }
                    error={ props.error }
                    isFetching={ props.isFetching }
                    maxPage={ props.maxPage }
                    items={ props.items.books }
                    count={ props.count }
                    pageSize={ props.pageSize }
                    decrementPage={ this.prevPage.bind( this ) }
                    incrementPage={ this.nextPage.bind( this ) }
                    clearSearch={ this.resetSearch.bind( this ) }
                    searchValue={ props.searchValue }
                    search={ props.search }>
                </Header>
                <Listing
                    error={ props.error }
                    isFetching={ props.isFetching }
                    items={ props.items.books }>
                </Listing>
            </div>
        );
    }
}

const mapStateToProps = ( state ) => {
    return {
        items: state.items,
        isFetching: state.isFetching,
        error: state.error,
        page: state.page,
        pageSize: state.pageSize,
        maxPage: state.maxPage,
        count: state.count,
        search: state.search,
        searchValue: state.searchValue
    }
};

const mapDispatchToProps = ( dispatch ) => {
    return {
        fetchData: ( pageNumber, pageSize ) => {
            dispatch( fetchAction( pageNumber, pageSize ) );
        },
        incrementPage: ( pageNumber ) => {
            dispatch( incrementAction( pageNumber ) );
        },
        decrementPage: ( pageNumber ) => {
            dispatch( decrementAction( pageNumber ) );
        },
        setFetchingState: ( loadingState ) => {
            dispatch( fetchingStateAction( loadingState ) );
        },
        setMaxPage: ( maxPage ) => {
            dispatch( maxPageAction( maxPage ) );
        },
        setCount: ( count ) => {
            dispatch( setCountAction( count ) );
        },
        getSearch: ( value, page ) => {
            dispatch( searchAction( value, page ) );
        },
        unsetSearch: ( state ) => {
            dispatch( unsetSearchAction( state ) );
        },
    }
};

export default connect( mapStateToProps, mapDispatchToProps )( App );
