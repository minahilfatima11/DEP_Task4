import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    const message = reader.result;
                    setMessages(prevMessages => [...prevMessages, message]);
                };
                reader.readAsText(event.data);
            } else {
                const message = event.data;
                setMessages(prevMessages => [...prevMessages, message]);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (input) {
            ws.current.send(input);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">Mini ChatBox </div>
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <div className="message-text">{message}</div>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    className="input-field"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
