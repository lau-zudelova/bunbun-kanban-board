import { DownloadSimple, GithubLogo, Export } from "@phosphor-icons/react";
import React from "react";
import ReactDom from "react-dom";

function download(filename) {
  const data = localStorage.getItem("userData");
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default function Settings({ close, isOpen, coords }) {
  if (!isOpen) return null;
  return ReactDom.createPortal(
    <>
      <div
        className="fixed top-0 left-0 z-10 w-full h-full"
        onClick={(event) => {
          event.stopPropagation();
          close();
        }}
      />
      <div
        className="absolute flex items-center justify-center flex-col z-20 p-2 rounded-md bg-gray-775 shadow-md fade-in"
        style={{ left: coords.x - 70, top: coords.y + 43 }}
      >
        <button className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100">
          <DownloadSimple size={23} className="pr-1" />
          Import
        </button>
        <button
          className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100"
          onClick={() => {
            const date = new Date();
            download(
              `kanbanData-${date.getDate()}-${
                date.getMonth() + 1
              }-${date.getFullYear()}-at-${date.getHours()}-${date.getMinutes()}.txt`
            );
          }}
        >
          <Export size={23} className="pr-1" />
          Export
        </button>
        <button className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100">
          <GithubLogo size={23} className="pr-1" />
          Github
        </button>
      </div>
    </>,
    document.getElementById("portal")
  );
}
