import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Dashboard = () => {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen'>

      {/* Navbar for recruiter panel */}
      <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
          <img src={assets.logo} alt="" className='max-sm:w-32 cursor-pointer' onClick={e => { navigate('/') }} />
          <div className='flex items-center gap-3'>
            <p className='max-sm:hidden '>Welcome ,User</p>
            <div className='relative group'>
              <img className='w-8 border rounded-full' src={assets.company_icon} alt="" />
              <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rouded pt-12'>
                <ul className='list-none m-0 p-2 bg-white rouded-md border text-sm'>
                  <li className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-start'>
  {/* Left sidebar */}
  <div className='sticky top-0 h-screen w-48 border-r-2 bg-gray-100 p-4'>
    <ul className='space-y-4'>
      <li>
        <NavLink
          to={'/dashboard/add-job'}
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
          }
        >
          <img src={assets.add_icon} alt="" className='w-5 h-5' />
          <p>Add Job</p>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={'/dashboard/manage-jobs'}
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
          }
        >
          <img src={assets.home_icon} alt="" className='w-5 h-5' />
          <p>Manage Jobs</p>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={'/dashboard/view-applications'}
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
          }
        >
          <img src={assets.person_tick_icon} alt="" className='w-5 h-5' />
          <p>View Applications</p>
        </NavLink>
      </li>
    </ul>
  </div>

  {/* Main content */}
  <div className='flex-1 p-4'>
    <Outlet />
  </div>
</div>

    </div>
  )
}

export default Dashboard
