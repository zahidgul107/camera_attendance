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
import { toast } from 'react-toastify'

const AddAttendance = () => {
  const { attendanceList, successMessage, failMessage, isLoading } =
    useSelector((state) => state.attendance)
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({
    checkInTime: '',
    imageFile: '',
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
    } else {
      const now = new Date()
      const localISOTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16)
      setAttendanceData({ checkInTime: localISOTime })
    }
  }, [id, attendanceList])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }

    if (failMessage) {
      toast.error(failMessage)
    }

    let timer
    if (successMessage || failMessage) {
      timer = setTimeout(() => {
        dispatch(clearMessages())
      }, 4000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [successMessage, failMessage, dispatch])

  const saveOrUpdateAttendance = (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!attendanceData.checkInTime) {
      newErrors.checkInTime = 'Check-In Time is required'
    }
    if (!imageFile) {
      newErrors.imageFile = 'Capture Live Photo'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData()
      formData.append('attendance', JSON.stringify(attendanceData))
      formData.append('imageName', imageFile)

      if (id) {
        formData.append('id', id)
        dispatch(updateAttendance(formData))
      } else {
        dispatch(createAttendance(formData))
      }

      setAttendanceData({
        checkInTime: '',
      })
      setImageFile(null)
      setImage(avatar)
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

    setImageFile(file)

    setErrors((prevErrors) => ({
      ...prevErrors,
      imageFile: '',
    }))

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="container">
        <br /> <br />
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            {pageTitle()}
            <div className="card-body">
              <form onSubmit={saveOrUpdateAttendance}>
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
                  {/* <h1>Capture Live Photo</h1> */}
                  {errors.imageFile && (
                    <h1 className="text-danger mt-2">{errors.imageFile}</h1>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Check-In-Time</label>
                  <input
                    type="datetime-local"
                    className={`form-control ${
                      errors.checkInTime ? 'is-invalid' : ''
                    }`}
                    name="checkInTime"
                    value={attendanceData.checkInTime}
                    readOnly // ✅ prevent manual editing
                  />

                  {errors.checkInTime && (
                    <div className="invalid-feedback">{errors.checkInTime}</div>
                  )}
                </div>
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
