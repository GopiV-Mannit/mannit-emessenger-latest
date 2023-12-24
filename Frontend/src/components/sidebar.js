import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMessage, faBook, faList, faCloudArrowUp,faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Message from './message';
import Profile from './profile';
import Summary from './summary';
import logo from '../assets/mani.png'
import Logout from '../assets/logout.png'
import Report from './report';
import Bulk from './bulkupload';
import { Subscription } from './subscription';
const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  useEffect(()=>{
    let username=sessionStorage.getItem('user');
    // console.log(username);
    if(username===''||username===null){
      navigate('/');
    }
  },[navigate,selectedMenu]);
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };
 
  const renderPage = () => {
    switch (selectedMenu) {
      case 'summary':
        return <Summary />;
      case 'profile':
        return <Profile />;
      case 'message':
        return <Message selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>;
      case 'report':
        return <Report />;
      case 'bulk':
        return <Bulk />;
      case 'subscription':
        return <Subscription/>;
      default:
        return <Message />;
    }
  };
  return (
    <div className="flex h-full">
      <div className={`bg-[#FDD116] h-[102vh] p-5 pt-8 duration-300 relative ${open ? 'w-72' : 'w-20'} `}>
        <BsArrowLeftShort
          className={`bg-white text-[#00203f] text-3xl rounded-full absolute -right-3 mt-3 top-9 border border-[#f97d09] cursor-pointer transform transition-transform ${!open ? 'rotate-180' : ''
            }`}
          onClick={() => setOpen(!open)}
        />

        <div className="ml-6 mt-3">
          <img className={`h-26 w-26  ${!open ? 'scale-0' : '0'} rounded-full     shadow-[0px_0px_10px]  shadow-white`} src={logo} onClick={() => setSelectedMenu('message')} />
        </div>
        <div className="mt-36 space-y-[150px] h-[350px]">
          <div className="flex flex-row items-center">
            <ul className="ml-6 space-y-8 flex flex-col">
              <li
                className={`text-[#018752] cursor-pointer text-[18px] flex flex-row space-x-4 duration-300   ${!open ? 'scale-0' : '0'} `}
                onClick={() => handleMenuClick('summary')}
              >
                <div className={`${!open ? 'scale-0' : '0'} duration-300  ${selectedMenu === 'summary' ? 'mt-2' : ''}`}>
                  <FontAwesomeIcon icon={faList} className='h-4 ml-2  shadow-[0px_0px_10px]  shadow-[#FDD116]' />
                </div>
                <div className={`${!open ? 'scale-0 ' : '0'} ${selectedMenu === 'summary' ? 'text-[26px]' : ''} duration-300`}>
                  Summary
                </div>
              </li>
              <li
                className={`text-[#018752] cursor-pointer text-[18px] flex flex-row space-x-4 duration-300   ${!open ? 'scale-0' : '0'} `}
                onClick={() => handleMenuClick('report')}
              >
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'report' ? 'mt-2' : ''}`}>
                  <FontAwesomeIcon icon={faBook} className={` ml-2  shadow-[0px_0px_10px] shadow-[#FDD116]`} />

                </div>
                <div className={`${!open ? 'scale-0' : '0'} ${selectedMenu === 'report' ? 'text-[26px]' : ''} duration-300 `}>
                  Report
                </div>
              </li>
              <li
                className={`text-[#018752] cursor-pointer  text-[18px] flex flex-row space-x-4 duration-300  ${!open ? 'scale-0' : '0'} `}
                onClick={() => handleMenuClick('message')}
              >
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'message' ? 'mt-2' : ''}`}>
                  <FontAwesomeIcon icon={faMessage} className='h-4 ml-2  shadow-[0px_0px_10px]   shadow-[#FDD116]' />
                </div>
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'message' ? 'text-[26px]' : ''}`}>
                  Message
                </div>
              </li>
              <li
                className={`text-[#018752] cursor-pointer  text-[18px] flex flex-row space-x-4 duration-300  ${!open ? 'scale-0' : '0'} `}
                onClick={() => handleMenuClick('bulk')}
                style={{ alignItems: 'center', justifyContent: 'flex-start' }}
              >
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'bulk' ? 'mt-2' : ''}`}>
                  <FontAwesomeIcon icon={faCloudArrowUp} className='h-4 ml-2  shadow-[0px_0px_10px]   shadow-[#FDD116]' />
                </div>
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'bulk' ? 'text-[26px]' : ''}`}>
                  Upload
                </div>
              </li>
              <li
                className={`text-[#018752] cursor-pointer  text-[18px] flex flex-row space-x-4 duration-300  ${!open ? 'scale-0' : '0'} `}
                onClick={() => handleMenuClick('subscription')}
                style={{ alignItems: 'center', justifyContent: 'flex-start' }}
              >
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'subscription' ? 'mt-2' : ''}`}>
                  <FontAwesomeIcon icon={faCartShopping} className='h-4 ml-2  shadow-[0px_0px_10px]   shadow-[#FDD116]' />
                </div>
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'subscription' ? 'text-[26px]' : ''}`}>
                  Subscription
                </div>
              </li>
              <li
                className={`text-[#018752] cursor-pointer text-[18px] flex flex-row space-x-4 duration-300   ${!open ? 'scale-0' : '0'} `}
                onClick={() => handleMenuClick('profile')}
              >
                <div className={`${!open ? 'scale-0' : '0'} duration-300 ${selectedMenu === 'profile' ? 'mt-2' : ''}`}>
                  <FontAwesomeIcon icon={faUser} className='h-4 ml-2  shadow-[0px_0px_10px]  shadow-[#FDD116]' />
                </div>
                <div className={`${!open ? 'scale-0' : '0'}duration-300 ${selectedMenu === 'profile' ? 'text-[26px]' : ''}`}>
                  Profile
                </div>
              </li>
            </ul>
          </div>


        </div>
        <div
          className={`text-[#018752] cursor-pointer ml-6 text-[18px] h-[50px] mt-10 flex flex-row items-center space-x-4 duration-300  ${!open ? 'scale-0' : '0'}`}
          onClick={() => navigate('/login')}
        >
          <div className={`${!open ? 'scale-0' : '0'} duration-300`}>
            <img src={Logout} className='h-8 ml-2  shadow-[0px_0px_10px]  shadow-[#FDD116]' />
          </div>
          <div className={`${!open ? 'scale-0' : '0'} duration-300 text-black`}>
            Logout
          </div>
        </div>

      </div>

      <div className={`background flex w-full `}>
        <div className='flex justify-center  mt-10 mx-auto'>
          {renderPage()}
        </div>
        {/* <div className=' pr-5 pt-5 cursor-pointer h-fit ' onClick={() => navigate('/login')} >
          {/* <FontAwesomeIcon icon={faCircleLeft} className=' text-[#00a650] bg-white rounded-full h-10 ' /> */}
        {/* <button>
              <img src={Logout} className='rounded-full h-12 w-12 bg-white  shadow-[0px_0px_5px] shadow-white' />
          </button>
        </div> */}
      </div>
    </div>


  );
};
export default Sidebar;
