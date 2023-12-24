import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import logo from '../assets/mani.png'
import globe from '../assets/globe.png'
import axios from 'axios';
import { UserContext } from '../userContext';
import { SERVER_URL } from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import '../login.css'
function Login({ selectedMenu, setSelectedMenu }) {
  const [username, usernameUpdate] = useState('');
  const { updateUser } = useContext(UserContext);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  setSelectedMenu('message');
  useEffect(() => {
    sessionStorage.clear()
  }, []);
  const ProceedLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      axios.post(`${SERVER_URL}api/check`, {
        username,
        password
      })
        .then((response) => {
          const a = response.data.message;
          if (a === "true") {
            toast.dismiss();
            toast.success('Logged in', { autoClose: 500 });
            sessionStorage.setItem('user', username);
            sessionStorage.setItem('password', password);
            const user = sessionStorage.getItem('user');
            axios
              .get(`${SERVER_URL}api/profile/${user}`)
              .then(response => {
                sessionStorage.setItem('name', response.data.user);
                sessionStorage.setItem('msgCount', response.data.msgCount);
                sessionStorage.setItem('category', response.data.posting);
                sessionStorage.setItem('email', response.data.email);
                sessionStorage.setItem('phoneNumber', response.data.mobile);
                if (response.data.location === '') {
                  sessionStorage.setItem('location', 'Not Given');
                }
                else {
                  sessionStorage.setItem('location', response.data.location);
                }
                if (response.data.dob === '') {
                  sessionStorage.setItem('dob', 'Not Given');
                }
                else {
                  sessionStorage.setItem('dob', response.data.dateCreated);
                }
                navigate('/sidebar');
                updateUser(username, password);
              })
              .catch(error => {
                console.error('Error fetching data:', error);
              });
          }
          else if (a === "false_user") {
            toast.error('Invalid user', { autoClose: 500, className: 'text-orange' });

          }
          else if (a === "false_password") {
            toast.error('Invalid Password', { autoClose: 500, className: 'bg-orange-500' });
          }
        })
        .catch((error) => {
          toast.error('Failed :' + error.message);
        });
    }
  }
  const validate = () => {
    let result = true;
    if (username === '' || username === null) {
      result = false;

    }
    if (password === '' || password === null) {
      result = false;

    }
    return result;
  }
  const [texts, setTexts] = useState(["Innovate", "Accelerate","Create"]);
  const [currentText, setCurrentText] = useState("Create");
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    sessionStorage.clear();
    const interval = setInterval(() => {
      setTextIndex((textIndex + 1) % texts.length);
      setCurrentText(texts[textIndex]);
    }, 2500);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [textIndex, texts]);

  const navigate = useNavigate();
  return (
    <div className="h-screen bg-custom-image ">
      <div>
        <nav className="bg-[#FDD116]">
          <div className="flex flex-row  items-center p-2 space-x-2">
            <img className="h-18 w-18 p-2 rounded-full shadow-[0px_0px_15px] shadow-white" src={logo} />
          </div>
        </nav>
        <div className=''>
          <div className="flex justify-around right-0 h-full items-center mt-28 mr-16 ">
            <div className="title flex flex-col items-center gap-5">
              <img src={globe} width={300} height={300} />
              <h1 id="titleText">
                <div className="space-x-6">
                  <span className="transform-text"> {currentText} </span>
                  <span>With Mannit</span>
                </div>
              </h1>
            </div>
            <div className="h-[400px] w-[320px] bg-[#FDD116] rounded-2xl shadow-5xl border-r-0 border-b-0 border-opacity-30">
              <div className="flex flex-col items-center justify-center space-y-[10px]">
                <div className=" p-1 rounded-full m-10">
                  <div className="rounded-full m-1">
                    <img className="h-8 w-18 rounded-full shadow-[0px_0px_15px] shadow-white bg-blue-500" src={logo} alt="user" />
                  </div>
                </div>
                <div>
                  <form onSubmit={ProceedLogin} className="flex flex-col items-center justify evenly space-y-[25px] m-5">
                    <div className="flex flex-row space-x-3">
                      <FontAwesomeIcon icon={faUser} className='text-[#28282B] mt-1' />
                      <input
                        value={username}
                        onChange={(e) => usernameUpdate(e.target.value)}
                        type="text"
                        required
                        placeholder="Enter Id"
                        className="w-[200px] text-sm text-[#28282B] placeholder-[#000000] bg-transparent focus:outline-none border border-[#000000] border-r-0 border-t-0 border-l-0"
                      />
                    </div>
                    <div className="flex flex-row space-x-3 ">

                      <FontAwesomeIcon icon={faLock} className='text-[#28282B] mt-1' />
                      <div>
                        <input
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Password"
                          className="w-[200px] text-sm text-[#28282B] placeholder-[#000000] border-[#000000] bg-transparent focus:outline-none border border-r-0 border-t-0 border-l-0 pr-10"
                        />
                        <button
                          type="button"
                          className=" absolute  right-0.7 top-1/6   transform -translate-y-[1.5px]   cursor-pointer  focus:outline-none border-b-[1px] border-[#000000]"
                          onClick={togglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="text-[#28282B] h-3"
                          />
                        </button>
                      </div>
                    </div>
                    <div className='p-2'>
                    <button
                      type="submit"
                      className="text-white font-bold  h-8 w-[125px] text-[14px] cursor-pointer font-poppins  rounded-sm bg-[#28282B] border shadow-[0px_0px_5px] shadow-white"
                    >
                      LOGIN
                    </button>
                    </div>
                  </form>
                </div>
                <div className="flex flex-row space-x-[45px] ">
                  <div className="flex flex-row space-x-[3px]">
                    <input type="checkbox" className='text-[#018752]' />
                    <p className="text-sm text-[#28282B] ">Remember me</p>
                  </div>
                  <button className="text-sm  text-[#28282B]" onClick={() => { navigate('/password') }}>Forgot password?</button>
                </div>
                {/* <div className='flex flex-row space-x-[10px]'>
                  <p className='text-white text-sm'>Dont have an account?</p>
                  <button className=' text-sm text-white' onClick={() => { navigate('/Register') }}>Click here</button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login;
