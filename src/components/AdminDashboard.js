import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminChecklistCard from './AdminChecklistCard';
import AddChecklistModal from './AddChecklistModal';

const AdminDashboard = () => {
  const { courseCode } = useParams();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/get-all/${courseCode}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching checklists');
        }
        return response.json();
      })
      .then(data => {
        setChecklists(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [courseCode]);

  const handleDelete = (checklistID) => {
    fetch(`/api/checklist/${checklistID}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting checklist');
        }
        return response.json();
      })
      .then(() => {
        setChecklists(prevChecklists => prevChecklists.filter(c => c.ChecklistID !== checklistID));
        console.log('Checklist deleted successfully');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleAddChecklist = () => {
    setShowModal(true);
  };

  const handleAddNewChecklist = (newChecklist) => {
    setChecklists([...checklists, newChecklist]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleClearFilter = () => {
    setFilter('');
  };

  const filteredChecklists = checklists.filter(checklist => 
    checklist.CourseRun.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Checklists for Course: <span className="course-code">{courseCode}</span></h1>
        <button className="add-checklist-btn" onClick={handleAddChecklist}>Add Checklist</button>
      </div>
      
      <div className="filter-container">
        <label htmlFor="filter">Filter by Course Run: </label>
        <input
          type="text"
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Enter course run..."
        />
        <button className="filter-btn" onClick={handleClearFilter}>Clear Filter</button>
      </div>

      <div className="admin-checklist-grid">
        {filteredChecklists.length > 0 ? (
          filteredChecklists.map(checklist => (
            <AdminChecklistCard 
              key={checklist.ChecklistID} 
              checklist={checklist}
              handleDelete={handleDelete} 
            />
          ))
        ) : (
          <div>No checklists found for the entered course run.</div>
        )}
      </div>

      {showModal && (
        <AddChecklistModal 
          courseCode={courseCode}
          onClose={handleCloseModal} 
          onAddChecklist={handleAddNewChecklist} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;