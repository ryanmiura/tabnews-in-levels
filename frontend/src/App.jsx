import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/ui/Header.jsx'
import Home from './components/pages/Home.jsx'
import Article from './components/pages/Article.jsx'
import Login from './components/pages/Login.jsx'
import Register from './components/pages/Register.jsx'
import { NewsProvider } from './contexts/NewsContext.jsx'
import { MockProvider } from './contexts/MockContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <MockProvider>
        <NewsProvider>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contents/:user/:slug" element={<Article />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Box>
          </Box>
        </NewsProvider>
      </MockProvider>
    </AuthProvider>
  )
}

export default App
