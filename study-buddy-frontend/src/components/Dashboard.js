import React from 'react';
import TodoList from './TodoList';
import Notes from './Notes';
import Schedule from './Schedule';

const Dashboard = () => {
  return (
    <div>
      <TodoList />
      <Notes />
      <Schedule />
    </div>
  );
};

export default Dashboard;
