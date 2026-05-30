import React, { useState } from 'react';

export default function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('notes');

  const generateContent = (topic, type) => {
    const t = topic.toLowerCase();
    const contents = {
      python: {
        notes: `📝 Python Study Notes\n\n🔹 What is Python?\nPython is a high-level, interpreted programming language known for simplicity.\n\n🔹 Key Concepts:\n• Variables: x = 5, name = "John"\n• Data Types: int, float, str, list, dict, tuple\n• Loops: for i in range(10), while condition\n• Functions: def my_function(params)\n• Classes: class MyClass:\n• Modules: import math, import os\n\n🔹 Example:\ndef greet(name):\n    return f"Hello, {name}!"\nprint(greet("World"))\n\n✅ Summary: Python is beginner-friendly and used in web dev, AI, data science!`,
        quiz: `❓ Python Quiz Questions\n\n1. What is the output of print(type(5))?\n   a) int  b) str  c) float  ✅ Answer: a) int\n\n2. Which keyword defines a function?\n   a) func  b) def  c) function  ✅ Answer: b) def\n\n3. What does len("Hello") return?\n   a) 4  b) 5  c) 6  ✅ Answer: b) 5\n\n4. Which is correct list syntax?\n   a) (1,2,3)  b) {1,2,3}  c) [1,2,3]  ✅ Answer: c) [1,2,3]\n\n5. What is used for comments in Python?\n   a) //  b) /* */  c) #  ✅ Answer: c) #`,
        lesson: `📖 Python Lesson Plan\n\nWeek 1: Basics\n• Day 1: Variables and Data Types\n• Day 2: Input/Output operations\n• Day 3: Operators and Expressions\n• Day 4: String manipulation\n• Day 5: Practice exercises\n\nWeek 2: Control Flow\n• Day 1: If/else statements\n• Day 2: For loops\n• Day 3: While loops\n• Day 4: Break and continue\n• Day 5: Mini project\n\nWeek 3: Functions & Modules\n• Day 1: Defining functions\n• Day 2: Parameters and return values\n• Day 3: Built-in modules\n• Day 4: Creating modules\n• Day 5: Project work`
      },
      react: {
        notes: `📝 React Study Notes\n\n🔹 What is React?\nReact is a JavaScript library for building user interfaces.\n\n🔹 Key Concepts:\n• Components: Building blocks of React apps\n• Props: Data passed to components\n• State: Dynamic data within components\n• Hooks: useState, useEffect, useContext\n• JSX: HTML-like syntax in JavaScript\n\n🔹 Example:\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count+1)}>{count}</button>\n}\n\n✅ Summary: React makes building interactive UIs simple and efficient!`,
        quiz: `❓ React Quiz Questions\n\n1. What hook manages state in React?\n   a) useData  b) useState  c) useStore  ✅ Answer: b) useState\n\n2. What does JSX stand for?\n   a) JavaScript XML  b) Java Syntax  c) JSON Extension  ✅ Answer: a) JavaScript XML\n\n3. How do you pass data to a component?\n   a) state  b) props  c) hooks  ✅ Answer: b) props\n\n4. Which hook runs after render?\n   a) useEffect  b) useRender  c) useMount  ✅ Answer: a) useEffect\n\n5. React was created by?\n   a) Google  b) Microsoft  c) Facebook  ✅ Answer: c) Facebook`,
        lesson: `📖 React Lesson Plan\n\nWeek 1: Fundamentals\n• Day 1: Introduction to React\n• Day 2: Components and JSX\n• Day 3: Props and data flow\n• Day 4: State with useState\n• Day 5: Event handling\n\nWeek 2: Hooks & Routing\n• Day 1: useEffect hook\n• Day 2: React Router\n• Day 3: Forms handling\n• Day 4: Context API\n• Day 5: Mini project\n\nWeek 3: Advanced\n• Day 1: API calls with axios\n• Day 2: Error handling\n• Day 3: Performance optimization\n• Day 4: Deployment\n• Day 5: Full project`
      },
      django: {
        notes: `📝 Django Study Notes\n\n🔹 What is Django?\nDjango is a high-level Python web framework.\n\n🔹 Key Concepts:\n• Models: Database structure\n• Views: Business logic\n• Templates: HTML presentation\n• URLs: Route mapping\n• Admin: Auto-generated admin panel\n• ORM: Database queries in Python\n\n🔹 Example:\nclass Course(models.Model):\n    title = models.CharField(max_length=200)\n    price = models.DecimalField(max_digits=8, decimal_places=2)\n\n✅ Summary: Django follows MVT pattern and includes everything needed for web development!`,
        quiz: `❓ Django Quiz Questions\n\n1. Django follows which pattern?\n   a) MVC  b) MVT  c) MVVM  ✅ Answer: b) MVT\n\n2. Which file contains URL patterns?\n   a) views.py  b) models.py  c) urls.py  ✅ Answer: c) urls.py\n\n3. What command creates migrations?\n   a) makemigrations  b) migrate  c) startapp  ✅ Answer: a) makemigrations\n\n4. Django ORM is used for?\n   a) HTML templates  b) Database queries  c) URL routing  ✅ Answer: b) Database queries\n\n5. Which file defines database models?\n   a) views.py  b) models.py  c) admin.py  ✅ Answer: b) models.py`,
        lesson: `📖 Django Lesson Plan\n\nWeek 1: Setup & Basics\n• Day 1: Install Django, create project\n• Day 2: Apps and project structure\n• Day 3: Models and database\n• Day 4: Views and URLs\n• Day 5: Templates\n\nWeek 2: Advanced Features\n• Day 1: Django Admin\n• Day 2: Forms and validation\n• Day 3: Authentication\n• Day 4: REST API with DRF\n• Day 5: Mini project\n\nWeek 3: Deployment\n• Day 1: Static files\n• Day 2: Database optimization\n• Day 3: Security best practices\n• Day 4: Deploy to Railway/Heroku\n• Day 5: Final project`
      }
    };

    const defaultContent = {
      notes: `📝 Study Notes: ${topic}\n\n🔹 Introduction:\n${topic} is an important concept in software development.\n\n🔹 Key Points:\n• Understand the core concepts first\n• Practice with small examples\n• Build real projects\n• Review documentation regularly\n\n🔹 Study Tips:\n• Break into smaller topics\n• Practice daily for 30 minutes\n• Join online communities\n• Build portfolio projects\n\n✅ Keep learning and never give up! 💪`,
      quiz: `❓ Quiz: ${topic}\n\n1. What is ${topic} mainly used for?\n   Think about its primary purpose and applications!\n\n2. What are the key concepts of ${topic}?\n   List at least 3 important concepts.\n\n3. How does ${topic} compare to alternatives?\n   Consider advantages and disadvantages.\n\n4. Give a real-world example of ${topic}.\n   Think of practical applications.\n\n5. What should you learn next after ${topic}?\n   Plan your learning path!`,
      lesson: `📖 Lesson Plan: ${topic}\n\nWeek 1: Fundamentals\n• Day 1: Introduction and overview\n• Day 2: Core concepts\n• Day 3: Basic implementation\n• Day 4: Examples and practice\n• Day 5: Review and exercises\n\nWeek 2: Intermediate\n• Day 1: Advanced concepts\n• Day 2: Best practices\n• Day 3: Common patterns\n• Day 4: Debugging techniques\n• Day 5: Mini project\n\nWeek 3: Advanced & Projects\n• Day 1: Expert techniques\n• Day 2: Real-world applications\n• Day 3: Performance optimization\n• Day 4: Project development\n• Day 5: Presentation and review`
    };

    const key = Object.keys(contents).find(k => t.includes(k));
    return key ? contents[key][type] : defaultContent[type];
  };

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setContent('');
    await new Promise(r => setTimeout(r, 1000));
    const result = generateContent(topic, type);
    setContent(result);
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">🎯 AI Content Generator</h1>
      <p className="page-subtitle">Generate study materials instantly!</p>

      <div style={{marginBottom:16, display:'flex', gap:8, flexWrap:'wrap'}}>
        {['Python', 'React', 'Django', 'JavaScript', 'Machine Learning', 'Data Science'].map(t => (
          <button key={t} className="btn btn-outline btn-sm" onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="card" style={{marginBottom:20}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto auto', gap:12, alignItems:'end'}}>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Topic</label>
            <input className="form-input" value={topic}
              onChange={e=>setTopic(e.target.value)}
              placeholder="e.g. Python, React, Django..." />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Type</label>
            <select className="form-select" value={type} onChange={e=>setType(e.target.value)}>
              <option value="notes">📝 Study Notes</option>
              <option value="quiz">❓ Quiz Questions</option>
              <option value="lesson">📖 Lesson Plan</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? '⏳ Generating...' : '✨ Generate'}
          </button>
        </div>
      </div>

      {content && (
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:16}}>
            <h3>Generated Content ✅</h3>
            <button className="btn btn-outline btn-sm"
              onClick={() => navigator.clipboard.writeText(content)}>
              📋 Copy
            </button>
          </div>
          <div style={{
            whiteSpace:'pre-wrap', lineHeight:1.8, color:'var(--text)',
            fontSize:'0.9rem', padding:16, background:'var(--surface2)',
            borderRadius:12
          }}>
            {content}
          </div>
        </div>
      )}

      {!content && !loading && (
        <div className="card" style={{textAlign:'center', padding:60}}>
          <div style={{fontSize:'4rem'}}>✨</div>
          <h3 style={{marginTop:16}}>Select a topic and generate!</h3>
          <p style={{color:'var(--text2)'}}>Get study notes, quizzes, or lesson plans instantly</p>
        </div>
      )}
    </div>
  );
}