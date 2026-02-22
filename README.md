# 🧠 Automata Simulator (DFA & NFA)

Welcome to the Automata Simulator, a full-stack web application designed to simulate and visualize Finite Automata. This comprehensive tool allows you to create, edit, and test both **Deterministic Finite Automata (DFA)** and **Non-Deterministic Finite Automata (NFA)**. The project features a React-based frontend with browser-based storage and a Node.js/Express backend for computational operations.

---

## 🚀 Features

- **Interactive Web Interface:** A user-friendly UI to build and visualize automata.
- **DFA and NFA Simulation:** Create and run simulations for both DFA and NFA.
- **NFA to DFA Conversion:** Automatically convert an NFA to an equivalent DFA.
- **DFA Minimization:** Optimize DFAs by reducing the number of states.
- **Input String Validation:** Test strings against your created automata to see if they are accepted or rejected.
- **Browser-based Storage:** All your automata are stored locally in your browser using localStorage (no account/database needed).

---

**Note:** All user data is stored in the browser's localStorage, so no database configuration is required!

---

## 📦 Example JSON Input

Here is an example of a DFA definition in JSON format:

```json
{
  "states": ["q0", "q1", "q2"],
  "alphabet": ["0", "1"],
  "transitions": [
    { "source": "q0", "input": "0", "destination": "q1" },
    { "source": "q0", "input": "1", "destination": "q0" },
    { "source": "q1", "input": "0", "destination": "q1" },
    { "source": "q1", "input": "1", "destination": "q2" },
    { "source": "q2", "input": "0", "destination": "q1" },
    { "source": "q2", "input": "1", "destination": "q0" }
  ],
  "start_state": "q0",
  "accept_states": ["q2"]
}
````
