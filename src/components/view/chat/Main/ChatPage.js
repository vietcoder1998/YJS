import React, { Component } from 'react';
import Layout from './../../../layout/Main/Layout';
import { Row, Col } from 'antd';
import ChatBar from './../chat-bar/ChatBar';
import ChatInterFace from './../chat-interface/ChatInterFace';
import firebase from './FireBase';

const myId = "410880da-1f4e-443a-837f-401e849c0c7f";

class ChatPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            boards: [],
            list_chat_room: [],
            message: 'ddd',
            messages: [],
            heightHeaderAndTextBox: 0,
            lastHeight: 0,
            roomSelect: null,
            firstTime: true,
            checkpointMess: null,
            loadMore: false,
            stateEmployer: new Map()
        };

        this.ref = firebase.firestore()
            .collection('chat_rooms')
            .where("candidate.id", "==", myId )
            .orderBy("lastMessage.createdDate", "desc");

        this.unsubscribe2 = null;
        this.unsubscribe = null
        this.messUnseen = null;
        this.checkpointMess = null;
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this._onCollectionUpdate);
    }

    _onCollectionUpdate = (querySnapshot) => {
        console.log(querySnapshot);

        let list_chat_room = [];
        let stateEmployer = new Map();
        let { roomSelect, firstTime } = this.state;

        querySnapshot.forEach((doc) => {
            let { employer, lastMessage, candidate } = doc.data();
            doc.ref.collection("visitStates").doc("employer").onSnapshot((doc2) => {
                stateEmployer.set(doc.id, doc2.data().state);
                this.setState({ stateEmployer })
            });

            list_chat_room.push({
                key: doc.id,
                doc, // DocumentSnapshot
                employer,
                lastMessage,
                candidate,
            });
        });

        this.setState({ list_chat_room, roomSelect: list_chat_room[0] });

        if (firstTime) {
            if (roomSelect) {
                console.log('room SelectSuccess');
                // Get Msg From DB
                this.ref2 = firebase
                    .firestore()
                    .collection('chat_rooms')
                    .doc(roomSelect.key)
                    .collection("messages");

                this.unsubscribe2 = this.ref2
                    .orderBy("createdDate", "desc")
                    .limit(10)
                    .onSnapshot(this._onCollectionUpdate2);

                this.messUnseen = this.ref2
                    .where('ownerID', '==', roomSelect.employer.id)
                    .where('seen', '==', false)
                    .onSnapshot((querySnapshot) => {
                        let batch = firebase.firestore().batch();

                        querySnapshot.forEach((doc) => {
                            console.log(doc);
                            batch.update(this.ref2.doc(doc.id), { seen: true });
                        });

                        batch.commit();
                    });

                this.setState({ firstTime: false });
            }
        }
    }

    _onCollectionUpdate2 = (querySnapshot) => {
        console.log('_onCollectionUpdate2');
        let messages = [];

        querySnapshot.forEach((doc2) => {
            messages.unshift(doc2.data());
            this.checkpointMess = doc2;
        });

        this.setState({ messages });
        this.forceUpdate();
    }

    _chooseChatRoom = (e) => {
        console.log(e)
    }

    _sendMsg = () => {

    }

    render() {
        let { roomSelect, list_chat_room, messages } = this.state;
        return (
            <Layout>
                <div className='content'>
                    <Row>
                        {/* Chat Bar */}
                        <Col sm={12} md={8} lg={8} xl={6} xxl={4} >
                            <ChatBar roomSelect={roomSelect} list_chat_room={list_chat_room} _chooseChatRoom={this._chooseChatRoom} />
                        </Col>
                        {/* Chat InterFace */}
                        <Col sm={12} md={16} lg={16} xl={18} xxl={20} >
                            <ChatInterFace roomSelect={roomSelect} messages={messages} _sendMsg={this._sendMsg} />
                        </Col>
                    </Row>
                </div>
            </Layout>
        );
    }
}

export default ChatPage;