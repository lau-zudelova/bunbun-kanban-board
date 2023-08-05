import Container from "./Components/Containter";
import { useGlobalContext } from "./GlobalContext";
import { Plus } from "@phosphor-icons/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect } from "react";

function App() {
  const { containers, addContainer } = useGlobalContext();
  const [parent] = useAutoAnimate();

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
    <>
      <div onDragStart={dragStart} onDragEnd={dragEnd}>
        <div className="w-full flex justify-center items-center select-none">
          <h1 className="relative w-fit m-10 px-32 pb-2 text-white font-bold text-5xl bg-gradient-to-b from-transparent from-50% to-violet-500/50 to-50%">
            <img
              className="absolute h-24 z-10 left-3 -top-4 pointer-events-none"
              src="/logo.svg"
            />
            {"Bunbun Board"}
          </h1>
        </div>

        <div
          ref={parent}
          className="flex flex-row w-screen flex-wrap p-8 justify-center md:justify-start"
        >
          {containers.map((container) => (
            <Container key={container.id} container={container} />
          ))}
          <button
            className="w-10 h-10 m-3 flex items-center justify-center text-white font-semibold bg-gray-850 rounded-md shadow-md hover:bg-violet-500 transition-all duration-100"
            onClick={addContainer}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
