// frontend/src/App.js
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./App.css";

const DEFAULT_MODEL = "Sallu-1";

function Sidebar({
  chats,
  onNew,
  onSelect,
  activeId,
  onClear,
  model,
  setModel,
  dark,
  toggleDark,
}) {
  return (
    <aside className={`sidebar ${dark ? "dark" : ""}`}>
      <div className="sb-top">
        <button className="new-chat" onClick={onNew}>+ New chat</button>
        <div className="model-row">
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="Sallu-1">Sallu-1 (fast)</option>
            <option value="Sallu-2">Sallu-2 (balanced)</option>
            <option value="Sallu-3">Sallu-3 (creative)</option>
          </select>
        </div>
      </div>

      <nav className="chat-list">
        {chats.length === 0 && <div className="empty">No chats yet</div>}
        {chats.map((c) => (
          <div
            key={c.id}
            className={`chat-item ${c.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="ci-title">{c.title || "Conversation"}</div>
            <div className="ci-meta">{new Date(c.updated).toLocaleString()}</div>
          </div>
        ))}
      </nav>

      <div className="sb-bottom">
        <button className="clear" onClick={onClear}>Clear all</button>
        <label className="dark-toggle">
          <input type="checkbox" checked={dark} onChange={toggleDark} />
          Dark
        </label>
      </div>
    </aside>
  );
}

function ChatWindow({ chat, onSend, loading, setChatTitle, dark }) {
  const [text, setText] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat, loading]);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <div className={`panel ${dark ? "dark" : ""}`}>
      <header className="panel-header">
        <div>
          <strong>{chat?.title || "New conversation"}</strong>
          <div className="sub">Sallu — {chat?.history?.length ?? 0} messages</div>
        </div>
        <div className="right">
          <input
            placeholder="Give this chat a title..."
            onBlur={(e) => setChatTitle(e.target.value)}
            className="title-input"
          />
        </div>
      </header>

      <div className="messages" ref={scrollRef}>
        {chat?.history?.map((m, idx) => (
          <div key={idx} className={`message ${m.sender === "You" ? "you" : "sallu"}`}>
            <div className="meta">
              <span className="from">{m.sender}</span>
              <span className="time">{m.ts ?? ""}</span>
            </div>

            {m.sender === "Sallu" || m.sender === "sallu" ? (
              <div className="bubble">
                <ReactMarkdown>{m.text}</ReactMarkdown>
                <div className="msg-actions">
                  <CopyToClipboard text={m.text}>
                    <button className="copy">Copy</button>
                  </CopyToClipboard>
                </div>
              </div>
            ) : (
              <div className="bubble user-bubble">{m.text}</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message sallu">
            <div className="bubble">
              <span className="typing">Sallu is typing…</span>
            </div>
          </div>
        )}
      </div>

      <form className="composer" onSubmit={submit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message and press Enter"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [chats, setChats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sallu_chats") || "[]");
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState(chats[0]?.id ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("sallu_chats", JSON.stringify(chats));
  }, [chats]);

  function newChat() {
    const nc = {
      id: Date.now().toString(),
      title: "",
      model,
      updated: Date.now(),
      history: [],
    };
    setChats((c) => [nc, ...c]);
    setActiveId(nc.id);
  }

  function selectChat(id) {
    setActiveId(id);
  }

  function clearAll() {
    if (!confirm("Clear all chats?")) return;
    setChats([]);
    setActiveId(null);
    localStorage.removeItem("sallu_chats");
  }

  function updateActive(fn) {
    setChats((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, ...fn(c) } : c))
    );
  }

  async function sendMessage(text) {
    if (!activeId) newChat();
    updateActive((c) => {
      const ns = {
        ...c,
        history: [
          ...c.history,
          { sender: "You", text, ts: new Date().toLocaleTimeString() },
        ],
        updated: Date.now(),
      };
      return ns;
    });
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: text,
        history: getActiveChat()?.history ?? [],
        model,
      });

      const reply = res?.data?.reply ?? "Sorry, no reply.";
      updateActive((c) => ({
        ...c,
        history: [
          ...c.history,
          { sender: "Sallu", text: reply, ts: new Date().toLocaleTimeString() },
        ],
        updated: Date.now(),
      }));
    } catch (err) {
      updateActive((c) => ({
        ...c,
        history: [
          ...c.history,
          {
            sender: "Sallu",
            text: "Error: could not reach backend. Try again.",
            ts: new Date().toLocaleTimeString(),
          },
        ],
        updated: Date.now(),
      }));
    } finally {
      setLoading(false);
    }
  }

  function getActiveChat() {
    return chats.find((c) => c.id === activeId) ?? null;
  }

  function setChatTitle(title) {
    if (!activeId) return;
    updateActive((c) => ({ ...c, title: title || c.title || "Conversation" }));
  }

  useEffect(() => {
    if (!activeId && chats.length > 0) setActiveId(chats[0].id);
  }, [chats, activeId]);

  // dark mode class on body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  return (
    <div className={`app-root ${dark ? "dark" : ""}`}>
      <Sidebar
        chats={chats}
        onNew={newChat}
        onSelect={selectChat}
        activeId={activeId}
        onClear={clearAll}
        model={model}
        setModel={setModel}
        dark={dark}
        toggleDark={() => setDark((d) => !d)}
      />
      <ChatWindow
        chat={getActiveChat() || { history: [], title: "" }}
        onSend={sendMessage}
        loading={loading}
        setChatTitle={setChatTitle}
        dark={dark}
      />
    </div>
  );
}
