import {createStore} from 'redux'

const defaultState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
};
const store = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'USER_INFO': {
            return {
                ...state,
                userInfo: action.userInfo
            }
        }
        default:
            break
    }
    return state
});
export default store
