import React, { useContext } from "react";
import style from './UserInfo.module.css';
import { AuthContext } from "../../../Context/AuthContext";

const UserInfo = () => {
    const auth = useContext(AuthContext);
    return (
        <div className={style.UserInfo}>
            <div className={style.imageSide}><img src={auth.user.imagePath}/></div>
            <div className={style.nameSide}>{auth.user.name}</div>
        </div>
    )
}

export default UserInfo;