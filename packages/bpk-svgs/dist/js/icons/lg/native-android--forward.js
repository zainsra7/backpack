import React from "react";
export default (({
  styles = {},
  ...props
}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{
  width: "1.5rem",
  height: "1.5rem"
}} {...props}><path fillRule="evenodd" d="M11.293 19.713a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.438 1.39l.024.024 5.293 5.293H5a1 1 0 0 0 0 2h11.586L11.293 18.3a1 1 0 0 0 0 1.414z" /></svg>);