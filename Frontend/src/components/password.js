import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { SERVER_URL, BASE_URL, } from './config';
import logo from '../assets/mani.png'
import axios from 'axios';
function Password() {
  const navigate = useNavigate();
  // const tohome = () => { navigate('/DashBoard') };
  const [user, userchange] = useState("");
  const [email, emailchange] = useState("");
  const [mobile, mobilechange] = useState("");
  const [posting, postingchange] = useState("");
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [conformpassword, conformpasswordchange] = useState("");
  const [dob, setBirthDate] = useState("");
  const [location, locationchange] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  const IsValidate = () => {
    let isproceed = true;
    if (user === '' && email === '' && mobile === '' && posting === '' && password === '' && conformpassword === '' && dob === '' && location === '') {
      isproceed = false;
    }
    return isproceed;
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    if (IsValidate()) {
      axios
        .patch(`${SERVER_URL}api/forgotpassword/${user}`, { password })
        .then(response => {
          if (response.status === 204) {
            toast.error('User Not exists', { autoClose: 500 });
          }
          else if (response.status == 200) {
            toast.success('Password Updated', { autoClose: 500 });
            navigate('/login');
          }

        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  return (
    <div className="bg-custom-image">
      <div className="flex flex-row justify-end items-center h-screen">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-5  h-[475px] w-[350px] items-center  mr-36 bg-[#FDD116] rounded-2xl shadow-5xl border-r-0 border-b-0 border-opacity-30">
            <div className="flex flex-col items-center justify-center m-6 ">
              <div className=" p-1 rounded-full m-10">
                <div className="rounded-full m-1">
                  <img className="h-8 w-18 rounded-full shadow-[0px_0px_15px] shadow-white bg-blue-500" src={logo} alt="user" />
                </div>
              </div>
              <div>
                <p className="text-xl text-[#000000]"> Change Password</p>
              </div>
            </div>
            <div className="flex flex-col space-y-[24px] mt-2">
              <div className=' flex flex-row space-x-3'>
                <FontAwesomeIcon icon={faUser} className='text-[#000000] mt-1' />
                <input value={user} onChange={e => userchange(e.target.value)} type="text" placeholder="Enter username" className="text-[15px] w-52  text-sm   text-[#000000] placeholder-[#000000] bg-transparent focus:outline-none border-b-2  border-[#000000] required"
                  required
                  pattern=".*\S+.*"
                />
              </div>
              <div className="flex flex-row space-x-3">
                <FontAwesomeIcon icon={faLock} className='text-[#000000] mt-1' />
                <div className="flex flex-row">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Password"
                    className="w-52 text-sm text-[#000000] placeholder-[#000000] bg-transparent focus:outline-none border  border-[#000000] border-r-0 border-t-0 border-l-0 border-b-2 pr-10"
                  />
                  <button
                    type="button"
                    className=" absolute top-1/6  transform -translate-y-[4px] ml-48 cursor-pointer bg-[#FDD116] focus:outline-none border-b-[0.1px] border-[#000000]"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-white h-3"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center mt-10">
              <button className="text-white font-bold  h-8 w-40  ml-4 text-sm cursor-pointer font-poppins rounded-sm bg-[#28282B] border " >
                Change
              </button>
              <div className='flex flex-row  mt-5  space-x-[30px] justify-center'>
                <p className='text-[#000000] text-sm'>Go to Login ?</p>
                <button className=' text-sm text-[#000000]' onClick={() => { navigate('/') }}>Click here</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Password;
