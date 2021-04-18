import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default () => {
  const [windowHistory, setWindowHistory] = useState([]);

  const getWindowHistory = async () => {
    const res = await axios.get('http://romeojuliet.com/juliet/windows');
    setWindowHistory(res.data);
  };

  useEffect(() => {
    getWindowHistory();
  }, []);

  const renderedWindows = Object.values(windowHistory).map((window) => {
    return (
      <div key={window.id} style={{ border: '1px solid black', color: 'red' }}>
        <h4>
          {window.open &&
            `Juliet opened the window for Romeo during ${window.time}`}
        </h4>
      </div>
    );
  });

  return (
    <div>
      <h1>Juliet, open the window for Romeo!</h1>
      {renderedWindows}
    </div>
  );
};
