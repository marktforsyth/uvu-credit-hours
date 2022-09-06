import { css } from "@emotion/react";

import filteredCourses from "../common/filtered-courses";
import type { Styles, State, Course } from "../common/types";

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

const visibleCourses = (state: State): Array<Course> => {
  const filtered = filteredCourses(state);
  console.log(state.howManyCourses);
  return filtered.filter((_course, c) => c <= state.howManyCourses);
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
  const visible = visibleCourses(state);

  if (visible.length === 0) {
    return (
      <div css={css(styles.searchNotFound)}>
        No courses match your search; please try again.
      </div>
    );
  }

  return (
    <div css={css(styles.page)}>
      {visible.map((course, c) => {
        return (
          <div css={css(styles.course)} key={`course-${c}`}>
            <div css={css(styles.subtitle)}>
              {course.sectionNumber.join(" ")}
            </div>
            <div css={css(styles.title)}>{course.title}</div>
            <div css={css(styles.subtitle)}>
              {renderCreditHours(course.creditHours)} Credit Hours
            </div>
            {course.prereqs.map((prereq, p) => (
              <div
                css={css(styles.description)}
                key={`course-${c}-prereq-${p}`}
              >
                {prereq}
              </div>
            ))}
            <div css={css(styles.description)}>{course.description}</div>
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
