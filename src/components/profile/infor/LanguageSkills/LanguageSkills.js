import React, { Component } from 'react';
import './LanguageSkills.scss';
import { connect } from 'react-redux';
import CompleteLanguageSkills from './Complete/CompleteLanguageSkills';

const mapStateToProps = (state) => {
    return {
        language_skills: state.handlePersonalInfo.language_skills,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
       
    }
}

class LanguageSkills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language_skills_state: [],
            language_skills: [],
        }

        this.list_component = []
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.language_skills_state !== nextProps.language_skills_state) {
            let language_skills = this.props.language_skills;
            let { language_skills_state } = this.state;
            for (let i = 0; i < language_skills.length; i++) {
                this.list_component.push(true)
            }
            this.setState({ language_skills, language_skills_state });
        }
    }

    _updateLanguageSkillsState = (event) => {
        let { language_skills_state } = this.props;
        let index = event.target.id;
        let item = !language_skills_state[index].is_fix;
        language_skills_state[index].is_fix = item;
        this.props.updateLgState(language_skills_state);
    }

    render() {
        let { language_skills } = this.props;

        return (
            language_skills && language_skills.map((item, index) => {
                return (
                   <CompleteLanguageSkills item={item} key={index} complete={'complete' + index + 'lg'} fix={'fix' + index + 'lg'} id={item.id} />
                )
            })

        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSkills);