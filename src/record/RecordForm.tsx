import React, { useState } from 'react';
import axios from 'axios';

interface Record {
    id?: string;
    serviceType: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
}

const RecordForm: React.FC = () => {
    const [records, setRecords] = useState<Record[]>([{ serviceType: '', title: '' }]);
    const serviceTypes = ['ACCOUNT', 'CREDIT', 'CARD'];

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newRecords = [...records];
        newRecords[index][name as keyof Record] = value;
        setRecords(newRecords);
    };

    const addRow = () => {
        setRecords([...records, { serviceType: '', title: '' }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('/api/records', records);
        setRecords([{ serviceType: '', title: '' }]);
    };

    return (
        <form onSubmit={handleSubmit}>
            {records.map((record, index) => (
                <div key={index}>
                    <select
                        name="serviceType"
                        value={record.serviceType}
                        onChange={(e) => handleChange(index, e)}
                    >
                        {serviceTypes.map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="title"
                        value={record.title}
                        onChange={(e) => handleChange(index, e)}
                        placeholder="Title"
                    />
                </div>
            ))}
            <button type="button" onClick={addRow}>Add Row</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default RecordForm;
