import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [memberName, setMemberName] = useState('');
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    const handleAddMember = () => {
        if (memberName.trim() && !members.includes(memberName.trim())) {
            setMembers([...members, memberName.trim()]);
            setMemberName('');
        }
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();

        const newGroup = {
            id: Date.now().toString(),
            name: groupName,
            members
        };

        const existingGroups = JSON.parse(localStorage.getItem('groups')) || {};
        existingGroups[newGroup.id] = newGroup;
        localStorage.setItem('groups', JSON.stringify(existingGroups));

        navigate('/groups');
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Create a New Group</h1>

            <Form onSubmit={handleCreateGroup}>
                <Form.Group className="mb-3">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Add Members</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            value={memberName}
                            onChange={(e) => setMemberName(e.target.value)}
                            placeholder="Enter member name"
                        />
                        <Button variant="secondary" type="button" onClick={handleAddMember}>
                            Add
                        </Button>
                    </div>
                </Form.Group>

                {members.length > 0 && (
                    <ul className="mb-3">
                        {members.map((m, idx) => (
                            <li key={idx}>{m}</li>
                        ))}
                    </ul>
                )}

                <Button type="submit" variant="primary" disabled={!groupName || members.length === 0}>
                    Create Group
                </Button>
            </Form>
        </div>
    );
};

export default CreateGroup;
