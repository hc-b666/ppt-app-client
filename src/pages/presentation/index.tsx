import SinglePresentation from "@/features/ppt/SinglePresentation";
import OnlineUsers from "@/features/user/OnlineUsers";

export default function PresentationPage() {
  return (
    <div className="container my-10 flex-grow flex flex-col gap-5">
      <SinglePresentation />
      <div className="flex-grow grid grid-cols-7 gap-8">
        <div className="col-span-1 flex flex-col gap-3">
          {[1, 2, 3].map((slide) => (
            <div className="p-4 border rounded-md h-32" key={slide}>
              {slide}
            </div>
          ))}
        </div>
        <div className="col-span-5 p-8 border rounded-lg">
          1 Slide. Coming...
        </div>
        <OnlineUsers />
      </div>
    </div>
  );
}
