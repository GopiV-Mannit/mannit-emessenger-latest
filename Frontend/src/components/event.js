import React from "react";
const MessagePreview = ({ message, onClose }) => {
  // console.log(message);
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close text-3xl cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <div
          className={`bg-white p-4 rounded-md shadow-lg text-white flex flex-col items-center justify-center ${(message == "No Image" || message == "No Video" || message == "No Message") ? "w-[400px] h-[200px]" : "w-[900px] h-[500px]"
            }`}
        >

          {message != "No Image" && message != "No Video" && message != "No Message" && (
            <h1 className="text-center mt-5 text-xl font-semibold text-black">
              Message Sent
            </h1>
          )}
          <div className={`overflow-auto mt-10  ${(message == "No Image" || message == "No Video" || message == "No Message") ? "ml-5 text-center w-[130px] h-[100px] mt-16" : "w-[700px] h-[300px] border border-black justify-center p-2"
            }`}>
            <p className="text-base text-black text-center  p-2">
              {/* Your long message content here */}
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
{/* <div
className={`bg-white p-4 rounded-md shadow-lg text-white flex flex-col items-center ${
  message == "No Image" ? "w-[400px] h-[200px]" : "w-[900px] h-[500px]"
}`}
>
{message !="No Image" && (
  <h1 className="text-center text-xl font-semibold text-black">
    Message Sent
  </h1>
)}

  <div className="overflow-auto mt-20 justify-center border border-black">
    <p className="text-base text-black text-center text-justify p-2">
      {/* Your long message content here */}

export default MessagePreview;