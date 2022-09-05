import courses from "../../data/courses.json";

import { Styles, State } from "../common/types";

type Course = {
  sectionNumber: Array<string>;
  title: string;
  creditHours: Array<number>;
  prereqs: Array<string>;
  description: string;
};

type Props = {
  state: State;
};

const styles: Styles = {
  page: {
    width: "60vw",
    margin: "1rem 0 1rem 0",
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
    fontSize: "1.5rem",
    textAlign: "center",
    letterSpacing: "2px",
    lineHeight: "1.5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#275d38",
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

const visibleCourses = (courses: Array<Course>): Array<Course> => {
  return courses;
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
  const visible = visibleCourses(filtered);

  if (visible.length === 0) {
    return (
      <div style={styles.searchNotFound}>
        No courses match your search; please try again.
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {visible.map((course, c) => {
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

const Courses = ({ state }: Props): JSX.Element => {
  return <div>{renderCourses(state)}</div>;
};

export default Courses;
