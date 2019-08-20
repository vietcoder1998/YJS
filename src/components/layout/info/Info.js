import React, { Component } from 'react';
import './Info.scss'
import { _get } from '../../../service/base-api';

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    _getData() {
        let params = {
            sortBy: 'priority',
            sortType: 'asc',
            pageIndex: 1,
            pageSize: 1,
        };

        let api = "/api/jobGroups";
        _get(params, api);
    }
    
    render() {
        return (
            <div className='info-block'>
                <div className="block-header">
                    <p> {this.props.describe}</p>
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default Info;