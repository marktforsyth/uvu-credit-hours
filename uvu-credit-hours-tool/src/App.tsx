import { useReducer, useEffect } from "react";

import courses from "../data/courses.json";

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
};

const matchesNoPrereqs = (state: State, course: Course): boolean => {
  return course.prereqs.length === 0 || !state.noPrereqs;
};

const matchesSectionNumber = (state: State, course: Course): boolean => {
  if (state.category === "All") {
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
  if (course.creditHours.length === 1) {
    return state.creditHours === course.creditHours[0];
  }

  return (
    state.creditHours >= course.creditHours[0] &&
    state.creditHours <= course.creditHours[1]
  );
};

const filteredCourses = (state: State): Array<Course> => {
  // is there a non horrible way to do this mess?
  return courses.filter(
    (course) =>
      matchesNoPrereqs(state, course) &&
      matchesSectionNumber(state, course) &&
      matchesCreditHours(state, course),
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

const renderCourses = (filteredCourses: Array<Course>): Array<JSX.Element> => {
  return filteredCourses.map((course, c) => {
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
  });
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
    default:
      return state;
  }
};

const App = (): JSX.Element => {
  const initial = {
    titleSearch: "",
    category: "CS",
    creditHours: 3,
    noPrereqs: false,
    categoryOpen: false,
    creditHoursOpen: false,
  };
  const [state, dispatch] = useReducer(reducer, initial);

  // useEffect(() => {
  //   console.log("OH my gosh dang HEAVENS the state freaking CAHNGED!!!!!");
  // }, [state.titleSearch, state.category, state.creditHours, state.noPrereqs]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.nav}>
        <div style={styles.navItems}>
          <input
            style={styles.searchBar}
            type="text"
            placeholder="Search by title"
          ></input>
          <div style={styles.labeledNavTool}>
            Category <div style={{ ...styles.navBtn, width: "5rem" }}>ACC</div>
          </div>
          <div style={styles.labeledNavTool}>
            Credit Hours <div style={styles.navBtn}>1</div>
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
      <div style={styles.page}>{renderCourses(filteredCourses(state))}</div>
    </div>
  );
};

export default App;
