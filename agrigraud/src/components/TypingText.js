import React, { useEffect, useState } from "react";

export default function TypingText({ text }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplay(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 60);

    return () => clearInterval(timer);
  }, [text]);

  return <h1 className="typing">“{display}”</h1>;
}