"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { generateChatResponse, getTokensByUserId, reduceTokensByUserId } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";

function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId } = useAuth();

  const { mutate, isPending, data } = useMutation({
    mutationFn: async (query) => {
      // console.log("[Chat.jsx]: Mutation function called", query);
      const currentTokens = await getTokensByUserId(userId);
      if (currentTokens.tokens < 100) {
        toast.error("You don't have enough tokens to ask a question.");
        return null;
      }
      const response = await generateChatResponse([...messages, query]);
      if (!response) {
        toast.error("Somrthing went wrong");
        return null;
      }
      setMessages((prev) => [...prev, response.message]);
      // console.log("[Chat.jsx]: After mutate. Value of message \n", messages);
      // console.log("[Chat.jsx]: After mutate. Value of response \n", response);
      const newTokens = await reduceTokensByUserId(userId, response.tokens);
      toast.success(`You have ${newTokens.tokens} tokens left.`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = { role: "user", content: text };
    // console.log("[Chat.jsx]: Before mutate. Value of query \n", query);
    setMessages((prev) => [...prev, query]);
    mutate(query);
    setText("");
  };

  console.log("Chat.jsx: ", messages);
  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
      <div>
        {messages.map(({ role, content }, index) => {
          const avatar = role == "user" ? "👤" : "🤖";
          const bcg = role == "user" ? "bg-base-200" : "bg-base-100";

          return (
            <div
              key={index}
              className={` ${bcg} flex py-6 -mx-8 px-8
                   text-xl leading-loose border-b border-base-300`}
            >
              <span className="mr-4 ">{avatar}</span>
              <p className="max-w-3xl">{content}</p>
            </div>
          );
        })}
        {isPending && <span className="loading"></span>}
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Message GeniusGPT"
            className="input input-bordered join-item w-full"
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-primary join-item" type="submit" disabled={isPending}>
            {isPending ? "please wait.." : "ask question"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
