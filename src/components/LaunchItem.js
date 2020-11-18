import React from 'react';
import Moment from 'react-moment';

/**
 * Responsible for rendering the Launch Item
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const LaunchItem = ( props ) => {
    return (
        <li key={ props.index } className="launch-item">
            <div className="launch-item__mission-content">
                <span className="launch-item__number">{ `#${ props.item.flight_number }` }</span>
                <span className="launch-item__label">{ `${ props.item.mission_name }` }</span>
            </div>
            <div className="launch-item__meta-info">
                <span className="launch-item__date"> <Moment format="Do MMMM YYYY" date={ props.item.launch_date_utc } /></span>
                <span className="launch-item__rocket">{ props.item.rocket.rocket_name }</span>
            </div>
        </li>
    );
}

export default LaunchItem;
