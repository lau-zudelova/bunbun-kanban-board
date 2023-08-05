import React, { useState, useContext, useEffect } from "react";
import { CardClass } from "./Classes/Classes";
import { ContainerClass } from "./Classes/Classes";

export function replaceCharacter(string, index, replacement) {
  return (
    string.slice(0, index) +
    replacement +
    string.slice(index + replacement.length)
  );
}

const GlobalContext = React.createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const [containers, setContainers] = useState(() => {
    const storedValue = localStorage.getItem("userData");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  useEffect(() => {
    saveData();
  }, [containers]);

  function saveData() {
    localStorage.setItem("userData", JSON.stringify(containers));
  }

  function addContainer() {
    setContainers((container) => {
      return [...container, new ContainerClass("")];
    });
  }

  function deleteContainer(container) {
    const newContainers = containers.filter((item) => item.id !== container.id);
    setContainers(newContainers);
  }

  function editContainerTitle(containerId, newTitle) {
    const prevContainers = [...containers];
    const containerIndex = prevContainers.findIndex(
      (container) => container.id === containerId
    );
    prevContainers[containerIndex] = {
      ...prevContainers[containerIndex],
      title: newTitle,
    };

    setContainers(prevContainers);
  }

  function addCard(containerId) {
    const prevContainers = [...containers];
    const containerIndex = prevContainers.findIndex(
      (container) => container.id === containerId
    );

    if (containerIndex >= 0) {
      prevContainers[containerIndex] = {
        ...prevContainers[containerIndex],
        cards: [
          ...prevContainers[containerIndex].cards,
          new CardClass("", "", containerId),
        ],
      };
    }
    setContainers(prevContainers);
  }

  function deleteCard(card) {
    const prevContainers = [...containers];
    const containerIndex = prevContainers.findIndex(
      (container) => container.id === card.containerId
    );

    if (containerIndex !== -1) {
      prevContainers[containerIndex] = {
        ...prevContainers[containerIndex],
        cards: [
          ...prevContainers[containerIndex].cards.filter(
            (item) => item.id !== card.id
          ),
        ],
      };
      setContainers(prevContainers);
    }
  }

  function editCardTitle(card, newTitle) {
    const prevContainers = [...containers];
    const containerIndex = prevContainers.findIndex(
      (container) => container.id === card.containerId
    );
    if (containerIndex !== -1) {
      const cardIndex = prevContainers[containerIndex].cards.findIndex(
        (item) => item.id === card.id
      );
      prevContainers[containerIndex].cards[cardIndex] = {
        ...prevContainers[containerIndex].cards[cardIndex],
        title: newTitle,
      };
      setContainers(prevContainers);
    }
  }

  function editCardMessage(card, newMessage) {
    const prevContainers = [...containers];
    const containerIndex = prevContainers.findIndex(
      (container) => container.id === card.containerId
    );
    if (containerIndex !== -1) {
      const cardIndex = prevContainers[containerIndex].cards.findIndex(
        (item) => item.id === card.id
      );
      prevContainers[containerIndex].cards[cardIndex] = {
        ...prevContainers[containerIndex].cards[cardIndex],
        message: newMessage,
      };
      setContainers(prevContainers);
    }
  }

  function appendImage(card, img) {
    const prevContainers = [...containers];
    const containerIndex = prevContainers.findIndex(
      (container) => container.id === card.containerId
    );

    if (containerIndex !== -1) {
      const cardIndex = prevContainers[containerIndex].cards.findIndex(
        (item) => item.id === card.id
      );
      prevContainers[containerIndex].cards[cardIndex].images = [
        ...prevContainers[containerIndex].cards[cardIndex].images,
        img,
      ];
      setContainers(prevContainers);
    }
  }

  function deleteImage(card, index) {
    const prevContainers = [...containers];
    const containerIndex = prevContainers.findIndex(
      (container) => container.id === card.containerId
    );

    if (containerIndex !== -1) {
      const cardIndex = prevContainers[containerIndex].cards.findIndex(
        (item) => item.id === card.id
      );

      if (cardIndex !== -1) {
        prevContainers[containerIndex].cards[cardIndex].images.splice(index, 1);
        setContainers(prevContainers);
      }
    }
  }

  const drag = (event) => {
    event.dataTransfer.setData("text/plain", event.currentTarget.dataset.id);
  };

  const dragEnter = (event) => {
    console.log("should highlight");
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
  const drop = (event) => {};
  const allowDrop = (event) => {};

  const dragStart = (event) => {
    if (event.target.classList.contains("Card")) {
      event.target.classList.add("draggingCard");
    }
  };

  const dragEnd = (event) => {
    if (event.target.classList.contains("Card")) {
      event.target.classList.remove("draggingCard");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        containers,
        addCard,
        addContainer,
        deleteContainer,
        deleteCard,
        editContainerTitle,
        editCardTitle,
        editCardMessage,
        appendImage,
        deleteImage,
        drag,
        dragEnter,
        dragLeave,
        drop,
        allowDrop,
        dragStart,
        dragEnd,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
