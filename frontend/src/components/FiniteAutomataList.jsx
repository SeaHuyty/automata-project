import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAutomata, deleteAutomaton } from '../services/storageService';
import { Search, Plus } from 'lucide-react';
import Navbar from './Navbar';
export default function FiniteAutomataList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [automataList, setAutomataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAutomata();
    }, []);

    const fetchAutomata = () => {
        try {
            const automata = getAllAutomata();
            setAutomataList(automata);
        } catch (err) {
            console.error("Error fetching automata:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddNew = () => {
        navigate('/new');
    };

    const handleAutomatonClick = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this automaton?')) {
            try {
                const result = deleteAutomaton(id);
                if (result.success) {
                    fetchAutomata();
                    alert('Automaton deleted successfully!');
                } else {
                    alert("Failed to delete automaton: " + result.error);
                }
            } catch (err) {
                console.error("Error deleting automaton:", err);
                alert("Failed to delete automaton");
            }
        }
    };

    const filteredAutomata = automataList.filter(automaton =>
        automaton.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header with Title and Add Button */}
                <div className="flex justify-between items-center mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Finite Automata
                        </h1>
                        <p className="text-gray-600">Create, manage, and visualize your automata</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                    >
                        <Plus size={20} />
                        <span>Create New</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8 animate-slide-in">
                    <Search 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent shadow-sm transition-all duration-300"
                    />
                </div>

                {/* Automata List */}
                <div className="min-h-[500px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-[500px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1a365d]"></div>
                        </div>
                    ) : automataList.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-[500px] bg-white rounded-2xl shadow-sm">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-xl text-gray-500 font-medium mb-2">No Automata Yet</p>
                            <p className="text-gray-400 mb-6">Start by creating your first automaton</p>
                            <button
                                onClick={handleAddNew}
                                className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Plus size={20} />
                                <span>Create First Automaton</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAutomata.map((automata, index) => (
                                <div 
                                    key={automata.id || index}
                                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer border border-gray-100 group"
                                    onClick={() => navigate(`/edit/${automata.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h1 className="font-bold text-2xl text-gray-800 group-hover:text-[#1a365d] transition-colors duration-300 flex-1 line-clamp-2">
                                            {automata.name}
                                        </h1>
                                        <div className="bg-gradient-to-br from-[#1a365d] to-[#2d4a7c] p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-gray-500 font-medium">Created:</span>
                                            <span className="text-gray-700 ml-2">{new Date(automata.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span className="text-gray-500 font-medium">Updated:</span>
                                            <span className="text-gray-700 ml-2">{new Date(automata.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/edit/${automata.id}`);
                                        }}
                                        className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Edit & Visualize</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
