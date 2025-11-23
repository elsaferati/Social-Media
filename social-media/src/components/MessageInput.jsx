import React, { useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="border-t border-[var(--border-color)] p-3 flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2 rounded-full border border-[var(--border-color)] focus:outline-none"
      />
      <button onClick={handleSend} className="btn-primary px-4">
        Send
      </button>
    </div>
  );
}

export default MessageInput;
