import { Styles } from "../common/types";

import possibleSubjects from "../../data/possible-subjects.json";
import possibleCreditHours from "../../data/possible-credit-hours.json";

type Props = {
  dispatch: Function;
  open: boolean;
  keyword: string;
};

const styles: Styles = {
  modalBackground: {
    position: "fixed",
    top: "0",
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
    padding: "2rem 1rem 2rem 2rem",
    width: "30vw",
    border: "1px solid #275d38",
    color: "#275d38",
  },
  modalContent: {
    overflow: "scroll",
    maxHeight: "80vh",
    paddingRight: "1rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gridGap: "1rem",
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

const possibleItems = (keyword: string): Array<string | number> => {
  if (keyword === "category") {
    return possibleSubjects;
  } else if (keyword === "credit-hours") {
    return possibleCreditHours;
  }

  throw Error(
    "Possible items needs to be 'category' or 'credit-hours', instead it's " +
      keyword,
  );
};

const Modal = ({ dispatch, open, keyword }: Props): JSX.Element => {
  if (!open) return <div></div>;

  return (
    <div
      style={styles.modalBackground}
      onClick={(event) => {
        if ((event.target as HTMLElement).style.width !== "100vw") {
          return;
        }
        dispatch({ type: `toggle-${keyword}-open`, payload: "" });
      }}
    >
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div
            style={styles.modalBtn}
            onClick={() => {
              dispatch({
                type: keyword,
                payload: keyword === "category" ? "Any" : "0",
              });
              dispatch({ type: `toggle-${keyword}-open`, payload: "" });
            }}
          >
            Any
          </div>
          {possibleItems(keyword).map((subject, s) => (
            <div
              style={styles.modalBtn}
              key={`subject-btn-${s}`}
              onClick={() => {
                dispatch({ type: keyword, payload: subject });
                dispatch({ type: `toggle-${keyword}-open`, payload: "" });
              }}
            >
              {subject}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
