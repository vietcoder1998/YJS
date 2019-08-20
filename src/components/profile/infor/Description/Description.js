import React, { Component } from 'react';
import './Description.scss';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        description: state.handlePersonalInfo.description
    }
}

class Description extends Component {
    render() {
        return (
            <div className='wrapper'>
                <textarea value={this.props.description} readOnly></textarea>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(Description);
