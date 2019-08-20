import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Col } from 'react-bootstrap';
import Layout from '../layout/Layout';
import './Profile.scss';

// Layer
import Block from '../layout/block/Block';
import FixPerson from './fix/FixPerson/FixPerson';
import Person from './infor/Person/Person';
import FixDescription from "./fix/FixDescription/FixDescription";
import Description from './infor/Description/Description';
import FixSkills from './fix/FixSkills/FixSkills';
import Skills from './infor/Skills/Skills';
import Info from '../layout/info/Info';
import FixExperience from './fix/FixExperience/FixExperience';
import Experience from './infor/Experience/Experience';
import Education from './infor/Education/Education';
import FixEducation from './fix/FixEducation/FixEducation';
import LanguageSkills from './infor/LanguageSkills/LanguageSkills';

// Service
import FixLanguageSkills from './fix/FixLanguageSkills/FixLanguageSkills';
// import moveScrollBar from '../../assets/js/moveScroll';
import { PUT, POST } from './../../const/method';
import { CALL_DATA } from './../../redux-saga/actionCreator/PersonInfo';
import { moveScroll } from '../../assets/js/moveScroll';


class Profile extends Component {
    constructor() {
        super();
        this.state = {
            rating: {
                attitudeRating: 0,
                skillRating: 0,
                jobAccomplishmentRating: 0,
                ratingCount: 0
            },

            profileState: {
                person: false,
                description: false,
                skills: false,
                langugeSkills: false,
                experiences: false,
                education: false,
            },

            list_icon_degree: [],
            list_icon_skill: [],
            list_icon_pleased: [],
            is_loading: true,
        }

        this.icon_user = <i className="fa fa-user"></i>;
        this.icon_list = <i className="fa fa-list" aria-hidden="true"></i>;
        this.icon_star = <i className="fa fa-star" aria-hidden="true"></i>;
        this.icon_tower = <i className="fa fa-home" aria-hidden="true"></i>;
        this.icon_bachelor = <i className="fa fa-graduation-cap" aria-hidden="true"></i>;
        this.icon_solid_star = <i className="fa fa-star"></i>;
        this.icon_regular_star = <i className="fa fa-star"></i>;
    }

    async componentWillMount() {
        if (this.props.isAuthen === true) {
            this.props.callData();
            this._handleComment();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.profileState !== nextProps.profileState) {
            console.log(this.props.profileState)
        }
    }

    componentDidMount() {
        this.setState({ is_loading: false });
    }

    _fixData = (id) => {
        let { personalInfo } = this.props;
        let { profileState } = this.state;
        let param = id;
        profileState[param] = !profileState[param];
        this.setState({ profileState });
        let l_ls = personalInfo.language_skills.length;
        let l_ex = personalInfo.experiences.length;
        let l_ed = personalInfo.educations.length;
        let l_sk = personalInfo.skills.length;


        let h_ls = 0;
        let h_ex = 0;
        let h_ed = 0;

        if (l_ls > 0) {
            h_ls = document.getElementById('complete0lg').clientHeight;
        }

        if (l_ex > 0) {
            h_ex = document.getElementById('complete0experience').clientHeight;
        }

        if (l_ed > 0) {
            h_ed = document.getElementById('complete0education').clientHeight;
        }

        let p_ls = l_ls * h_ls;
        let p_ex = l_ex * h_ex;
        let p_ed = l_ed * h_ed;

        let p_sk = 25 * ((l_sk - 3) / 2);

        switch (param) {
            case 'person':
                moveScroll(80, 0, true);
                break;

            case 'description':
                moveScroll(700, 0, true);
                break;

            case 'skills':
                moveScroll(980, 0, true);
                break;

            case 'languageSkills':
                moveScroll(980 + 300 + p_sk + p_ls, 0, true);
                break;
            case 'experience':
                moveScroll(980 + 260 * 2 + p_sk + p_ls + p_ex, 0);
                break;
            case 'education':
                moveScroll(980 + 450 * 3 + p_sk + p_ls * p_ex + p_ed, 0);
                break;
            default:
                break;
        }
    }

    _handleComment = () => {
        let { rating, list_icon_degree, list_icon_skill, list_icon_pleased } = this.state;
        let rating_state = this.props.personalInfo.rating;

        if (rating_state !== null) {
            rating = rating_state;
        }

        for (let i = 0; i < 5; i++) {
            let deegree = rating.attitudeRating;
            let skill = rating.skillRating;
            let pleased = rating.jobAccomplishmentRating;

            if (i < deegree) {
                list_icon_degree.push(this.icon_solid_star);
            } else {
                list_icon_degree.push(this.icon_regular_star)
            }

            if (i < skill) {
                list_icon_skill.push(this.icon_solid_star);
            } else {
                list_icon_skill.push(this.icon_regular_star)
            }

            if (i < pleased) {
                list_icon_pleased.push(this.icon_solid_star);
            } else {
                list_icon_pleased.push(this.icon_regular_star)
            }
        }

        this.setState({ list_icon_degree, list_icon_skill, list_icon_pleased })
    }

    render() {
        let {
            list_icon_degree,
            list_icon_pleased,
            list_icon_skill
        } = this.state;

        let { profileState } = this.state;

        return (
            <Layout>
                <div className="content">
                    <div className='profile'>
                        {/* Profile */}
                        <Col xs={12} md={9} sm={12} lg={8} className='block-info'>
                            <React.Fragment>
                                <Block describe='Thông tin cá nhân' icon={this.icon_user} >
                                    <div className='icon-fix' onClick={() => this._fixData('person')}>
                                        <span data-tip
                                            data-for='f_p_i'
                                            className="fa fa-pencil"
                                        >
                                        </span>
                                    </div>
                                    {profileState['person'] ? <FixPerson _fixData={this._fixData} /> : <Person />}
                                </Block >
                                {/* Description */}
                                <Block describe='Mô tả bản thân' icon={this.icon_list} >
                                    <div className='icon-fix' onClick={() => this._fixData('description')}>
                                        <span
                                            data-tip data-for='f_d_i'
                                            id='description'
                                            className="fa fa-pencil"
                                        >
                                        </span>
                                    </div>
                                    {profileState['description'] ? <FixDescription _fixData={this._fixData} method={PUT} /> : <Description />}
                                </Block >

                                {/* Skill */}
                                <Block describe='Kỹ năng chuyên nghành' icon={this.icon_star}   >
                                    <div className='icon-fix' onClick={() => this._fixData('skills')}>
                                        <span data-tip data-for='a_s'
                                            id='skills'
                                            className="fa fa-pencil"
                                        >
                                        </span>
                                    </div>
                                    {profileState['skills'] ? <FixSkills _fixData={this._fixData} /> : <Skills />}
                                </Block >

                                {/* Language Skills */}
                                <Block describe='Ngoại ngữ' icon={this.icon_list}  >
                                    <div className='icon-fix' onClick={() => this._fixData('languageSkills')}>
                                        <span
                                            data-tip data-for='a_ls'
                                            id='languageSkills'
                                            className="fa fa-plus"
                                            color="blue"
                                        ></span>
                                    </div>
                                    <LanguageSkills />
                                    {profileState['languageSkills'] ? <FixLanguageSkills _fixData={this._fixData} method={POST} /> : null}
                                </Block >

                                {/* Experience */}
                                <Block describe='Kinh nghiệm làm việc' icon={this.icon_tower}  >
                                    <div className='icon-fix' onClick={() => this._fixData('experience')}>
                                        <span
                                            data-tip data-for='a_ex'
                                            id='experience'
                                            className="fa fa-plus"
                                        >

                                        </span>
                                    </div>
                                    <Experience />
                                    {profileState['experience'] ? <FixExperience _fixData={this._fixData} method={POST} /> : null}
                                </Block >

                                {/* Education */}
                                <Block describe='Học vấn và bằng cấp' icon={this.icon_bachelor}>
                                    <div className='icon-fix' onClick={() => this._fixData('education')}>
                                        <span
                                            data-tip data-for='a_ed'
                                            id='education'
                                            className="fa fa-plus"
                                        >
                                        </span>
                                    </div>
                                    <Education />
                                    {profileState['education'] ? <FixEducation _fixData={this._fixData} method={POST} /> : null}
                                </Block >
                                {/* Personal Info */}

                            </React.Fragment>
                        </Col>

                        {/* Comment */}
                        <Col lg={3} md={4} xs={12} className='candicate-info'>
                            <React.Fragment>
                                <Info describe='ĐÁNH GIÁ'>
                                    <p>
                                        <label>THÁI ĐỘ</label>{list_icon_degree.map((item, index) => { return <span key={index}>{item}</span> })}
                                    </p>
                                    <p>
                                        <label>KĨ NĂNG</label>{list_icon_skill.map((item, index) => { return <span key={index}>{item}</span> })}
                                    </p>
                                    <p>
                                        <label>HÀI LÒNG</label>{list_icon_pleased.map((item, index) => { return <span key={index}>{item}</span> })}
                                    </p>

                                </Info>
                                <Info describe='Ai xem hồ sơ của bạn'>

                                </Info>
                                <Info describe='Kỹ năng mềm'>

                                </Info>
                            </React.Fragment>
                        </Col>
                    </div>
                </div>
            </Layout >
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isAuthen: state.handleAuthState.isAuthen,
        personalInfo: state.handlePersonalInfo,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        callData: () => dispatch({ type: CALL_DATA }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
