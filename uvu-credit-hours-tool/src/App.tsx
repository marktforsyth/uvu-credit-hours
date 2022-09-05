import { useEffect, useReducer, useRef } from "react";

import Nav from "./components/Nav";
import Courses from "./components/Courses";
import Modal from "./components/Modal";

import type { Styles, State } from "./common/types";

type Action = {
  type: string;
  payload: string;
};

const styles: Styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "5rem",
    overflow: "scroll",
    height: "calc(100vh - 5rem)",
  },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "title":
      return { ...state, titleSearch: action.payload };
    case "category":
      return { ...state, category: action.payload };
    case "credit-hours":
      return { ...state, creditHours: parseFloat(action.payload) };
    case "no-prereqs":
      return { ...state, noPrereqs: !state.noPrereqs };
    case "toggle-category-open":
      return { ...state, categoryOpen: !state.categoryOpen };
    case "toggle-credit-hours-open":
      return { ...state, creditHoursOpen: !state.creditHoursOpen };
    default:
      return state;
  }
};

const App = (): JSX.Element => {
  const initial = {
    titleSearch: "",
    category: "Any",
    creditHours: 0,
    noPrereqs: false,
    categoryOpen: false,
    creditHoursOpen: false,
  };
  const [state, dispatch] = useReducer(reducer, initial);

  const coursesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    coursesRef.current?.scrollTo(0, 0);
  }, [state.titleSearch, state.category, state.creditHours, state.noPrereqs]);

  return (
    <div>
      <Nav dispatch={dispatch} state={state} />
      <div style={styles.pageContainer} ref={coursesRef}>
        <Courses state={state} />
      </div>

      <Modal dispatch={dispatch} open={state.categoryOpen} keyword="category" />
      <Modal
        dispatch={dispatch}
        open={state.creditHoursOpen}
        keyword="credit-hours"
      />
    </div>
  );
};

export default App;
