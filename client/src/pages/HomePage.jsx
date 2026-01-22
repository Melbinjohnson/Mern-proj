import React from 'react'
import { Carrousal } from '../../components/Carrousal'
import MovieGrid from '../../components/MovieGrid'
import { Sparkles } from 'lucide-react'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto p-6 space-y-10'>
        
        {/* Carousel Section */}
        <section className='rounded-3xl overflow-hidden shadow-2xl'>
          <Carrousal />
        </section>

        {/* Heading Section */}
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h2 className='text-3xl font-black tracking-tight flex items-center gap-2'>
              <Sparkles className='text-yellow-500' size={28} />
              Recommended Movies
            </h2>
            <p className='text-zinc-500 dark:text-zinc-400 text-sm'>Handpicked blockbusters just for you</p>
          </div>
          <button className='text-sm font-bold text-red-600 hover:underline'>View All</button>
        </div>

        {/* Movie Grid */}
        <MovieGrid />
      </div>
    </div>
  )
}

export default HomePage