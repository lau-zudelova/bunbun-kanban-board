import Container from "./Components/Containter";
import { useGlobalContext } from "./GlobalContext";
import { Plus } from "@phosphor-icons/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function App() {
  const { containers, addContainer } = useGlobalContext();
  const [parent] = useAutoAnimate();

  return (
    <>
      <div>
        <div className="w-full flex justify-center">
          <h1 className="w-fit m-10 px-3 pb-2 text-white font-bold text-5xl bg-gradient-to-b from-transparent from-50% to-violet-500/50 to-50%">
            Kanban Board
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
