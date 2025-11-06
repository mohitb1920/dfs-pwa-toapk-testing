import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {SOMETHING_WENT_WRONG} from '../constants'
import { useTranslation } from "react-i18next";

const Alert = React.forwardRef(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification({ open, type, duration, message, setOpen, position}) {
  
  const { t } = useTranslation();
  
  return (
    <>
      {(type) ? 
     ( <Snackbar
        open={open}
        bodyStyle={{ height: 'auto', lineHeight: '28px', padding: 24, whiteSpace: 'pre-line' }} 
        autoHideDuration={duration || 5000}
        onClose={() => setOpen(false)}
        anchorOrigin={position}
      >
        <Alert severity={type} sx={{ width: "100%", fontSize: "15px"}} onClose={() => setOpen(false)}>
          {(message && message?.length !== 0) ? t(message[0]) : t(SOMETHING_WENT_WRONG)}
        </Alert>
      </Snackbar>): ''}
    </>
  );
}
