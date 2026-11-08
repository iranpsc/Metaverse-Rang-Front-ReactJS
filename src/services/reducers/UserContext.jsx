import { createContext, useEffect, useReducer } from 'react';
import { UserContextTypes } from '../actions/UserContextAction';


export const UserContext = createContext({});

const reducer = (state, action) => {
  switch (action.type) {
    case UserContextTypes.ADD_USER:
      return action.payload.user;

    case UserContextTypes.DELETE_USER:
      return {};

    case UserContextTypes.UPDATE_FIELD:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    default:
      return state;
  }
};

export default function UserProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {});

    useEffect(() => {
        if(!children) {
            throw Error('You must use UserContext provider ...');
        }
    }, [children]);

    return (
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    );
}
