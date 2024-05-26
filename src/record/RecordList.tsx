import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Record {
    id?: string;
    serviceType: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
    sortOrder?: number;
}

const RecordList: React.FC = () => {
    const [records, setRecords] = useState<Record[]>([]);
    const [editedRecords, setEditedRecords] = useState<Record[]>([]);
    const [editableIndexes, setEditableIndexes] = useState<number[]>([]);
    const [selectedServiceType, setSelectedServiceType] = useState<string>('');

    useEffect(() => {
        const fetchRecords = async () => {
            let url = '/api/records';
            if (selectedServiceType) {
                url += `?serviceType=${selectedServiceType}`;
            }
            const response = await axios.get<Record[]>(url);
            setRecords(response.data);
            setEditedRecords(response.data.map(record => ({ ...record })));
            setEditableIndexes([]);
        };
        fetchRecords();
    }, [selectedServiceType]);

    const handleEdit = (index: number) => {
        setEditableIndexes([...editableIndexes, index]);
    };

    const handleEditChange = (index: number, field: keyof Record, value: string) => {
        const newEditedRecords = editedRecords.map((record, idx) => {
            if (idx === index) {
                return { ...record, [field]: value };
            }
            return record;
        });
        setEditedRecords(newEditedRecords);
    };

    const handleSave = async (index: number) => {
        try {
            await axios.put(`/api/records/${editedRecords[index].id}`, editedRecords[index]);
            const response = await axios.get<Record[]>('/api/records');
            setRecords(response.data);
            setEditedRecords(response.data.map(record => ({ ...record })));
            setEditableIndexes(editableIndexes.filter(idx => idx !== index));
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceType(e.target.value);
    };

    const isEditable = (index: number) => editableIndexes.includes(index);

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
                    <th>SortOrder</th>
                    <th>ID</th>
                    <th>Service Type</th>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {records.map((record, index) => (
                    <tr key={record.id}>
                        <td>
                            {isEditable(index) ? (
                                <input
                                    type="text"
                                    value={editedRecords[index].sortOrder}
                                    onChange={(e) => handleEditChange(index, 'sortOrder', e.target.value)}
                                />
                            ) : (
                                <span>{record.sortOrder}</span>
                            )}
                        </td>
                        <td>{record.id}</td>
                        <td>
                            {isEditable(index) ? (
                                <input
                                    type="text"
                                    value={editedRecords[index].serviceType}
                                    onChange={(e) => handleEditChange(index, 'serviceType', e.target.value)}
                                />
                            ) : (
                                <span>{record.serviceType}</span>
                            )}
                        </td>
                        <td>
                            {isEditable(index) ? (
                                <input
                                    type="text"
                                    value={editedRecords[index].title}
                                    onChange={(e) => handleEditChange(index, 'title', e.target.value)}
                                />
                            ) : (
                                <span>{record.title}</span>
                            )}
                        </td>
                        <td>{record.createdAt}</td>
                        <td>{record.updatedAt}</td>
                        <td>
                            {isEditable(index) ? (
                                <button onClick={() => handleSave(index)}>Save</button>
                            ) : (
                                <button onClick={() => handleEdit(index)}>Edit</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecordList;
