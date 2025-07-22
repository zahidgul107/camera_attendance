import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Login from './components/pages/auth/Login/Login'
import { AddTask, ListTasks, Dashboard } from './components/pages/tasks'
import Register from './components/pages/auth/Register/Register'
import Footer from './components/Footer/Footer'
import { useSelector } from 'react-redux'

function App() {
  const { loggedInUser } = useSelector((state) => state.user)
  function AuthenticatedRoute({ children }) {
    if (loggedInUser) {
      return children
    } else {
      return <Navigate to="/" />
    }
  }

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route
            path="/dashboard"
            element={
              <AuthenticatedRoute>
                <Dashboard />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/tasks"
            element={
              <AuthenticatedRoute>
                <ListTasks />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/addTask"
            element={
              <AuthenticatedRoute>
                <AddTask />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/updateTask/:id"
            element={
              <AuthenticatedRoute>
                <AddTask />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
