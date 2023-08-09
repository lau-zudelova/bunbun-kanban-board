import { DotsThreeVertical } from "@phosphor-icons/react";
import { useState } from "react";
import Menu from "../Modals/Menu";
import { TYPES } from "../Classes/Types";
import { useGlobalContext } from "../GlobalContext";
import CardDetail from "../Modals/CardDetail";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  function parseCheckboxes() {
    const regex = /(- \[(?: |x)\] .*)(\n|$)/g;
    const string = card.message;
    const result = string.match(regex);
    if (result === null) return null;
    return result.join("");
  }

  return (
    <div
      className={
        `Card flex flex-col hover:cursor-pointer bg-gray-800 hover:text-violet-400 h-auto rounded-md p-2 mb-4 border-t border-t-blue-200 border-opacity-10 shadow-md transition-transform ` +
        card.color
      }
      // style={{
      //   color: card.color,
      // }}
      draggable={!isEditable}
      onDragStart={drag}
      onClick={(event) => {
        if (isDetailOpen === false && !isEditable) setIsDetailOpen(true);
      }}
      data-cardid={card.id}
    >
      <div className="flex justify-between items-center pointer-events-none">
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
              <hr className="w-full h-full border border-gray-500" />
            ) : (
              <p className="w-[90%] font-semibold break-words">{card.title}</p>
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
          className="p-1 justify-self-end text-white hover:bg-gray-700 rounded-md hover:text-violet-400 transition-all duration-100 pointer-events-auto"
          onClick={(event) => {
            event.stopPropagation();
            setIsMenuOpen(true);
            getCoords();
            parseCheckboxes();
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
      {parseCheckboxes() ? (
        <>
          <hr className="border border-gray-700 my-2 pointer-events-none" />
          <ReactMarkdown
            children={parseCheckboxes()}
            remarkPlugins={[remarkGfm]}
            components={{
              input: ({ node, ...props }) => {
                return (
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const siblingContent =
                        (props.checked ? "- [x]" : "- [ ]") +
                        e.target.parentElement.textContent;
                      toggleInputCheckbox(siblingContent, props.checked);
                    }}
                    // readOnly={true}
                    checked={props.checked ? true : false}
                  />
                );
              },
            }}
            className="h-full w-full p-2 pt-0 text-white pointer-events-none"
          />
        </>
      ) : null}
    </div>
  );
}
