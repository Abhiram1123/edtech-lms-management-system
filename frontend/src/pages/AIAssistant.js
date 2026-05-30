import React, { useState } from 'react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '👋 Hi! I am your AI Study Assistant. Ask me anything about your courses!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getAIResponse = (question) => {
    const q = question.toLowerCase();
    if (q.includes('python')) return 'Python is a high-level programming language. Key concepts include: variables, data types, loops (for/while), functions, classes, modules, and file handling. Practice by building small projects!';
    if (q.includes('react')) return 'React is a JavaScript library for building UIs. Key concepts: Components, Props, State, Hooks (useState, useEffect), JSX, and Component lifecycle. Start with functional components!';
    if (q.includes('django')) return 'Django is a Python web framework. Key concepts: Models (database), Views (logic), Templates (HTML), URLs (routing), Admin panel, and REST APIs with DRF.';
    if (q.includes('javascript') || q.includes('js')) return 'JavaScript is the language of the web. Key concepts: Variables (let/const), Functions, Arrays, Objects, Promises, Async/Await, DOM manipulation, and ES6+ features.';
    if (q.includes('database') || q.includes('sql')) return 'Databases store and organize data. SQL key concepts: SELECT, INSERT, UPDATE, DELETE, JOIN, WHERE clauses, Primary keys, and Foreign keys.';
    if (q.includes('html')) return 'HTML structures web content. Key tags: div, p, h1-h6, a, img, form, input, button, table, ul/ol. Always use semantic HTML for better accessibility!';
    if (q.includes('css')) return 'CSS styles web pages. Key concepts: Selectors, Box model, Flexbox, Grid, Colors, Fonts, Animations, and Responsive design with media queries.';
    if (q.includes('algorithm')) return 'Algorithms are step-by-step problem solving methods. Key types: Sorting (bubble, merge, quick), Searching (binary, linear), and concepts like Big O notation for complexity.';
    if (q.includes('machine learning') || q.includes('ml')) return 'Machine Learning enables computers to learn from data. Key concepts: Supervised learning, Unsupervised learning, Neural networks, Training/Testing data, and common libraries like scikit-learn.';
    if (q.includes('api')) return 'APIs allow applications to communicate. Key concepts: REST APIs, HTTP methods (GET, POST, PUT, DELETE), JSON data format, Authentication (JWT, tokens), and endpoints.';
    if (q.includes('git')) return 'Git is version control for code. Key commands: git init, git add, git commit, git push, git pull, git branch, git merge. Use GitHub to host your repositories!';
    if (q.includes('hello') || q.includes('hi')) return 'Hello! I am your AI Study Assistant 🤖. Ask me about Python, React, Django, JavaScript, HTML, CSS, Databases, Algorithms, or any other tech topic!';
    if (q.includes('help')) return 'I can help you with: 📚 Python, React, Django, JavaScript, HTML/CSS, Databases, Machine Learning, APIs, Git, and more! Just ask your question!';
    return `Great question about "${question}"! Here are some study tips: 1️⃣ Break the topic into smaller parts 2️⃣ Practice with hands-on examples 3️⃣ Review regularly 4️⃣ Build a small project using this concept 5️⃣ Check documentation and tutorials online. Keep learning! 💪`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const aiText = getAIResponse(currentInput);
    setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">🤖 AI Study Assistant</h1>
      <p className="page-subtitle">Ask anything about your studies!</p>

      <div style={{marginBottom:16, display:'flex', gap:8, flexWrap:'wrap'}}>
        {['Explain Python', 'What is React?', 'How does Django work?', 'Explain APIs', 'Git commands'].map(q => (
          <button key={q} className="btn btn-outline btn-sm"
            onClick={() => { setInput(q); }}>
            {q}
          </button>
        ))}
      </div>

      <div className="card" style={{height:'500px', display:'flex', flexDirection:'column'}}>
        <div style={{flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:12}}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth:'70%', padding:'12px 16px', borderRadius:16,
                background: m.role === 'user' ? 'var(--accent)' : 'var(--surface2)',
                color: 'var(--text)', fontSize:'0.9rem', lineHeight:1.6
              }}>
                {m.role === 'assistant' && <span style={{marginRight:8}}>🤖</span>}
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{display:'flex', justifyContent:'flex-start'}}>
              <div style={{padding:'12px 16px', borderRadius:16, background:'var(--surface2)'}}>
                🤖 Thinking...
              </div>
            </div>
          )}
        </div>

        <div style={{padding:'16px', borderTop:'1px solid var(--border)', display:'flex', gap:12}}>
          <input
            className="form-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything... e.g. Explain React hooks"
            style={{flex:1}}
          />
          <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}