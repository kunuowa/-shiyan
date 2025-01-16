import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TesterDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', age: '', gender: '', contact: '' });
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null); // Store selected assignment for report view
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');

  // Fetch subjects, questionnaires, and assignments
  useEffect(() => {
    fetchSubjects();
    fetchQuestionnaires();
    fetchAssignments();
  }, []);

  const fetchSubjects = () => {
    axios
      .get('http://localhost:5000/api/subjects')
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error('Error fetching subjects:', err));
  };

  const fetchQuestionnaires = () => {
    axios
      .get('http://localhost:5000/api/questionnaires')
      .then((res) => setQuestionnaires(res.data))
      .catch((err) => console.error('Error fetching questionnaires:', err));
  };

  const fetchAssignments = () => {
    axios
      .get('http://localhost:5000/api/assignments')
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error('Error fetching assignments:', err));
  };

  // Add a new subject
  const addSubject = () => {
    if (!newSubject.name || !newSubject.age || !newSubject.gender || !newSubject.contact) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);
    axios
      .post('http://localhost:5000/api/subjects', newSubject)
      .then((res) => {
        setSubjects([...subjects, res.data]);
        setNewSubject({ name: '', age: '', gender: '', contact: '' }); // Clear form
        setError('');
      })
      .catch((err) => {
        console.error('Error adding subject:', err);
        setError('Failed to add subject. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  // Assign a questionnaire to a subject
  const assignQuestionnaire = () => {
    if (!selectedSubject || !selectedQuestionnaire) {
      alert('Please select both a subject and a questionnaire.');
      return;
    }

    setLoading(true);
    axios
      .post('http://localhost:5000/api/assignments', {
        subjectId: selectedSubject,
        questionnaireId: selectedQuestionnaire,
      })
      .then((res) => {
        setAssignments([...assignments, res.data]);
        setError('');
      })
      .catch((err) => {
        console.error('Error assigning questionnaire:', err);
        setError('Failed to assign questionnaire. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  // View the selected assignment's report
  const viewReport = (assignmentId) => {
    // Mock report data for the demonstration
    const mockReports = [
      {
        assignmentId: 1,
        subjectName: 'John Doe',
        questionnaireTitle: 'Depression Assessment',
        totalScore: 75,
        factorScores: { mood: 25, sleep: 30, anxiety: 20 },
        conclusion: 'Moderate depression detected.',
      },
      {
        assignmentId: 2,
        subjectName: 'Jane Smith',
        questionnaireTitle: 'Anxiety Test',
        totalScore: 50,
        factorScores: { worry: 20, stress: 15, panic: 15 },
        conclusion: 'Mild anxiety detected.',
      },
    ];

    const selectedReport = mockReports.find((report) => report.assignmentId === assignmentId);

    if (!selectedReport) {
      alert('Report not available for this assignment.');
    } else {
      alert(`
        Report for ${selectedReport.subjectName}:
        Total Score: ${selectedReport.totalScore}
        Conclusion: ${selectedReport.conclusion}
      `);
    }
  };

  return (
    <div>
      <h1>Tester Dashboard</h1>

      {/* Error Message */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Add a new subject */}
      <div>
        <h2>Add Subject</h2>
        <input
          type="text"
          placeholder="Name"
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newSubject.age}
          onChange={(e) => setNewSubject({ ...newSubject, age: e.target.value })}
        />
        <select
          value={newSubject.gender}
          onChange={(e) => setNewSubject({ ...newSubject, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          placeholder="Contact"
          value={newSubject.contact}
          onChange={(e) => setNewSubject({ ...newSubject, contact: e.target.value })}
        />
        <button onClick={addSubject}>Add Subject</button>
      </div>

      {/* Assign a questionnaire */}
      <div>
        <h2>Assign Questionnaire</h2>
        <select onChange={(e) => setSelectedSubject(e.target.value)} value={selectedSubject}>
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => setSelectedQuestionnaire(e.target.value)} value={selectedQuestionnaire}>
          <option value="">Select Questionnaire</option>
          {questionnaires.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
        <button onClick={assignQuestionnaire} disabled={loading}>
          {loading ? 'Assigning...' : 'Assign'}
        </button>
      </div>

      {/* List of assignments */}
      <div>
        <h2>Assignments</h2>
        <ul>
          {assignments.map((assignment) => {
            const subject = subjects.find((s) => s.id === assignment.subjectId);
            const questionnaire = questionnaires.find((q) => q.id === assignment.questionnaireId);
            return (
              <li key={assignment.id}>
                <p>
                  Subject: {subject?.name || 'Unknown'} - Questionnaire: {questionnaire?.title || 'Unknown'}
                </p>
                <button onClick={() => viewReport(assignment.id)}>View Report</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TesterDashboard;
