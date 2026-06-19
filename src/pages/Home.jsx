import React from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import About from '../components/about'
import Contact from '../components/contact'
import Products from './Products'

const Home = () => {
  return (
    <div>
        <Hero/>
        <Products/>
        <About/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default Home