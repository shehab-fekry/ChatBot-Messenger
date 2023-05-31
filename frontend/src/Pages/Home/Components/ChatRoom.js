import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import style from './ChatRoom.module.css';

import Message from './Message';
import { AuthContext } from "../../../Context/AuthContext";
import { socket } from '../../../Socket/Socket-Connect';

const ChatRoom = (props) => {
    const auth = useContext(AuthContext);
    let [newMessage, setNewMessage] = useState('');
    let [User, setUser] = useState({});
    let [Messages, setMessages] = useState([]);


    // Change (Rerendering) other users chat messages when a message is recieved | Socket.io
    useEffect(() => {
        // check if the message meant to (this chat room)
        if(props.DBroomData.room._id === props.recievedMessage.room){
            let updatedMessages = [...Messages];
            updatedMessages.unshift(props.recievedMessage);
            setMessages(updatedMessages);
        }
    }, [props.recievedMessage])

    // Change (Rerendering) other users status when thay take actions (login/logout) | Socket.io
    useEffect(() => {
        let updatedUser = {...User};
        if(updatedUser._id === props.otherUserStatus.userID){
            updatedUser.status = props.otherUserStatus.status;
            setUser(updatedUser)
        }
    }, [props.otherUserStatus])

    // Change (Rerendering) room data from database when selecting a chat room
    useEffect(() => {
        let DBmessages = [...props.DBroomData.room.messages].reverse();
        setMessages(DBmessages)
        setUser({...props.DBroomData.user})
    }, [props.DBroomData])

    const inputChangeHandler = (event) => {
        let inputValue = event.target.value;
        setNewMessage(inputValue)
    }

    const sendMessageHandler = (roomID) => {
        if(newMessage === '') return 
        let time = new Date().toLocaleTimeString();
        let xm = time.split(' ')[1];
        let hours = time.split(' ')[0].split(':')[0];
        let minutes = time.split(' ')[0].split(':')[1];
        let message = {
            creatorID: auth.user._id,
            to: User._id,
            text: newMessage,
            time: hours + ':' + minutes + ' ' + xm,
            room: roomID,
        }
        
        setNewMessage('');
        props.authUserLastMessageHandler(message)
        socket.emit('send-message', message);
        axios.post('http://localhost:8000/Chat/newMessage', message)
        .then(result => {
            let updatedMessages = [...Messages];
            updatedMessages.unshift(message);
            setMessages([...updatedMessages]);
        })
        .catch(err => console.log(err))
    }


    return (
        <div className={style.ChatRoom}>
            <div className={style.ChatHeader}>
                <div className={style.User}>
                    <div className={style.ImageSide}><img src={User.imagePath}/></div>
                    <div className={style.InfoSide}>
                        <div className={style.Name}>{User.name}</div>
                        <div className={style.Status}>{User.status ? 'Online' : 'Offline'}</div> 
                    </div>
                </div>
                <div className={style.toggleButton} onClick={props.toggleHandler}></div>
            </div>
            
            <div id="ChatRoom" className={style.ReadingSide}>
                {Messages.map((message, index) => {
                    return <Message
                    key={index}
                    message={message} 
                    auth={auth.user._id}/>
                })}
            </div>
            
            <div className={style.WritingSide}>
                <div className={style.ToolContainer}></div>
                <div className={style.InputContainer}>
                    <div className={style.InputSide}>
                        <input 
                        value={newMessage}
                        type="text" 
                        placeholder="Type A Message" 
                        onChange={(e) => inputChangeHandler(e)}/>
                    </div>
                    <div className={style.ButtonSide}>
                        <button onClick={() => sendMessageHandler(props.DBroomData.room._id)}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;