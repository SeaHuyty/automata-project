import React from 'react'
import Navbar from './Navbar'

const OurTeam = () => {
    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Our Team</h1>
                    <p>Meet the talented individuals behind the project.</p>
                </div>
                <div className='w-full grid grid-cols-3 gap-10'>
                    <a href="https://github.com/SeaHuyty" target='_blank'>
                        <img className='transition ease-in-out hover:scale-107' src="https://avatars.githubusercontent.com/u/185038956?v=4" alt="SeaHuyty" />
                    </a>
                    <a href="https://github.com/Ming-99s" target='_blank'>
                        <img className='transition ease-in-out hover:scale-107' src="https://avatars.githubusercontent.com/u/169033882?v=4" alt="LeeMing" />
                    </a>
                    <a href="https://github.com/PhaySometh" target='_blank'>
                        <img className='transition ease-in-out hover:scale-107' src="https://avatars.githubusercontent.com/u/169027524?v=4" alt="LeeMing" />
                    </a>
                    <a href="https://github.com/Sophavisnuka" target='_blank'>
                        <img className='transition ease-in-out hover:scale-107' src="https://avatars.githubusercontent.com/u/168633610?v=4" alt="Nuka" />
                    </a>
                    <a href="https://github.com/UmLyrithyreach" target='_blank'>
                        <img className='transition ease-in-out hover:scale-107' src="https://avatars.githubusercontent.com/u/170098956?v=4" alt="RithyReach" />
                    </a>
                    <a href="https://github.com/ChhunHour72" target='_blank'>
                        <img className='transition ease-in-out hover:scale-107' src="https://avatars.githubusercontent.com/u/185312749?v=4" alt="Chhunhour" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default OurTeam