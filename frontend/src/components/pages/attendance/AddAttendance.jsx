import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearMessages,
  createAttendance,
  updateAttendance,
} from '../../../features/slice/attendanceSlice'
import { useNavigate, useParams } from 'react-router'
import avatar from '../../../assets/images/avatar.png'
import './index.css'

const AddAttendance = () => {
  const { attendanceList, successMessage, failMessage, isLoading } =
    useSelector((state) => state.tasks)
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({
    checkInTime: '',
  })
  const [attendanceData, setAttendanceData] = useState({
    checkInTime: '',
  })
  const navigate = useNavigate()
  const { id } = useParams()
  const [image, setImage] = useState(avatar)
  const [imageFile, setImageFile] = useState(null)
  useEffect(() => {
    if (id) {
      const attendance = attendanceList.find(
        (attendance) => attendance.id === parseInt(id)
      )
      if (attendance) {
        setAttendanceData(attendance)
      }
    }
  }, [id, attendanceList])

  useEffect(() => {
    let timer
    if (successMessage || failMessage) {
      timer = setTimeout(() => {
        dispatch(clearMessages())
      }, 3000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [successMessage, failMessage, dispatch])

  const saveOrUpdateAttendance = (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!attendanceData.checkInTime) {
      newErrors.checkInTime = 'CheckInTime is required'
    }
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Prepare FormData
      const formData = new FormData()
      formData.append('attendance', JSON.stringify(attendanceData))
      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (id) {
        // Add ID in case it's an update
        formData.append('id', id)
        dispatch(updateAttendance(formData))
      } else {
        dispatch(createAttendance(formData))
      }

      setAttendanceData({
        checkInTime: '',
      })
      setImageFile(null)
    }
  }

  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Update Attendance</h2>
    } else {
      return <h2 className="text-center">Add Attendance</h2>
    }
  }

  if (isLoading) {
    return (
      <div id="preloader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  }

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
    <>
      <div className="container">
        <br /> <br />
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            {pageTitle()}
            <div className="row w-50 mx-auto">
              {failMessage && typeof failMessage === 'string' && (
                <div
                  className=" col-md-12 m-4 alert alert-icon alert-danger border-danger alert-dismissible fade show text-center "
                  role="alert"
                  style={{ width: 'fit-content' }}
                >
                  {failMessage}
                </div>
              )}
              {successMessage && typeof successMessage === 'string' && (
                <div
                  className=" col-md-12 m-4 alert alert-icon alert-success border-success alert-dismissible fade show text-center "
                  role="alert"
                  style={{ width: 'fitContent' }}
                >
                  {successMessage}
                </div>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={saveOrUpdateAttendance}>
                {/* <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? 'is-invalid' : ''
                    }`}
                    name="title"
                    value={taskData.title}
                    onChange={(e) =>
                      setTaskData({ ...taskData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    type="textarea"
                    className={`form-control ${
                      errors.description ? 'is-invalid' : ''
                    }`}
                    name="description"
                    value={taskData.description}
                    onChange={(e) =>
                      setTaskData({ ...taskData, description: e.target.value })
                    }
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div> */}
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
                <div className="mb-3">
                  <label className="form-label">Check-In-Time</label>
                  <input
                    type="datetime-local"
                    className={`form-control ${
                      errors.dueDate ? 'is-invalid' : ''
                    }`}
                    name="checkInTime"
                    value={attendanceData.checkInTime}
                    onChange={(e) =>
                      setAttendanceData({
                        ...attendanceData,
                        checkInTime: e.target.value,
                      })
                    }
                  />
                  {errors.checkInTime && (
                    <div className="invalid-feedback">{errors.checkInTime}</div>
                  )}
                </div>
                {/* <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    type="email"
                    className={`form-control ${
                      errors.status ? 'is-invalid' : ''
                    }`}
                    name="status"
                    value={taskData.status}
                    onChange={(e) =>
                      setTaskData({ ...taskData, status: e.target.value })
                    }
                  >
                    <option value="">Select task status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                  {errors.status && (
                    <div className="invalid-feedback">{errors.status}</div>
                  )}
                </div> */}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddAttendance
