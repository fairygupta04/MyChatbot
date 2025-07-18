import { useState, useRef, useEffect } from 'react'

function App() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([
    {type : "ai", text : "Hey! How can I help you?"}, 
  ]);
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);
  
  useEffect(() => {
    chatEnd.current?.scrollIntoView({
      behavior : "smooth"
    });
  }, [message]);

  const handleSend = async () => {
    if(input.trim === "") return;

    setMessage(prev => [...prev, { type: "user", text: input }]);
    setInput("");
    setLoading(true);

    try{
      const response = await fetch("http://localhost:5000/chat" , 
      {
        method : "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body : JSON.stringify({message : input}),
      });
  
      const data = await response.json();
      
      setMessage(prev => [...prev, {type : "ai", text : data.reply}]);
    }
    catch(error){
      setMessage((prev => [...prev, {type : "ai", text : "Error in fetching data from ai"}]));
    }
    setLoading(false);
  }

  return (
    <>
      <div className='container'>
        <h1>MyChatbot</h1>
          <div className='chat-screen'>
            {message.map((msg, index) => (
              <p key={index} className={msg.type=== "user"? "userMessage" : "aiMessage"}>
                {msg.text} </p>
          ))}
            {loading && (
              <p className="ai-typing">Typing...</p>)}
            <div ref={chatEnd}></div>
          </div>
          
          <div className="input-field">
            <input type="text" className='text-input'
             value={input}
             placeholder='Ask Anything'
             onChange={(e) => setInput(e.target.value)}/>
            <button onClick={handleSend} className='send'>Send</button>
          </div>
      </div>
    </>
  )
}

export default App
