import SinglePresentation from "@/features/ppt/SinglePresentation";
import SlidesList from "@/features/slide/SlidesList";
import OnlineUsers from "@/features/user/OnlineUsers";

export default function PresentationPage() {
  return (
    <div className="container my-10 flex-grow flex flex-col gap-5">
      <SinglePresentation />
      <div className="flex-grow grid grid-cols-7 gap-8">
        <SlidesList />
        <div className="col-span-5 p-8 border rounded-lg">
          1 Slide. Coming...
        </div>
        <OnlineUsers />
      </div>
    </div>
  );
}
