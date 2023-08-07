import { DownloadSimple, GithubLogo, Export } from "@phosphor-icons/react";
import React from "react";
import ReactDom from "react-dom";

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
        <button className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100">
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
