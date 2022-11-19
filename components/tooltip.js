import React, {Component} from 'react';
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default class Tooltip extends Component {
    render() {
        return (
            <div className="inline-block ml-2 cursor-pointer relative">
                <div className="tip">
                    <span className={this.props.type} data-tooltip={this.props.content || " "}>
                        <FontAwesomeIcon icon={faCircleExclamation} size="sm"/>
                    </span>
                </div>
            </div>
        );
    }
}
