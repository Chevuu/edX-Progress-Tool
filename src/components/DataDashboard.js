import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const DataDashboard = () => {
  const { courseCode } = useParams();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  useEffect(() => {
    const url = `/edX-Progress-Tool/server/index.php?method=getChecklistStats&courseCode=${courseCode}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching stats');
        }
        return response.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [courseCode]);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChecklistSelect = (checklistID) => {
    const checklist = stats.find(item => item.ChecklistID === checklistID);
    setSelectedChecklist(checklist);
  };

  return (
    <div className="data-dashboard-container">
      <h1 className="data-dashboard-header">Data for Course: <span className="course-code">{courseCode}</span></h1>
      <div className="data-dashboard">
        <div className="checklist-selector">
          <h2>Select Checklist</h2>
          <ul>
            {stats.map(item => (
              <li key={item.ChecklistID}>
                <button onClick={() => handleChecklistSelect(item.ChecklistID)}>
                  {item.ChecklistID} - {item.CourseRun}
                </button>
              </li>
            ))}
          </ul>
          <ChecklistSubmissionsHistogram stats={stats} />
        </div>
        <div className="checklist-stats">
          {selectedChecklist ? (
            <ChecklistStats checklist={selectedChecklist} />
          ) : (
            <div>Select a checklist to view stats</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChecklistStats = ({ checklist }) => {
  const { ChecklistID, Questions, Answers, TotalSubmissions } = checklist;

  const data = {
    labels: Questions,
    datasets: [
      {
        label: 'Number of Users Who Checked This Item',
        data: Answers.map(answer => answer.count),
        backgroundColor: 'rgba(0, 166, 214, 0.6)',
        borderColor: 'rgba(0, 166, 214, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16 // Increase this value to make the legend text bigger
          }
        }
      },
      title: {
        display: true,
        text: `Statistics for Checklist ID: ${ChecklistID}`,
        font: {
          size: 18 // Increase this value to make the chart title text bigger
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14 // Increase this value to make the x-axis labels bigger
          }
        },
        beginAtZero: true,
        max: TotalSubmissions - 1,
      },
      y: {
        ticks: {
          font: {
            size: 14 // Increase this value to make the y-axis labels bigger
          }
        }
      },
    },
  };

  return (
    <div>
      <h2>Checklist ID: {ChecklistID}</h2>
      <p>Total Submissions: {TotalSubmissions - 1}</p>
      <Bar data={data} options={options} />
    </div>
  );
};

const ChecklistSubmissionsHistogram = ({ stats }) => {
  const data = {
    labels: stats.map(item => `Checklist ${item.ChecklistID}`),
    datasets: [
      {
        label: 'Number of Submissions',
        data: stats.map(item => item.TotalSubmissions - 1),
        backgroundColor: 'rgba(0, 166, 214, 0.6)',
        borderColor: 'rgba(0, 166, 214, 1)',
        borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Submissions per Checklist',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };
  return (
    <div className="checklist-histogram">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DataDashboard;