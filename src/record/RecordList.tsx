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
    const [selectedServiceType, setSelectedServiceType] = useState<string>('');

    useEffect(() => {
        const fetchRecords = async () => {
            let url = '/api/records';
            if (selectedServiceType) {
                url += `?serviceType=${selectedServiceType}`;
            }
            const response = await axios.get(url);
            setRecords(response.data);
        };
        fetchRecords();
    }, [selectedServiceType]);

    const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceType(e.target.value);
    };

    return (
        <div>
            <h2>Records</h2>
            <div>
                <label htmlFor="serviceType">Service Type:</label>
                <select
                    id="serviceType"
                    value={selectedServiceType}
                    onChange={handleServiceTypeChange}
                >
                    <option value="">All</option>
                    <option value="ACCOUNT">ACCOUNT</option>
                    <option value="CREDIT">CREDIT</option>
                    <option value="CARD">CARD</option>
                </select>
            </div>
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