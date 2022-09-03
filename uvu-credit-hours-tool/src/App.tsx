import { useReducer, useEffect } from "react";

import courses from "../data/courses.json";
import possibleSubjects from "../data/possible-subjects.json";
import possibleCreditHours from "../data/possible-credit-hours.json";

type Course = {
  sectionNumber: Array<string>;
  title: string;
  creditHours: Array<number>;
  prereqs: Array<string>;
  description: string;
};

type Styles = {
  [className: string]: {
    [style: string]: string;
  };
};

type State = {
  titleSearch: string;
  category: string;
  creditHours: number;
  noPrereqs: boolean;
  categoryOpen: boolean;
  creditHoursOpen: boolean;
};

type Action = {
  type: string;
  payload: string;
};

const styles: Styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  nav: {
    position: "fixed",
    top: "0",
    width: "100vw",
    color: "#275d38",
    padding: "1rem 0 1rem 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    BoxShadow: "0 5px 25px -2px rgba(0,0,0,0.2)",
    WebkitBoxShadow: "0 5px 25px -2px rgba(0,0,0,0.2)",
    MozBoxShadow: "0 5px 25px -2px rgba(0,0,0,0.2)",
  },
  navItems: {
    width: "70%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    letterSpacing: "1px",
  },
  searchBar: {
    borderRadius: "2rem",
    fontSize: "inherit",
    fontFamily: "inherit",
    letterSpacing: "inherit",
    border: "none",
    backgroundColor: "#eeeeee",
    padding: "1rem",
    outline: "none",
    width: "30vw",
  },
  labeledNavTool: {
    display: "flex",
    alignItems: "center",
    fontWeight: "normal",
  },
  navBtn: {
    backgroundColor: "#eeeeee",
    borderRadius: "2rem",
    cursor: "pointer",
    userSelect: "none",
    marginLeft: "0.5rem",
    height: "2rem",
    width: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "300",
  },
  checkBoxInner: {
    backgroundColor: "#275d38",
    borderRadius: "2rem",
    width: "1rem",
    height: "1rem",
  },
  page: {
    width: "60vw",
    marginTop: "6.5rem",
    display: "grid",
    gridGap: "1rem",
    gridTemplateColumns: "repeat(2, max(50%))",
  },
  course: {
    backgroundColor: "#eeeeee",
    borderRadius: "2rem",
    padding: "2rem",
    wordWrap: "break-word",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.2rem",
  },
  description: {
    fontSize: "1rem",
    lineHeight: "1.5",
    letterSpacing: "1px",
    marginTop: "1rem",
  },
  searchNotFound: {
    width: "60vw",
    height: "calc(100vh - 6rem)",
    marginTop: "6rem",
    fontSize: "1.5rem",
    textAlign: "center",
    letterSpacing: "2px",
    lineHeight: "1.5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#275d38",
  },
  modalBackground: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(200, 200, 200, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "2rem",
    padding: "2rem",
    width: "30vw",
    maxHeight: "80vh",
    overflow: "scroll",
    border: "1px solid #275d38",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gridGap: "1rem",
    scrollbarWidth: "none",
    color: "#275d38",
  },
  modalBtn: {
    backgroundColor: "#eeeeee",
    borderRadius: "2rem",
    padding: "1rem",
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
  },
};

const matchesNoPrereqs = (state: State, course: Course): boolean => {
  return course.prereqs.length === 0 || !state.noPrereqs;
};

const matchesSectionNumber = (state: State, course: Course): boolean => {
  if (state.category === "Any") {
    return true;
  }

  const courseSectionNames = course.sectionNumber.filter((part) =>
    part.match(/^[A-Z]+$/g),
  );

  return courseSectionNames.indexOf(state.category) !== -1;
};

const matchesTitle = (state: State, course: Course): boolean => {
  return (
    course.title.toUpperCase().match(state.titleSearch.toUpperCase()) !== null
  );
};

const matchesCreditHours = (state: State, course: Course): boolean => {
  if (state.creditHours === 0) {
    return true;
  }

  if (course.creditHours.length === 1) {
    return state.creditHours === course.creditHours[0];
  }

  return (
    state.creditHours >= course.creditHours[0] &&
    state.creditHours <= course.creditHours[1]
  );
};

const filteredCourses = (state: State): Array<Course> => {
  return courses.filter(
    (course) =>
      matchesNoPrereqs(state, course) &&
      matchesSectionNumber(state, course) &&
      matchesCreditHours(state, course) &&
      matchesTitle(state, course),
  );
};

const renderCreditHours = (creditHours: Array<number>) => {
  if (creditHours.length === 1) {
    return `${creditHours[0]}`;
  } else if (creditHours.length === 2) {
    return `${creditHours[0]} to ${creditHours[1]}`;
  }

  throw new Error(
    `creditHours is supposed to have length of 1 or 2, but it has a length of ${
      creditHours.length
    }. This is the array: ${JSON.stringify(creditHours)}`,
  );
};

const renderCourses = (state: State): JSX.Element => {
  const filtered = filteredCourses(state);

  if (filtered.length === 0) {
    return (
      <div style={styles.searchNotFound}>
        No courses match your search; please try again.
      </div>
    );
  }

  return (
    <div
      style={
        state.categoryOpen || state.creditHoursOpen
          ? { ...styles.page, overflow: "hidden", position: "fixed" }
          : styles.page
      }
    >
      {filtered.map((course, c) => {
        return (
          <div style={styles.course} key={`course-${c}`}>
            <div style={styles.subtitle}>{course.sectionNumber.join(" ")}</div>
            <div style={styles.title}>{course.title}</div>
            <div style={styles.subtitle}>
              {renderCreditHours(course.creditHours)} Credit Hours
            </div>
            {course.prereqs.map((prereq, p) => (
              <div style={styles.description} key={`course-${c}-prereq-${p}`}>
                {prereq}
              </div>
            ))}
            <div style={styles.description}>{course.description}</div>
          </div>
        );
      })}
    </div>
  );
};

const reducer = (state: State, action: Action): State => {
  window.scrollTo(0, 0);

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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.nav}>
        <div style={styles.navItems}>
          <input
            style={styles.searchBar}
            type="text"
            placeholder="Search by title"
            onChange={(event) => {
              dispatch({ type: "title", payload: event.target.value });
            }}
          ></input>
          <div style={styles.labeledNavTool}>
            Category
            <div
              style={{ ...styles.navBtn, width: "5rem" }}
              onClick={() =>
                dispatch({ type: "toggle-category-open", payload: "" })
              }
            >
              {state.category}
            </div>
          </div>
          <div style={styles.labeledNavTool}>
            Credit Hours
            <div
              style={styles.navBtn}
              onClick={() =>
                dispatch({ type: "toggle-credit-hours-open", payload: "" })
              }
            >
              {state.creditHours === 0 ? "A" : state.creditHours}
            </div>
          </div>
          <div style={styles.labeledNavTool}>
            No Prereqs{" "}
            <div
              style={{ ...styles.navBtn, width: "2rem" }}
              onClick={() => dispatch({ type: "no-prereqs", payload: "" })}
            >
              {state.noPrereqs ? (
                <div style={styles.checkBoxInner}></div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {renderCourses(state)}

      {state.categoryOpen ? (
        <div
          style={styles.modalBackground}
          onClick={(event) => {
            if ((event.target as HTMLElement).style.width !== "100vw") {
              return;
            }
            dispatch({ type: "toggle-category-open", payload: "" });
          }}
        >
          <div style={styles.modal}>
            <div
              style={styles.modalBtn}
              onClick={() => {
                dispatch({ type: "category", payload: "Any" });
                dispatch({ type: "toggle-category-open", payload: "" });
              }}
            >
              Any
            </div>
            {possibleSubjects.map((subject, s) => (
              <div
                style={styles.modalBtn}
                key={`subject-btn-${s}`}
                onClick={() => {
                  dispatch({ type: "category", payload: subject });
                  dispatch({ type: "toggle-category-open", payload: "" });
                }}
              >
                {subject}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {state.creditHoursOpen ? (
        <div
          style={styles.modalBackground}
          onClick={(event) => {
            if ((event.target as HTMLElement).style.width !== "100vw") {
              return;
            }
            dispatch({ type: "toggle-credit-hours-open", payload: "" });
          }}
        >
          <div style={styles.modal}>
            <div
              style={styles.modalBtn}
              onClick={() => {
                dispatch({ type: "credit-hours", payload: "0" });
                dispatch({ type: "toggle-credit-hours-open", payload: "" });
              }}
            >
              Any
            </div>
            {possibleCreditHours.map((creditHours, c) => (
              <div
                style={styles.modalBtn}
                key={`credit-hour-btn-${c}`}
                onClick={() => {
                  dispatch({
                    type: "credit-hours",
                    payload: creditHours.toString(),
                  });
                  dispatch({ type: "toggle-credit-hours-open", payload: "" });
                }}
              >
                {creditHours}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default App;
