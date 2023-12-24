import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLocationPin, faKey, faEnvelope, faBriefcase, faPhone, faComments, faEye, faEyeSlash, faMessage, faLock, faCalendarDays, faList, faMagnifyingGlass, faTrash, faPenToSquare, faNoteSticky, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { SERVER_URL } from './config';
import logo from '../assets/mani.png';
import wp from '../assets/wp.png';
function Register() {
  const navigate = useNavigate();
  const [user, userchange] = useState("");
  const [name, namechange] = useState("");
  const [email, emailchange] = useState("");
  var    [mobile, mobilechange] = useState("");
  const [posting, postingchange] = useState("");
  const [msgCount, msgCountChange] = useState("");
  const [password, passwordchange] = useState("");
  const [conformpassword, conformpasswordchange] = useState("");
  const [dob, setBirthDate] = useState("");
  const [location, locationchange] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  const IsValidate = () => {
    let isproceed = true;
    if (user === '' && name === '' && email === '' && mobile === '' && posting === '' && password === '' && msgCount === '' && conformpassword === '' && dob === '' && location === '') {
      isproceed = false;
    }
    else if(password!=conformpassword)
    {
      isproceed = false;
      toast.warning("Password Aren't Match", { autoClose: 1000 });
    }
    else if (!/\S+@\S+\.\S+/.test(email)) {
      isproceed = false;
      toast.warning("Invalid Email Address", { autoClose: 1000 });
    }
    return isproceed;
  }
  const handleSubmit = (e) => {
    mobile="91"+mobile;
    
    e.preventDefault();
    let dobj = {
      user,
      mobile,
      email,
      posting,
      msgCount,
      password,
      location,
      dob,
    };
    if (IsValidate()) {
      fetch(`${SERVER_URL}api/register`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(dobj)
      }).then((res) => {
        if (res.status === 204) {
          toast.error('User Exists', { autoClose: 1000 });
        }
        else if (res.status === 200) {
          toast.success('Registered successfully.', { autoClose: 1000 });
          userchange("");
          namechange("");
          mobilechange("");
          emailchange("");
          postingchange("");
          msgCountChange("");
          passwordchange("");
          conformpasswordchange("");
          setBirthDate("");
          locationchange("");
        }
      }).catch((err) => {
        toast.error('Failed :' + err.message);
      });
    }
  }
  return (
    <div className="cont bg-custom-image">
      <div className="flex flex-row justify-around items-center h-screen">
        <img src={wp} className='w-[300px] h-[300px]' alt='img'/>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-3 pb-3  h-full w-[350px] items-center bg-[#FDD116] rounded-3xl shadow-5xl border-r-0 border-b-0 border-opacity-30">
            <div className="flex flex-col items-center justify-center  ">
              <div className=" p-1 rounded-full m-2">
                <div className="rounded-full m-1">
                  <img className="h-18 w-18 p-2 rounded-full shadow-[0px_0px_15px] shadow-white" src={logo} alt="user" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-[18px] text-[#000000]"> Register Here</p>
              </div>
            </div>
            <div className="flex flex-col space-y-[24px] mt-5">
              <div className=' flex flex-row space-x-3'>

                <FontAwesomeIcon icon={faUser} className='text-[#28282B] mt-1' />

                <input value={user} onChange={e => userchange(e.target.value)} type="text" placeholder="Enter username" className="text-[15px] w-[215px]  text-sm   text-[#28282B] placeholder-[#28282B] bg-transparent focus:outline-none border-b-[1px] border-[#28282B] required"
                  required
                  pattern=".*\S+.*"
                />
              </div>
              <div className="flex flex-row space-x-3">

                <FontAwesomeIcon icon={faCalendarDays} className='text-[#28282B] mt-1' />
                <div className="relative">
                  <DatePicker
                    selected={dob}
                    onChange={date => setBirthDate(date)}
                    placeholderText="Date of Onboarding"
                    showYearDropdown
                    showMonthDropdown
                    scrollableMonthYearDropdown={false}
                    scrollableYearDropdown={false}
                    dateFormat="dd/MM/yyyy"
                    className="text-[15px] w-[215px] text-sm text-[#28282B] placeholder-[#28282B] bg-transparent focus:outline-none border-b-[1px] border-[#28282B]"
                  />
                </div>
              </div>
              <div className="flex flex-row space-x-3">

                <FontAwesomeIcon icon={faEnvelope} className='text-[#28282B] mt-1' />

                <input value={email} onChange={e => emailchange(e.target.value)} type="text"  placeholder="Enter email" className="w-[215px] text-sm text-[#28282B] placeholder-[#28282B] bg-transparent focus:outline-none border-b-[1px] border-[#28282B]"
                  required
                  pattern=".*\S+.*"
                />
              </div>
              <div className="flex flex-row space-x-3">

                <FontAwesomeIcon icon={faPhone} className='text-[#28282B] mt-1' />

                <input value={mobile} onChange={e => mobilechange(e.target.value)} required type="text"  maxLength={10} placeholder="Enter Mobile Number"  className="w-[215px] text-sm text-[#28282B]  placeholder-[#28282B] bg-transparent focus:outline-none border-b-[1px] border-[#28282B]" />
              </div>
              <div className="flex flex-row space-x-3">

                <FontAwesomeIcon icon={faBriefcase} className='text-[#28282B] mt-1' />

                <input value={posting} onChange={e => postingchange(e.target.value)} type="text" placeholder="Enter Posting" className="w-[215px] text-sm text-[#28282B] placeholder-[#28282B]  bg-transparent focus:outline-none border-b-[1px] border-[#28282B]" />
              </div>
              <div className="flex flex-row space-x-3">
                <FontAwesomeIcon icon={faLock} className='text-[#28282B] mt-1' />
                <div>
                  <input value={password} onChange={e => passwordchange(e.target.value)}  placeholder="Password" type={showPassword1 ? 'text' : 'password'} className="w-52 text-sm  text-[#28282B]  placeholder-[#28282B] bg-transparent focus:outline-none  border-b-[1px] border-[#28282B]" />
                  <button
                    type="button"
                    className=" absolute   top-1/10  transform -translate-y-[1.5px]   cursor-pointer  focus:outline-none border-b-[1px] border-[#28282B]"
                    onClick={togglePasswordVisibility1}
                  >
                    <FontAwesomeIcon
                      icon={showPassword1 ? faEyeSlash : faEye}
                      className="text-[#28282B] h-3"
                    />
                  </button>
                </div>
              </div>
              <div className="flex flex-row space-x-3">

                <FontAwesomeIcon icon={faKey} className='text-[#28282B] mt-1' />
                <div>
                  <input value={conformpassword} onChange={e => conformpasswordchange(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Conform Password" className=" w-52 text-sm text-[#28282B]  placeholder-[#28282B] bg-transparent focus:outline-none border-b-[1px] border-[#28282B] " />
                  <button
                    type="button"
                    className=" absolute   top-1/10  transform -translate-y-[1.5px]   cursor-pointer  focus:outline-none border-b-[1px] border-[#28282B]"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-[#28282B] h-3"
                    />
                  </button>
                </div>
              </div>
              <div className="flex flex-row space-x-3">
  <FontAwesomeIcon icon={faMessage} className='text-[#28282B] mt-1' />
  
  <select value={msgCount} onChange={e => msgCountChange(e.target.value)} className="text-sm text-[#28282B] placeholder-[#28282B] bg-transparent focus:outline-none border-b-[1px] border-[#28282B]">
    <option value="">Select Message Count</option>
    <option value="300">300 - Onboarding</option>
    <option value="500">500 - Silver</option>
    <option value="1100">1100 - Gold</option>
    <option value="3000">3000 - Platinum</option>
    <option value="6500">6500 - Diamond</option>
    <option value="15000">15000 - VIP</option>
  </select>
</div>

              <div className="flex flex-row space-x-3">

                <FontAwesomeIcon icon={faLocationPin} className='text-[#28282B] mt-1' />
                <input value={location} onChange={e => locationchange(e.target.value)} type="text" placeholder="Location" className=" w-[225px] text-sm text-[#28282B] placeholder-[#28282B]  bg-transparent focus:outline-none border-b-[1px] border-[#28282B]" />
              </div>
            </div>
            <div className="mt-7">
              <button className="text-[#fff] font-bold  h-8 w-40 ml-12 text-sm cursor-pointer font-poppins rounded-sm  px-5 bg-[#28282B]" >
                Create Account
              </button>
              <div className='flex flex-row  p-4 space-x-[10px]'>
                <p className='text-[#28282B] text-sm'>Already Have an account?</p>
                <button className=' text-sm text-[#000000]' onClick={() => { navigate('/') }}>Click here</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
