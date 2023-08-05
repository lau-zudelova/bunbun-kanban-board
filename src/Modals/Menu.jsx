import React from "react";
import { FileX, Pencil, Trash } from "@phosphor-icons/react";
import ReactDom from "react-dom";
import { useGlobalContext } from "../GlobalContext";
import { TYPES } from "../Classes/Types";

export default function Menu({
  isOpen,
  close,
  coords,
  type,
  object,
  setIsEditable,
}) {
  const { deleteContainer, deleteCard } = useGlobalContext();

  if (!isOpen) return null;
  return ReactDom.createPortal(
    <>
      <div
        className="fixed top-0 left-0 z-10 w-full h-full"
        onClick={() => {
          close();
        }}
      />
      <div
        className="absolute flex items-center justify-center flex-col z-20 p-1 rounded-md bg-gray-775 shadow-md fade-in"
        style={{ left: coords.x - 95, top: coords.y }}
      >
        <button
          className="flex items-center p-1 m-1 w-full text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100"
          onClick={(event) => {
            event.stopPropagation();
            setIsEditable(true);
            close();
          }}
        >
          <Pencil size={23} className="pr-1" />
          Edit
        </button>
        <button
          className="flex items-center p-1 m-1 w-full text-white hover:bg-rose-200/20 rounded-md hover:text-rose-400 transition-all duration-100"
          onClick={(event) => {
            event.stopPropagation();
            type === TYPES.CONTAINER
              ? deleteContainer(object)
              : deleteCard(object);
          }}
        >
          <Trash size={23} className="pr-1" />
          Delete
        </button>
      </div>
    </>,
    document.getElementById("menuPortal")
  );
}
