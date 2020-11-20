import React from 'react';
import Listing from '../components/Listing';
import Header from '../components/Header';
import CONSTANTS from '../common/constants';
import '../assets/styles/index.scss';
import { connect } from 'react-redux';
import { fetchAction, searchAction, fetchingStateAction } from '../actions/fetchActions';
import { incrementAction, decrementAction, maxPageAction, setCountAction } from '../actions/paginationActions';

class App extends React.Component {
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor() {
        super();
    }

    /**
     * Runs after the component output has been rendered to the DOM
     */
    componentDidMount() {
        const params = new URLSearchParams( window.location.search );
        const page = params.get( 'page' ) ? Number( params.get( 'page' ) ) : 1;

        // update store
        this.props.setFetchingState( true );
        this.props.fetchData( page, this.props.pageSize );
    }

    /**
     * [componentDidUpdate description]
     * @param  {[type]} prevProps [description]
     * @return {[type]}           [description]
     */
    componentDidUpdate( prevProps ) {
        if ( this.props.page !== prevProps.page && !this.props.search ) {
            this.props.setFetchingState( true );
            this.props.fetchData( this.props.page, this.props.pageSize );

            // update query string
            const params = new URLSearchParams( window.location.search );
            params.set( 'page', this.props.page );
            window.history.replaceState( {}, '', `${ window.location.pathname }?${ params }` );
        }

        if ( this.props.page !== prevProps.page && this.props.search ) {
            this.props.setFetchingState( true );
            this.props.getSearch( this.props.searchValue, this.props.page );
        }

        // update page limit
        if ( prevProps.items === null && this.props.items?.count ) {
            const limit = Math.ceil( this.props.items.count / this.props.pageSize );
            this.props.setMaxPage( limit );
            this.props.setCount( this.props.items.count );
        }

        if ( this.props.search && !prevProps.search || this.props.searchValue !== prevProps.searchValue ) {
            const limit = Math.ceil( this.props.items.count / this.props.pageSize );
            this.props.setMaxPage( limit );
            this.props.setCount( this.props.items.count );
        }
    }

    onSearch( event ) {
        event.preventDefault();
        const input = event.target[ 0 ];
        const value = input.value;
        if ( !value ) {
            input.value = '';
            return;
        }
        this.props.setFetchingState( true );
        this.props.getSearch( value, 1 );
        input.value = '';
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
                    <p className='u-message loading'>{ CONSTANTS.LABELS.LOADING }</p>
                </div>
            )
        }

        return (
            <div className='app'>
                <form className='search' onSubmit={ this.onSearch.bind( this ) }>
                    <input type='search' placeholder='Search...'></input>
                </form>
                <Header
                    page={ this.props.page }
                    error={ this.props.error }
                    isFetching={ this.props.isFetching }
                    maxPage={ this.props.maxPage }
                    items={ this.props.items.books }
                    count={ this.props.count }
                    pageSize={ this.props.pageSize }
                    decrementPage={ this.props.decrementPage }
                    incrementPage={ this.props.incrementPage }>
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
        }
    }
};

export default connect( mapStateToProps, mapDispatchToProps )( App );
