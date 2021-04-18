import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default () => {
  const [rockHistory, setRockHistory] = useState([]);

  const getRockHistory = async () => {
    const res = await axios.get('http://romeojuliet.com/romeo/rocks');
    setRockHistory(res.data);
  };

  useEffect(() => {
    getRockHistory();
  }, []);

  const renderedRocks = Object.values(rockHistory).map((rock) => {
    return (
      <div key={rock.id} style={{ color: 'blue' }}>
        <h4>{`Romeo threw a ${rock.size} rock at Juliet's window during the ${rock.time}`}</h4>
      </div>
    );
  });

  return <div>{renderedRocks}</div>;
};
