import { createStore } from 'redux';

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  email: null,
  firstName: null,
  lastName: null,
  profileImage: null
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isLoggedIn: true,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        email: action.email,
        firstName: action.firstName,
        lastName: action.lastName,
        profileImage: action.profileImage
      };
    case 'LOGOUT':
      return {
        isLoggedIn: false,
        accessToken: null,
        refreshToken: null,
        email: null,
        firstName: null,
        lastName: null,
        profileImage: null
      };
    case 'UPDATE_USER':
      return {
        isLoggedIn: true,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        email: action.email,
        firstName: action.firstName,
        lastName: action.lastName,
        profileImage: action.profileImage
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;