import React, { Component } from 'react';
import './Skills.scss';
import { connect } from 'react-redux';

const mapStateToProps = (state) =>{
    return {
        skills: state.handlePersonalInfo.skills
    }
}

class Skills extends Component {
    render() {
        return (
            <div className='wrapper'>
                <p>Thêm công việc hoặc kĩ năng để nhà tuyển dụng tìm kiếm phù hợp với bạn</p>
                {this.props.skills.map((item, index) => {
                    return (
                        <label key={index}><span className='tag-ability'> {item.name}</span></label>
                    )
                })}
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(Skills);
