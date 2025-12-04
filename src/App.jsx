import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function App() {
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    socket.on("onlineUsers", (list) => setOnline(list));
  }, []);

  const sendBlock = (target) => {
    if (!selectedBlock) return;
    socket.emit("shareBlock", { to: target, block: selectedBlock });
    alert("Đã gửi block!");
  };

  return (
    <div className="text-white p-6 flex flex-col items-center gap-6">
      {!ready ? (
        <div className="flex flex-col items-center gap-4 p-6 bg-slate-800 rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold">Nhập tên người chơi</h1>
          <input
            className="p-2 rounded bg-slate-700"
            placeholder="Tên..."
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => {
              socket.emit("setName", name);
              setReady(true);
            }}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            Bắt đầu
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg flex flex-col gap-4">
          <h2 className="text-xl font-bold">Chọn block</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((b) => (
              <div
                key={b}
                onClick={() => setSelectedBlock(b)}
                className={`p-6 bg-slate-700 rounded-xl cursor-pointer hover:scale-105 transition shadow ${
                  selectedBlock === b ? "ring-4 ring-blue-500" : ""
                }`}
              >
                Block {b}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mt-4">Người chơi online</h2>
          <div className="flex flex-col gap-2">
            {online
              .filter((u) => u !== name)
              .map((u) => (
                <button
                  key={u}
                  onClick={() => sendBlock(u)}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
                >
                  Gửi cho {u}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
