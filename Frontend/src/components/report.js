import React, { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from './config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Video from './video';
import MessagePreview from './event';
import Send from './sent';
import ImagePopup from './image';
import { toast } from 'react-toastify';
const Report = () => {
  //   const [data, setData] = useState(JSON.parse(sessionStorage.getItem('data')));
  const [data, setData] = useState([]);
  const [videopopupOpen, setPopupOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [messagepopup, setPopup] = useState(false);
  const [videoid, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [todate, settodate] = useState("");
  const [fromdate, setfromdate] = useState("");
  const [sentcount, setsentcount] = useState([]);
  const [sentcountpopup, setsentPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [image, setImageUrl] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const user=sessionStorage.getItem('user');
  const handlePreviewClick = () => {
    openPopup();
  };
  const handlePreviewClick1 = () => {
    openPopup1();
  };
  const openPopup = () => {
    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  const openPopup1 = () => {
    setPopup(true);
  };
  const closePopup1 = () => {
    setPopup(false);
  };
  const close = () => {
    setsentPopup(false);
  };
  const ImagePreviewClick = () => {
    openImagePreview();
  }
  const openImagePreview = () => {
    setIsImageModalOpen(true);
  };

  const closeImagePreview = () => {
    setIsImageModalOpen(false);
  };
  const handlefromdateChange = (event) => {
    setfromdate(event.target.value);
    if (todate !== "") {
      axios.get(`${SERVER_URL}api/report/${event.target.value}/${todate}/${user}`,)
        .then(response => {
          setData(response.data);
          // console.log(dataString);
          // sessionStorage.setItem('data', dataString);
          // console.log(sessionStorage.getItem('data'));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  };
  const hexToRgb = hex => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const headerColorHex = "#018752"; // Your desired hexadecimal color code
  const headerColorRgb = hexToRgb(headerColorHex);
  const generatePDFReport = () => {
    if (data.length !== 0) {
      const doc = new jsPDF();
     
      const tableData = data.map(item => {
        return {
          Tag: item.tag,
          Name: item.user,
          Message: item.message !== '' ? item.message : 'Not Given',
          Videoid: item.videoid !== '' ? item.videoid : 'Not Given',
          Date: item.dateCreated,
        };
      });
      const header = [{ Tag: 'Tag              ', Name: '  Admin', Message: '                    Message    ', Videoid: '          Video URL   ', Date: '     Date   ' }];
      const maxTableHeight = doc.internal.pageSize.height - 20; // Adjust padding as needed
      let startY = 10; // Starting Y position
      let isFirstPage = true; // Variable to track the first page
      // Get the column widths from the header
      const columnWidths = header.map(column => column.width);
      for (let i = 0; i < tableData.length; i++) {
        const record = tableData[i];
        const recordHeight = 20; // Adjust as needed
        const spaceRequired = recordHeight + 5; // Space required for record plus some padding
        if (!isFirstPage && startY + spaceRequired > maxTableHeight) {
          doc.addPage(); // Add a new page if there's not enough space
          startY = 10; // Reset startY for the new page
        }
        if (isFirstPage || startY === 10) {
          doc.autoTable({
            head: header, // Wrap the header in an array
            startY: startY, // Use the current startY position
            theme: 'grid',
            headStyles: { fillColor: headerColorRgb, width: columnWidths }, // Set header background color to orange
          });
          isFirstPage = false; // Mark the first page as processed
        }
        startY = doc.lastAutoTable.finalY; // Update startY after adding the header
        doc.autoTable({
          body: [record], // Put the record in a single-row array
          startY: startY,
          theme: 'grid',
          columnStyles: {
            Tag: { cellWidth: 30, cellPadding: 2, halign: 'center', valign: 'top' },
            Name: { cellWidth: 23, cellPadding: 2, halign: 'center', valign: 'top' },
            Message: { cellWidth: 60, cellPadding: 2, halign: 'left', valign: 'top' },
            Videoid: { cellWidth: 45, cellPadding: 2, halign: 'center', valign: 'top' },
            Date: { cellWidth: 23, cellPadding: 2, halign: 'center', valign: 'top' },

          }

        });

        startY = doc.lastAutoTable.finalY; // Update startY for the next rows
      }

      doc.save('adminlist.pdf');

    }
    else {
      toast.error("Please Select From and To Date", { autoClose: 1000 });
    }
  };
  const handletodatechange = (event) => {
    const selectedToDate = event.target.value;
    // Create a Date object from the selected todate
    const toDateObject = new Date(selectedToDate);
    // Increment the toDate by one day
    toDateObject.setDate(toDateObject.getDate() + 1);
    // Format the toDate in the required format (e.g., YYYY-MM-DD)
    const formattedToDate = toDateObject.toISOString().substring(0, 10);
    settodate(event.target.value);
    axios.get(`${SERVER_URL}api/report/${fromdate}/${event.target.value}/${user}`)
      .then(response => {
        setData(response.data);
        // console.log(response.data);
        // console.log(dataString);
        // sessionStorage.setItem('data', dataString);
        // console.log(sessionStorage.getItem('data'));
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
      });
  }
  const handleClear = () => {
    setfromdate("");
    settodate("");
    setData([]);
  }
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'tag',
        header: 'Tag',
        size: 120,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {

          },
        }),
        //or in the component override callbacks like this
        Cell: ({ cell }) => {
          return <div>{cell.getValue()}</div>;
        },

      },
      {
        accessorKey: 'user',
        header: 'Name',
        size: 120,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {

          },
        }),
        //or in the component override callbacks like this
        Cell: ({ cell }) => {
          return <div>{cell.getValue()}</div>;
        },

      },
      {
        accessorKey: 'message',
        header: 'Message',
        enableGlobalFilter: false,
        size: 120,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            if (cell.getValue() !== "") {
              // Handle click when filepath is not empty
              setMessage(cell.getValue())
              // console.log(cell.getValue());
              // Handle click when filepath is empty
            } else {
              // Do something else or show a message
              setMessage("No Message");
            }
          },
        }),
        //or in the component override callbacks like this
        Cell: ({ cell }) => {
          return <div className="cursor-pointer text-[#018752] underline" onClick={handlePreviewClick1}>View</div>;
        },
      },
      {
        accessorKey: 'videoid',
        header: 'Video',
        size: 120,
        enableGlobalFilter: false,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {

            if (cell.getValue() !== "") {
              // Handle click when filepath is not empty
              setVideoUrl(cell.getValue())
              // console.log(cell.getValue());
            } else {
              // Handle click when filepath is empty
              // Do something else or show a message
              setMessage("No Video");
            }
          },
        }),
        //or in the component override callbacks like this
        Cell: ({ cell }) => {

          if (cell.getValue() !== "") {
            // Render a clickable element when filepath is not empty
            return <div className="cursor-pointer text-[#018752] underline" onClick={handlePreviewClick}>View</div>;
          } else {
            // Render non-clickable text or any other content when filepath is empty
            return <div className="cursor-pointer text-[#018752] underline" onClick={handlePreviewClick1}>View</div>;
          }
        },
      },
      {
        accessorKey: 'filepath',
        header: 'Image',
        size: 120,
        enableGlobalFilter: false,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            if (cell.getValue() !== "") {
              // Handle click when filepath is not empty
              setImageUrl(cell.getValue());
              // console.log(cell.getValue());
            } else {
              // Handle click when filepath is empty
              // Do something else or show a message
              setMessage("No Image");
            }
          },
        }),
        //or in the component override callbacks like this
        Cell: ({ cell }) => {

          if (cell.getValue() !== "") {
            // Render a clickable element when filepath is not empty
            return <div className="cursor-pointer text-[#018752] underline" onClick={ImagePreviewClick}>View</div>;
          } else {
            // Render non-clickable text or any other content when filepath is empty
            return <div className="cursor-pointer text-[#018752] underline" onClick={handlePreviewClick1}>View</div>;
          }

        },
      },
      {
        accessorKey: 'selectedData',
        header: 'SentTo',
        enableGlobalFilter: false,
        size: 120,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            const selectedData = cell.getValue();
            const doc = new jsPDF();

            const tableData = selectedData.map(item => {
              return {
                Name: item[0],
                PhoneNumber: item[1],
              };
            });

            const header = [{ Name: '                                      Name            ', PhoneNumber: '    PhoneNumber  ' }];
            const rowsPerPage = 10; // Adjust as needed
            const maxTableHeight = doc.internal.pageSize.height - 20; // Adjust padding as needed

            let startY = 10; // Starting Y position
            let isFirstPage = true; // Variable to track the first page

            // Get the column widths from the header


            for (let i = 0; i < tableData.length; i++) {
              const record = tableData[i];
              const recordHeight = 20; // Adjust as needed
              const spaceRequired = recordHeight + 5; // Space required for record plus some padding

              if (!isFirstPage && startY + spaceRequired > maxTableHeight) {
                doc.addPage(); // Add a new page if there's not enough space
                startY = 10; // Reset startY for the new page
              }

              if (isFirstPage || startY === 10) {
                doc.autoTable({
                  head: header, // Wrap the header in an array
                  startY: startY, // Use the current startY position
                  theme: 'grid',
                  headStyles: { fillColor: headerColorRgb }, // Set header background color to orange


                });

                isFirstPage = false; // Mark the first page as processed
              }
              startY = doc.lastAutoTable.finalY; // Update startY after adding the header
              doc.autoTable({
                body: [record], // Put the record in a single-row array
                startY: startY,
                theme: 'grid',
                columnStyles: {

                  Name: { cellWidth: 90, cellPadding: 2, halign: 'center', valign: 'top' },
                  PhoneNumber: { cellWidth: 91, cellPadding: 2, halign: 'center', valign: 'top' },

                }

              });

              startY = doc.lastAutoTable.finalY; // Update startY for the next rows
            }
            const tagValue = cell.row.original.tag;
            doc.save(`${tagValue}.pdf`);




          },
        }),
        //or in the component override callbacks like this
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const arrayLength = Array.isArray(value) ? value.length : 0;
          return <div className="cursor-pointer text-[#018752] underline">{arrayLength}</div>;
        },
      },
      {
        accessorKey: 'dateCreated',
        enableGlobalFilter: false,
        header: 'Date',
        size: 120,
        headerClassName: 'orange-header',
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            // console.log("hello");
          },
        }),
        //or in the component override callbacks like this
        Cell: ({ cell }) => {
          return <div>{cell.getValue()}</div>;
        },
      },

    ],
    [],
  );
  return (
    <div className="bg-white z--10 h-[650px]  overflow-y-auto flex flex-col items-center  w-[1080px] mt-8 filter backdrop-blur-3xl border shadow-[0px_0px_5px] shadow-white">
      <div className='mt-12'>
        <div className="space-y-20">
          <div className="flex justify-between w-full">
            <div className="flex flex-col space-y-1 ">
              <label htmlFor="videoTag" className='font-semibold text-[17px] mb-2 text-[#00A650]' >
                From Date
              </label>
              <input
                type="date"
                placeholder="Enter date"
                value={fromdate}
                onChange={handlefromdateChange}
                className="w-[240px] bg-white border shadow-[0px_0px_3px] shadow-[#018752] focus:outline-none"

              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="videoUrl" className='font-semibold text-[17px] mb-2 text-[#018752]'>
                To Date
              </label>
              <input
                type="date"
                placeholder="Enter date"
                value={todate}
                onChange={handletodatechange}
                className="w-[240px] bg-white border shadow-[0px_0px_3px] shadow-[#018752] focus:outline-none"
              />
            </div>
            <div className='mt-6'>
              <button
                className="text-white w-[100px] p-2 rounded-sm btncolor border shadow-[0px_0px_5px] shadow-[#018752] "
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
            <div className='mt-6'>
              <button
                className="text-white p-2 rounded-sm btncolor border shadow-[0px_0px_5px] shadow-[#018752]"
                onClick={generatePDFReport}
              >
                Download PDF
              </button>
            </div>
          </div>
          <div className=''>
            <MaterialReactTable columns={columns}
              data={data}
              //data={data}
              defaultColumn={{
                minSize: 100, //allow columns to get smaller than default
                //make columns wider by default
              }}
              enableGlobalFilter
              enableColumnFilters={false}
              enableDensityToggle={false}
              enableFullScreenToggle={false}
              enableColumnActions={false}
              enableHiding={false}
              enablePagination={true}
              initialState={{ pagination: { pageSize: 5, pageIndex: currentPage - 1 } }}
              onPageChange={(pageIndex) => setCurrentPage(pageIndex + 1)}
            />
          </div>
        </div>
        {videopopupOpen && (
          <div className="  fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <Video videoUrl={videoid} onClose={closePopup} />
          </div>
        )}
        {messagepopup && (
          <div className="  fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <MessagePreview message={message} onClose={closePopup1} />
          </div>
        )}
        {sentcountpopup && (
          <div className="  fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <Send sent={sentcount} onClose={close} />
          </div>
        )}
        {isImageModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
            <ImagePopup imageUrl={image} onClose={closeImagePreview} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Report;
