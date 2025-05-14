"use client";
import React, { FormEvent, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const ChatStream = () => {
  const [entries, setEntries] = useState<
    { question: string; answer: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [_, setRenderTrigger] = useState(0);
  const currentAnswerRef = useRef("");
  const currentQuestionRef = useRef("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isStreaming) return;

    currentQuestionRef.current = inputText.trim();
    currentAnswerRef.current = "";
    setInputText("");
    setIsStreaming(true);

    const ctrl = new AbortController();

    await fetchEventSource("http://localhost:5090/Chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Content: currentQuestionRef.current,
      }),
      signal: ctrl.signal,
      onmessage(event) {
        const data = JSON.parse(event.data);
        currentAnswerRef.current += data.Content;
        setRenderTrigger((prev) => prev + 1);
        // setResponseText((prev) => prev + data.Content);
      },
    });

    setEntries((prev) => [
      ...prev,
      {
        question: currentQuestionRef.current,
        answer: currentAnswerRef.current,
      },
    ]);

    setIsStreaming(false);
  };

  return (
    <div className="p-4 flex flex-col justify-between flex-1 w-full max-w-240 mx-auto">
      <div>
        {entries.map((entry, i) => (
          <ChatEntry key={i} question={entry.question} answer={entry.answer} />
        ))}

        {isStreaming && (
          <ChatEntry
            question={currentQuestionRef.current}
            answer={currentAnswerRef.current || "..."}
          />
        )}
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="textarea"
          className="p-2 border rounded w-full mb-4"
          disabled={isStreaming}
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
        />
        <button
          type="submit"
          disabled={isStreaming}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send message
        </button>
      </form>
    </div>
  );
};

const ChatEntry = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <div className="mb-6 p-4 bg-white rounded shadow w-full">
    <p className="font-semibold text-gray-700 mb-2 text-end">{question}</p>
    <pre className="bg-gray-100 p-3 rounded text-sm text-black whitespace-pre-wrap">
      {answer}
    </pre>
  </div>
);

export default ChatStream;
