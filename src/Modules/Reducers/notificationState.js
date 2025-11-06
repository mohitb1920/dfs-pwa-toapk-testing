import { SOMETHING_WENT_WRONG } from "../../constants";
const initial = {
  open: false,
  message: [SOMETHING_WENT_WRONG],
  type: "success",
  duration: "",
  position: { vertical: "bottom", horizontal: "left" },
};

export default function NotificationStateChange(state = initial, event) {
  switch (event.type) {
    case "SHOW_NOTIFICATION":
      return {
        ...state,
        open: event.data.open,
        type: event.data.type,
        message: event.data.message,
        position: event.data?.position || state.position,
      };
    default:
      return state;
  }
}
