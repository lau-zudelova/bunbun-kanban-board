import { DotsThreeVertical } from "@phosphor-icons/react";
import { useState } from "react";
import Menu from "../Modals/Menu";
import { TYPES } from "../Classes/Types";
import { useGlobalContext } from "../GlobalContext";
import CardDetail from "../Modals/CardDetail";

export default function Card({ card }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [titleInput, setTitleInput] = useState(card.title);
  const [isEditable, setIsEditable] = useState(() => {
    if (card.title === "") return true;
    else return false;
  });

  const { editCardTitle, addCard, deleteCard } = useGlobalContext();

  const getCoords = () => {
    const buttonElement = document.getElementById(card.id);
    if (buttonElement) {
      const buttonRect = buttonElement.getBoundingClientRect();
      setCoords(buttonRect);
    }
  };

  const saveTitle = (title) => {
    editCardTitle(card, title);
    setIsEditable(false);
  };

  const drag = (event) => {
    event.dataTransfer.setData(
      "text/plain",
      event.currentTarget.dataset.cardid
    );
  };

  return (
    <div
      className={`Card flex justify-between hover:cursor-pointer bg-gray-800 hover:text-violet-400 text-white h-auto rounded-md p-2 mb-4 border-t border-t-blue-200 border-opacity-10 shadow-md items-center transition-transform`}
      draggable={!isEditable}
      style={{
        color: card.color,
      }}
      onDragStart={drag}
      onClick={(event) => {
        if (isDetailOpen === false && !isEditable) setIsDetailOpen(true);
      }}
      data-cardid={card.id}
    >
      {isEditable ? (
        <input
          autoFocus
          type="text"
          className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-white font-semibold focus:outline-none focus:border-violet-400 caret-violet-400 selection:bg-violet-200 selection:text-violet-900"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              saveTitle(e.target.value);
              addCard(card.containerId);
            } else if (e.key === "Enter") {
              saveTitle(e.target.value);
            } else if (e.key === "Escape") {
              if (card.title === "") deleteCard(card);
              else {
                e.target.value = card.title;
                setTitleInput(card.title);
                setIsEditable(false);
              }
            }
          }}
        />
      ) : (
        <>
          {card.title === "---" ? (
            <hr className="w-full h-full bg-green-200 border border-gray-500" />
          ) : (
            <p className="w-[90%] pointer-events-none font-semibold cursor-pointer break-words">
              {card.title}
            </p>
          )}
        </>
      )}
      <CardDetail
        isOpen={isDetailOpen}
        close={() => setIsDetailOpen(false)}
        card={card}
      />
      <button
        id={card.id}
        className="p-1 justify-self-end text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100"
        onClick={(event) => {
          event.stopPropagation();
          setIsMenuOpen(true);
          getCoords();
        }}
      >
        <DotsThreeVertical size={18} />
      </button>
      <Menu
        isOpen={isMenuOpen}
        close={() => setIsMenuOpen(false)}
        coords={coords}
        type={TYPES.CARD}
        object={card}
        setIsEditable={setIsEditable}
      />
    </div>
  );
}
