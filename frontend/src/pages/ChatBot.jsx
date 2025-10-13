import React, { useState, useEffect, useRef } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [vitals, setVitals] = useState({});
  const chatEndRef = useRef(null);

  // Load latest vitals from localStorage
  useEffect(() => {
    const savedVitals = JSON.parse(localStorage.getItem("vitals"));
    if (savedVitals && savedVitals.length > 0) {
      setVitals(savedVitals[savedVitals.length - 1]); // ✅ latest vitals only
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input, time: new Date().toLocaleTimeString() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    // Add temporary typing bubble
    setMessages((prev) => [...prev, { sender: "bot", text: "⏳ Typing...", time: "" }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          vitals,
          history: updatedMessages.slice(-5), // send last 5 messages
        }),
      });

      const data = await res.json();

      // Replace typing bubble with real AI reply
      setMessages((prev) => {
        const temp = [...prev];
        temp.pop(); // remove "Typing..." bubble
        return [
          ...temp,
          { sender: "bot", text: data.reply, time: new Date().toLocaleTimeString() },
        ];
      });
    } catch (error) {
      setMessages((prev) => {
        const temp = [...prev];
        temp.pop();
        return [
          ...temp,
          {
            sender: "bot",
            text: "⚠️ Connection error. Please try again.",
            time: new Date().toLocaleTimeString(),
          },
        ];
      });
    }
  };

  const showVitals = () => {
    if (vitals && Object.keys(vitals).length > 0) {
      const msg = `🩺 Your latest vitals:\nHeart Rate: ${vitals.heartRate} bpm\nSpO₂: ${vitals.spo2}%\nBP: ${vitals.bp}\nTemp: ${vitals.temp} °C\nSteps: ${vitals.steps}`;
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: msg, time: new Date().toLocaleTimeString() },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "No vitals found. Please log your vitals first!",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">💬 HealthMate AI</h2>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-3 mb-3 h-96 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                m.sender === "user"
                  ? "bg-blue-600 text-white self-end"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{m.text}</p>
              {m.time && (
                <span className="block text-xs text-gray-400 mt-1 text-right">
                  {m.time}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your health..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {/* Quick Actions */}
      <button
        onClick={showVitals}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg mt-3 text-sm"
      >
        🩺 Show My Vitals
      </button>
    </div>
  );
}

export default ChatBot;
