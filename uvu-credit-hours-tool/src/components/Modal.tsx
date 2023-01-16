import { Styles } from "../common/types";

import mq from "../common/breakpoints";

import possibleSubjects from "../../data/possible-subjects.json";
import possibleCreditHours from "../../data/possible-credit-hours.json";

type Props = {
  dispatch: Function;
  open: boolean;
  keyword: string;
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

  const lightTheme = window.matchMedia("(prefers-color-scheme: light)").matches;

  const styles: Styles = {
    modalBackground: {
      position: "fixed",
      top: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: lightTheme
        ? "rgba(200 200 200 / 50%)"
        : "rgb(110 110 110 / 50%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: lightTheme ? "#ffffff" : "#202124",
      borderRadius: "2rem",
      padding: "2rem 1rem 2rem 2rem",
      width: "30vw",
      border: lightTheme ? "1px solid #275d38" : "none",
      color: lightTheme ? "#275d38" : "#8bc19c",

      [mq[1]]: {
        width: "60vw",
      },
      [mq[0]]: {
        width: "80vw",
      },
    },
    modalContent: {
      overflow: "auto",
      maxHeight: "80vh",
      paddingRight: "1rem",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gridGap: "1rem",

      [mq[1]]: {
        gridTemplateColumns: "1fr 1fr 1fr",
      },
    },
    modalBtn: {
      backgroundColor: lightTheme ? "#eeeeee" : "#303134",
      borderRadius: "2rem",
      padding: "1rem",
      textAlign: "center",
      cursor: "pointer",
      userSelect: "none",
    },
  };

  return (
    <div
      css={styles.modalBackground}
      onClick={(event) => {
        if (
          !(event.target as HTMLElement).innerText.startsWith(
            "Any\nACC\nAERO",
          ) &&
          !(event.target as HTMLElement).innerText.startsWith("Any\n0.5\n1")
        ) {
          return;
        }

        dispatch({ type: `toggle-${keyword}-open` });
      }}
    >
      <div css={styles.modal}>
        <div css={styles.modalContent}>
          <div
            css={styles.modalBtn}
            onClick={() => {
              dispatch({
                type: keyword,
                payload: keyword === "category" ? "Any" : 0,
              });
              dispatch({ type: `toggle-${keyword}-open` });
            }}
          >
            Any
          </div>
          {possibleItems(keyword).map((subject, s) => (
            <div
              css={styles.modalBtn}
              key={`subject-btn-${s}`}
              onClick={() => {
                dispatch({ type: keyword, payload: subject });
                dispatch({ type: `toggle-${keyword}-open` });
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
