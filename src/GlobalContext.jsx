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
          new CardClass("", "", containerId, []),
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

  function moveCard(cardId, newContainer, cardAboveId) {
    // arr.splice(index, 0, item)
    const card = getCardById(cardId);
    const prevContainers = [...containers];
    const oldContainerIndex = prevContainers.findIndex(
      (container) => container.id === card.containerId
    );
    const newContainerIndex = prevContainers.findIndex(
      (container) => container.id === newContainer.id
    );

    if (oldContainerIndex !== -1 && newContainerIndex !== -1) {
      // Add to a new container
      if (cardAboveId) {
        const cardAboveIndex = prevContainers[
          newContainerIndex
        ].cards.findIndex((card) => card.id === cardAboveId);
        prevContainers[newContainerIndex] = {
          ...prevContainers[newContainerIndex],
          cards: [
            ...prevContainers[newContainerIndex].cards.slice(
              0,
              cardAboveIndex + 1
            ),
            new CardClass(
              card.title,
              card.message,
              newContainer.id,
              card.images
            ),
            ...prevContainers[newContainerIndex].cards.slice(
              cardAboveIndex + 1
            ),
          ],
        };
        console.log(prevContainers[newContainerIndex]);
      } else {
        prevContainers[newContainerIndex] = {
          ...prevContainers[newContainerIndex],
          cards: [
            ...prevContainers[newContainerIndex].cards,
            new CardClass(
              card.title,
              card.message,
              newContainer.id,
              card.images
            ),
          ],
        };
      }

      // Remove from the old one
      prevContainers[oldContainerIndex] = {
        ...prevContainers[oldContainerIndex],
        cards: [
          ...prevContainers[oldContainerIndex].cards.filter(
            (item) => item.id !== card.id
          ),
        ],
      };
    }
    setContainers(prevContainers);
  }

  function getCardById(id) {
    for (const container of containers) {
      for (const card of container.cards) {
        if (card.id == id) return card;
      }
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
        moveCard,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
