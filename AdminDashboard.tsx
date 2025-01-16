import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';


const AdminDashboard = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestionnaire, setNewQuestionnaire] = useState({ title: '', category: '' });
  const [newQuestion, setNewQuestion] = useState({
    questionnaireId: '',
    text: '',
    answers: [{ text: '', score: '' }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchQuestionnaires(), fetchQuestions()]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch all questionnaires
  const fetchQuestionnaires = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/questionnaires');
      setQuestionnaires(res.data);
    } catch (err) {
      setError('Failed to load questionnaires');
    }
  };

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/questions');
      setQuestions(res.data);
    } catch (err) {
      setError('Failed to load questions');
    }
  };

  // Add a new questionnaire
  const addQuestionnaire = async () => {
    if (!newQuestionnaire.title || !newQuestionnaire.category) {
      alert('Please fill out all fields!');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/questionnaires', newQuestionnaire);
      setQuestionnaires([...questionnaires, res.data]);
      setNewQuestionnaire({ title: '', category: '' });
      alert('Questionnaire added successfully!');
    } catch (err) {
      alert('Failed to add questionnaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new question
  const addQuestion = async () => {
    if (!newQuestion.questionnaireId || !newQuestion.text || newQuestion.answers.length === 0) {
      alert('Please fill out all fields!');
      return;
    }
  
    console.log("Payload being sent:", newQuestion); // Log the payload
  
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/questions', newQuestion);
      setQuestions([...questions, res.data]);
      setNewQuestion({
        questionnaireId: '',
        text: '',
        answers: [{ text: '', score: '' }],
      });
      alert('Question added successfully!');
    } catch (err) {
      console.error("Error adding question:", err.response || err);
      alert('Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Add another answer option
  const addAnswerOption = () => {
    setNewQuestion({
      ...newQuestion,
      answers: [...newQuestion.answers, { text: '', score: '' }],
    });
  };

  // Handle changes to answers
  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = newQuestion.answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Create Questionnaire */}
      <div>
        <h2>Create Questionnaire</h2>
        <input
          type="text"
          placeholder="Title"
          value={newQuestionnaire.title}
          onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newQuestionnaire.category}
          onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, category: e.target.value })}
        />
        <button onClick={addQuestionnaire} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Questionnaire'}
        </button>
      </div>

      {/* Add Question */}
      <div>
        <h2>Add Question</h2>
        <select
          onChange={(e) => setNewQuestion({ ...newQuestion, questionnaireId: e.target.value })}
          value={newQuestion.questionnaireId}
        >
          <option value="">Select Questionnaire</option>
          {questionnaires.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Question Text"
          value={newQuestion.text}
          onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
        />
        <h3>Answers</h3>
        {newQuestion.answers.map((answer, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Answer Text"
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
            />
            <input
              type="number"
              placeholder="Score"
              value={answer.score}
              onChange={(e) => handleAnswerChange(index, 'score', e.target.value)}
            />
          </div>
        ))}
        <button onClick={addAnswerOption}>Add Answer Option</button>
        <button onClick={addQuestion} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Question'}
        </button>
      </div>

      {/* Questionnaires */}
      <h2>Questionnaires</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {questionnaires.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
