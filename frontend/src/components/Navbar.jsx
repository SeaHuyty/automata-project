import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isTeamPage = location.pathname === '/team';

    return (
        <nav className='bg-gradient-to-r from-[#1a365d] via-[#2d4a7c] to-[#1a365d] shadow-lg sticky top-0 z-50 backdrop-blur-sm'>
            <div className='max-w-7xl px-6 mx-auto flex w-full justify-between items-center py-4'>
                <Link to="/" className='flex items-center gap-3 group'>
                    <div className='bg-white p-2 rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300'>
                        <img className='h-10 w-auto' src="./CADT.png" alt="CADT Logo" />
                    </div>
                    <div>
                        <h1 className='text-white font-bold text-xl tracking-tight'>Automata Simulator</h1>
                        <p className='text-blue-200 text-xs'>DFA & NFA Visualizer</p>
                    </div>
                </Link>
                <Link to="/team">
                    <button className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                        isTeamPage 
                            ? 'bg-white text-[#1a365d] shadow-lg'
                            : 'bg-white/10 text-white hover:bg-white hover:text-[#1a365d] border border-white/20'
                    }`}>
                        <Users size={18} />
                        <span>Our Team</span>
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar