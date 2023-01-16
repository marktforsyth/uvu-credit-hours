import { useEffect, useReducer, useRef } from "react";

import Nav from "./components/Nav";
import Courses from "./components/Courses";
import Modal from "./components/Modal";

import mq from "./common/breakpoints";
import filteredCourses from "./common/filtered-courses";
import type { Styles, State } from "./common/types";

type Action = {
  type: string;
  payload?: string | number;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "title":
      if (typeof action.payload === "string")
        return { ...state, titleSearch: action.payload };
    case "category":
      if (typeof action.payload === "string")
        return { ...state, category: action.payload };
    case "credit-hours":
      if (typeof action.payload === "number")
        return { ...state, creditHours: action.payload };
    case "no-prereqs":
      return { ...state, noPrereqs: !state.noPrereqs };
    case "toggle-category-open":
      return { ...state, categoryOpen: !state.categoryOpen };
    case "toggle-credit-hours-open":
      return { ...state, creditHoursOpen: !state.creditHoursOpen };
    case "more-courses":
      const filtered = filteredCourses(state);

      if (state.howManyCourses + 20 < filtered.length) {
        return { ...state, howManyCourses: state.howManyCourses + 20 };
      }

      if (state.howManyCourses === filtered.length - 1) return state;

      return { ...state, howManyCourses: filtered.length };
    case "reset-how-many-courses":
      return { ...state, howManyCourses: 21 };
    default:
      return state;
  }
};

const App = (): JSX.Element => {
  const lightTheme = window.matchMedia("(prefers-color-scheme: light)").matches;

  const styles: Styles = {
    pageContainer: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: lightTheme ? "#ffffff" : "#202124",
      width: "100%",
      marginTop: "5rem",
      overflow: "scroll",
      overflowX: "hidden",
      height: "calc(100vh - 5rem)",

      [mq[1]]: { marginTop: "8rem", height: "calc(100vh - 8rem)" },
      [mq[0]]: { marginTop: "11rem", height: "calc(100vh - 11rem)" },
    },
  };

  const initial = {
    titleSearch: "",
    category: "Any",
    creditHours: 0,
    noPrereqs: false,
    categoryOpen: false,
    creditHoursOpen: false,
    howManyCourses: 21,
  };
  const [state, dispatch] = useReducer(reducer, initial);

  const coursesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!coursesRef.current) return;

      if (
        coursesRef.current.scrollTop + coursesRef.current.clientHeight >=
        coursesRef.current.scrollHeight
      ) {
        dispatch({ type: "more-courses" });
      }
    };

    coursesRef.current?.addEventListener("scroll", handleScroll);

    return () =>
      coursesRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    coursesRef.current?.scrollTo(0, 0);
    dispatch({ type: "reset-how-many-courses" });
  }, [state.titleSearch, state.category, state.creditHours, state.noPrereqs]);

  return (
    <div>
      <Nav dispatch={dispatch} state={state} />
      <div css={styles.pageContainer} ref={coursesRef}>
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
