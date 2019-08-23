import React, { Component } from 'react';
import './Info.scss'
import { _get } from '../../../../service/base-api';
import { Icon } from 'antd';

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

        let { describe, breakcumb, children } = this.props;

        return (
            <div className='info-block'>
                <div className="block-header">
                    <div className='header-content'>
                        <p>
                            {describe}
                        </p>

                        {breakcumb ? <div className='break-cumb'>
                            <Icon type='home' /> {this.props.breakcumb}
                        </div> : null}
                    </div>

                </div>
                {children}
            </div>
        );
    }
}

export default Info;