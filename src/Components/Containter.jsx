import Card from "./Card";
import {
  DotsSixVertical,
  DotsThreeVertical,
  PlusCircle,
} from "@phosphor-icons/react";
import { useGlobalContext } from "../GlobalContext";
import Menu from "../Modals/Menu";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TYPES } from "../Classes/Types";

export default function Container({ container }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [titleInput, setTitleInput] = useState(container.title);
  const [isEditable, setIsEditable] = useState(() => {
    if (container.title === "") return true;
    else return false;
  });
  const { addCard, editContainerTitle, deleteContainer, moveCard } =
    useGlobalContext();
  const [coords, setCoords] = useState(null);
  const [parent] = useAutoAnimate();
  const [cards, setCards] = useState(container.cards);

  const getCoords = () => {
    const buttonElement = document.getElementById(container.id);
    if (buttonElement) {
      const buttonRect = buttonElement.getBoundingClientRect();
      setCoords(buttonRect);
    }
  };

  const saveTitle = (title) => {
    editContainerTitle(container.id, title);
    setIsEditable(false);
  };

  const dragEnter = (event) => {
    if (event.target.classList.contains("Container")) {
      event.target.classList.add("highlight");
    }
    if (event.target.classList.contains("Card")) {
      event.target.classList.add("highlight");
    }
  };

  const dragLeave = (event) => {
    event.target.classList.remove("highlight");
  };

  const drop = (event, newContainer) => {
    // const newContainer = event.currentTarget.dataset.container;
    const cardId = event.dataTransfer.getData("text/plain");
    const cardBelowId = event.target.dataset.cardid;

    event.target.classList.remove("highlight");

    event.preventDefault();

    moveCard(cardId, newContainer, cardBelowId);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  return (
    <div
      ref={parent}
      className="Container relative h-min w-96 p-2 m-3 rounded-md bg-gray-850 shadow-xl border-2 border-gray-850/0"
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDragOver={allowDrop}
      onDrop={(event) => drop(event, container)}
    >
      <div className="flex items-center pb-2 mb-5 border-solid border-b border-violet-500/70">
        <button className="pr-1 hover: cursor-grab">
          <DotsSixVertical color="white" size={20} />
        </button>
        {isEditable ? (
          <input
            autoFocus
            type="text"
            className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-white font-bold focus:outline-none focus:border-violet-400 caret-violet-400 selection:bg-violet-200 selection:text-violet-900"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveTitle(e.target.value);
              } else if (e.key === "Escape") {
                if (container.title === "") deleteContainer(container);
                else {
                  e.target.value = container.title;
                  setIsEditable(false);
                }
              }
            }}
          />
        ) : (
          <p className="w-full text-white font-bold">{container.title}</p>
        )}
        <button
          id={container.id}
          className="p-1 justify-self-end text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100"
          onClick={() => {
            setIsMenuOpen(true);
            getCoords();
          }}
        >
          <DotsThreeVertical size={20} />
        </button>
        <Menu
          isOpen={isMenuOpen}
          close={() => setIsMenuOpen(false)}
          coords={coords}
          type={TYPES.CONTAINER}
          object={container}
          setIsEditable={setIsEditable}
        />
      </div>

      {container.cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}

      <div className="w-full h-7 my-2 flex items-center justify-center">
        <button
          className="flex items-center justify-center h-8 w-8 text-white rounded-md hover:bg-violet-500 transition-all duration-100"
          onClick={() => addCard(container.id)}
        >
          <PlusCircle size={20} />
        </button>
      </div>
    </div>
  );
}
