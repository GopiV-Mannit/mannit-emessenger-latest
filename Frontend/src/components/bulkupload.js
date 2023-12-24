import React, { useMemo, useState } from 'react';
import { SERVER_URL } from './config';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';
import statesData from '../stateanddistrict.json';
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import file from '../assets/Mannit.xlsx'
import logo from '../assets/excel.webp'
const Bulk = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [selectedFile, setSelectedFile] = useState({ name: "No File Chosen" });
  const adminid = sessionStorage.getItem('user');
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [countries, setCountries] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [inputValue1 , setInputValue1] = useState("");
  const [selected1, setSelected1] = useState("");
  const [open1, setOpen1] = useState(false);
  const [group,setGroup]=useState("");
  const handleStateChange = (event) => {
    const state = event.target.value;
    setState(state);
  };
  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setDistrict(district);
  };
  const handlearea = (event) => {
    setArea(event.target.value);
  };
  const handlegroup=(event)=>{
    setGroup(event.target.value);
  }
  const handleFileSelect = (e) => {
    // Get the selected file from the input element
    const file = e.target.files[0];
    setSelectedFile(file);
  }
  const handlename = (e) => {
    setName(e.target.value);
  }
  const handlephone = (e) => {
    setPhone(e.target.value);
  }
  const validphone = () => {
    const phoneRegex = /^[2-9]{1}[0-9]{9}$/;

    // Check if the input matches the phone number format
    if (phoneRegex.test(phone)) {
      // Input is a valid phone number, update the state
      return true;
    } else {
      // Input is not a valid phone number, you can handle this case accordingly
      // For example, show an error message to the user
      return false;
      console.log("Invalid phone number");
    }
  }
  const handleDownloadExcel = () => {
    // Column names
    const columns = ['name', 'phone', 'state', 'district', 'area'];

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([columns]);

    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Convert buffer to Blob and trigger download
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'sample  .xlsx');
  };
  const addcustomer = (e) => {
    const flag = validphone();
    if (name !== "" && phone !== "" && phone.length == 10 && flag) {
      e.preventDefault();
      let customerdata = {
        name,
        phone,
        adminid,
        state,
        district,
        area,
        group
      };
      axios.post(`${SERVER_URL}api/postuser`, customerdata)
        .then((response) => {
          // console.log(response);
          if (response.data.message == 'User exists') {
            toast.error('Customer Already Exists', { autoClose: 500, className: 'text-orange' })
          }
          else {
            toast.success('Customer Added SucessFully', { autoClose: 500, className: 'text-orange' });
            setName("");
            setPhone("");
            setDistrict("");
            setState("");
            setArea("");
            setSelected("");
            setSelected1("");
            setGroup("");
          }
        }).catch((err) => {
          toast.error('Not Able to add Customer', { autoClose: 500, className: 'text-orange' });

        });
    }
    else if(name=="" && phone=="" && state=="" && area=="" && district=="" && group=="")
    {
      toast.error('Please Enter Customer Details', { autoClose: 500, className: 'text-orange' });
    }
    else if (name != "" && phone == "") {
      toast.error('Please Enter the Phone', { autoClose: 500, className: 'text-orange' });
    }
    else if (phone.length != 10) {
      toast.error('Please Enter the 10 digit Phone Number', { autoClose: 500, className: 'text-orange' });
    }
    else if (phone != "" && name == "") {
      toast.error('Please Enter the Name', { autoClose: 500, className: 'text-orange' });
    }
    else if (flag == false) {
      toast.error('Please Enter Valid Phone', { autoClose: 500, className: 'text-orange' });
    }

  }

  const upload = async () => {
    if (selectedFile.name === 'No File Chosen') {
      toast.error('Please select a file first', {
        autoClose: 2000,
        className: 'text-orange',
      });
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is the one with data
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert the sheet to an array of objects
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const convertedData = jsonData.map((row, index) => {
            const convertedRow = {};
            Object.keys(row).forEach((key) => {
              convertedRow[key.toLowerCase()] = row[key];
            });
            return convertedRow;
        });
        // console.log(convertedData);
        // Send the data to the backend
   
        toast.success('File is being uploaded please wait', {
          autoClose: 1000000,
          className: 'text-orange',
        });
        await axios.post(`${SERVER_URL}api/bulkupload`, { data: convertedData, adminid: adminid });
        toast.dismiss();
        toast.success('Data uploaded successfully', {
          autoClose: 2000,
          className: 'text-orange',
        });
        setSelectedFile({ name: "No File Chosen" });
      } catch (error) {
        console.error(error);
        toast.error('Error uploading data', {
          autoClose: 2000,
          className: 'text-orange',
        });
      }
    };

    // Read the selected file as an array buffer
    fileReader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="bg-white z--10 h-[650px]  overflow-y-auto flex flex-col space-y-[40px]  items-center  w-[1080px] mt-8 filter backdrop-blur-3xl border shadow-[0px_0px_5px] shadow-white">
      <div className="flex flex-col mt-10 space-y-10 items-center">
        <div className='flex flex-row space-x-10 relative'>
          <label htmlFor="label1" className="font-semibold text-[17px] text-[#00A650]">
            Customer Name
          </label>
          <input
            type="text"
            placeholder="Enter Customer Name"
            value={name}
            required
            onChange={handlename}
            className="border border-white w-[400px]  shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none "
          />
        </div>
        <div className='flex flex-row space-x-10'>
          <label htmlFor="label2" className="font-semibold text-[17px] text-[#00A650]">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter Phone Number"
            required
            maxLength="10"
            value={phone}
            onChange={handlephone}
            className="border border-white w-[400px]  shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none "
          />
        </div>

        <div className="flex flex-row space-x-[115px] flex-start">
          <div>
        <label htmlFor="label3" className="font-semibold text-[17px] absolute text-[#00A650] top-[180px] left-[260px] ">
              State
            </label>
            </div>
          <div className=''>
            {/* <label htmlFor="label3" className="font-semibold text-[17px] text-[#00A650]">State</label>
        <select  onChange={handleStateChange} value={state} className={`text-[17px] border border-white w-[400px] shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none max-h-[100px] ${state === "" || state==="Select State" ? 'text-gray-400' : 'text-black'}`} >
          <option value="">Select State</option>
          {statesData.states.map((stateObj) => (
            <option  key={stateObj.state} value={stateObj.state} className={`${state === "" || state==="Select State" ? 'text-gray-400' : 'text-black'}`}>
              {stateObj.state}
            </option>
          ))}
        </select> */}
            <div className="flex flex-col  absolute top-[180px] left-[417px] z-40">

              <div
                onClick={() => setOpen(!open)}
                className={`  p-2 flex items-center justify-between ${!selected && "text-gray-400"
                  } border border-white w-[402px] shadow-[0px_0px_5px] shadow-[#018752]  focus:outline-none `}
              >
                {selected
                  ? selected?.length > 25
                    ? selected?.substring(0, 25) + "..."
                    : selected
                  : "Select State"}
                <BiChevronDown size={20} className={`${open && "rotate-180"}`} />
              </div>
              <ul
                className={`bg-white mt-2 overflow-y-auto ${open ? "max-h-[250px]" : "max-h-0"
                  } `}
              >
                <div className="flex items-center px-2 sticky top-0 bg-white">
                  <AiOutlineSearch size={18} className="text-gray-700" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                    placeholder="Search State"
                    className="placeholder:text-gray-700 p-2 outline-none"
                  />
                </div>
                {statesData.states.map((stateObj) => (
                  <li
                    key={stateObj.state}
                    className={`p-2 text-sm hover:bg-[#FDD116] 
            ${stateObj.state?.toLowerCase() === selected?.toLowerCase() &&
                      " text-black"
                      }
            ${stateObj.state?.toLowerCase().startsWith(inputValue)
                        ? "block"
                        : "hidden"
                      }`}
                    onClick={() => {
                      if (stateObj.state?.toLowerCase() !== selected.toLowerCase()) {
                        setSelected(stateObj.state);
                        setState(stateObj.state);
                        setOpen(false);
                        setInputValue("");
                      }
                    }}
                  >
                    {stateObj.state}
                  </li>
                ))}
              </ul>
            </div>

          </div>
          {/* <div className='flex flex-row space-x-[103px]'>
        <label htmlFor="label4" className="font-semibold text-[17px] text-[#00A650]">District</label>
        <select className={`text-[17px] border border-white w-[400px] p-1 shadow-[0px_0px_5px] shadow-[#018752]  focus:outline-none max-h-[100px] ${district === "" || district==="District State" ? 'text-gray-400' : 'text-black'}`}   onChange={handleDistrictChange} value={district}>
          <option value="">Select District</option>
          {state &&
            statesData.states.find((stateObj) => stateObj.state === state).districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
        </select>
        </div>
        <div className='flex flex-row space-x-[122px]'>
          <label htmlFor="label5" className="font-semibold text-[17px] text-[#00A650]">
            Area
          </label>
          <input
            type="text"
            placeholder="Enter Area"
            required
            value={area}
            onChange={handlearea}
            className="border border-white w-[400px]  shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none "
          />
        </div> */}

        </div>
        <div className="flex flex-row space-x-[115px] flex-start">
          <div>
        <label htmlFor="label3" className="font-semibold text-[17px] absolute text-[#00A650] top-[260px] left-[260px] ">
              District
            </label>
            </div>
          <div className=''>
            {/* <label htmlFor="label3" className="font-semibold text-[17px] text-[#00A650]">State</label>
        <select  onChange={handleStateChange} value={state} className={`text-[17px] border border-white w-[400px] shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none max-h-[100px] ${state === "" || state==="Select State" ? 'text-gray-400' : 'text-black'}`} >
          <option value="">Select State</option>
          {statesData.states.map((stateObj) => (
            <option  key={stateObj.state} value={stateObj.state} className={`${state === "" || state==="Select State" ? 'text-gray-400' : 'text-black'}`}>
              {stateObj.state}
            </option>
          ))}
        </select> */}
            <div className="flex flex-col  absolute top-[260px] left-[416px] z-10">

              <div
                onClick={() => setOpen1(!open1)}
                className={`bg-white  p-2 flex items-center justify-between ${!selected1 && "text-gray-400"
                  } border border-white w-[401px] shadow-[0px_0px_5px] shadow-[#018752]  focus:outline-none `}
              >
                {selected1
                  ? selected1?.length > 25
                    ? selected1?.substring(0, 25) + "..."
                    : selected1
                  : "Select District"}
                <BiChevronDown size={20} className={`${open1 && "rotate-180"}`} />
              </div>
              <ul
                className={`bg-white mt-2 overflow-y-auto ${open1 ? "max-h-[250px]" : "max-h-0"
                  } `}
              >
                <div className="flex items-center px-2 sticky top-0 bg-white">
                  <AiOutlineSearch size={18} className="text-gray-700" />
                  <input
                    type="text"
                    value={inputValue1}
                    onChange={(e) => setInputValue1(e.target.value.toLowerCase())}
                    placeholder="Search District"
                    className="placeholder:text-gray-700 p-2 outline-none"
                  />
                </div>
                {state &&
            statesData.states.find((stateObj) => stateObj.state === state).districts.map((dis, index) => (
                  <li
                    key={index}
                    className={`p-2 text-sm hover:bg-[#FDD116] 
            ${dis?.toLowerCase() === selected1?.toLowerCase() &&
                      " text-black"
                      }
            ${dis?.toLowerCase().startsWith(inputValue1)
                        ? "block"
                        : "hidden"
                      }`}
                    onClick={() => {
                      if (dis?.toLowerCase() !== selected1.toLowerCase()) {
                        setSelected1(dis);
                        setDistrict(dis);
                        setOpen1(false);
                        setInputValue1("");
                      }
                    }}
                  >
                    {dis}
                  </li>
                ))}
              </ul>
            </div>

          </div>
          {/* <div className='flex flex-row space-x-[103px]'>
        <label htmlFor="label4" className="font-semibold text-[17px] text-[#00A650]">District</label>
        <select className={`text-[17px] border border-white w-[400px] p-1 shadow-[0px_0px_5px] shadow-[#018752]  focus:outline-none max-h-[100px] ${district === "" || district==="District State" ? 'text-gray-400' : 'text-black'}`}   onChange={handleDistrictChange} value={district}>
          <option value="">Select District</option>
          {state &&
            statesData.states.find((stateObj) => stateObj.state === state).districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
        </select>
        </div>
        <div className='flex flex-row space-x-[122px]'>
          <label htmlFor="label5" className="font-semibold text-[17px] text-[#00A650]">
            Area
          </label>
          <input
            type="text"
            placeholder="Enter Area"
            required
            value={area}
            onChange={handlearea}
            className="border border-white w-[400px]  shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none "
          />
        </div> */}

        </div>
        <div className='flex flex-row space-x-[122px] absolute top-[300px] left-[258px]'>
          <label htmlFor="label5" className="font-semibold text-[17px] text-[#00A650]">
            Area
          </label>
          <input
            type="text"
            placeholder="Enter Area"
            value={area}
            onChange={handlearea}
            className="border border-white w-[402px]  shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none "
          />
        </div>
        <div className='flex flex-row space-x-[110px] absolute top-[360px] left-[258px]'>
          <label htmlFor="label5" className="font-semibold text-[17px] text-[#00A650]">
            Group
          </label>
          <input
            type="text"
            placeholder="Enter Group"
            value={group}
            onChange={handlegroup}
            className="border border-white w-[402px]  shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none "
          />
        </div>
        <div>
          <div className='flex flex-col space-y-[20px] mt-[199px]'>
            <div className="flex flex-row justify-center  items-center space-x-[40px] ">
              <button className="text-white  h-10 w-52  cursor-pointer  rounded-sm px-5 py-1 btncolor border shadow-[0px_0px_5px] shadow-[#018752]" onClick={addcustomer}>Add Customer</button>
            
            </div>
            <div className="flex flex-row space-x-[50px] ml-[60px] rounded-sm w-[300px] p-2 text-white">
            <div><label className="bg-[#018752] w-[300px] py-[6px] px-3 rounded-[2px]">Sample Sheet</label></div>
            <div className="w-[30px] h-7 cursor-pointer">
            <a href={file} download={`Mannit ${adminid}`} ><img src={logo} width={35}/></a>
            </div>
            </div>
            <div className="flex  flex-row space-x-10 ml-[50px]">
              <div className="flex flex-row space-x-[485px]">
                <div className="w-12 border-black p-2">
                  <p className="text-black w-[500px] border-[2.1px] border-[#00A650] pl-2">{selectedFile.name}</p>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  accept=".xlsx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => document.getElementById('fileInput').click()}
                  className="text-white  h-10 w-48  cursor-pointer  rounded-sm px-5 py-1 btncolor border shadow-[0px_0px_5px] shadow-[#018752]"
                >
                  Browse
                </button>
              </div>
              <button
                onClick={upload}
                className="text-white  h-10 w-52  mr-2 cursor-pointer  rounded-sm px-5 py-1 btncolor border shadow-[0px_0px_5px] shadow-[#018752]"
              >
                upload
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Bulk;
