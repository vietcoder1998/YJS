import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompleteExperience from './Complete/CompleteExperience';

const mapStateToProps = (state) => {
    return {
        experiences: state.handlePersonalInfo.experiences
    }
}

class Experience extends Component {
    render() {
        let { experiences } = this.props;
        return (
            experiences.map((item, index) => {
                return (
                    <CompleteExperience item={item} key={index} id={item.id}complete={'complete' + index + 'experience'} fix={'fix' + index + 'experience'}/>
                )
            })
        );
    }
}

export default connect(mapStateToProps, null)(Experience);
