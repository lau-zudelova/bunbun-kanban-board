import { DownloadSimple, GithubLogo, Export } from "@phosphor-icons/react";
import React from "react";
import ReactDom from "react-dom";
import { useGlobalContext } from "../GlobalContext";

export default function Settings({ close, isOpen, coords }) {
  const { loadData } = useGlobalContext();

  function exportData() {
    const data = localStorage.getItem("userData");
    const date = new Date();
    const fileName = `kanbanData-${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}-at-${date.getHours()}-${date.getMinutes()}.txt`;

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(data)
    );
    element.setAttribute("download", fileName);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function importData(e) {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result;
      loadData(content);
    };
    fileReader.readAsText(e.target.files[0]);
  }

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
        <label
          id="file-upload"
          className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100 hover:cursor-pointer"
        >
          <input type="file" accept=".txt" onChange={(e) => importData(e)} />
          <DownloadSimple size={23} className="pr-1" />
          Import
        </label>

        <button
          className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100"
          onClick={() => {
            exportData();
          }}
        >
          <Export size={23} className="pr-1" />
          Export
        </button>
        <a
          className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100"
          href="https://github.com/lau-zudelova/bunbun-kanban-board"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubLogo size={23} className="pr-1" />
          Github
        </a>
      </div>
    </>,
    document.getElementById("portal")
  );
}
