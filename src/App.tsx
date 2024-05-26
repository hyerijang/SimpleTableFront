import React from 'react';
import RecordForm from './record/RecordForm';
import RecordList from './record/RecordList';

const App: React.FC = () => {
    return (
        <div>
            <h1>Record Management</h1>
            <RecordForm />
            <RecordList />
        </div>
    );
};

export default App;
