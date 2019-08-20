import React, { Component } from 'react';
import './Block.scss';
import { Icon } from 'antd';

class Block extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            fade: true,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false, fade: false })
        }, 1000)
    }

    render() {
        let { loading, fade } = this.state;

        return (
            <div className='box-block'>
                <div className="block-header">
                    <p>{this.props.icon} {this.props.describe}</p>
                </div>
                {loading ? <div className='loading'><Icon type="loading-3-quarters" style={{ fontSize: 24 }} spin /></div > :
                    <div className='effect' style={{ opacity: fade === true ? '0' : '1' }}>{this.props.children}</div>}
            </div>
        );
    }
}

export default Block;