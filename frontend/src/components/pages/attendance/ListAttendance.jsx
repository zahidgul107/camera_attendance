import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearMessages,
  deleteAttendance,
  getAllAttendance,
  getPagAttendance,
  searchAttendance,
} from '../../../features/slice/attendanceSlice'

const ListAttendance = () => {
  const {
    attendanceList,
    isLoading,
    errorMessage,
    successMessage,
    failMessage,
  } = useSelector((store) => store.attendance)
  const [search, setSearch] = useState({
    checkInTime: '',
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPagAttendance())
  }, [])

  useEffect(() => {
    let timer
    if (errorMessage) {
      timer = setInterval(() => {
        dispatch(getAllAttendance())
      }, 30000)
    }

    return () => clearInterval(timer)
  }, [errorMessage, dispatch])

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

  const updateAttendance = (id) => {
    navigate(`/updateAttendance/${id}`)
  }

  const handleDeleteTask = (id) => {
    const currentPage = attendanceList.currentPage
    const attendanceData = {
      id,
      currentPage,
    }
    dispatch(deleteAttendance(attendanceData))
  }

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(search)
    dispatch(searchAttendance(search))
  }

  //   if (isLoading) {
  //     return (
  //       <div id="preloader">
  //         <div></div>
  //         <div></div>
  //         <div></div>
  //         <div></div>
  //       </div>
  //     )
  //   }

  const generatePageNumbers = () => {
    const maxPagesOnEachSide = 1
    const startPage = Math.max(
      1,
      attendanceList.currentPage - maxPagesOnEachSide
    )
    const endPage = Math.min(
      attendanceList.totalPages,
      attendanceList.currentPage + maxPagesOnEachSide
    )

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <>
      {errorMessage ? (
        <div>
          <div
            class="modal fade show d-block mt-5"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            role="dialog"
          >
            <div class="modal-dialog modal-sm">
              <svg
                class="bi flex-shrink-0 me-2"
                width="24"
                height="24"
                role="img"
                aria-label="Danger:"
              >
                <use xlink:href="#exclamation-triangle-fill" />
              </svg>
              <div
                class="modal-content text-danger text-center"
                style={{ color: '#D63301', backgroundColor: '#FFCCBA' }}
              >
                <div class="modal-body">{errorMessage}</div>
                <div class="d-flex justify-content-center m-1 p-2">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <h2 className="text-light text-center">List of Attendance</h2>
          <div className="row w-50 mx-auto">
            {failMessage && (
              <div
                className=" col-md-12 m-4 alert alert-icon alert-danger border-danger alert-dismissible fade show text-center "
                role="alert"
                style={{ width: 'fit-content' }}
              >
                {failMessage}
              </div>
            )}
            {successMessage && (
              <div
                className=" col-md-12 m-4 alert alert-icon alert-success border-success alert-dismissible fade show text-center "
                role="alert"
                style={{ width: 'fit-content' }}
              >
                {successMessage}
              </div>
            )}
          </div>
          <div className="row">
            <div className="card ms-3 border-0 d-flex mb-2 text-center col-md-2 p-2">
              <strong className="fw-bold">
                Total Attendance List :{' '}
                <strong className="badge badge-success p-2 rounded-circle fw-bold text-black">
                  {attendanceList.totalItems}
                </strong>
              </strong>
            </div>
          </div>
          <div className="card table-success mb-2 form p-4 border-0 shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="status">Status</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    value={search.status}
                    onChange={handleChange}
                    name="status"
                  >
                    {/* <option>Select task status</option> */}
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    className="form-control picker"
                    placeholder="Enter From Date"
                    value={search.dueDate}
                    onChange={handleChange}
                    name="dueDate"
                  />
                </div>
              </div>

              <div className="row">
                <div className="container text-center mt-3">
                  <button type="submit" className="btn btn-outline-primary">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <table className="table table-hover table-responsive-sm table-success table-striped">
            <thead>
              <tr>
                <th scope="col">Task Title</th>
                <th scope="col">Task Description</th>
                <th scope="col">Task Due Date</th>
                <th scope="col">Task Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList?.pagAttendanceList?.map((attendance) => (
                <tr key={attendance.id}>
                  <td>{attendance.checkInTime}</td>
                  <td>{attendance.checkInTime}</td>
                  <td>{attendance.checkInTime}</td>
                  <td>{attendance.checkInTime}</td>
                  <td>
                    <a
                      className="me-2"
                      onClick={() => updateAttendance(attendance.id)}
                    >
                      <i
                        className="fa fa-edit text-success"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        data-bs-title="Update Bill "
                      ></i>
                    </a>
                    <a
                      type="button"
                      onClick={() => handleDeleteAttendance(attendance.id)}
                    >
                      <i
                        className="fa fa-trash text-danger"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        data-bs-title="Delete Bill"
                      ></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>{' '}
          {/* pagination */}{' '}
          {attendanceList.totalPages > 1 && (
            <div className="offset-md-4 col-md-8 mb-5">
              <ul className="pagination">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => dispatch(getPagAttendance(1))}
                  >
                    First
                  </button>
                </li>

                <li className="page-item">
                  <button
                    className="pe-3 page-link"
                    onClick={() =>
                      dispatch(getPagAttendance(taskList.currentPage - 1))
                    }
                    disabled={attendanceList.currentPage <= 1}
                  >
                    {'<<'}
                  </button>
                </li>
                {generatePageNumbers().map((i) => (
                  <li className="page-item" key={i}>
                    <button
                      className={`page-link ${
                        attendanceList.currentPage === i ? 'active' : ''
                      }`}
                      onClick={() => dispatch(getPagAttendance(i))}
                    >
                      {i}
                    </button>
                  </li>
                ))}

                <li className="page-item">
                  <button
                    className="pe-3 page-link"
                    onClick={() =>
                      dispatch(getPagAttendance(attendanceList.currentPage + 1))
                    }
                    disabled={
                      attendanceList.currentPage >= attendanceList.totalPages
                    }
                  >
                    {'>>'}
                  </button>
                </li>

                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() =>
                      dispatch(getPagAttendance(attendanceList.totalPages))
                    }
                    disabled={
                      attendanceList.currentPage >= attendanceList.totalPages
                    }
                  >
                    Last
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ListAttendance
