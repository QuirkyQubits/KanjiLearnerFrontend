import { Backlogger } from "./Backlogger";
import NavBar from "./NavBar";

export default function BackloggerPage() {
  return (
    <div className="min-h-screen bg-background-light text-text flex flex-col">
      <NavBar />
      <Backlogger />
    </div>
  );
}
