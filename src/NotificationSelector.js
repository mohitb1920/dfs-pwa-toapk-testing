import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./components/NotificationComponent";

export default function NotificationSelector({ children }) {
  const notificationStatus = useSelector((state) => {
    return state.notificationAlert});
  const dispatch = useDispatch();

  useEffect(() => {
  }, [])

  return (
    <>
      <Notification
        open={notificationStatus.open}
        type={notificationStatus.type}
        message={notificationStatus.message}
        position={notificationStatus.position}
        setOpen={() => dispatch({type: "SHOW_NOTIFICATION", data: {open: false},})}
      />
      {children}
    </>
  );
}
