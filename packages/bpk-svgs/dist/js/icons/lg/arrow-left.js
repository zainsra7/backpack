import React from "react";
export default (({
  styles = {},
  ...props
}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{
  width: "1.5rem",
  height: "1.5rem"
}} {...props}><path d="M16.5 17.293V6.707a1.632 1.632 0 0 0-2.701-1.296l-5.724 5.081a1.75 1.75 0 0 0-.121 2.472q.035.039.072.075l5.724 5.505a1.632 1.632 0 0 0 2.75-1.251z" /></svg>);