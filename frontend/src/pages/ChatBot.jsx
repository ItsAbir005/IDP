import React, { useState, useEffect, useRef } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [vitals, setVitals] = useState({});
  const chatEndRef = useRef(null);

  // Load vitals from localStorage
  useEffect(() => {
    const savedVitals = JSON.parse(localStorage.getItem("vitals"));
    if (savedVitals) setVitals(savedVitals);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, vitals }),
      });
      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Connection error. Please try again." },
      ]);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">💬 HealthMate AI</h2>

      <div className="flex-1 overflow-y-auto border rounded-lg p-3 mb-3 h-96 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`my-2 ${m.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                m.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your health..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
