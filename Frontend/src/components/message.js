import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialReactTable from 'material-react-table';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Video from "./video";
import ImagePopup from './image';
import { toast } from 'react-toastify';
import { SERVER_URL, BASE_URL } from './config';
function Message({ selectedMenu, setSelectedMenu }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchbar, setSearchbar] = useState(true);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [bool, setbool] = useState(false);
  const [msgCount, setmsgCount] = useState(sessionStorage.getItem('msgCount'));
  const [rowSelection, setRowSelection] = useState({});
  const [flag, setflag] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  var flag1 = true;
  const [popupOpen, setPopupOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [videoid, setVideoUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [localurl, setlocalUrl] = useState("");
  const [tag, setInput] = useState("");
  const os = require('os');
  const [filepath, setFilePath] = useState("");
  const [selectedFile, setSelectedFile] = useState({ name: "No Image Chosen" });
  const [globalFilter, setGlobalFilter] = useState('');
  const handleFileSelect = async (e) => {
    const updateUserToken = await axios.post(`${SERVER_URL}api/updateToken/${user}`);
    const timeout = { timeout: 10000 };

    // console.log(updateUserToken.data.token);
    // Get the selected file from the input element
    // console.log(1);
    const file = e.target.files[0];
    // console.log(file);
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = `${BASE_URL}/api/v1/user/cloudstorages/file-upload`;
      const headers = {
        'Content-Type': 'multipart/form-data; boundary=MfnBoundry',
        'Authorization': `Bearer ${updateUserToken.data.token}`,
      };
      const formData = new FormData();
      formData.append('files', file);

      axios.post(url, formData, { headers }, timeout)
        .then(response => {
          // Handle success
          toast.success('File uploaded successfully', { autoClose: 1000 })
          setFilePath(response.data.data.file_url);
          // console.log(response.data.data.file_url);
        })
        .catch(error => {
          // Handle error
          toast.error('Internal Server Error', { autoClose: 1000 })
          // console.error('Error uploading file:', error);
        });


    } else {
      alert('Please select a valid image file.');
    }
  }
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  const openImagePreview = () => {
    setIsImageModalOpen(true);
  };

  const closeImagePreview = () => {
    setIsImageModalOpen(false);
  };
  const handleurlChange = (event) => {
    setInputUrl(event.target.value);
  };
  const handletagchange = (event) => {
    setInput(event.target.value);
  }

  const handlePreviewClick = () => {
    if (inputUrl.includes("si")) {
      // If inputUrl contains "=", execute this logic
      var b = inputUrl.split("?");
      // console.log(b);
      b = b[0].split("/");
      setVideoUrl('https://www.youtube.com/embed/' + b[b.length - 1]);
      openPopup();
    } else {
      var b = inputUrl.split("v=");
      var c = b[b.length - 1];
      if (c.includes("&")) {
        c = c.split("&");
        c = c[0];
      }
      setVideoUrl('https://www.youtube.com/embed/' + c);
      openPopup();

    }
  };
  const handlePreviewClickImage = () => {
    try {
      if (selectedFile.name === "No Image Chosen") {

        toast.error("Please Upload File", { autoClose: 1000 });

      }
      else {
        openImagePreview();

      }
    }
    catch (error) {
      openImagePreview();
    }
  }
  const user = sessionStorage.getItem('user');
  const usermobile = sessionStorage.getItem('phoneNumber');
  // console.log("mobile : "+usermobile);
  // console.log(videoid);
  useEffect(() => {
    if (msgCount === 0) {
      alert('Please Subscribe as your current plan has expired.');
    }

    const fetchData = async () => {
      const response = await axios.post(`${SERVER_URL}api/user`, {
        adminid
      });
      const msgCountUpdate = await axios.get(`${SERVER_URL}api/profile/${user}`);
      setmsgCount(msgCountUpdate.data.msgCount);
      setData(response.data);
    };

    if (globalFilter === '') {
      fetchData();
      setRowSelection({});
    } else {
      try {
        // Load original data when global filter is cleared
        if (flag) {
          setflag(false);
          fetchData();
        } else {
          // Filter data based on globalFilter
          const filteredData = data.filter((row) =>
            Object.values(row).some((value) => {
              if (value && typeof value === 'string') {
                return value.toLowerCase().includes(globalFilter.toLowerCase());
              }
              return false;
            })
          );
          setData(filteredData);

        }
      } catch (error) {
        // Handle errors or revert to original data
        fetchData();
        setGlobalFilter('');
        setRowSelection({});
        toast.warning('Please Clear by Manually Features are Getting Updated');
      }
    }
  }, [msgCount]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const adminid = sessionStorage.getItem('user');
  // const handleSelectAllRows = () => {
  //   setRowSelection((prevRowSelection) => {
  //     const allRowsSelected = data.reduce((acc, _, index) => {
  //       acc[index] = true;
  //       return acc;
  //     }, { ...prevRowSelection });

  //     return allRowsSelected;
  //   });
  // };
  const handleSelectAllRows = () => {
    try {

      setRowSelection((prevRowSelection) => {
        const allRowsSelected = data.reduce((acc, row, index) => {
          const matchesSearch = Object.values(row).some((value) => {
            if (value != null && typeof value === 'string') {
              return value.toLowerCase().includes(globalFilter.toLowerCase());
            }
            return false;
          });
          acc[index] = matchesSearch ? !areAllRowsSelected() : prevRowSelection[index];
          return acc;
        }, {});
        return allRowsSelected;
      });
    } catch (error) {
      // console.error(error);
    }
  };

  const areAllRowsSelected = () => {
    try {
      if (Object.keys(rowSelection).length === 0) {
        return false;
      }
      return Object.values(rowSelection).every((selected) => selected);
    }
    catch (error) {

    }
  };


  const loadUserData = async () => {
    const response = await axios.post(`${SERVER_URL}api/user`, {
      adminid
    });
    const msgCountUpdate = await axios.get(`${SERVER_URL}api/profile/${user}`);
    setmsgCount(msgCountUpdate.data.msgCount);
    setData(response.data);
    //console.log(response.data);
    // setData(()=> response.data.map(item => {
    //   const keyValuePairs = item.split(',').map(pair => pair.trim());
    //   const itemObject = {};
    //   keyValuePairs.forEach(pair => {
    //     const [key, value] = pair.split(':');
    //     itemObject[key] = value;
    //   });
    //   return itemObject;
    // }))
    setflag(true);
    // setData(response.data);
    // console.log(response.data);
    // setPhoneNumbers(response.data.map((user) => user.phonenumber));
    // console.log(data);
  };

  const [content, setcontent] = useState([]);
  const columns = useMemo(
    () => [
      {

        accessorKey: 'name', //access nested data with dot notation
        header: 'Name',
      },
      {

        accessorKey: 'phone',
        header: 'Phone',
      },
      {
        accessorKey: 'state', //access nested data with dot notation
        header: 'State',
        Cell: ({ row }) => (row.original.state ? row.original.state : "-"),
      },
      {
        accessorKey: 'district', //access nested data with dot notation
        header: 'District',
        Cell: ({ row }) => (row.original.district ? row.original.district : "-"),
      },
      {
        accessorKey: 'area', //access nested data with dot notation
        header: 'Area',
        Cell: ({ row }) => (row.original.area ? row.original.area : "-"),
      },
      {
        accessorKey: 'group', //access nested data with dot notation
        header: 'Group',
        Cell: ({ row }) => (row.original.area ? row.original.group : "-"),
      },

    ],
    [],
  );
  const [message, setMessage] = useState('');
  // const [flag,setFlag]=useState(0);
  const handleChange = (event) => {
    const inputText = event.target.value;
    // You can add logic here to limit the message to 200 words if needed
    setMessage(inputText);
  };
  const handlevideoChange = (event) => {
    setlocalUrl(event.target.value);
    // console.log(event.target.value);
  }
  // const [rowSelection, setRowSelection] = useState({});
  const selectedIndices = Object.keys(rowSelection).filter(key => rowSelection[key]);
  const filteredSelectedData = selectedIndices.map(index => {
    const item = data[index];
    if (item && item.name && item.phone) {
      return {
        name: item.name,
        phone: item.phone
      };
    }
    return null;
  });
  // console.log(filteredSelectedData);
  const selectedData = filteredSelectedData
    .filter(item => item !== null) // Remove null values
    .map(item => [item.name, item.phone]);
  // console.log(selectedData);
  const member = selectedData
    .filter(item => item !== null) // Remove null values
    .map(item => "91" + item[1]);
  // console.log(member);
  // function delay(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }
  // console.log(member);
  const sendMember = async () => {
    const updateUserToken = await axios.post(`${SERVER_URL}api/updateToken/${user}`);
    // console.log(updateUserToken.data.token);
    const timeout = { timeout: 1000 };
    var content;
    const batchSize = 10;
    // const memberChunks = [];

    // Split the member array into chunks of size batchSize
    var countmes = 0;
    // const batchSize = 10; // Set your batch size
    let totalMembers = member.length;
    let totalCount = member.length;
    if (filepath != "") {

      // let countmes = 0; // Counter for unsuccessful messages
      const url = `${BASE_URL}/api/v1/user/whatsapp/phone/${usermobile}/send-photos`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${updateUserToken.data.token}`,
      };

      for (let i = 0; i < totalCount; i += batchSize) {
        if (totalMembers >= 10) {
          const chunk = member.slice(i, i + batchSize);
          // console.log(chunk);
          const dataBatch = {
            to: chunk,
            caption: "Hi,\n\n" + message + "\n\n" + inputUrl + "\n\n" + "Thanks" + "\n\n" + " Have a nice day....",
            photo_url: filepath
          };
          console.log(url,dataBatch,headers);
          try {
            const responses = await axios.post(url, dataBatch, { headers }, timeout);

            // Check responses for each batch
            if (responses.data.code === 200) {
              // Message sent successfully for this batch
              // console.log('Message sent successfully');
              totalMembers -= 10;
            } else {
              // Handle error for this batch
              countmes += 10;
              // console.error('Error sending message:', responses.data);
            }
          } catch (error) {
            // Handle error for the entire batch
            // console.error('Error sending messages:', error);
            return false;
          }
        }
      }

      // Handle remaining members if any
      const remainingMembers = totalMembers % batchSize;

      if (remainingMembers > 0) {
        const remainingChunk = member.slice(member.length - remainingMembers);
        // console.log(remainingChunk);
        const dataRemaining = {
          to: remainingChunk,
          caption: "Hi,\n\n" + message + "\n\n" + inputUrl + "\n\n" + "Thanks" + "\n\n" + " Have a nice day....",
          photo_url: filepath
        };
        try {
          const remainingResponses = await axios.post(url, dataRemaining, { headers }, timeout);
          if (remainingResponses.data.code !== 200) {
            // Handle error for the remaining batch
            countmes += remainingMembers;
            // console.error('Error sending message:', remainingResponses.data);
          }
        } catch (error) {
          // Handle error for the remaining batch
          return false;
          console.error('Error sending messages:', error);
        }
      }

      // Check overall success or failure
      if (countmes === 0) {
        return true;
      } else {
        toast.error(`${countmes} Messages Are not Sent`);
        return false;
      }

      return true;
    }
    else {
      // var content;
      // console.log(usermobile);
      const url = `${BASE_URL}/api/v1/user/whatsapp/phone/${usermobile}/send-text`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${updateUserToken.data.token}`,
      };
      if (inputUrl != "") {
        content = "Hi,\n\n" + message + "\n\n" + inputUrl + "\n\n" + "Thanks" + "\n\n" + " Have a nice day...."
      }
      else {
        content = "Hi,\n\n" + message + "\n\n" + "\n\n" + "Thanks" + "\n\n" + " Have a nice day...."
      }

      // const batchSize = 10;
      // const memberChunks = [];
      // var countmes = 0;
      // // Split the member array into chunks of size batchSize
      // for (let i = 0; i < member.length; i += batchSize) {
      //   const chunk = member.slice(i, i + batchSize);
      //   // memberChunks.push(chunk);
      //   console.log(chunk);
      //   const dataBatch = {
      //     to: chunk,
      //     message: content,
      //   };

      //   try {
      //     const responses = await axios.post(url, dataBatch, { headers }, timeout)

      //     // var countmes=0;
      //     // Check responses for each batch
      //     // for (const response of responses) {
      //     if (responses.data.code === 200) {
      //       // Message sent successfully for this batch

      //     } else {
      //       countmes += 10;
      //       // Handle error for this batch
      //       console.error('Error sending message:', responses.data);
      //     }

      //   } catch (error) {
      //     // Handle error for the entire batch
      //     console.error('Error sending messages:', error);
      //   }
      //   if (countmes == 0) {
      //     return true;
      //   }
      //   else {
      //     toast.error(`${countmes} Messages Are not Sent`);
      //     return false;
      //   }
      // }
      for (let i = 0; i < totalCount; i += batchSize) {
        if (totalMembers >= 10) {
          const chunk = member.slice(i, i + batchSize);
          // console.log(chunk);
          const dataBatch = {
            to: chunk,
            message: content,
          };

          try {
            const responses = await axios.post(url, dataBatch, { headers }, timeout);
            // Check responses for each batch
            if (responses.data.code === 200) {
              // Message sent successfully for this batch
              // console.log('Message sent successfully');
              totalMembers -= 10;
            } else {
              // Handle error for this batch
              countmes += 10;
              // console.error('Error sending message:', responses.data);
            }
          } catch (error) {
            // Handle error for the entire batch
            // console.error('Error sending messages:', error);
            return false;
          }
        }
      }

      // Handle remaining members if any
      const remainingMembers = totalMembers % batchSize;

      if (remainingMembers > 0) {
        const remainingChunk = member.slice(member.length - remainingMembers);
        // console.log(remainingChunk);
        const dataRemaining = {
          to: remainingChunk,
          message: content,
        };
        try {
          const remainingResponses = await axios.post(url, dataRemaining, { headers }, timeout);
          if (remainingResponses.data.code !== 200) {
            // Handle error for the remaining batch
            countmes += remainingMembers;
            // console.error('Error sending message:', remainingResponses.data);
          }
        } catch (error) {
          // Handle error for the remaining batch
          return false;
          console.error('Error sending messages:', error);
        }
      }

      // Check overall success or failure
      if (countmes === 0) {
        return true;
      } else {
        toast.error(`${countmes} Messages Are not Sent`);
        return false;
      }



      return true;
    }

  };
  //console.log(selectedData);
  const sendMessage = async (e) => {
    if ((tag !== "" && selectedData.length !== 0) && (videoid != "" || message != "" || filepath != "") && (selectedData.length <= msgCount)) {
      e.preventDefault();
      let dobj = {
        user,
        tag,
        videoid,
        message,
        selectedData,
        filepath
      };
      toast.success('Messages are being Sent', { autoClose: 100000000 });
      const isSuccess = await sendMember();
      if (isSuccess) {
        fetch(`${SERVER_URL}api/summaries`, {
          method: "POST",
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(dobj)
        }).then((res) => {
          // console.log('success');
          toast.dismiss();
          toast.success("Message Sent", { autoClose: 2000 })
          axios
            .patch(`${SERVER_URL}api/updateMsgCount/${user}`, { msgCount: msgCount - selectedData.length })
            .then(response => {
              if (response.status === 500) {
                // toast.error('failed to update', { autoClose: 500 });
              }
              else if (response.status === 200) {
                // toast.success('message count Updated', { autoClose: 500 });
                setmsgCount(msgCount - selectedData.length);
                sessionStorage.setItem('msgCount', msgCount - selectedData.length);
              }
            })
            .catch(error => {
              // console.log(error);
            });
          setMessage('');
          // sendMember();
          setData([]);
          setInput("");
          setInputUrl("");
          setSearchTerm("");
          setVideoUrl("");
          setSelectedFile({ name: "No Image Chosen" });
          setRowSelection({});
          setFilePath("");
          setPopupOpen(false);
          setIsImageModalOpen(false);
          // handleFileSelect(selectedFile);
          // setSearchbar(false);
          // setSearchbar(true);
          // sendMember();
          // console.log(selectedMenu);
          // setSelectedMenu('sidebar');
          // console.log(selectedMenu);
          loadUserData();
          setGlobalFilter('');
          areAllRowsSelected();
          axios.get(`${SERVER_URL}api/summary/${user}`)
            .then(response => {
              const dataString = JSON.stringify(response.data);
              // console.log(dataString);
              sessionStorage.setItem('data', dataString);

              // console.log(sessionStorage.getItem('data'));
            })
            .catch(error => {
              // console.error('Error fetching data:', error);
            });
          // setTimeout(() => {
          //   window.location.reload();
          // }, 2500);

        }).catch((err) => {

        });
      }
      else {
        toast.dismiss();
        toast.warning("Server Under Maintenance", { autoClose: 1000 });
      }

    }
    else {
      if (selectedFile.name === "No Image Chosen" && videoid === "" && message === "") {
        toast.error("Please Enter Data", { autoClose: 1000 });
      }
      else if (selectedData.length > msgCount) {
        toast.warning("Message Count Exceeds Limit");
        // console.log(selectedData.length);
      }
      else if (selectedData.length === 0) {
        toast.error("Please Select Members", { autoClose: 1000 })
      }
      else if (tag === "") {
        toast.error("Please Enter Tag", { autoClose: 1000 });
      }



    }
  };

  return (
    <div className="mt-8 bg-white h-[650px] overflow-y-scroll  w-[1080px] border shadow-[0px_0px_5px] shadow-white">
      <div className="p-4 ">
        <textarea
          className={`w-full h-[100px] resize-none border border-white  shadow-[0px_0px_5px] shadow-[#018752] ${message.length === 0 ? 'p-1' : 'p-4'} focus:outline-none `}
          placeholder="Enter your message (maximum 200 words)"
          value={message}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="flex flex-col justify-center items-center p-4 w-full">
        <div className="flex justify-between w-full">
          <input
            type="text"
            placeholder="Enter Tag Name"
            value={tag}
            onChange={handletagchange}
            className="border border-white w-[240px] shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter video URL"
            value={inputUrl}
            onChange={handleurlChange}
            className="border border-white w-[600px]  shadow-[0px_0px_5px] shadow-[#018752] p-1 focus:outline-none"
          />
          <button onClick={handlePreviewClick} className='py-1 px-3 rounded-sm text-white flex btncolor border shadow-[0px_0px_5px] shadow-[#018752]'>
            Preview
          </button>
          {popupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <Video videoUrl={videoid} onClose={closePopup} />
            </div>
          )}
        </div>
      </div>
      <div className="flex  justify-center p-2 w-full">
        <div className="flex flex-row space-x-[36px]">
          <p className="border border-white w-[800px] text-[#888888] shadow-[0px_0px_5px]  shadow-[#018752] p-1 focus:outline-none">{selectedFile.name}</p>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button onClick={() => document.getElementById("fileInput").click()} className='py-1 px-3  rounded-sm text-white flex btncolor border shadow-[0px_0px_5px] shadow-[#018752]'>
            Upload
          </button>
          <button onClick={handlePreviewClickImage} className='py-1 px-3  rounded-sm text-white flex btncolor border shadow-[0px_0px_5px] shadow-[#018752]'>
            Preview
          </button>
        </div>
        {isImageModalOpen && (
          <div className="fixed-image h-full w-full flex items-center justify-center z-50 bg-black bg-opacity-50 ">
            <ImagePopup imageUrl={filepath} onClose={closeImagePreview} />
          </div>
        )}
      </div>
      <div className="pr-2 pl-2 ml-2 pt-3">
        <button
          className="pb-3 pt-1 px-3 rounded-sm h-[36px] text-white  flex btncolor border shadow-[0px_0px_5px] shadow-[#018752]"
          onClick={handleSelectAllRows}
        >
          {areAllRowsSelected() ? "Deselect All Rows" : "Select All Rows"}
        </button>
      </div>
      <div className="pl-4 pr-4">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableRowSelection
          enableGlobalFilter={searchbar}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableColumnActions={false}
          enableHiding={false}
          initialState={{ pagination: { pageSize: 5 } }}
          onRowSelectionChange={setRowSelection}
          onGlobalFilterChange={setGlobalFilter}
          state={{ rowSelection, globalFilter }}

        />
      </div>
      <div className="flex flex-row justify-end p-8">
        <div className="flex flex-row space-x-10">
          <div className='bg-[#fdd116] w-[300px] h-10  rounded-sm font-bold   p-[6px]  text-[#018752]'><h1>Remaining Message Count : {msgCount}</h1></div>
          <button className="text-white h-10 w-52  cursor-pointer  rounded-sm px-5 py-1 btncolor border shadow-[0px_0px_5px] shadow-[#018752] " onClick={sendMessage} >
            Publish Whatsapp
          </button>
        </div>
        {/* <div className="p-4">
        <button className="text-white  h-10 w-52  cursor-pointer  rounded-sm px-5 py-1 btncolor border shadow-[0px_0px_10px] shadow-[#fb660d]" onClick={sendSms}  >
              Publish Sms
        </button>
      </div> */}
      </div>
    </div>
  )
}
export default Message;