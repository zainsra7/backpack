import React from "react";
export default (({
  styles = {},
  ...props
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style={{
  width: "1.125rem",
  height: "1.125rem"
}} {...props}><path d="M21 3H3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM4.5 13.5A1.5 1.5 0 1 1 6 12a1.5 1.5 0 0 1-1.5 1.5zM12 15a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm7.5-1.5A1.5 1.5 0 1 1 21 12a1.5 1.5 0 0 1-1.5 1.5z" /></svg>);