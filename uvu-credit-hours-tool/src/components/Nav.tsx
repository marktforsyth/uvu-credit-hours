import mq from "../common/breakpoints";
import type { Styles, State } from "../common/types";

type Props = {
  dispatch: Function;
  state: State;
};

const Nav = ({ dispatch, state }: Props): JSX.Element => {
  const lightTheme = window.matchMedia("(prefers-color-scheme: light)").matches;

  const styles: Styles = {
    nav: {
      position: "fixed",
      top: "0",
      width: "100vw",
      height: "3rem",
      color: lightTheme ? "#275d38" : "#8bc19c",
      padding: "1rem 0 1rem 0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: lightTheme ? "#ffffff" : "#202124",
      BoxShadow: lightTheme ? "0 5px 25px -2px rgba(0,0,0,0.2)" : "",
      WebkitBoxShadow: lightTheme ? "0 5px 25px -2px rgba(0,0,0,0.2)" : "",
      MozBoxShadow: lightTheme ? "0 5px 25px -2px rgba(0,0,0,0.2)" : "",

      [mq[1]]: { height: "6rem" },
      [mq[0]]: { height: "9rem" },
    },
    navItems: {
      width: "70%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      letterSpacing: "1px",

      [mq[1]]: {
        flexDirection: "column",
        gap: "1rem",
        width: "calc(100% - 4rem)",
      },
    },
    searchBar: {
      borderRadius: "2rem",
      fontSize: "inherit",
      fontFamily: "inherit",
      letterSpacing: "inherit",
      border: "none",
      backgroundColor: lightTheme ? "#eeeeee" : "#303134",
      color: lightTheme ? "#000000" : "#bdc1c6",
      padding: "1rem",
      outline: "none",
      width: "100%",
    },
    labeledNavTools: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      [mq[0]]: {
        flexDirection: "column",
        gap: "1rem",
      },
    },
    dropDownTools: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    labeledNavTool: {
      display: "flex",
      alignItems: "center",
      fontWeight: "normal",
      marginLeft: "1rem",
      whiteSpace: "nowrap",
    },
    navBtn: {
      backgroundColor: lightTheme ? "#eeeeee" : "#303134",
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
      backgroundColor: lightTheme ? "#275d38" : "#8bc19c",
      borderRadius: "2rem",
      width: "1rem",
      height: "1rem",
    },
  };

  return (
    <div css={styles.nav}>
      <div css={styles.navItems}>
        <input
          css={styles.searchBar}
          type="text"
          placeholder="Search by title"
          onChange={(event) => {
            dispatch({ type: "title", payload: event.target.value });
          }}
        ></input>
        <div css={styles.labeledNavTools}>
          <div css={styles.dropDownTools}>
            <div css={styles.labeledNavTool}>
              Category
              <div
                css={{ ...styles.navBtn, width: "5rem" }}
                onClick={() => dispatch({ type: "toggle-category-open" })}
              >
                {state.category}
              </div>
            </div>
            <div css={styles.labeledNavTool}>
              Credit Hours
              <div
                css={styles.navBtn}
                onClick={() => dispatch({ type: "toggle-credit-hours-open" })}
              >
                {state.creditHours === 0 ? "A" : state.creditHours}
              </div>
            </div>
          </div>
          <div css={styles.labeledNavTool}>
            No Prereqs
            <div
              css={{ ...styles.navBtn, width: "2rem" }}
              onClick={() => dispatch({ type: "no-prereqs" })}
            >
              {state.noPrereqs ? <div css={styles.checkBoxInner}></div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
