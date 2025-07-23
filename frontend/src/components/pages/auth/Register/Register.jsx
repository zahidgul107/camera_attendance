import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import { register } from '../../../../services/AuthService'
import avatar from '../../../../assets/images/avatar.png'

const Register = (props) => {
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState(avatar)
  const [imageFile, setImageFile] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file) // store the actual file to send to backend

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result) // preview image
    }
    reader.readAsDataURL(file)
  }

  const handleRegistrationForm = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match')
      setTimeout(() => setErrorMessage(''), 4000)
      return
    }

    const user = {
      name,
      username,
      email,
      password,
    }

    const formData = new FormData()
    formData.append('user', JSON.stringify(user)) // stringified JSON
    formData.append('userImage', imageFile) // file from input (we’ll store this below)

    setLoading(true)

    register(formData)
      .then((response) => {
        setSuccessMessage(response.data.message)
        setTimeout(() => setSuccessMessage(''), 4000)
      })
      .catch((error) => {
        const resMessage =
          error.response?.data?.errors ||
          error.response?.data?.message ||
          error.message ||
          error.toString()

        setErrorMessage(resMessage)
        setTimeout(() => setErrorMessage(''), 4000)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div id="body1">
      <div className="signup-container">
        <div className="signup-form">
          <h2>Register</h2>
          <div
            className="error-message"
            style={{ display: errorMessage ? 'block' : 'none' }}
          >
            {errorMessage}
          </div>
          <div
            className="sent-message"
            style={{ display: successMessage ? 'block' : 'none' }}
          >
            {successMessage}
          </div>
          <form action="#" method="post">
            <div className="container">
              <div className="avatar-upload">
                <div className="avatar-edit">
                  <input
                    type="file"
                    id="imageUpload"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="imageUpload"></label>
                </div>

                <div className="avatar-preview">
                  <div
                    id="imagePreview"
                    style={{ backgroundImage: `url(${image})` }}
                  ></div>
                </div>
              </div>
              <h1>Upload Your Photo</h1>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="mb-4"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="col-md-12 text-center">
              {loading ? (
                <div className="loading" style={{ display: 'block' }}>
                  Registering...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleRegistrationForm(e)}
                >
                  Register
                </button>
              )}
            </div>
            <p className="text-light mt-3 mb-3">
              Already have an account?{' '}
              <Link to="/login" className="text-light font-weight-bolder">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
