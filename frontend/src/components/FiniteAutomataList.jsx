import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllAutomata, deleteAutomaton } from '../services/storageService';
import { Search, Plus } from 'lucide-react';
import Navbar from './Navbar';
export default function FiniteAutomataList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [automataList, setAutomataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAutomata();
    }, []);

    useEffect(() => {
        if (deleteModal.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [deleteModal.isOpen]);

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
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = () => {
        try {
            const result = deleteAutomaton(deleteModal.id);
            if (result.success) {
                fetchAutomata();
                toast.success('Automaton deleted successfully!');
            } else {
                toast.error("Failed to delete automaton: " + result.error);
            }
        } catch (err) {
            console.error("Error deleting automaton:", err);
            toast.error("Failed to delete automaton");
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    const filteredAutomata = automataList.filter(automaton =>
        automaton.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen">
            <Navbar />
            
            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
                        onClick={() => setDeleteModal({ isOpen: false, id: null })}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 z-10">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Automaton?</h3>
                            <p className="text-gray-600">This action cannot be undone. Are you sure you want to delete this automaton?</p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                {/* Header with Title and Add Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                            Finite Automata
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">Create, manage, and visualize your automata</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base"
                    >
                        <Plus size={18} className='sm:w-5 sm:h-5' />
                        <span>Create New</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6 sm:mb-8 animate-slide-in">
                    <Search 
                        className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent shadow-sm transition-all duration-300"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredAutomata.map((automata, index) => (
                                <div 
                                    key={automata.id || index}
                                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer border border-gray-100 group"
                                    onClick={() => navigate(`/edit/${automata.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                                        <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-800 group-hover:text-[#1a365d] transition-colors duration-300 flex-1 line-clamp-2 pr-2">
                                            {automata.name}
                                        </h1>
                                        <div className="bg-gradient-to-br from-[#1a365d] to-[#2d4a7c] p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                                        <div className="flex items-center text-xs sm:text-sm">
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-gray-500 font-medium">Created:</span>
                                            <span className="text-gray-700 ml-1.5 sm:ml-2 truncate">{new Date(automata.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-xs sm:text-sm">
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span className="text-gray-500 font-medium">Updated:</span>
                                            <span className="text-gray-700 ml-1.5 sm:ml-2 truncate">{new Date(automata.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/edit/${automata.id}`);
                                        }}
                                        className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className='hidden sm:inline'>Edit & Visualize</span>
                                        <span className='sm:hidden'>Edit</span>
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
