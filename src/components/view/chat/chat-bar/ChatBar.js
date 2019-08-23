import React, { Component } from 'react';
import './ChatBar.scss';
import Search from 'antd/lib/input/Search';
import { limitString } from '../../../../assets/js/limitString';
import { timeConverter } from '../../../../assets/js/convertTime';

class ChatBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { list_user } = this.state;
        let { list_chat_room } = this.props;

        console.log(list_chat_room);
        return (
            <div className='chat-bar test'>
                <header>
                    <h4>
                        <img src={'TestImg'} alt='' />
                        <label>Chat</label>
                    </h4>
                </header>
                <div className='search-chat-bar'>
                    <Search />
                </div>
                <div className='content-chat-bar'>
                    <ul>
                        {list_chat_room.map((item, index) => {
                            let ownerID = item.lastMessage.ownerID;
                            let candidateID = item.candidate.id;
                            // if (item.candidate.avatarUrl && item.employer.logoUrl) {
                            //     avatarUrl = ownerID === candidateID ? item.candidate.avatarUrl : item.employer.logoUrl;
                            // }

                            let name = ownerID === candidateID ? item.candidate.lastName : item.employer.name;
                            let sender = ownerID === candidateID ? "Bạn:" : "";
                            let content = limitString(item.lastMessage.message);
                            let time = timeConverter(item.lastMessage.createdDate.seconds)

                            return (
                                <li key={index} id={item.key} onClick={() => {this.props._chooseChatRoom(item.key)}}>
                                    <div className='item-chat-user wteam-container'>
                                        <div className='img-content '>
                                            <img src={'avatarUrl'} alt='' />
                                        </div>
                                        <ul className='msg-content '>
                                            <li>
                                                <p>{limitString(name, 12)}</p>
                                            </li>
                                            <li>
                                                {sender}
                                                {content + '.'}
                                                <span style={{ fontSize: " 0.5rem" }}>
                                                    {time}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                </div>
            </div>
        );
    }
}

export default ChatBar;