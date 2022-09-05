import type { Styles, State } from "../common/types";

type Props = {
  dispatch: Function;
  state: State;
};

const styles: Styles = {
  nav: {
    position: "fixed",
    top: "0",
    width: "100vw",
    height: "3rem",
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
};

const Nav = ({ dispatch, state }: Props): JSX.Element => {
  return (
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
            {state.noPrereqs ? <div style={styles.checkBoxInner}></div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
