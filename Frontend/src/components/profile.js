import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
function Profile() {
  const [user, setName] = useState(sessionStorage.getItem('name'));
  const [mobile, setPhoneNumber] = useState(sessionStorage.getItem('phoneNumber'));
  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [posting, setPosting] = useState(sessionStorage.getItem('category'));
  const [location, setlocation] = useState(sessionStorage.getItem('location'));
  const [isEditing, setIsEditing] = useState(false);
  const [password, setpassword] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [flag,setFlag]=useState(false);
  const originalDate = new Date(sessionStorage.getItem('dob'));
  const day = originalDate.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
  const year = originalDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  
  const formattedTime = originalDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const [dob, setDOB] = useState(formattedDate+" "+formattedTime);
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordToggle1 = () => {
    setShowPassword1(!showPassword1);
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleemail=(e)=>{
    setEmail(e.target.value);
    setFlag(true);
  }
  const handlelocation=(e)=>{
    setlocation(e.target.value);
    setFlag(true);
  }
  const handlecategory=(e)=>{
    setPosting(e.target.value);
    setFlag(true);
  }
  const passwordChange= async ()=>{
    // console.log("Hii")
    axios
    .patch(`${SERVER_URL}api/changepassword/${user}`, {password,newpassword})
    .then(response => {
      // console.log(response);
      if(response.status==200)
      {
        toast.success('Password Updated SuccessFully', { autoClose: 1000 });
        setpassword("");
        setnewpassword("");
        setShowPassword(false);
        setShowPassword1(false);
        setIsEditing(false);
        // console.log(4);
        
      }
    })
    .catch(error => {
      if(error.response.data.message=="Invalid password")
      {
        toast.error('Invalid Old Password',{autoClose:1000});
      }
      // console.log(error);
    });
    // setpassword("");
    // setnewpassword("");
  }
  const handleSave = async () => {
    if((password=="" && newpassword=="" && flag)||(password!=="" && newpassword!=="" && flag))
    {
            axios
              .patch(`${SERVER_URL}api/patchprofile/${user}`, {  posting,email, location })
              .then(response => {
                // console.log(response.data);
               if((newpassword=="" &&  password=="") || (newpassword!="" && password!=""))
               {
                       toast.success('Profile Updated', { autoClose: 1000 });
                       setIsEditing(false);
                       setShowPassword(false);
                       setShowPassword1(false);
              }
              })
              .catch(error => {
                console.error('Error fetching data:', error);
              });
            // sessionStorage.setItem('name', user);
            // sessionStorage.setItem('phoneNumber', mobile);
            sessionStorage.setItem('category', posting);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('location', location);
            // sessionStorage.setItem('dob', dob);
            // console.log(sessionStorage.getItem('location'));
            setFlag(false);
            // setIsEditing(false);
            // console.log(password);
            // console.log(newpassword);
            


  }
  if(password!="" && newpassword!="")
  {
        passwordChange();   
  }
  else if(password=="" && newpassword!="")
  {
     toast.warning('Please Enter Old Password', { autoClose: 1000 });
    //  console.log(1);
  }
  else if(newpassword=="" && password!="")
  {
     toast.warning('Please Enter New Password', { autoClose: 1000 });
    //  console.log(2);
  }
  else
  {
    setShowPassword(false);
    setShowPassword1(false);
    setIsEditing(false);
  }
  
  };

  return (
    <div className="flex flex-col content justify-center  bg-white  w-[1080px] space-y-10 mt-8 h-[650px] border shadow-[0px_0px_5px] shadow-white">
      <div className="flex flex-row justify-center space-x-20">
        <div className={`${isEditing ? 'space-y-6' : 'space-y-4'}`}> {/* Adjust the vertical spacing here */}
          {!isEditing && (
            <h1 className="text-[#018752] font-bold">Name</h1>
          )}
          {!isEditing && (
            <h1 className="text-[#018752] font-bold ">Phone Number</h1>
          )}
          {!isEditing && (
            <h1 className="text-[#018752] font-bold">Onboarded Date</h1>
          )}
          <h1 className="text-[#018752] font-bold">Email Id</h1>
          <h1 className="text-[#018752] font-bold">Category</h1>
          <h1 className="text-[#018752] font-bold">Location</h1>
          {isEditing && (
            <h1 className="text-[#018752] font-bold">Old Password</h1>
          )}
          {isEditing && (
            <h1 className="text-[#018752] font-bold">New Password</h1>
          )}
        </div>
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="flex flex-col space-y-[21px]">
                <div>
                <input
                  type="text"
                  value={email}
                  onChange={handleemail}
                  className=" border-[#000000] border-r-0 border-t-0 border-l-0 border-b-2 focus:outline-none w-[250px]"
                />
                </div>
                <div>
                <input
                  type="text"
                  value={posting}
                  onChange={handlecategory}
                  className=" border-[#000000] border-r-0 border-t-0 border-l-0 border-b-2 focus:outline-none w-[250px]"
                />
                </div>
                <div>
                <input
                  type="text"
                  value={location}
                  onChange={handlelocation}
                  className=" border-[#000000] border-r-0 border-t-0 border-l-0 border-b-2 focus:outline-none w-[250px]"
                />
                </div>
                <div>
                <input
                    type={showPassword1 ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className=" border-[#000000] border-r-0 border-t-0 border-l-0 border-b-2 focus:outline-none w-[240px]"
                  />  
               <button
                          type="button"
                          className=" "
                          onClick={handlePasswordToggle1}
                        >
                          <FontAwesomeIcon
                            icon={showPassword1 ? faEyeSlash : faEye}
                            className="text-[#28282B] h-3 absolute top-1/6  transform -translate-y-[6.5px]  cursor-pointer  focus:outline-none border-b-[2px] border-[#000000]"
                          />
                        </button>
                </div>
                <div className=" ">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newpassword}
                    onChange={(e) => setnewpassword(e.target.value)}
                    className=" border-[#000000] border-r-0 border-t-0 border-l-0 border-b-2 focus:outline-none w-[240px]"
                  />  
               <button
                          type="button"
                          className=" "
                          onClick={handlePasswordToggle}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="text-[#28282B] h-3 absolute top-1/6  transform -translate-y-[6.5px]  cursor-pointer  focus:outline-none border-b-[2px] border-[#000000]"
                          />
                        </button>
                </div>

              </div>
            </>
          ) : (
            <>
              <h4 className="text-black font-bold">{user}</h4>
              <h4 className="text-black font-bold">{mobile}</h4>
              <h4 className="text-black font-bold">{dob}</h4>
              <h4 className="text-black font-bold">{email}</h4>
              <h4 className="text-black font-bold">{posting}</h4>
              <h4 className="text-black font-bold">{location}</h4>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-white px-4 py-2 mr-12 w-20 rounded-sm btncolor border shadow-[0px_0px_5px] shadow-[#018752] ">
              Save
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="text-white px-4 py-2 mr-12 w-20 rounded-sm btncolor border shadow-[0px_0px_5px] shadow-[#018752] ">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export default Profile;
