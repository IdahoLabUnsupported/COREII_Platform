// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from '../api/axios'
import { useAuth } from '../contexts/AuthContext';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,25}$/;
const REGISTER_URL = 'api/auth/register';

const PageRegister: React.FC = () => {
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validName || !validPwd) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axiosInstance.post(REGISTER_URL, {
                userName: user,
                password: pwd,
                firstName: "lily",
                lastName: "Cant"
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            setSuccess(true);
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current?.focus();
        }
    }

    return (
        <>
            {success ? (
                <div className='flex justify-center items-center dark:bg-gray-900 dark:text-white pt-8 bg-white text-black min-h-screen'>
                    <section>
                        <h1>Success!</h1>
                        <p>
                            <Link to="/login">Sign In</Link>
                        </p>
                    </section>
                </div>
            ) : (
                <div className='flex flex-col items-center w-full dark:bg-gray-900 dark:text-white pt-8 bg-white text-black min-h-screen'>
                    <h1 className="text-center mb-8 mt-8 pt-8">Register</h1>
                    <div className="dark:bg-gray-800 w-1/3 bg-gray-200 p-8 mt-4 rounded-md">
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col mb-4">

                                <div className="flex items-center">
                                    <label htmlFor="username" className="w-2/4 text-right  items-center mr-4 min-w-[96px]">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                        aria-invalid={!validName}
                                        aria-describedby="uidnote"
                                        onFocus={() => setUserFocus(true)}
                                        onBlur={() => setUserFocus(false)}
                                        className={`input input-bordered input-sm w-3/5 dark:bg-gray-700 ${userFocus && user && !validName ? 'border-red-500' : ''}`}
                                    />
                                    {userFocus && user && (
                                        <FontAwesomeIcon icon={validName ? faCheck : faTimes} className={`ml-2 ${validName ? 'text-green-500' : 'text-red-500'}`} />
                                    )}
                                </div>
                                {userFocus && user && !validName && (
                                    <p id="uidnote" className="text-sm text-red-500 mt-1">
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        4 to 24 characters.<br />
                                        Must begin with a letter.<br />
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col mb-4">
                                <div className="flex items-center">
                                    <label htmlFor="password" className="w-2/4 text-right  items-center mr-4 min-w-[96px]">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        aria-invalid={!validPwd}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                        className={`input input-bordered input-sm w-3/5 dark:bg-gray-700 ${pwdFocus && !validPwd ? 'border-red-500' : ''}`}
                                    />

                                    {pwdFocus && (
                                        <FontAwesomeIcon icon={validPwd ? faCheck : faTimes} className={`ml-2 inline-block ${validPwd ? 'text-green-500' : 'text-red-500'}`} />
                                    )}
                                </div>
                                {pwdFocus && !validPwd && (
                                    <p id="pwdnote" className="text-sm text-red-500 mt-1">
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        8 to 24 characters.<br />
                                        Must include uppercase and lowercase letters, a number, and a special character.<br />
                                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                    </p>
                                )}
                            </div>
                      
                            <div className="flex flex-col mb-4">
                                <div className="flex items-center">
                                    <label htmlFor="confirm_pwd" className="w-2/4 text-right  items-center mr-4 min-w-[96px] whitespace-nowrap">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        id="confirm_pwd"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        value={matchPwd}
                                        required
                                        aria-invalid={!validMatch}
                                        aria-describedby="confirmnote"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                        className={`input input-bordered input-sm w-3/5 dark:bg-gray-700  ${matchFocus && !validMatch ? 'border-red-500' : ''}`}
                                    />

                                    {matchFocus && (
                                        <FontAwesomeIcon icon={validMatch ? faCheck : faTimes} className={`ml-2 ${validMatch ? 'text-green-500' : 'text-red-500'}`} />
                                    )}
                                </div>
                                {matchFocus && !validMatch && (
                                    <p id="confirmnote" className="text-sm text-red-500 mt-1">
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        Must match the first password input field.
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col mb-4">
                                <div className="flex items-center">
                                    <div className="w-2/4"></div>
                                    <button
                                        disabled={!validName || !validPwd || !validMatch}
                                        className="bg-primary hover:bg-sky-800 hover:opacity-100 border-none w-3/5 text-white rounded-md flex-grow text-sm font-bold ms-6"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>

                        </form>
                        <div className='text-right'>
                            <Link to="/login" className='dark:text-white underline text-lg mb-8 text-black'>
                                Already registered?<br />
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PageRegister;
