import React from "react";
import ReactDom from "react-dom";

export default function Settings(close) {
  return ReactDom.createPortal(
    <>
      <div>
        <p>cau</p>
      </div>
    </>,
    document.getElementById("portal")
  );
}
