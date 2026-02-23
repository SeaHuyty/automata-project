import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveAutomaton } from "../services/storageService";
import MultipleSelection from "./MultipleSeletion";
import SingleSelection from "./SingleSelection";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Features from "./Features";
import Navbar from "./Navbar";

export default function NewAutomata() {
    const navigate = useNavigate();
    const [symbolsText, setSymbolsText] = useState("");
    const [symbols, setSymbols] = useState([]);
    const [statesText, setStatesText] = useState("");
    const [states, setStates] = useState([]);
    const [faName, setFaName] = useState("");
    const [startState, setStartState] = useState("");
    const [finalStates, setFinalStates] = useState([]);
    const [transitions, setTransitions] = useState({});
    const fa = {
        name: faName,
        states: states,
        symbols: symbols,
        start_state: startState,
        end_states: finalStates,
        transitions: transitions,
    };

    // Update transitions whenever states or symbols change
    useEffect(() => {
        const newTransitions = {};
        states.forEach((state) => {
            newTransitions[state] = {};
            symbols.forEach((symbol) => {
                newTransitions[state][symbol] = [];
            });
            // Always include epsilon transitions (empty by default)
            newTransitions[state]['ɛ'] = [];
        });
        setTransitions(newTransitions);
    }, [states, symbols]);
    
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


    const handleStartStateChange = (selectedStates) => {
        setStartState(selectedStates);
    };

    const handleFinalStatesChange = (selectedStates) => {
        setFinalStates(selectedStates);
    };


    const handleSave = async () => {
        // Add validation
        if (!faName.trim()) {
            alert("Please enter a name for the automaton");
            return;
        }
        
        if (states.length === 0) {
            alert("Please add at least one state");
            return;
        }
        
        if (symbols.length === 0) {
            alert("Please add at least one symbol");
            return;
        }
        
        if (!startState) {
            alert("Please select a start state");
            return;
        }
        
        if (finalStates.length === 0) {
            alert("Please select at least one final state");
            return;
        }

        try {
            const result = saveAutomaton({
                name: faName,
                states,
                symbols,
                startState,
                finalStates,
                transitions
            });

            if (result.success) {
                console.log("Saved:", result);
                alert("Automaton saved successfully!");
                navigate("/");
            } else {
                alert("Failed to save automaton: " + result.error);
            }
        } catch (err) {
            console.error("Error saving automaton:", err);
            alert("Failed to save automaton. Please try again.");
        }
    };
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header Section */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Automaton</h1>
                                <p className="text-gray-600">Define your DFA or NFA with complete specifications</p>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:shadow-md"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                        </div>

                        {/* Name & Save Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                                        <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Automaton Name
                                    </label>
                                    <input
                                        value={faName}
                                        onChange={(e) => setFaName(e.target.value)}
                                        type="text"
                                        placeholder="e.g., Binary String Acceptor"
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* States & Symbols Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                                    <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    States
                                </label>
                                <input
                                    placeholder="q0, q1, q2"
                                    value={statesText}
                                    onChange={handleStatesChange}
                                    type="text"
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all duration-300"
                                />
                                <p className="text-sm text-gray-500 mt-2">Comma-separated state names</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                                    <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Input Symbols
                                </label>
                                <input
                                    placeholder="0, 1"
                                    value={symbolsText}
                                    onChange={handleSymbolsChange}
                                    type="text"
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all duration-300"
                                />
                                <p className="text-sm text-gray-500 mt-2">Epsilon (ɛ) added automatically for NFA</p>
                            </div>
                        </div>

                        {/* Start & Final States */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            Transition Function
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white">
                                        <th className="border-2 border-gray-300 p-3 font-semibold">State</th>
                                        {symbols.map(sym => (
                                            <th key={sym} className="border-2 border-gray-300 p-3 font-semibold">{sym}</th>
                                        ))}
                                        <th className="border-2 border-gray-300 p-3 font-semibold">ɛ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {states.map((state, idx) => (
                                        <tr key={state} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="border-2 border-gray-200 p-3 font-medium text-gray-700">{state}</td>
                                            {symbols.map(symbol => (
                                                <td key={`${state}-${symbol}`} className="border-2 border-gray-200 p-2">
                                                    <MultipleSelection
                                                        options={states}
                                                        initialSelect={transitions[state]?.[symbol] || []}
                                                        handleEndStatesChange={(selected) => {
                                                            // Update transitions directly with array
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
                                                        // Update transitions directly with array
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
                        fa={fa}
                    />
                </div>
        </div>
    );
}
