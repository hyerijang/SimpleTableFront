import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Record {
    id?: string;
    serviceType: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
}

const RecordList: React.FC = () => {
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
        const fetchRecords = async () => {
            const response = await axios.get('/api/records');
            setRecords(response.data);
        };
        fetchRecords();
    }, []);

    return (
        <div>
            <h2>Records</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Service Type</th>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                </tr>
                </thead>
                <tbody>
                {records.map(record => (
                    <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>{record.serviceType}</td>
                        <td>{record.title}</td>
                        <td>{record.createdAt}</td>
                        <td>{record.updatedAt}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecordList;
