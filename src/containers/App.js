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

    constructor() {
        super();
        this.searchRef = React.createRef();
    }

    /**
     * Runs after the component output has been rendered to the DOM
     */
    componentDidMount() {
        const params = new URLSearchParams( window.location.search );
        const page = params.get( 'page' ) ? Number( params.get( 'page' ) ) : 1;
        const search = params.get( 'search' ) ? params.get( 'search' ) : null;

        // update store
        this.props.setFetchingState( true );

        if ( search ) {
            this.props.getSearch( search, page );
        } else {
            this.props.fetchData( page, this.props.pageSize );
        }
    }

    componentDidUpdate( prevProps ) {

        if ( this.props.page !== prevProps.page && !this.props.search ) {
            this.props.setFetchingState( true );
            this.props.fetchData( this.props.page, this.props.pageSize );
            this.updateSearchQuery( this.props.page );
        }

        if ( this.props.page !== prevProps.page && this.props.search ) {
            this.props.setFetchingState( true );
            this.props.getSearch( this.props.searchValue, this.props.page );
            this.updateSearchQuery( this.props.page, this.props.searchValue );
        }

        if ( this?.searchRef?.current && this.props.searchValue ) {
            this.searchRef.current.value = this.props.searchValue;
        }

        this.updatePageDetails();

        if ( prevProps.search && !this.props.search && this.props.searchValue === null ) {
            this.props.setFetchingState( true );
            this.props.fetchData( 1, this.props.pageSize );
        }

    }

    updatePageDetails() {
        const limit = Math.ceil( this.props.items.count / this.props.pageSize );
        this.props.setMaxPage( limit );
        this.props.setCount( this.props.items.count );
    }

    updateSearchQuery( page, search = null ) {
        const params = new URLSearchParams( window.location.search );
        if ( search !== null ) {
            params.set( 'search', search );
        }
        params.set( 'page', this.props.page );
        window.history.replaceState( {}, '', `${ window.location.pathname }?${ params }` );
    }

    handleSearchChange( event ) {
        this.inputValue = event.target.value;
    }

    onSearch( event ) {
        event.preventDefault();
        if ( !this?.inputValue ) {
            this.searchRef.current.value = '';
            return;
        }
        this.props.setFetchingState( true );
        this.props.getSearch( this.inputValue, 1 );
        this.updateSearchQuery( 1, this.inputValue );
    }

    resetSearch() {
        this.props.unsetSearch();
    }

    render() {

        if ( this.props.error ) {
            return (
                <div className='u-overlay'>
                    <span className='u-overlay u-message'>{ CONSTANTS.LABELS.ERROR }</span>
                </div>
            )
        }

        if ( this.props.isFetching ) {
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
                    error={ this.props.error }
                    onChangeCallback={ this.handleSearchChange.bind( this ) }
                    onSearchCallback={ this.onSearch.bind( this ) }>
                </Search>
                <Header
                    page={ this.props.page }
                    error={ this.props.error }
                    isFetching={ this.props.isFetching }
                    maxPage={ this.props.maxPage }
                    items={ this.props.items.books }
                    count={ this.props.count }
                    pageSize={ this.props.pageSize }
                    decrementPage={ this.props.decrementPage }
                    incrementPage={ this.props.incrementPage }
                    clearSearch={ this.resetSearch.bind( this ) }
                    searchValue={ this.props.searchValue }
                    search={ this.props.search }>
                </Header>
                <Listing
                    error={ this.props.error }
                    isFetching={ this.props.isFetching }
                    items={ this.props.items.books }>
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
