import { useState, useEffect } from 'react';
import { getUSerByUsername } from '../../../utils/api/fetch.js';

const TeamMembers = ({ projectData, setProjectData, onNext, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Search users with debounce
    useEffect(() => {
        const searchUsers = async () => {
            if (searchTerm.trim() === '') {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const result = await getUSerByUsername(searchTerm);
                console.log("resultado", result);
                // Si no hay resultados, establecer array vacío
                if (!result) {
                    setSearchResults([]);
                    return;
                }
                // Ensure result is always an array
                const users = [result];
                console.log("users", users)
                // Filter out already selected users
                const filteredResults = users.filter(user => 
                    user && user.userId && !projectData.team_members.includes(user.userId)
                );
                console.log("firesult", filteredResults)
                setSearchResults(filteredResults);
            } catch (error) {
                // Si el error es 404, significa que no se encontró el usuario
                if (error.message === "User not found") {
                    setSearchResults([]);
                    return;
                }
                console.error('Error searching users:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                searchUsers();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, projectData.team_members]);

    // Load selected users data
    // useEffect(() => {
    //     const loadSelectedUsers = async () => {
    //         try {
    //             const usersData = await Promise.all(
    //                 projectData.team_members.map(async (userId) => {
    //                     try {
    //                         const user = await getUSerByUsername(userId);
    //                         return Array.isArray(user) ? user[0] : user;
    //                     } catch (error) {
    //                         console.error(`Error loading user ${userId}:`, error);
    //                         return null;
    //                     }
    //                 })
    //             );
    //             setSelectedUsers(usersData.filter(Boolean));
    //         } catch (error) {
    //             console.error('Error loading selected users:', error);
    //             setSelectedUsers([]);
    //         }
    //     };

    //     if (projectData.team_members.length > 0) {
    //         loadSelectedUsers();
    //     } else {
    //         setSelectedUsers([]);
    //     }
    // }, [projectData.team_members]);

    const handleAddMember = (user) => {
        if (!projectData.team_members.includes(user.userId)) {
            setProjectData(prev => ({
                ...prev,
                team_members: [...prev.team_members, user]
            }));
            setSearchTerm('');
            setSearchResults([]);
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
                        placeholder="Type username to search..."
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    
                    {/* Search Results Dropdown */}
                    {searchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {isLoading ? (
                                <div className="px-4 py-2 text-gray-500">
                                    Searching...
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <button
                                        key={user.userId}
                                        type="button"
                                        onClick={() => handleAddMember(user)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                            {user.avatar && (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <span>{user.username}</span>
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
                    {projectData.team_members.map(user => (
                        <div 
                            key={user.userId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                    {user.avatar && (
                                        <img 
                                            src={user.avatar} 
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <span>{user.username}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveMember(user.userId)}
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
                    
                    {projectData.team_members.length === 0 && (
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