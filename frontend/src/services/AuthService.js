import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = 'https://aca9236bface.ngrok-free.app/api/auth'
//const API_URL = 'http://localhost:9901/api/auth'

export const register = (formData) => {
  return axios.post(API_URL + '/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const login = (user) => {
  return axios.post(API_URL + '/login', user)
}
