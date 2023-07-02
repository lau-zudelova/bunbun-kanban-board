import { Images, X } from "@phosphor-icons/react";
import { useGlobalContext } from "../GlobalContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const permissions = {
  "image/bmp": true,
  "image/gif": true,
  "image/png": true,
  "image/jpeg": true,
  "image/tiff": true,
};

function getType(types) {
  for (let j = 0; j < types.length; ++j) {
    const type = types[j];
    if (permissions[type]) {
      return type;
    }
  }
  return null;
}

function getItem(items) {
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    if (item) {
      const type = getType(item.types);
      if (type) {
        return item.getType(type);
      }
    }
  }
  return null;
}

function loadFile(file, callback) {
  if (window.FileReader) {
    const reader = new FileReader();
    reader.onload = function () {
      callback(reader.result, null);
    };
    reader.onerror = function () {
      callback(null, "Incorrect file.");
    };
    reader.readAsDataURL(file);
  } else {
    callback(null, "File API is not supported.");
  }
}

function readImage(callback) {
  if (navigator.clipboard) {
    const promise = navigator.clipboard.read();
    promise
      .then(function (items) {
        const promise = getItem(items);
        if (promise == null) {
          callback(null, null);
          return;
        }
        promise
          .then(function (result) {
            loadFile(result, callback);
          })
          .catch(function (error) {
            callback(null, "Reading clipboard error.");
          });
      })
      .catch(function (error) {
        callback(null, "Reading clipboard error.");
      });
  } else {
    callback(null, "Clipboard is not supported.");
  }
}

function createHash(string) {
  let hash = 0;

  if (string.length == 0) return hash;

  for (let i = 0; i < string.length; i++) {
    let char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}

export default function Gallery({ card }) {
  const [parent] = useAutoAnimate();
  const { appendImage, deleteImage } = useGlobalContext();

  function pasteImageBitmap() {
    readImage(function (data, error) {
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        appendImage(card, data);
        return;
      }
      console.log("Image bitmap is not available - copy it to clipboard.");
    });
  }

  return (
    <>
      <button
        className="flex flex-row justify-center items-center m-3 mb-0 text-white font-semibold hover:text-violet-400"
        onClick={() => {
          pasteImageBitmap();
        }}
      >
        <Images size={30} className="mr-2" /> Paste image
      </button>
      {card.images.length !== 0 && (
        <div
          ref={parent}
          className={
            "grid grid-cols-2 md:grid-cols-3 gap-4 w-full h-[150px] md:h-[300px] p-2 mt-2" +
            (card.images.length > 3 ? " overflow-y-scroll" : "")
          }
        >
          {card.images.map((image, index) => {
            return (
              <div
                key={createHash(image)}
                // key={index}
                className="flex flex-1 justify-center relative group/img hover:brightness-125 cursor-pointer transition-all duration-100"
              >
                <button
                  className="absolute right-2 top-2 opacity-0 group-hover/img:opacity-100 transition-all duration-100 text-rose-400 hover:bg-rose-200/20 rounded-md"
                  onClick={() => deleteImage(card, index)}
                >
                  <X size={25} />
                </button>
                <img
                  className="h-[80px] md:h-[165px] max-w-full rounded-lg peer"
                  src={image}
                  alt=""
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
