import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";

const MessagesPage = () => {
  return (
    <div className="messages-page flex h-full p-4">
      <ChatWindow />
    </div>
  );
};

export default MessagesPage;
