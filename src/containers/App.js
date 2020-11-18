import React from 'react';
import LaunchList from '../components/LaunchList';
import Button from '../components/Button';
import Select from '../components/Select';
import CONSTANTS from '../common/constants';
import { connect } from 'react-redux';
import { fetchAction, fetchingStateAction } from '../actions/fetchActions';
import { incrementAction, decrementAction, maxPageAction } from '../actions/paginationActions';

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
    componentDidUpdate( prevProps, prevState, snapshot ) {
        if ( this.props.page !== prevProps.page ) {
            this.props.setFetchingState( true );
            this.props.fetchData( this.props.page, this.props.pageSize );

            // update query string
            const params = new URLSearchParams( window.location.search );
            params.set( 'page', this.props.page );
            window.history.replaceState( {}, '', `${ window.location.pathname }?${ params }` );
        }

        // update page limit
        if ( prevProps.items === null && this.props.items?.count ) {
            const limit = Math.ceil( this.props.items.count / this.props.pageSize );
            this.props.setMaxPage( limit );
        }
    }

    render() {

        if ( this.props.error ) {
            return (
                <span>Sorry, there has been an error trying to load the data.</span>
            )
        }

        if ( this.props.isFetching ) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <div>
                <p>{ this.props.page }</p>
                <button onClick={ this.props.decrementPage.bind( this, this.props.page ) } disabled={ this.props.page === 1 }>Prev</button>
                <button onClick={ this.props.incrementPage.bind( this, this.props.page ) } disabled={ this.props.page === this.props.maxPage }>Next</button>
                <ul>
                    { this.props.items.books.map( ( item, index ) => {
                        return <li key={ index }>{ item.book_title }</li>
                    } ) }
                </ul>
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
        maxPage: state.maxPage
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
        }
    }
};

export default connect( mapStateToProps, mapDispatchToProps )( App );
