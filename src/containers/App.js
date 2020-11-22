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
     * 
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
     */
    componentDidMount() {
        const params = new URLSearchParams( window.location.search );
        const page = Number( this.getPageNumber( params ) );
        const search = this.getSearchQuery( params );

        this.props.setFetchingState( true );
        if ( search ) {
            this.props.getSearch( search, page );
        } else {
            this.props.fetchData( page, CONSTANTS.DEFAULT_PAGE_SIZE );
        }
    }

    /**
     * getPageNumber
     * 
     * 
     * 
     * @param {Object} params 
     * @return {Number}
     */
    getPageNumber( params ) {
        return params.get( CONSTANTS.PARAMS.PAGE ) ? params.get( CONSTANTS.PARAMS.PAGE ) : CONSTANTS.DEFAULT_PAGE;
    }

    /**
     * getSearchQuery
     * 
     * 
     * 
     * @param {Object} params 
     * @return {String}
     */
    getSearchQuery( params ) {
        return params.get( CONSTANTS.PARAMS.SEARCH ) ? params.get( CONSTANTS.PARAMS.SEARCH ) :  null;
    }

    /**
     * componentDidUpdate
     * 
     * 
     * 
     * @param {Object} prevProps 
     * @return {Boolean}
     */
    componentDidUpdate( prevProps ) {
        const props = this.props;

        if ( props.error ) {
            return;
        }

        if ( props.page !== prevProps.page && !props.search ) {
            this.getNewListing();
        }

        if ( props.page !== prevProps.page && props.search ) {
            this.getNewSearchListing();
        }

        if ( this?.searchRef?.current && props.searchValue ) {
            this.searchRef.current.value = props.searchValue;
        }

        this.updatePageDetails();
        if ( prevProps.search && !props.search && props.searchValue === null ) {
            props.setFetchingState( true );
            props.fetchData( CONSTANTS.DEFAULT_PAGE, CONSTANTS.DEFAULT_PAGE_SIZE );
        }
    }

    /**
     * getNewListing
     * 
     * 
     */
    getNewListing() {
        this.props.setFetchingState( true );
        this.props.fetchData( this.props.page, CONSTANTS.DEFAULT_PAGE_SIZE );
        this.updateSearchQuery( this.props.page );
    }

    /**
     * getNewSearchListing
     * 
     * 
     */
    getNewSearchListing() {
        this.props.setFetchingState( true );
        this.props.getSearch( this.props.searchValue, this.props.page );
        this.updateSearchQuery( this.props.page, this.props.searchValue );
    }

    /**
     * updatePageDetails
     * 
     * 
     */
    updatePageDetails() {
        const limit = Math.ceil( this.props.items.count / CONSTANTS.DEFAULT_PAGE_SIZE );
        this.props.setMaxPage( limit );
        this.props.setCount( this.props.items.count );
    }

    /**
     * updateSearchQuery
     * 
     * 
     * 
     * @param {Number} page 
     * @param {String} search 
     */
    updateSearchQuery( page, search = null ) {
        const params = new URLSearchParams( window.location.search );
        if ( search !== null ) {
            params.set( CONSTANTS.PARAMS.SEARCH, search );
        }
        params.set( CONSTANTS.PARAMS.PAGE, page );
        window.history.replaceState( {}, '', `${ window.location.pathname }?${ params }` );
    }

    /**
     * handleSearchChange
     * 
     * 
     * 
     * @param {Event} event 
     */
    handleSearchChange( event ) {
        this.inputValue = event.target.value;
    }

    /**
     * onSearch
     * 
     * 
     * 
     * @param {Event} event 
     * @return {Boolean}
     */
    onSearch( event ) {
        event.preventDefault();
        if ( !this?.inputValue ) {
            this.searchRef.current.value = '';
            return;
        }
        this.props.setFetchingState( true );
        this.props.getSearch( this.inputValue, CONSTANTS.DEFAULT_PAGE );
        this.updateSearchQuery( CONSTANTS.DEFAULT_PAGE, this.inputValue );
    }

    /**
     * resetSearch
     * 
     * 
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
     * 
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
                    decrementPage={ props.decrementPage }
                    incrementPage={ props.incrementPage }
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
