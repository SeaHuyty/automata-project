import React from 'react'
import Navbar from './Navbar'

const OurTeam = () => {
    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className='text-center mb-6 sm:mb-8'>
                    <h1 className='text-2xl sm:text-3xl font-semibold text-gray-800 mb-2'>Our Team</h1>
                    <p className='text-sm sm:text-base text-gray-600'>Meet the talented individuals behind the project.</p>
                </div>
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10'>
                    <a href="https://github.com/SeaHuyty" target='_blank' className='transform transition ease-in-out hover:scale-105 rounded-lg overflow-hidden shadow-md hover:shadow-xl'>
                        <img className='w-full h-auto' src="https://avatars.githubusercontent.com/u/185038956?v=4" alt="SeaHuyty" />
                    </a>
                    <a href="https://github.com/Ming-99s" target='_blank' className='transform transition ease-in-out hover:scale-105 rounded-lg overflow-hidden shadow-md hover:shadow-xl'>
                        <img className='w-full h-auto' src="https://avatars.githubusercontent.com/u/169033882?v=4" alt="LeeMing" />
                    </a>
                    <a href="https://github.com/PhaySometh" target='_blank' className='transform transition ease-in-out hover:scale-105 rounded-lg overflow-hidden shadow-md hover:shadow-xl'>
                        <img className='w-full h-auto' src="https://avatars.githubusercontent.com/u/169027524?v=4" alt="PhaySometh" />
                    </a>
                    <a href="https://github.com/Sophavisnuka" target='_blank' className='transform transition ease-in-out hover:scale-105 rounded-lg overflow-hidden shadow-md hover:shadow-xl'>
                        <img className='w-full h-auto' src="https://avatars.githubusercontent.com/u/168633610?v=4" alt="Nuka" />
                    </a>
                    <a href="https://github.com/UmLyrithyreach" target='_blank' className='transform transition ease-in-out hover:scale-105 rounded-lg overflow-hidden shadow-md hover:shadow-xl'>
                        <img className='w-full h-auto' src="https://avatars.githubusercontent.com/u/170098956?v=4" alt="RithyReach" />
                    </a>
                    <a href="https://github.com/ChhunHour72" target='_blank' className='transform transition ease-in-out hover:scale-105 rounded-lg overflow-hidden shadow-md hover:shadow-xl'>
                        <img className='w-full h-auto' src="https://avatars.githubusercontent.com/u/185312749?v=4" alt="Chhunhour" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default OurTeam