import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import rough from "roughjs/bundled/rough.esm";
import socket from "./socket";

const generator = rough.generator();

const createElement = (
  id: any,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tool: Tool
) => {
  let roughElement: any;

  switch (tool) {
    case "rectangle":
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
      break;
    case "line":
      roughElement = generator.line(x1, y1, x2, y2);
      break;
    default:
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  }

  return { id, x1, y1, x2, y2, tool, roughElement };
};

const isWithinElement = (x: number, y: number, el: any) => {
  const { tool, x1, x2, y1, y2 } = el;

  if (tool === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  } else if (tool === "line") {
    const distance =
      Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
      Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    return distance < 5;
  }
  return false;
};

const getElementAtPosition = (x: number, y: number, objects: any) => {
  return objects
    .map((el: any) => ({ ...el, position: isWithinElement(x, y, el) }))
    .find((el: any) => el.position);
};

export type Tool = "rectangle" | "line" | "selection";
export type Action = "none" | "drawing" | "moving";

export default function Presentation({
  handleGetPresentation,
  handleAddSlide,
  handleAddObject,
}: {
  handleGetPresentation: (presentationId: string) => void;
  handleAddSlide: (presentationId: string) => void;
  handleAddObject: (
    presentationId: string,
    slideId: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tool: Tool,
    roughElement: any
  ) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [presentation, setPresentation] = useState(
    location.state?.presentation
  );
  const nickname = localStorage.getItem("nickname");

  const sortedSlides = useMemo(
    () => presentation?.slides.sort((a: any, b: any) => a.order - b.order),
    [presentation]
  );
  const [currentSlide, setCurrentSlide] = useState(sortedSlides?.[0]);

  const [objects, setObjects] = useState(currentSlide?.objects || []);
  const [action, setAction] = useState<Action>("none");
  const [tool, setTool] = useState<Tool>("rectangle");
  const [selectedElement, setSelectedElement] = useState<any>(null);

  useEffect(() => {
    if (id) {
      handleGetPresentation(id);
    } else {
      navigate("/enter");
    }
  }, [id, navigate, handleGetPresentation]);

  useEffect(() => {
    setObjects(currentSlide?.objects || []);
  }, [currentSlide]);

  useEffect(() => {
    socket.on("slideAdded", (data) => {
      if (data.success) {
        setPresentation(data.presentation);
        setCurrentSlide(
          data.presentation.slides.find(
            (slide: any) => slide._id === currentSlide._id
          )
        );
      } else {
        console.error("Error adding slide:", data.error);
      }
    });

    socket.on("objectAdded", (data) => {
      if (data.success) {
        setPresentation(data.presentation);
        setCurrentSlide(
          data.presentation.slides.find(
            (slide: any) => slide._id === currentSlide._id
          )
        );
      } else {
        console.error("Error adding object:", data.error);
      }
    });

    return () => {
      socket.off("slideAdded");
      socket.off("objectAdded");
    };
  }, [currentSlide]);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    objects?.forEach((el: any) => roughCanvas.draw(el.roughElement));
  }, [objects]);

  const getRelativeCoordinates = (e: React.MouseEvent) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const updateElement = useCallback(
    (id: number, x1: number, y1: number, x2: number, y2: number) => {
      setObjects((prevObjects: any) => {
        const objectsCopy = [...prevObjects];
        const index = objectsCopy.findIndex((el) => el.id === id);
        if (index !== -1) {
          objectsCopy[index] = createElement(
            id,
            x1,
            y1,
            x2,
            y2,
            objectsCopy[index].tool
          );
        }
        return objectsCopy;
      });
    },
    []
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getRelativeCoordinates(e);

    if (tool === "selection") {
      const el = getElementAtPosition(x, y, objects);
      console.log("Selected Element:", el);

      if (el) {
        const offsetX = x - el.x1;
        const offsetY = y - el.y1;
        setSelectedElement({ ...el, offsetX, offsetY });
        setAction("moving");
      }
    } else {
      const id = objects.length + 1;
      setAction("drawing");
      const el = createElement(id, x, y, x, y, tool);
      setObjects((p: any) => [...p, el]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getRelativeCoordinates(e);

    if (action === "drawing") {
      const index = objects.length - 1;
      const el = objects[index];
      updateElement(el.id, el.x1, el.y1, x, y);
    } else if (action === "moving" && selectedElement) {
      const { id, x1, x2, y1, y2, offsetX, offsetY } = selectedElement;

      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = x - offsetX;
      const newY1 = y - offsetY;
      updateElement(id, newX1, newY1, newX1 + width, newY1 + height);
    }
  };

  const handleMouseUp = () => {
    if (action === "drawing") {
      const newObject = objects[objects.length - 1];
      handleAddObject(
        id as string,
        currentSlide._id,
        newObject.x1,
        newObject.y1,
        newObject.x2,
        newObject.y2,
        newObject.tool,
        newObject.roughElement
      );
    }
    setAction("none");
    setSelectedElement(null);
  };

  return (
    <main className="container h-screen w-full flex flex-col gap-5">
      <div className="w-full py-5 border-b bg-sky-50 flex items-center justify-between">
        <h3>Tools</h3>
        <div className="flex items-center gap-2">
          <button
            className={`${tool === "selection" && "bg-green-500 text-white"}`}
            onClick={() => setTool("selection")}
          >
            Selection
          </button>
          <button
            className={`${tool === "rectangle" && "bg-green-500 text-white"}`}
            onClick={() => setTool("rectangle")}
          >
            Rectangle
          </button>
          <button
            className={`${tool === "line" && "bg-green-500 text-white"}`}
            onClick={() => setTool("line")}
          >
            Line
          </button>
        </div>
        <button onClick={() => localStorage.clear()}>Leave</button>
      </div>
      <div className="w-full h-full grid grid-cols-5 gap-5">
        <div className="px-2 col-span-1 border-r bg-sky-50 flex flex-col gap-2">
          <h3>Slides</h3>
          {sortedSlides?.map((slide: any) => (
            <button key={slide._id} onClick={() => setCurrentSlide(slide)}>
              {slide.order}
            </button>
          ))}
          {nickname === presentation?.creator_nickname && (
            <button onClick={() => handleAddSlide(id as string)}>
              Add Slide
            </button>
          )}
        </div>
        <div className="px-2 col-span-3 bg-sky-50 flex flex-col items-center justify-start gap-5 py-5 relative">
          <span className="self-start">Slide: {currentSlide?.order}</span>
          <canvas
            id="canvas"
            width={800}
            height={600}
            className="bg-white"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
        {nickname === presentation?.creator_nickname && (
          <div className="px-2 col-span-1 border-l bg-sky-50">
            <h3>Users</h3>
            <div>
              {presentation?.users.map((user: any) => (
                <div key={user._id}>
                  {user.nickname} | {user.role}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
