/**
 * Convert NFA to DFA using subset construction algorithm
 * @param {Object} data - NFA data with states, symbols, transitions, start_state, and end_states
 * @returns {Promise<Object>} Converted DFA with conversion information
 */
export function convertNFAtoDFA(data) {
    return new Promise((resolve, reject) => {
        try {
            // Validate required fields
            if (!data.transitions || !data.start_state || !data.end_states || !data.symbols) {
                reject(new Error("Missing required fields: transitions, start_state, end_states, symbols"));
                return;
            }

            const result = performConversion(data);
            resolve(result);
        } catch (error) {
            reject(new Error(`Conversion error: ${error.message}`));
        }
    });
}

/**
 * Compute epsilon closure of a set of states
 */
function epsilonClosure(states, transitions) {
    const closure = new Set(states);
    const toProcess = [...states];

    while (toProcess.length > 0) {
        const currentState = toProcess.shift();

        // Check for epsilon transitions (both ɛ and ε)
        if (transitions[currentState]) {
            const epsilonTrans = transitions[currentState]['ɛ'] || transitions[currentState]['ε'];
            
            if (Array.isArray(epsilonTrans)) {
                for (const nextState of epsilonTrans) {
                    if (!closure.has(nextState)) {
                        closure.add(nextState);
                        toProcess.push(nextState);
                    }
                }
            }
        }
    }

    return closure;
}

/**
 * Get the set of states reachable from a set of states on a given symbol
 */
function move(states, symbol, transitions) {
    const result = new Set();
    
    for (const state of states) {
        if (transitions[state] && transitions[state][symbol]) {
            const nextStates = transitions[state][symbol];
            if (Array.isArray(nextStates)) {
                for (const nextState of nextStates) {
                    result.add(nextState);
                }
            }
        }
    }
    
    return result;
}

/**
 * Generate a name for a DFA state from its NFA states
 */
function generateStateName(nfaStates, stateCounter) {
    if (nfaStates.size === 0) {
        return '∅';
    }

    const stateSet = Array.from(nfaStates).sort().join(',');
    
    if (!stateCounter.has(stateSet)) {
        stateCounter.set(stateSet, stateCounter.size);
    }

    return 'q' + stateCounter.get(stateSet);
}

/**
 * Convert set to comparable key for Map
 */
function setToKey(set) {
    return Array.from(set).sort().join(',');
}

/**
 * Perform NFA to DFA conversion using subset construction
 */
function performConversion(nfaData) {
    const nfaTransitions = nfaData.transitions;
    const nfaStartState = nfaData.start_state;
    const nfaEndStates = new Set(nfaData.end_states);
    const symbols = nfaData.symbols;

    // Check if there are epsilon transitions
    let hasEpsilonTransitions = false;
    for (const state in nfaTransitions) {
        const stateTransitions = nfaTransitions[state];
        if ((stateTransitions['ɛ'] && Array.isArray(stateTransitions['ɛ']) && stateTransitions['ɛ'].length > 0) ||
            (stateTransitions['ε'] && Array.isArray(stateTransitions['ε']) && stateTransitions['ε'].length > 0)) {
            hasEpsilonTransitions = true;
            break;
        }
    }

    // Remove epsilon from symbols for DFA
    const dfaSymbols = symbols.filter(s => s !== 'ɛ' && s !== 'ε');

    // Data structures for DFA construction
    const dfaStates = new Map(); // key: state set key, value: DFA state info
    const unprocessedStates = [];
    const dfaTransitions = {};
    const stateCounter = new Map();

    // Start with epsilon closure of NFA start state
    const startStateSet = new Set([nfaStartState]);
    const startClosure = epsilonClosure(startStateSet, nfaTransitions);
    const startKey = setToKey(startClosure);

    // Create initial DFA state
    const startDFAState = {
        nfaStates: startClosure,
        name: generateStateName(startClosure, stateCounter),
        isAccepting: Array.from(startClosure).some(s => nfaEndStates.has(s))
    };

    dfaStates.set(startKey, startDFAState);
    unprocessedStates.push(startClosure);

    // Process all states using subset construction
    while (unprocessedStates.length > 0) {
        const currentStateSet = unprocessedStates.shift();
        const currentKey = setToKey(currentStateSet);
        const currentStateName = dfaStates.get(currentKey).name;

        dfaTransitions[currentStateName] = {};

        // For each symbol in the alphabet
        for (const symbol of dfaSymbols) {
            // Compute move(currentStateSet, symbol)
            const moveResult = move(currentStateSet, symbol, nfaTransitions);

            // Compute epsilon closure of the move result
            const newStateSet = epsilonClosure(moveResult, nfaTransitions);

            if (newStateSet.size > 0) {
                const newKey = setToKey(newStateSet);

                // Check if this state set already exists
                if (!dfaStates.has(newKey)) {
                    // Create new DFA state
                    const newDFAState = {
                        nfaStates: newStateSet,
                        name: generateStateName(newStateSet, stateCounter),
                        isAccepting: Array.from(newStateSet).some(s => nfaEndStates.has(s))
                    };

                    dfaStates.set(newKey, newDFAState);
                    unprocessedStates.push(newStateSet);
                }

                // Add transition
                const targetStateName = dfaStates.get(newKey).name;
                dfaTransitions[currentStateName][symbol] = [targetStateName];
            }
        }
    }

    // Collect DFA states and end states
    const dfaStatesList = [];
    const dfaEndStatesList = [];

    for (const dfaState of dfaStates.values()) {
        dfaStatesList.push(dfaState.name);
        if (dfaState.isAccepting) {
            dfaEndStatesList.push(dfaState.name);
        }
    }

    // Create result JSON
    const result = {
        success: true,
        dfa: {
            states: dfaStatesList,
            symbols: dfaSymbols,
            transitions: dfaTransitions,
            start_state: dfaStates.get(setToKey(startClosure)).name,
            end_states: dfaEndStatesList
        },
        conversion_info: {
            original_nfa_states: nfaData.states ? nfaData.states.length : Object.keys(nfaTransitions).length,
            resulting_dfa_states: dfaStatesList.length,
            epsilon_transitions_removed: hasEpsilonTransitions
        }
    };

    return result;
}
