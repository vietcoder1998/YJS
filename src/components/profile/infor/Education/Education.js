import React, { Component } from 'react';
import './Education.scss';
import {connect} from 'react-redux';
import CompleteEducation from './Complete/CompleteEducation';

const mapStateToProps = (state) => {
    return {
        educations: state.handlePersonalInfo.educations
    }
}

class Education extends Component {
    render() {
        return (
            this.props.educations && this.props.educations.map((item, index) => {
                return (
                    <CompleteEducation item={item} index={index} key= {index} id={item.id} complete={'complete' + index + 'education'} fix={'fix' + index + 'education'}/>
                )
            })
        );
    }
}

export default connect(mapStateToProps, null) (Education);
