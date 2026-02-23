/**
 * Minimize a DFA using table-filling algorithm
 * @param {Object} data - DFA data with states, symbols, transitions, start_state, and end_states
 * @returns {Promise<Object>} Minimized DFA
 */
export function minimizeDFA(data) {
    return new Promise((resolve, reject) => {
        try {
            if (!data.transitions || !data.start_state || !data.end_states || !data.symbols) {
                reject(new Error("JSON must contain 'transitions', 'start_state', 'end_states', and 'symbols'"));
                return;
            }

            const dfa = parseDFA(data);
            const minimized = performMinimization(dfa);
            const result = dfaToJson(minimized);
            
            resolve(result);
        } catch (error) {
            reject(new Error(error.message));
        }
    });
}

/**
 * Parse input JSON to DFA structure
 */
function parseDFA(data) {
    const dfa = {
        states: new Set(),
        alphabet: new Set(),
        transitions: new Map(),
        start_state: data.start_state,
        accept_states: new Set(data.end_states)
    };

    // Parse symbols (skip epsilon)
    for (const sym of data.symbols) {
        if (sym !== 'ɛ' && sym !== 'ε' && sym.length === 1) {
            dfa.alphabet.add(sym);
        }
    }

    // Parse transitions
    for (const fromState in data.transitions) {
        dfa.states.add(fromState);
        
        for (const symbol in data.transitions[fromState]) {
            if (symbol !== 'ɛ' && symbol !== 'ε' && symbol.length === 1) {
                const targetStates = data.transitions[fromState][symbol];
                if (Array.isArray(targetStates) && targetStates.length === 1) {
                    const toState = targetStates[0];
                    const key = `${fromState},${symbol}`;
                    dfa.transitions.set(key, toState);
                    dfa.states.add(toState);
                }
            }
        }
    }

    return dfa;
}

/**
 * Perform DFA minimization
 */
function performMinimization(dfa) {
    // Step 1: Remove unreachable states
    const reachable = new Set();
    const queue = [dfa.start_state];
    reachable.add(dfa.start_state);

    while (queue.length > 0) {
        const current = queue.shift();
        for (const symbol of dfa.alphabet) {
            const key = `${current},${symbol}`;
            if (dfa.transitions.has(key)) {
                const nextState = dfa.transitions.get(key);
                if (!reachable.has(nextState)) {
                    reachable.add(nextState);
                    queue.push(nextState);
                }
            }
        }
    }

    // Step 2: Create state mappings
    const statesVec = Array.from(reachable);
    const n = statesVec.length;
    const stateToIdx = new Map();
    
    for (let i = 0; i < n; i++) {
        stateToIdx.set(statesVec[i], i);
    }

    // Step 3: Create distinguishability table
    const distinguishable = Array(n).fill(null).map(() => Array(n).fill(false));
    const newlyDistinguishable = [];

    // Mark pairs where one is accepting and other is not
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const iAccept = dfa.accept_states.has(statesVec[i]);
            const jAccept = dfa.accept_states.has(statesVec[j]);
            if (iAccept !== jAccept) {
                distinguishable[i][j] = true;
                newlyDistinguishable.push([i, j]);
            }
        }
    }

    // Step 4: Table-filling algorithm with queue-based propagation
    while (newlyDistinguishable.length > 0) {
        const [p, q] = newlyDistinguishable.shift();

        for (let r = 0; r < n; r++) {
            for (let s = r + 1; s < n; s++) {
                if (!distinguishable[r][s]) {
                    for (const symbol of dfa.alphabet) {
                        const keyR = `${statesVec[r]},${symbol}`;
                        const keyS = `${statesVec[s]},${symbol}`;
                        
                        const hasR = dfa.transitions.has(keyR);
                        const hasS = dfa.transitions.has(keyS);

                        // If one has transition and other doesn't, they're distinguishable
                        if (hasR !== hasS) {
                            distinguishable[r][s] = true;
                            newlyDistinguishable.push([r, s]);
                            break;
                        }

                        // If both have transitions, check if they go to distinguishable states
                        if (hasR && hasS) {
                            const nextR = dfa.transitions.get(keyR);
                            const nextS = dfa.transitions.get(keyS);

                            if (stateToIdx.has(nextR) && stateToIdx.has(nextS)) {
                                const idxR = stateToIdx.get(nextR);
                                const idxS = stateToIdx.get(nextS);

                                if (idxR !== idxS) {
                                    const minIdx = Math.min(idxR, idxS);
                                    const maxIdx = Math.max(idxR, idxS);
                                    if (distinguishable[minIdx][maxIdx]) {
                                        distinguishable[r][s] = true;
                                        newlyDistinguishable.push([r, s]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Step 5: Create equivalence classes using Union-Find
    const parent = Array.from({ length: n }, (_, i) => i);

    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    function unite(x, y) {
        x = find(x);
        y = find(y);
        if (x !== y) {
            parent[y] = x;
        }
    }

    // Union equivalent states
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (!distinguishable[i][j]) {
                unite(i, j);
            }
        }
    }

    // Map each root to a class ID
    const rootToClass = new Map();
    let classCount = 0;
    const classId = Array(n);

    for (let i = 0; i < n; i++) {
        const root = find(i);
        if (!rootToClass.has(root)) {
            rootToClass.set(root, classCount++);
        }
        classId[i] = rootToClass.get(root);
    }

    // Step 6: Build minimized DFA
    const newDfa = {
        states: new Set(),
        alphabet: dfa.alphabet,
        transitions: new Map(),
        start_state: dfa.start_state,
        accept_states: new Set()
    };

    // Find representatives for each class
    const classRepresentatives = new Map();
    const classToState = new Map();

    for (let i = 0; i < n; i++) {
        const cls = classId[i];
        if (!classRepresentatives.has(cls)) {
            classRepresentatives.set(cls, statesVec[i]);
        } else {
            // Prefer start state as representative
            if (statesVec[i] === dfa.start_state) {
                classRepresentatives.set(cls, statesVec[i]);
            }
        }
    }

    // Create state names
    for (let i = 0; i < classCount; i++) {
        const rep = classRepresentatives.get(i);
        classToState.set(i, rep);
        newDfa.states.add(rep);
    }

    // Set accept states
    for (const acceptState of dfa.accept_states) {
        if (stateToIdx.has(acceptState)) {
            const idx = stateToIdx.get(acceptState);
            const cls = classId[idx];
            newDfa.accept_states.add(classToState.get(cls));
        }
    }

    // Set transitions
    for (let i = 0; i < classCount; i++) {
        const repState = classRepresentatives.get(i);

        for (const symbol of dfa.alphabet) {
            const key = `${repState},${symbol}`;
            if (dfa.transitions.has(key)) {
                const nextState = dfa.transitions.get(key);
                if (stateToIdx.has(nextState)) {
                    const nextIdx = stateToIdx.get(nextState);
                    const nextClass = classId[nextIdx];
                    const newKey = `${classToState.get(i)},${symbol}`;
                    newDfa.transitions.set(newKey, classToState.get(nextClass));
                }
            }
        }
    }

    return newDfa;
}

/**
 * Convert DFA structure to JSON format
 */
function dfaToJson(dfa) {
    const result = {
        success: true,
        states: Array.from(dfa.states),
        symbols: Array.from(dfa.alphabet),
        start_state: dfa.start_state,
        end_states: Array.from(dfa.accept_states),
        transitions: {}
    };

    // Format transitions
    for (const state of dfa.states) {
        result.transitions[state] = {};
        
        for (const symbol of dfa.alphabet) {
            const key = `${state},${symbol}`;
            if (dfa.transitions.has(key)) {
                result.transitions[state][symbol] = [dfa.transitions.get(key)];
            } else {
                result.transitions[state][symbol] = [];
            }
        }
        
        // Add empty epsilon transitions
        result.transitions[state]['ɛ'] = [];
    }

    return result;
}
