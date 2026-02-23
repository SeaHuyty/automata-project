/**
 * Check if a finite automaton is a DFA or NFA
 * @param {Object} data - Automaton data with transitions and symbols
 * @returns {Promise<Object>} Result with success status and type (DFA or NFA)
 */
export function checkFAType(data) {
    return new Promise((resolve, reject) => {
        try {
            if (!data.transitions || !data.symbols) {
                reject(new Error("JSON must contain 'transitions' and 'symbols'"));
                return;
            }

            const { transitions, symbols } = data;
            const isDfa = isDFA(transitions, symbols);

            resolve({
                success: true,
                type: isDfa ? "DFA" : "NFA"
            });
        } catch (error) {
            reject(new Error(error.message));
        }
    });
}

/**
 * Determine if the automaton is a DFA
 * @param {Object} transitions - State transition table
 * @param {Array<string>} symbols - Input alphabet symbols
 * @returns {boolean} True if DFA, false if NFA
 */
function isDFA(transitions, symbols) {
    // First, check if there are any non-empty epsilon transitions
    for (const state in transitions) {
        const stateTransitions = transitions[state];
        
        // Check for epsilon transitions (both ɛ and ε)
        if (stateTransitions['ɛ'] && Array.isArray(stateTransitions['ɛ']) && stateTransitions['ɛ'].length > 0) {
            return false; // Has epsilon transitions, so it's NFA
        }
        if (stateTransitions['ε'] && Array.isArray(stateTransitions['ε']) && stateTransitions['ε'].length > 0) {
            return false; // Has epsilon transitions, so it's NFA
        }
    }

    // Check for non-epsilon symbols - each state must have exactly one transition for each symbol
    for (const state in transitions) {
        const stateTransitions = transitions[state];
        
        for (const symbol of symbols) {
            // Skip epsilon symbol for DFA check - empty epsilon transitions are allowed in DFA
            if (symbol === 'ɛ' || symbol === 'ε') continue;

            if (!stateTransitions.hasOwnProperty(symbol)) {
                return false; // Missing transition
            }
            
            if (!Array.isArray(stateTransitions[symbol])) {
                return false; // Invalid format
            }
            
            if (stateTransitions[symbol].length !== 1) {
                return false; // Multiple transitions or no transitions
            }
        }
    }
    
    return true;
}
