import React, { useState } from 'react';
import axios from 'axios';

export default () => {
  const [formData, setFormData] = useState({ size: '', time: '' });
  const { size, time } = formData;

  const onSubmit = async () => {
    await axios.post('http://romeojuliet.com/romeo/rocks/throw', formData);
    setFormData({ size: '', time: '' });
  };

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  return (
    <div>
      <h1>Romeo, throw some rocks at Juliet's windows!</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <label>What size rock do you want to throw?</label>
          <input
            type='text'
            name='size'
            placeholder='small'
            value={size}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <label>What time of day do you want to throw it?</label>
          <input
            type='text'
            name='time'
            placeholder='mignight'
            value={time}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};
