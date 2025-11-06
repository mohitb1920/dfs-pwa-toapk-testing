const initial = {
    number: ""
}
export default (state = initial, event) => {
    switch (event.type) {
        case "UPDATE_NUMBER":

            return {
                ...state,
                number: event.data
            }

        default:
            return state;
    }
};
