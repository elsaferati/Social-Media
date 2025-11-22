import { useState } from 'react'
import './App.css'

import Header from './components/Header.jsx'
import ProfileHeader from './components/ProfileHeader.jsx'  

function App() {
  const [count, setCount] = useState(0)

  return (
   
  <div>
    <Header />
    <ProfileHeader />
  </div>


  )
}

export default App
