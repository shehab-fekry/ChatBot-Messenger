import React from "react";
import style from './SideBar.module.css';

import UserInfo from "../UserInfo";
import ChatList from "../ChatList";

const SideBar = (props) => {
    return (    
        <React.Fragment>
            {/* SideBar Component */}
            <div className={style.SideBar}
            style={{
                transform: props.toggle ? 'translateX(0px)' : 'translateX(-100%)',

            }}>
                <UserInfo/>
                <ChatList 
                fetchRoomData={props.fetchRoomData}
                otherUserStatus={props.otherUserStatus}
                recievedMessage={props.recievedMessage}
                authUserMessage={props.authUserMessage}
                toggleHandler={props.toggleHandler}/>
            </div>
            {/* BackDrop */}
            <div className={style.BackDrop} onClick={props.toggleHandler}
            style={{
                display: props.toggle ? 'block' : 'none',
            }}></div>
        </React.Fragment>
    )
}

export default SideBar;