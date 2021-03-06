import React from "react";
export default (({
  styles = {},
  ...props
}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{
  width: "1.5rem",
  height: "1.5rem"
}} {...props}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.962 6.748l-3.038 7.9a.55.55 0 0 1-.932.159.535.535 0 0 1-.082-.151l-.97-2.467a2 2 0 0 0-1.13-1.13l-2.466-.97a.535.535 0 0 1-.15-.081.55.55 0 0 1 .158-.931l7.9-3.04v.001a.55.55 0 0 1 .71.71z" /></svg>);