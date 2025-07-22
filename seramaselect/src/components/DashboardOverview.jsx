import React from 'react';
import { useTheme } from '../App';
import { FaFeather, FaCheck, FaTimes, FaEgg, FaThumbsUp, FaEye } from 'react-icons/fa';
import './SharedComponents.css';

export default function DashboardOverview({ stats }) {
  const { isDarkMode } = useTheme();
  // Prepare data for cards - Total Birds = all records, breakdown by conformation type
  const conformation = [
    { label: 'Traditional/American', value: stats.traditionalCount || 0 },
    { label: 'Ayam (Malaysian)', value: stats.ayamCount || 0 },
    { label: 'Modern Malaysian', value: stats.modernCount || 0 },
    { label: 'Undetermined', value: stats.undeterminedCount || 0 },
  ];
  const totalConformation = stats.totalBirds || 0; // Use actual total count of all birds

  // Active birds breakdown
  const activeStages = [
    { label: 'Chicks', value: stats.chicks || 0 },
    { label: 'Growouts', value: stats.growouts || 0 },
    { label: 'Breeders', value: stats.breeders || 0 },
    { label: 'Brood Hens', value: stats.broodHens || 0 },
    { label: 'Exhibition', value: stats.exhibition || 0 },
    { label: 'Active Other', value: stats.activeOther || 0 }
  ];

  const totalActive = stats.activeTotal;

  const inactive = stats.inactiveBirds || 0;
  const coming = [
    { label: 'Hatches Coming Soon', value: stats.hatches || 0 },
    { label: 'Total Likes Coming Soon', value: stats.likes || 0 },
    { label: 'Total Views Coming Soon', value: stats.views || 0 },
  ];

  // Card definitions
  const cards = [
    {
      label: 'Total Birds',
      value: totalConformation,
      icon: <FaFeather />,
      details: conformation.filter(c => c.value > 0),
      color: '#007bff' // Blue - matches Records
    },
    {
      label: 'Active Birds',
      value: totalActive,
      icon: <FaCheck />,
      details: [...activeStages].filter(a => a.value > 0),
      color: '#28a745' // Green - matches Traits
    },
    { 
      label: 'Inactive Birds', 
      value: inactive,
      icon: <FaTimes />,
      color: '#dc3545' // Red for inactive
    },
    { 
      label: 'Hatches Coming Soon', 
      value: stats.hatches || 0,
      icon: <FaEgg />,
      color: '#fd7e14' // Orange - matches Hatching
    },
    { 
      label: 'Total Likes Coming Soon', 
      value: stats.likes || 0,
      icon: <FaThumbsUp />,
      color: '#6f42c1' // Purple - matches Gallery
    },
    { 
      label: 'Total Views Coming Soon', 
      value: stats.views || 0,
      icon: <FaEye />,
      color: '#17a2b8' // Teal for views
    }
  ];

  return (
    <section className="dashboard-overview">
      {cards.map(({ label, value, icon, details, color }) => (
        <div key={label} className={`card ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="card-header">
            <div className="card-title-with-icon">
              {icon && <span className="card-icon" style={{ color }}>{icon}</span>}
              <h3 className={isDarkMode ? 'dark' : 'light'}>{label}</h3>
            </div>
          </div>
          <div className="card-value" style={{ color }}>
            {value > 0 ? value : '-'}
          </div>
          {details && (
            <ul className="card-details">
              {details.map(d => (
                <li key={d.label} className={isDarkMode ? 'dark' : 'light'}>
                  <span>{d.label}</span>
                  <span>{d.value > 0 ? d.value : '-'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}