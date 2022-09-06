import courses from "../../data/courses.json";
import type { State, Course } from "./types";

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

export default filteredCourses;
