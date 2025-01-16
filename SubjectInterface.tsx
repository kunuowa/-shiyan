import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TesteeDashboard = () => {
  const [subjectId, setSubjectId] = useState(''); // Testee login ID
  const [assignments, setAssignments] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState(null);
  const [questions, setQuestions] = useState([]); // Store questions for the current questionnaire
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const [testResults, setTestResults] = useState(null); // Store test results


  // Fetch assignments for the logged-in testee
  const fetchAssignments = () => {
    if (!subjectId) {
      alert('Please enter your ID to login.');
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/assignments/${subjectId}`)
      .then((res) => {
        setAssignments(res.data);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  // Fetch questions for the current questionnaire
  const fetchQuestions = (questionnaireId) => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/questionnaires/${questionnaireId}/questions`)
      .then((res) => {
        setQuestions(res.data);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  // Start taking a questionnaire
  const startQuestionnaire = (assignment) => {
    setCurrentQuestionnaire(assignment);
    fetchQuestions(assignment.questionnaireId);
  };

  // Handle responses for the current questionnaire
  const handleResponseChange = (questionId, answer) => {
    setResponses({ ...responses, [questionId]: answer });
  };

  const fetchTestResults = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/results/${subjectId}/${currentQuestionnaire.questionnaireId}`)
      .then((res) => {
        setTestResults(res.data);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching test results:', err);
        setError('Failed to load test results. Please try again.');
      })
      .finally(() => setLoading(false));
  };
  

  // Submit responses
  const submitResponses = () => {
    if (!Object.keys(responses).length) {
      alert('Please answer the questions before submitting.');
      return;
    }
  
    const submitResponses = () => {
      if (!Object.keys(responses).length) {
        alert('Please answer the questions before submitting.');
        return;
      }
    
      setLoading(true);
      axios
        .post('http://localhost:5000/api/responses', {
          subjectId,
          questionnaireId: currentQuestionnaire.questionnaireId,
          responses,
        })
        .then(() => {
          alert('Responses submitted successfully!');
          fetchTestResults(); // Fetch and display the results after submitting
          setCurrentQuestionnaire(null);
          setResponses({});
          setQuestions([]);
          setError('');
        })
        .catch((err) => {
          console.error('Error submitting responses:', err);
          alert('Failed to submit responses. Please try again.');
        })
        .finally(() => setLoading(false));
    };
    

    setLoading(true);
    axios
      .post('http://localhost:5000/api/responses', {
        subjectId,
        questionnaireId: currentQuestionnaire.questionnaireId,
        responses,
      })
      .then(() => {
        alert('Responses submitted successfully!');
        setCurrentQuestionnaire(null);
        setResponses({});
        setQuestions([]);
        setError('');
      })
      .catch((err) => {
        console.error('Error submitting responses:', err);
        alert('Failed to submit responses. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1>Testee Dashboard</h1>

      {/* Login Section */}
      <div>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter your ID"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        />
        <button onClick={fetchAssignments} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>

      {/* Error Message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Assignments Section */}
      {assignments.length > 0 && !currentQuestionnaire && (
        <div>
          <h2>Your Assigned Questionnaires</h2>
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment.id}>
                {assignment.questionnaireTitle}{' '}
                <button
                  onClick={() => startQuestionnaire(assignment)}
                  disabled={loading}
                >
                  Start Test
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questionnaire Section */}
      {currentQuestionnaire && (
        <div>
          <h2>Answer the Questionnaire: {currentQuestionnaire.questionnaireTitle}</h2>
          {questions.map((question) => (
            <div key={question.id}>
              <p>{question.text}</p>
              <input
                type="text"
                placeholder="Your Answer"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            </div>
          ))}
          <button onClick={submitResponses} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
  
      )}

      {testResults && (
        <div>
          <h2>Test Results for {currentQuestionnaire.questionnaireTitle}</h2>
          <div>
            <p><strong>Total Score:</strong> {testResults.totalScore}</p>
            {testResults.factors.map((factor, index) => (
              <div key={index}>
                <p><strong>Factor {factor.name} Score:</strong> {factor.score}</p>
                <p>{factor.analysis}</p>
              </div>
            ))}
            <button onClick={() => window.print()} disabled={loading}>
              {loading ? 'Generating Report...' : 'Generate PDF Report'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TesteeDashboard;
