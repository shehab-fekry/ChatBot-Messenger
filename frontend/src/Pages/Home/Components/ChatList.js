import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import style from './ChatList.module.css';

import { AuthContext } from "../../../Context/AuthContext";
import ChatItem from './ChatItem';
 
const ChatList = (props) => {
    const auth = useContext(AuthContext);
    let [users, setUsers] = useState([]);

    // getting all chat rooms 
    useEffect(() => {
        axios.get('http://localhost:8000/Chat/UsersList')
        .then(data => {
            let users = data.data.users;
            users = users.filter(user => user._id !== auth.user._id);
            setUsers([...users])
            console.log(users)
        })
        .catch(err => console.log(err))
    }, []);

    // change (Rerendering) other users status when thay take actions (login - logout) | Socket.io
    useEffect(() => {
        let updatedUsers = [...users]
        updatedUsers.forEach(user => {
            if(user._id === props.otherUserStatus.userID)
            user.status = props.otherUserStatus.status;
        })
        setUsers(updatedUsers)
    }, [props.otherUserStatus])

    const clickHandler = (userID) => {
        // getting data of a specific room onClick
        axios.get(`http://localhost:8000/Chat/Rooms/${userID}/${auth.user._id}`)
        .then(data => {
            props.fetchRoomData({...data.data});
            console.log(data.data)
        })
        .catch(err => console.log(err))

        // activate sideDrawer (close event) onClick when screen width in mobile mood
        if( (window.innerWidth || document.documentElement.clientWidth) <= 900){
            props.toggleHandler();
        }
    }

    return (
        <div className={style.Container}>
            <div className={style.ListHeader}>
                <div className={style.search}><input type="text" placeholder="Search"/></div>
                <div className={style.title}>Chats</div>
            </div>
            <div className={style.ChatList}>
                {
                users?.map((user, index) => {
                    return <ChatItem
                    key={index}
                    user={user}
                    recievedMessage={props.recievedMessage}
                    authUserMessage={props.authUserMessage}
                    onClick={() => clickHandler(user._id)}/>
                })
                }
            </div>
        </div>
        
    )
}
 
export default ChatList;