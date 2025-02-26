import { createContext, useReducer } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

interface IDefaultState {
  userDetails: any;
  token: any;
  sectionCreated: boolean;
  profilePicUpdated: boolean;
  hasLoggedIn: boolean;
  contextLoading: boolean;
}

const defaultState: IDefaultState = {
  userDetails: {},
  token: {},
  sectionCreated: false,
  profilePicUpdated: false,
  hasLoggedIn: false,
  contextLoading: false,
};

export const AppContext = createContext<{
  state: typeof defaultState;
  dispatch: React.Dispatch<any>;
}>({
  state: defaultState,
  dispatch: () => null,
});

const contextreducer = (
  state: typeof defaultState,
  action: any
): typeof defaultState => {
  switch (action.type) {
    case "UPDATE_SECTION_CREATED":
      return { ...state, sectionCreated: action.data };
    case "UPDATE_SECTION_RESET":
      return { ...state, sectionCreated: action.data };
    case "UPDATE_PROFILE_PICTURE":
      return { ...state, profilePicUpdated: action.data };
    case "UPDATE_LOGIN_STATE":
      return { ...state, hasLoggedIn: action.data };
    case "UPDATE_LOADING_STATE":
      return { ...state, contextLoading: action.data };
    case "UPDATE_PROFILE_DATA":
      return {
        ...state,
        userDetails: { ...state.userDetails, ...action.data },
      };
    default:
      return defaultState;
  }
};
const MainLayout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const [state, dispatch] = useReducer(contextreducer, defaultState);
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children || null}
    </AppContext.Provider>
  );
};

export default MainLayout;
