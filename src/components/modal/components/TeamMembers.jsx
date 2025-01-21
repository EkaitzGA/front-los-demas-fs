import { useState } from 'react';

const TeamMembers = ({ projectData, setProjectData, onNext, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Mock users data
    const mockUsers = [
        { _id: '1', name: 'John Doe', avatar: '/mock-avatar-1.jpg' },
        { _id: '2', name: 'Jane Smith', avatar: '/mock-avatar-2.jpg' },
        { _id: '3', name: 'Mike Johnson', avatar: '/mock-avatar-3.jpg' },
        { _id: '4', name: 'Sarah Wilson', avatar: '/mock-avatar-4.jpg' },
        { _id: '5', name: 'David Brown', avatar: '/mock-avatar-5.jpg' },
    ];

    const filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !projectData.team_members.includes(user._id)
    );

    const handleAddMember = (userId) => {
        if (!projectData.team_members.includes(userId)) {
            setProjectData(prev => ({
                ...prev,
                team_members: [...prev.team_members, userId]
            }));
            setSearchTerm(''); // Clear search after adding
        }
    };

    const handleRemoveMember = (userId) => {
        setProjectData(prev => ({
            ...prev,
            team_members: prev.team_members.filter(id => id !== userId)
        }));
    };

    const handleContinue = (e) => {
        e.preventDefault();
        onNext();
    };

    const getSelectedMembers = () => {
        return projectData.team_members.map(memberId => 
            mockUsers.find(user => user._id === memberId)
        ).filter(Boolean);
    };

    return (
        <form onSubmit={handleContinue} className="flex flex-col gap-6">
            <div className="form-group">
                <label 
                    htmlFor="memberSearch"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Search Team Members
                </label>
                
                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        id="memberSearch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Type to search users..."
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    
                    {/* Search Results Dropdown */}
                    {searchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <button
                                        key={user._id}
                                        type="button"
                                        onClick={() => handleAddMember(user._id)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full">
                                            {/* Avatar placeholder */}
                                        </div>
                                        <span>{user.name}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500">
                                    No users found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Team Members */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                    Selected Team Members
                </label>
                <div className="space-y-2">
                    {getSelectedMembers().map(member => (
                        <div 
                            key={member._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full">
                                    {/* Avatar placeholder */}
                                </div>
                                <span>{member.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveMember(member._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg 
                                    className="w-5 h-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                    
                    {getSelectedMembers().length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            No team members selected
                        </div>
                    )}
                </div>
            </div>

            <div className="navigation-buttons">
                <button
                    type="button"
                    onClick={onBack}
                    className="nav-button"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="nav-button"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default TeamMembers;