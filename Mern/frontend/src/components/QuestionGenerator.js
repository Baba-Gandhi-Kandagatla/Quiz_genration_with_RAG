import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const QuestionGenerator = () => {
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [questionType, setQuestionType] = useState('MCQs');
  const [numberQuestions, setNumberQuestions] = useState(6);
  const [generatedQuestions, setGeneratedQuestions] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (topic) formData.append('topic', topic);
    if (file) formData.append('file', file);
    formData.append('question_type', questionType);
    formData.append('number_questions', numberQuestions);
    try {
      setGeneratedQuestions("Waiting for responce from backend");
      const response = await fetch('http://localhost:8000/generate-questions', {
          method: 'POST',
          body: formData,
          headers: {
          },
      });

      if (response.ok) {
          const data = await response.json();
          setGeneratedQuestions(data.generated_questions);
      } else {
          console.error('Failed to generate questions:', response.status);
      }
  } catch (error) {
      console.error('Error generating questions:', error);
  }};

  return (
    <div className="question-gen-container">
      <h2>Generate Questions</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (optional if uploading a document)"
          />
        </div>
        <div className="form-group">
          <label>Upload Word Document:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Question Type:</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
            <option value="MCQs">MCQs</option>
            <option value="True/False">True/False</option>
            <option value="Short question answers">Short question answers</option>
            <option value="Fill in the blanks">Fill in the blanks</option>
          </select>
        </div>
        <div className="form-group">
          <label>Number of Questions:</label>
          <input
            type="number"
            value={numberQuestions}
            onChange={(e) => setNumberQuestions(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit">Generate</button>
        </div>
      </form>

      {generatedQuestions && (
        <div>
          <h3>Generated Questions:</h3>
          <p>{generatedQuestions}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
