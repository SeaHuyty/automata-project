/**
 * LocalStorage service for managing automata data in the browser
 * No backend database needed - all data stored locally
 */

const STORAGE_KEY = 'automata_collection';

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Get all automata from localStorage
 */
export function getAllAutomata() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

/**
 * Get a single automaton by ID
 */
export function getAutomatonById(id) {
    const automata = getAllAutomata();
    return automata.find(a => a.id === id);
}

/**
 * Save a new automaton
 */
export function saveAutomaton({ name, states, symbols, startState, finalStates, transitions }) {
    try {
        const automata = getAllAutomata();
        
        const newAutomaton = {
            id: generateId(),
            name,
            states,
            symbols,
            start_state: startState,
            end_states: finalStates,
            transitions,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        automata.push(newAutomaton);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(automata));
        
        return {
            success: true,
            id: newAutomaton.id,
            message: 'Automaton saved successfully',
            automaton: newAutomaton
        };
    } catch (error) {
        console.error('Error saving automaton:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update an existing automaton
 */
export function updateAutomaton(id, { name, states, symbols, startState, finalStates, transitions }) {
    try {
        const automata = getAllAutomata();
        const index = automata.findIndex(a => a.id === id);
        
        if (index === -1) {
            return {
                success: false,
                error: 'Automaton not found'
            };
        }

        automata[index] = {
            ...automata[index],
            name,
            states,
            symbols,
            start_state: startState,
            end_states: finalStates,
            transitions,
            updated_at: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(automata));
        
        return {
            success: true,
            message: 'Automaton updated successfully',
            automaton: automata[index]
        };
    } catch (error) {
        console.error('Error updating automaton:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Delete an automaton
 */
export function deleteAutomaton(id) {
    try {
        const automata = getAllAutomata();
        const filteredAutomata = automata.filter(a => a.id !== id);
        
        if (filteredAutomata.length === automata.length) {
            return {
                success: false,
                error: 'Automaton not found'
            };
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAutomata));
        
        return {
            success: true,
            message: 'Automaton deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting automaton:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Clear all automata (useful for testing or reset)
 */
export function clearAllAutomata() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return {
            success: true,
            message: 'All automata cleared'
        };
    } catch (error) {
        console.error('Error clearing automata:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Export all automata as JSON (for backup/download)
 */
export function exportAutomata() {
    const automata = getAllAutomata();
    return JSON.stringify(automata, null, 2);
}

/**
 * Import automata from JSON (for restore/upload)
 */
export function importAutomata(jsonString) {
    try {
        const automata = JSON.parse(jsonString);
        
        if (!Array.isArray(automata)) {
            return {
                success: false,
                error: 'Invalid data format: expected an array'
            };
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(automata));
        
        return {
            success: true,
            message: `Imported ${automata.length} automata successfully`
        };
    } catch (error) {
        console.error('Error importing automata:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get storage statistics
 */
export function getStorageStats() {
    const automata = getAllAutomata();
    const dataSize = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
    
    return {
        count: automata.length,
        size: dataSize,
        sizeFormatted: formatBytes(dataSize)
    };
}

/**
 * Helper function to format bytes
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
