import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { getAutomatonById, updateAutomaton, deleteAutomaton } from '../services/storageService';
import Navbar from './Navbar';

// Import the same components used in NewAutomata
import MultipleSelection from './MultipleSeletion';
import SingleSelection from './SingleSelection';
import Features from './Features';

export default function EditAutomata() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State variables (same as NewAutomata)
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [statesText, setStatesText] = useState("");
    const [symbolsText, setSymbolsText] = useState("");
    const [faName, setFaName] = useState("");
    const [states, setStates] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [startState, setStartState] = useState("");
    const [finalStates, setFinalStates] = useState([]);
    const [transitions, setTransitions] = useState({});

    useEffect(() => {
        const fetchAutomaton = () => {
            try {
                setLoading(true);
                const automaton = getAutomatonById(id);
                
                if (automaton) {
                    setFaName(automaton.name);
                    setStates(automaton.states);
                    setSymbols(automaton.symbols);
                    setStartState(automaton.start_state);
                    setFinalStates(automaton.end_states);
                    setTransitions(automaton.transitions);

                    // Set the text fields for editing
                    setStatesText(automaton.states.join(','));
                    setSymbolsText(automaton.symbols.join(','));
                } else {
                    toast.error("Automaton not found");
                    navigate("/");
                }
            } catch (err) {
                console.error("Error fetching automaton:", err);
                toast.error("Failed to load automaton");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAutomaton();
        }
    }, [id, navigate]);

    useEffect(() => {
        if (deleteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [deleteModal]);

    const handleUpdate = () => {
        if (!faName.trim()) {
            toast.error("Please enter a name for the automaton");
            return;
        }

        // Validate transitions completeness
        const isTransitionsComplete = states.every(state => 
            symbols.every(symbol => 
                Array.isArray(transitions[state]?.[symbol])
            ) && Array.isArray(transitions[state]?.['ɛ'])
        );
        
        if (!isTransitionsComplete) {
            toast.error("Please complete all transition entries");
            return;
        }

        try {
            const result = updateAutomaton(id, {
                name: faName,
                states,
                symbols,
                startState,
                finalStates,
                transitions
            });

            if (result.success) {
                toast.success("Automaton updated successfully!");
                navigate("/");
            } else {
                toast.error("Failed to update automaton: " + result.error);
            }
        } catch (err) {
            console.error("Error updating automaton:", err);
            toast.error("Failed to update automaton. Please try again.");
        }
    };

    const handleDelete = () => {
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        try {
            const result = deleteAutomaton(id);
            if (result.success) {
                toast.success("Automaton deleted successfully!");
                navigate("/");
            } else {
                toast.error("Failed to delete automaton: " + result.error);
            }
        } catch (err) {
            console.error("Error deleting automaton:", err);
            toast.error("Failed to delete automaton. Please try again.");
        } finally {
            setDeleteModal(false);
        }
    };

    // Event handlers for updating states and symbols
    const handleStatesChange = (e) => {
        const value = e.target.value;
        setStatesText(value);

        const arr = value.split(",").map(s => s.trim()).filter(Boolean);
        setStates(arr);
    };

    const handleSymbolsChange = (e) => {
        const value = e.target.value;
        setSymbolsText(value);

        const arr = value.split(",").map(s => s.trim()).filter(Boolean);
        setSymbols(arr);
    };

    const handleStartStateChange = (selected) => {
        setStartState(selected);
    };

    const handleFinalStatesChange = (selected) => {
        setFinalStates(selected);
    };

    // Update transitions when states or symbols change
    useEffect(() => {
        if (states.length > 0 && symbols.length > 0) {
            const newTransitions = {};
            states.forEach((state) => {
                newTransitions[state] = {};
                symbols.forEach((symbol) => {
                    newTransitions[state][symbol] = transitions[state]?.[symbol] || [];
                });
                newTransitions[state]['ɛ'] = transitions[state]?.['ɛ'] || [];
            });
            setTransitions(newTransitions);
        }
    }, [states, symbols]);

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1a365d] mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading automaton...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            
            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
                        onClick={() => setDeleteModal(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 z-10">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Automaton?</h3>
                            <p className="text-gray-600">This action cannot be undone. Are you sure you want to delete this automaton?</p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModal(false)}
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
                {/* Header Section */}
                <div className="mb-6 sm:mb-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Edit Automaton</h1>
                            <p className="text-sm sm:text-base text-gray-600">Modify your DFA or NFA specifications</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:shadow-md text-sm sm:text-base"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Back</span>
                        </button>
                    </div>

                    {/* Name & Actions Section */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 mb-4 sm:mb-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex-1">
                                <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Automaton Name
                                </label>
                                <input
                                    value={faName}
                                    onChange={(e) => setFaName(e.target.value)}
                                    type="text"
                                    placeholder="e.g., Binary String Acceptor"
                                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all duration-300"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={handleUpdate}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Update</span>
                                </button>
                                
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* States & Symbols Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
                            <label className="flex items-center gap-2 mb-2 sm:mb-3 font-semibold text-gray-700 text-sm sm:text-base">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                States
                            </label>
                            <input
                                placeholder="q0, q1, q2"
                                value={statesText}
                                onChange={handleStatesChange}
                                type="text"
                                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all duration-300"
                            />
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Comma-separated state names</p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
                            <label className="flex items-center gap-2 mb-2 sm:mb-3 font-semibold text-gray-700 text-sm sm:text-base">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                Input Symbols
                            </label>
                            <input
                                placeholder="0, 1"
                                value={symbolsText}
                                onChange={handleSymbolsChange}
                                type="text"
                                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all duration-300"
                            />
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Epsilon (ɛ) added automatically for NFA</p>
                        </div>
                    </div>

                    {/* Start & Final States */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
                            <label className="flex items-center gap-2 mb-2 sm:mb-3 font-semibold text-gray-700 text-sm sm:text-base">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                Start State
                            </label>
                            <SingleSelection 
                                options={states}
                                handleStartStateChange={handleStartStateChange}
                                initialState={startState}
                            />
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
                            <label className="flex items-center gap-2 mb-2 sm:mb-3 font-semibold text-gray-700 text-sm sm:text-base">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                Final States
                            </label>
                            <MultipleSelection
                                options={states}
                                handleEndStatesChange={handleFinalStatesChange}
                                initialSelect={finalStates}
                            />
                        </div>
                    </div>
                </div>

                {/* Transition Table */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        <span className='hidden sm:inline'>Transition Function</span>
                        <span className='sm:hidden'>Transitions</span>
                    </h3>
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                        <table className="w-full border-collapse min-w-[500px]">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white">
                                    <th className="border-2 border-gray-300 p-2 sm:p-3 font-semibold text-xs sm:text-base">State</th>
                                    {symbols.map(sym => (
                                        <th key={sym} className="border-2 border-gray-300 p-2 sm:p-3 font-semibold text-xs sm:text-base">{sym}</th>
                                    ))}
                                    <th className="border-2 border-gray-300 p-2 sm:p-3 font-semibold text-xs sm:text-base">ɛ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {states.map((state, idx) => (
                                    <tr key={state} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="border-2 border-gray-200 p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-base">{state}</td>
                                        {symbols.map(symbol => (
                                            <td key={`${state}-${symbol}`} className="border-2 border-gray-200 p-2">
                                                <MultipleSelection
                                                    options={states}
                                                    initialSelect={transitions[state]?.[symbol] || []}
                                                    handleEndStatesChange={(selected) => {
                                                        setTransitions((prev) => ({
                                                            ...prev,
                                                            [state]: {
                                                                ...prev[state],
                                                                [symbol]: selected,
                                                            },
                                                        }));
                                                    }}
                                                />
                                            </td>
                                        ))}
                                        <td key={`${state}-ɛ`} className="border-2 border-gray-200 p-2">
                                            <MultipleSelection
                                                options={states}
                                                initialSelect={transitions[state]?.['ɛ'] || []}
                                                handleEndStatesChange={(selected) => {
                                                    setTransitions((prev) => ({
                                                        ...prev,
                                                        [state]: {
                                                            ...prev[state],
                                                            'ɛ': selected,
                                                        },
                                                    }));
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Features Section */}
                <Features
                    transitions={transitions}
                    symbols={symbols}
                    start_state={startState}
                    end_states={finalStates}
                    states={states}
                    fa={{
                        name: faName,
                        states: states,
                        symbols: symbols,
                        start_state: startState,
                        end_states: finalStates,
                        transitions: transitions,
                    }}
                />
            </div>
        </div>
    );
}


