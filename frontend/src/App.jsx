import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import FiniteAutomataList from './components/FiniteAutomataList';
import NewAutomata from './components/NewAutomata';
import EditAutomata from './components/EditAutomata';
import OurTeam from './components/OurTeam';

export default function App() {
    return (
        <div className="min-h-screen">
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <Router>
                <Routes>
                    <Route path="/" element={<FiniteAutomataList />} />
                    <Route path="/new" element={<NewAutomata />} />
                    <Route path="/edit/:id" element={<EditAutomata />} />
                    <Route path="/team" element={<OurTeam />} />
                </Routes>
            </Router>
        </div>
    );
}
