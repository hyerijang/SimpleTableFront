import React, { useState } from 'react';
import axios from 'axios';

interface Record {
    id?: string;
    serviceType: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
    sortOrder: number; // sortOrder 필드 추가
}

const RecordForm: React.FC = () => {
    const [records, setRecords] = useState<Record[]>([{ serviceType: '', title: '', sortOrder: 0 }]); // sortOrder 초기값 추가
    const serviceTypes = ['ACCOUNT', 'CREDIT', 'CARD'];

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newRecords: Record[] = records.map((record, idx) => {
            if (idx === index) {
                return {
                    ...record,
                    [name]: name === 'sortOrder' ? parseInt(value, 10) : value
                };
            }
            return record;
        });
        setRecords(newRecords);
    };

    const addRow = () => {
        setRecords([...records, { serviceType: '', title: '', sortOrder: 0 }]); // sortOrder 초기값 추가
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('/api/records', records);
        setRecords([{ serviceType: '', title: '', sortOrder: 0 }]); // sortOrder 초기값 추가
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
                    <input
                        type="number" // 숫자 입력 필드 추가
                        name="sortOrder"
                        value={record.sortOrder.toString()} // 숫자를 문자열로 변환
                        onChange={(e) => handleChange(index, e)}
                        placeholder="Sort Order"
                    />
                </div>
            ))}
            <button type="button" onClick={addRow}>Add Row</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default RecordForm;
