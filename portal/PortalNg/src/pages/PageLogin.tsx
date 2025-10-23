// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState } from 'react';
import authService from './../services/authService'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from "../api/axios";



const API_BASE_URL = 'api/auth';
function Login() {
  // const { login } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [invalidAttempt, setinvalidAttempt] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axiosInstance.post(`${API_BASE_URL}/login`, { "Username": userName, "Password": password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((val => {
        setinvalidAttempt(false)
        localStorage.setItem("token", val.data.token)
        navigate("/");
      }))
      .catch((failure) => {
        setinvalidAttempt(true)
      })
  };

  return (
    <>
      <div className="h-screen grid grid-rows-3  dark:bg-gray-900 dark:text-white pt-8 bg-white text-black">
        <div className="flex w-full">
          <div className="w-3/5 p-4 flex justify-center items-center">
            <span className="dark:text-white text-center text-sm md:text-base lg:text-lg">
              <p className="text-lg font-normal tracking-normal text-center mx-8">
                Login using your KDI active directory account to access the PORTAL app
              </p>

              {invalidAttempt && <p > Login Attempt Failed</p>}
              {/* <p className="text-lg font-normal tracking-normal text-center mx-8">
                The CORE II Portal provides users with single sign on access to CORE II applications, including high-level overviews of each CORE II application, enabling the user to decide which individual application would serve their needs best.  Collectively,
                CORE II applications provides for a cohesive solution, comprised off individual applications, each endeavoring to enrich feedback to an enquiring user.
              </p> */}
              <div className="w-px bg-gray-400 h-full"></div>
            </span>
          </div>
          <div className="bg-gray-700 mb-4" style={{ width: '0.9px' }}></div>
          <div className="w-2/5 p-2 overflow-hidden flex justify-center items-center">
            <div className="flex flex-col items-center w-full">

              <form onSubmit={handleSubmit} className="flex flex-col items-left space-y-3 w-full px-4">
                <h2 className='text-lg mb-1 font-semibold'>Log In</h2>
                <div className="form-control w-3/6">
                  <input
                    type="text"
                    className="input input-sm w-full dark:bg-gray-700 bg-slate-200"
                    id="userName"
                    name="userName"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ padding: '10px', height: '38px', fontSize: '12px' }}
                  />
                </div>

                <div className="form-control w-3/6">
                  <input
                    type="password"
                    className="input input-sm w-full dark:bg-gray-700 bg-slate-200"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', height: '38px', fontSize: '12px' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-3/6" style={{ height: '36px' }}>Log in</button>
              </form>
              {/* <div className="flex flex-col items-left space-y-1 w-full px-4 mb-6 mt-2">
                <a href="#" className="dark:text-white link link-primary text-sm" style={{ textAlign: 'left' }}>Forgot Password?</a>
               <Link to={"/requestAccount"} className="dark:text-white link link-primary text-sm mt-1" style={{ textAlign: 'left' }} >Request Account</Link>
               
              </div> */}
            </div>
          </div>
        </div>
        <div className="bg-slate-400  dark:bg-gray-500 flex justify-center items-center p-4 overflow-hidden">
          <span className="text-white text-center text-sm md:text-base lg:text-lg">
            <img className="m-auto w-full max-w-[140px]" src={import.meta.env.BASE_URL + "/cyotelogo.png"} alt="CyOTE Methodology" />
          </span>
        </div>

        <div className="flex justify-center items-center p-4 overflow-hidden">
          {/* Empty content */}
        </div>
      </div>
    </>
  );
}

export default Login;
