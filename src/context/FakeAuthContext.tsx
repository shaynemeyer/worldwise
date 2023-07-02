import { createContext, useContext, useReducer } from 'react';
import { AppUser } from '../../types/User';
interface AuthContextProps {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
}

const initialState = {
  user: null,
  isAuthenticated: false,
} as AuthState;

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  login: () => undefined,
  logout: () => undefined,
});

type AuthLogin = {
  type: 'login';
  payload: AppUser;
};

type AuthLogout = {
  type: 'logout';
};

type AuthAction = AuthLogin | AuthLogout;

function reducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'logout':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error('Unknown action');
  }
}

// todo: NEVER do this in real code. Replace this with the response from an authorization api endpoint
const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
} as AppUser;

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider
      value={{ user: user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
