import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/ui/Header.jsx'
import Home from './components/pages/Home.jsx'
import Article from './components/pages/Article.jsx'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contents/:user/:slug" element={<Article />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
