import React, { useState, useContext, useEffect } from "react";
import { CardClass } from "./Classes/Classes";
import { ContainerClass } from "./Classes/Classes";
import { DIRECTIONS } from "./Classes/Directions";
import { COLORS } from "./Classes/Colors";
import { defaultData } from "./assets/DefaultData";

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
    return storedValue ? JSON.parse(storedValue) : defaultData;
  });

  useEffect(() => {
    saveData();
  }, [containers]);

  function saveData() {
    localStorage.setItem("userData", JSON.stringify(containers));
  }

  function loadData(rawData) {
    const newData = JSON.parse(rawData);
    console.log(newData);
    localStorage.setItem("userData", rawData);
    setContainers(newData);
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
          new CardClass("", "", containerId, [], COLORS.DEFAULT),
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

  function moveCard(cardId, newContainer, cardBelowId) {
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
      if (cardBelowId) {
        const cardBelowIndex = prevContainers[
          newContainerIndex
        ].cards.findIndex((card) => card.id === cardBelowId);
        prevContainers[newContainerIndex] = {
          ...prevContainers[newContainerIndex],
          cards: [
            ...prevContainers[newContainerIndex].cards.slice(0, cardBelowIndex),
            new CardClass(
              card.title,
              card.message,
              newContainer.id,
              card.images,
              card.color
            ),
            ...prevContainers[newContainerIndex].cards.slice(cardBelowIndex),
          ],
        };
      } else {
        prevContainers[newContainerIndex] = {
          ...prevContainers[newContainerIndex],
          cards: [
            ...prevContainers[newContainerIndex].cards,
            new CardClass(
              card.title,
              card.message,
              newContainer.id,
              card.images,
              card.color
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

  function moveContainer(container, direction) {
    const index = containers.findIndex((c) => c.id === container.id);

    if (index === -1) return;
    if (index === 0 && direction === DIRECTIONS.LEFT) return;
    if (index === containers.length - 1 && direction === DIRECTIONS.RIGHT)
      return;

    const swapWithIndex = direction === DIRECTIONS.LEFT ? index - 1 : index + 1;

    const tempContainer = containers[swapWithIndex];
    let prevContainers = [...containers];

    if (direction === DIRECTIONS.LEFT) {
      prevContainers = [
        ...prevContainers.slice(0, swapWithIndex),
        container,
        tempContainer,
        ...prevContainers.slice(index + 1, containers.length),
      ];
    } else {
      prevContainers = [
        ...prevContainers.slice(0, index),
        tempContainer,
        container,
        ...prevContainers.slice(swapWithIndex + 1, containers.length),
      ];
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

  function editCardColor(card, newColor) {
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
        color: newColor,
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
        moveContainer,
        editCardColor,
        loadData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
