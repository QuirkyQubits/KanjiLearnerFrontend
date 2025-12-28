import { useState } from "react";
import NavBar from "./NavBar";

export default function LiveMirrorPage() {
  const [text, setText] = useState("");

  return (
    <div className="min-h-screen bg-background-light text-text flex flex-col">
      <NavBar />

      <div className="p-8 flex flex-col gap-6">
        <textarea
          className="w-full h-128 p-4 border rounded text-lg"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="p-4 border rounded bg-background">
          <pre className="whitespace-pre-wrap">{text}</pre>
        </div>
      </div>
    </div>
  );
}
