/**
 * Test if an input string is accepted by a finite automaton (DFA/NFA)
 * @param {Object} params - Automaton data with transitions, start_state, end_states, and input_string
 * @returns {Promise<Object>} Validation result with accepted status, path, and final state
 */
export function testInputStringWithCpp({ transitions, start_state, end_states, input_string }) {
    return new Promise((resolve, reject) => {
        try {
            const result = validateString(transitions, start_state, new Set(end_states), input_string);
            
            const response = {
                success: true,
                accepted: result.accepted,
                path: result.path,
                final_state: result.currentState,
                input_length: input_string.length,
                path_length: result.path.length
            };

            if (result.error) {
                response.error = result.error;
                response.success = false;
            }

            resolve(response);
        } catch (error) {
            reject(new Error(error.message));
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
 * Validate an input string against the automaton
 */
function validateString(transitions, startState, endStates, inputString) {
    const result = {
        accepted: false,
        path: [],
        currentState: '',
        position: 0,
        error: ''
    };

    try {
        // Start with epsilon closure of the start state
        let currentStates = new Set([startState]);
        currentStates = epsilonClosure(currentStates, transitions);

        // Add all states in initial epsilon closure to path
        result.path.push(startState);
        for (const state of currentStates) {
            if (state !== startState) {
                result.path.push(`${state} (ɛ)`);
            }
        }

        // Process each input symbol
        for (const char of inputString) {
            const symbol = char;
            const nextStates = new Set();

            // For each current state, find all possible next states
            for (const currentState of currentStates) {
                if (transitions[currentState] && transitions[currentState][symbol]) {
                    const stateNextStates = transitions[currentState][symbol];
                    if (Array.isArray(stateNextStates)) {
                        for (const nextState of stateNextStates) {
                            nextStates.add(nextState);
                        }
                    }
                }
            }

            // If no transitions found for this symbol, reject
            if (nextStates.size === 0) {
                result.error = `No valid transition for symbol '${symbol}' from current states`;
                return result;
            }

            // Add epsilon closure of next states
            const closureStates = epsilonClosure(nextStates, transitions);
            currentStates = closureStates;

            // Update path with first state reached (simplified)
            if (currentStates.size > 0) {
                const firstState = Array.from(currentStates)[0];
                result.path.push(firstState);
                result.currentState = firstState;
            }

            result.position++;
        }

        // Check if any current state is accepting
        for (const state of currentStates) {
            if (endStates.has(state)) {
                result.accepted = true;
                result.currentState = state;
                break;
            }
        }

    } catch (error) {
        result.error = `Error during validation: ${error.message}`;
        result.accepted = false;
    }

    return result;
}
