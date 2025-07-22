import { Link, useNavigate } from 'react-router-dom'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../../../features/login/userSlice'
import { login } from '../../../../services/AuthService'

const Login = () => {
  const { unauthorizedMessage, isLoading } = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLoginForm = (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const user = Object.fromEntries(formData)

    dispatch(signInStart())
    login(user)
      .then((response) => {
        if (response.status === 200) {
          dispatch(signInSuccess(response.data))
          navigate('/dashboard')
        } else {
          console.error('Login failed:', response.statusText)
        }
      })
      .catch((error) => {
        dispatch(signInFailure(error))
      })
  }

  return (
    <form onSubmit={handleLoginForm}>
      <div className="ring mx-auto mt-5">
        <i style={{ '--clr': '#00ff0a' }}></i>
        <i style={{ '--clr': '#ff0057' }}></i>
        <i style={{ '--clr': '#fffd44' }}></i>
        <div className="login">
          <h2>Login</h2>
          {unauthorizedMessage && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {unauthorizedMessage}
              </div>
            </div>
          )}

          <div className="inputBx">
            <input type="text" placeholder="Username" name="username" />
          </div>
          <div className="inputBx">
            <input type="password" placeholder="Password" name="password" />
          </div>
          <div className="inputBx">
            {isLoading ? (
              <div className="loading1" style={{ display: 'block' }}>
                Signing in
              </div>
            ) : (
              <input type="submit" value="Sign in" />
            )}
          </div>
          <div className="links">
            <a>Forget Password</a>
            <Link to="/register">Signup</Link>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Login
