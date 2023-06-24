import { useContext, useState, useCallback, useEffect } from 'react';
import style from './Home.module.css';

import UserInfo from "./Components/UserInfo";
import ChatList from './Components/ChatList';
import ChatRoom from './Components/ChatRoom';
import SideBar from './Components/Mobile/SideBar';
import { socket } from '../../Socket/Socket-Connect';
import { AuthContext } from '../../Context/AuthContext';

const Home = () => {
    const auth = useContext(AuthContext);
    let [toggle, setToggle] = useState(false);
    let [DBroomData, setRoomData] = useState(null);
    let [otherUserStatus, setOtherUserStatus] = useState({});
    let [recievedMessage, setRecievedMessage] = useState({});
    let [otherUserTyping, setOtherUserTyping] = useState({});
    let [authUserMessage, setAuthUserMessage] = useState({});

    // announcement of current user status (isActive) when signin
    useEffect(() => {
        socket.emit('send-status', {userID: auth.user._id, status: auth.user.status});
    }, [])

    // recieve other users status when thay take actions (login - logout)
    socket.on('recieve-status', status => {
        setOtherUserStatus(status);
    })

    // recieve other users messages
    socket.on('recieve-message', message => {
        // check if the message meant to (this user)
        if(message.to !== auth.user._id) return 
        setRecievedMessage(message)
    })

    // recieve other users typingEffect
    socket.on('recieve-typingEffect', effect => {
        // check if the effect meant to (this user)
        if(effect.to !== auth.user._id) return 
        console.log(effect)
        setOtherUserTyping(effect)
    })
    
    // announcement of current user status (notActive) when signout
    const preLogOut = useCallback(() => {
        socket.emit('send-status', {userID: auth.user._id, status: false});
        auth.logout()
    })

    const toggleHandler = () => { 
        setToggle(!toggle) 
    }

    const authUserLastMessageHandler = (message) => {
        setAuthUserMessage(message);
    }
    
    const fetchRoomData = useCallback((data) => {
        setRoomData({...data});
    })

    let content = null;
    if(DBroomData)
    content = (
        <ChatRoom 
        toggleHandler={toggleHandler} 
        DBroomData={DBroomData} 
        otherUserStatus={otherUserStatus}
        recievedMessage={recievedMessage}
        otherUserTyping={otherUserTyping} 
        authUserLastMessageHandler={authUserLastMessageHandler}/>
    )

    return (
        <div className={style.Home}>
            <div className={style.desktop_responsive}>
                <div className={style.sideBar}>
                    <UserInfo
                    logOutHandler={preLogOut}/>
                    <ChatList 
                    fetchRoomData={fetchRoomData} 
                    DBroomData={DBroomData}
                    otherUserStatus={otherUserStatus}
                    recievedMessage={recievedMessage}
                    otherUserTyping={otherUserTyping}
                    authUserMessage={authUserMessage}/>
                </div>
            </div>
            <div className={style.content}>
                {content}
            </div>
            <SideBar 
            toggle={toggle} 
            toggleHandler={toggleHandler}
            logOutHandler={preLogOut}
            fetchRoomData={fetchRoomData}
            DBroomData={DBroomData}
            otherUserStatus={otherUserStatus}
            otherUserTyping={otherUserTyping}
            recievedMessage={recievedMessage}
            authUserMessage={authUserMessage}/>
        </div>
    )
}

export default Home;