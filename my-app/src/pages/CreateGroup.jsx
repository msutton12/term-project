import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Badge } from 'react-bootstrap';
import Card from '../components/Card';

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

    const handleRemoveMember = (memberToRemove) => {
        setMembers(members.filter(m => m !== memberToRemove));
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();

        // Make sure the current user is included in the group
        const activeUser = localStorage.getItem('activeUser');
        let updatedMembers = [...members];

        if (activeUser && !members.includes(activeUser)) {
            updatedMembers.push(activeUser);
        }

        const newGroup = {
            id: Date.now().toString(),
            name: groupName,
            members: updatedMembers,
            createdAt: new Date().toISOString()
        };

        const existingGroups = JSON.parse(localStorage.getItem('groups')) || {};
        existingGroups[newGroup.id] = newGroup;
        localStorage.setItem('groups', JSON.stringify(existingGroups));

        navigate('/groups');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddMember();
        }
    };

    return (
        <div className="app-container">
            <h1 className="mb-4">Create a New Group</h1>

            <Row>
                <Col md={8} lg={6}>
                    <Card>
                        <Form onSubmit={handleCreateGroup}>
                            <Form.Group className="mb-4">
                                <Form.Label>Group Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Enter group name (e.g., Roommates, Trip to Paris)"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Add Members</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        value={memberName}
                                        onChange={(e) => setMemberName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter member name"
                                    />
                                    <Button
                                        variant="outline-primary"
                                        type="button"
                                        onClick={handleAddMember}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <Form.Text className="text-muted">
                                    Press Enter to add quickly
                                </Form.Text>
                            </Form.Group>

                            {members.length > 0 && (
                                <div className="mb-4">
                                    <label className="d-block mb-2">Group Members:</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {members.map((m, idx) => (
                                            <Badge
                                                key={idx}
                                                bg="light"
                                                text="dark"
                                                className="d-flex align-items-center p-2 mb-2"
                                            >
                                                {m}
                                                <span
                                                    className="ms-2 cursor-pointer"
                                                    onClick={() => handleRemoveMember(m)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    ✕
                                                </span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="d-flex justify-content-between">
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => navigate('/groups')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!groupName || members.length === 0}
                                >
                                    Create Group
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>

                <Col md={4} lg={6}>
                    <Card title="Group Preview" className={members.length > 0 ? '' : 'd-none d-md-block'}>
                        {members.length > 0 ? (
                            <div>
                                <h3 className="h5 mb-3">{groupName || 'Your Group'}</h3>
                                <p className="mb-2"><strong>Members:</strong></p>
                                <ul className="list-group">
                                    {members.map((member, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            {member}
                                            <span className="badge bg-primary rounded-pill">Member</span>
                                        </li>
                                    ))}
                                    {localStorage.getItem('activeUser') &&
                                        !members.includes(localStorage.getItem('activeUser')) && (
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                {localStorage.getItem('activeUser')} (You)
                                                <span className="badge bg-success rounded-pill">Auto-added</span>
                                            </li>
                                        )}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray">Add members to preview your group</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateGroup;