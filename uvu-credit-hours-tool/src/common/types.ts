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

export type { Styles, State };
