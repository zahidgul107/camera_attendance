import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import { getCount } from '../../../features/dashboard/dashboardSlice'

const Dashboard = () => {
  const { count } = useSelector((store) => store.dashboard)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCount())
  }, [])

  return (
    <div className="container mt-5">
      <div className="row column1">
        <div className="col-md-6">
          <Link to="/addAttendance">
            <div className="full counter_section margin_bottom_30">
              <div className="couter_icon">
                <span>
                  <i className="fa fa-file-text yellow_color"></i>
                </span>
              </div>
              <div className="counter_no">
                <div>
                  <p className="total_no"></p>
                  <p className="head_couter text-warning fw-bold">
                    Add Attendance
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/viewAttendance">
            <div className="full counter_section margin_bottom_30">
              <div className="couter_icon">
                <div>
                  <i className="fa fa-list orange_color"></i>
                </div>
              </div>
              <div className="counter_no">
                <div>
                  <p className="total_no text-info font-weight-bold">
                    {count?.attendanceCount}
                  </p>
                  <p className="head_couter text-warning fw-bold">
                    View Attendance
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
