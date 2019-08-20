import React, { Component } from 'react';
import './ChatInterFace.scss';
import { Input, Icon, Button } from 'antd';
import firebase from '../Main/FireBase';

const myId = "410880da-1f4e-443a-837f-401e849c0c7f";


class ChatInterFace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: 'asdf',
                avatarUrl: 'asfdsf',
                name: "Trang"
            },

            list_msg: [],
            fisrtTime: '',
            load_more: '',
            roomSelect: null,
        };

        this.unsubscribe = null;
        this.unsubscribe2 = null;
        this.messUnseen = null;
        this.checkpointMess = null;
    }

    componentWillMount() {
        // Call FireBase Store
  
    }

    render() {
        let { user, list_msg } = this.state
        return (
            <div className='chat-interface test'>
                <header>
                    <h4>
                        <img src={''} alt='' />
                        <label>{user.name}</label>
                    </h4>
                </header>
                <div className='msg-properties b_'>
                    {/* List Msg */}
                    <div className='list-msg'>
                        {list_msg.map((item, index) => {
                            return (
                                <div key={index} className='p1-content'>
                                    <div className='avatar-p1'>
                                        <img src={''} alt='' />
                                    </div>
                                    <div className='msg'>
                                        <span className='s-msg-p1'>
                                            {item.l_message.content}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
                {/* Input Msg */}
                <div className='input-msg b_t'>
                    <div className='more-state'>
                        <Button>
                            <Icon type="plus-circle" />
                        </Button>
                    </div>
                    <div className='input-content'>
                        <Input prefix={<Icon type='smile' />} placeholder='Nhập tin nhắn' />
                    </div>
                    <div>
                        <Button type='like' />
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatInterFace;