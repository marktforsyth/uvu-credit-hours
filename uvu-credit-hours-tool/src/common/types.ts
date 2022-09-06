type Styles = {
  [className: string]: {
    [style: string]: string | { [style: string]: string };
  };
};

type State = {
  titleSearch: string;
  category: string;
  creditHours: number;
  noPrereqs: boolean;
  categoryOpen: boolean;
  creditHoursOpen: boolean;
  howManyCourses: number;
};

type Course = {
  sectionNumber: Array<string>;
  title: string;
  creditHours: Array<number>;
  prereqs: Array<string>;
  description: string;
};

export type { Styles, State, Course };
