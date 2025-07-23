import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearMessages,
  createTask,
  updateTask,
} from '../../../features/slice/taskListSlice'
import { useNavigate, useParams } from 'react-router'

const AddTask = () => {
  const { taskList, successMessage, failMessage, isLoading } = useSelector(
    (state) => state.tasks
  )
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
  })
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
  })
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    if (id) {
      const task = taskList.pagTaskList.find((task) => task.id === parseInt(id))
      if (task) {
        setTaskData(task)
      }
    }
  }, [id, taskList.pagTaskList])

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

  const saveOrUpdateTask = (e) => {
    e.preventDefault()

    // Validate fields
    const newErrors = {}
    if (!taskData.title) {
      newErrors.title = 'Title is required'
    }
    if (!taskData.description) {
      newErrors.description = 'Description is required'
    }
    if (!taskData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }
    if (!taskData.status) {
      newErrors.status = 'Status is required'
    }
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      if (id) {
        const updatedTask = {
          ...taskData,
        }
        const resp = dispatch(updateTask(updatedTask))
        navigate('/tasks')
      } else {
        dispatch(createTask(taskData))
      }
      setTaskData({
        title: '',
        description: '',
        dueDate: '',
        status: '',
      })
    }
  }

  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Update Task</h2>
    } else {
      return <h2 className="text-center">Add Task</h2>
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
              <form onSubmit={saveOrUpdateTask}>
                <div className="mb-3">
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
                </div>
                <div className="mb-3">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className={`form-control ${
                      errors.dueDate ? 'is-invalid' : ''
                    }`}
                    name="dueDate"
                    value={taskData.dueDate}
                    onChange={(e) =>
                      setTaskData({ ...taskData, dueDate: e.target.value })
                    }
                  />
                  {errors.dueDate && (
                    <div className="invalid-feedback">{errors.dueDate}</div>
                  )}
                </div>
                <div className="mb-3">
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

export default AddTask
