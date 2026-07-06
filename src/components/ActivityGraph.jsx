import React from 'react';

// Acum primim array-ul de date de la profil
const ActivityGraph = ({ data }) => {
  // Dacă nu avem date încă, afișăm un grafic gol de 90 de zile
  const days = data && data.length === 90 ? data : Array.from({ length: 90 }, () => 0);

  return (
    <div className="activity-wrapper">
      <div className="activity-grid">
        {days.map((level, i) => (
          <div key={i} className="activity-day" data-level={level} title={`${level} interactions`} />
        ))}
      </div>
    </div>
  );
};

export default ActivityGraph;