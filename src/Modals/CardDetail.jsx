import React, { useState } from "react";
import {
  ArrowCounterClockwise,
  CheckFat,
  NotePencil,
  XCircle,
} from "@phosphor-icons/react";
import ReactDom from "react-dom";
import { useGlobalContext } from "../GlobalContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { replaceCharacter } from "../GlobalContext";
import Gallery from "../Components/Gallery";

export default function CardDetail({ isOpen, close, card }) {
  const [isEditable, setIsEditable] = useState(() => {
    if (card.message === "") return true;
    else return false;
  });
  const [messageInput, setMessageInput] = useState(card.message);
  const [titleInput, setTitleInput] = useState(card.title);
  const { editCardMessage, editCardTitle } = useGlobalContext();

  const saveMessage = (msg) => {
    editCardMessage(card, msg);
    setIsEditable(false);
  };

  const saveTitle = (title) => {
    editCardTitle(card, title);
    setIsEditable(false);
  };

  function toggleInputCheckbox(content, isTicked) {
    let prevMessage = messageInput;
    const index = prevMessage.indexOf(content);

    if (index !== -1) {
      if (isTicked) {
        prevMessage = replaceCharacter(prevMessage, index + 3, " ");
      } else {
        prevMessage = replaceCharacter(prevMessage, index + 3, "x");
      }
    }

    saveMessage(prevMessage);
    setMessageInput(prevMessage);
  }

  if (!isOpen) return null;
  return ReactDom.createPortal(
    <>
      <div className="absolute top-0 left-0 h-screen w-screen flex items-center justify-center ">
        <div
          className="fixed top-0 left-0 z-10 w-full h-full bg-black/60 fade-in"
          onClick={() => {
            close();
            setIsEditable(false);
            setMessageInput(card.message);
          }}
        />
        <div className="flex items-center justify-center flex-col z-20 p-5 h-full md:h-3/4 w-full md:w-3/4 md:rounded-lg bg-gray-800 shadow-lg fade-in ">
          {!isEditable ? (
            <>
              <div className="w-full flex justify-end flex-row">
                <button
                  className="mr-2 text-white hover:text-violet-400"
                  onClick={() => setIsEditable(true)}
                >
                  <NotePencil size={30} />
                </button>
                <button
                  className="text-white hover:text-violet-400"
                  onClick={() => close()}
                >
                  <XCircle size={30} />
                </button>
              </div>

              <h1 className=" mx-5 mb-8 px-3 pb-2 text-center text-white font-bold text-5xl bg-gradient-to-b from-transparent from-50% to-violet-500/50 to-50%">
                {card.title}
              </h1>

              <hr className="w-full mb-5 border-2 border-gray-700" />

              <ReactMarkdown
                children={card.message}
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
                        checked={props.checked ? true : false}
                      />
                    );
                  },
                }}
                className="h-full w-full p-3 text-white selection:bg-violet-200 selection:text-violet-900"
              />
              <Gallery card={card} />
            </>
          ) : (
            <>
              <div className="w-full flex justify-end flex-row">
                <button
                  onClick={() => {
                    setIsEditable(false);
                    setMessageInput(card.message);
                    setTitleInput(card.title);
                  }}
                  className="text-white hover:text-rose-400"
                >
                  <ArrowCounterClockwise size={30} />
                </button>
                <button
                  className="mx-2 text-white hover:text-green-400"
                  onClick={() => {
                    setIsEditable(false);
                    saveMessage(messageInput);
                  }}
                >
                  <CheckFat size={30} />
                </button>
                <button
                  className="text-white hover:text-violet-400"
                  onClick={() => {
                    close();
                    setIsEditable(false);
                    setMessageInput(card.message);
                  }}
                >
                  <XCircle size={30} />
                </button>
              </div>

              <h1 className=" mx-5 mb-8 px-3 pb-2 text-center text-white font-bold text-5xl bg-gradient-to-b from-transparent from-50% to-violet-500/50 to-50%">
                {card.title}
              </h1>

              <hr className="w-full mb-5 border-2 border-gray-700" />

              <textarea
                className=" h-full w-full p-2 rounded-md bg-gray-900 border-2 border-gray-700 text-white 
                focus:outline-none focus:border-violet-400 caret-violet-400 selection:bg-violet-200 selection:text-violet-900
                resize-none"
                onChange={(e) => setMessageInput(e.target.value)}
                value={messageInput}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape" && isEditable) {
                    e.target.value = card.message;
                    setIsEditable(false);
                    setMessageInput(card.message);
                  } else if (e.key === "Enter" && e.shiftKey) {
                    saveMessage(e.target.value);
                  }
                }}
              />
              <Gallery card={card} />
            </>
          )}
        </div>
      </div>
    </>,
    document.getElementById("cardDetail")
  );
}
