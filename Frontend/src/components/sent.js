import React from "react";

const Send = ({ sent, onClose }) => {
  const sentcount = sent || [];
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close text-3xl cursor-pointer " onClick={onClose}>
          &times;
        </span>
        <div
          className="bg-white p-4 rounded-md shadow-lg text-white flex flex-col items-center"
          style={{ width: '800px', height: '500px' }}
        >
          <h1 className="text-center text-xl font-semibold text-black">Received Members</h1>
          <div className="flex overflow-auto mt-20 justify-center items-center border border-black" style={{ width: '700px', height: '300px' }}>
            <div className="space-x-10 flex flex-row">
              <div className="flex flex-col justify-center ">
                {sentcount.map((item, index) => (
                  <div key={index} className="text-black mt-2 flex justify-left space-x-20">
                    <div className="space-x-3 ">
                      <span className="label text-orange-500 font-semibold">Name :</span>
                      <span className="value">{item[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center ">
                {sentcount.map((item, index) => (
                  <div key={index} className="text-black mt-2 flex justify-left space-x-20">
                    <div className="space-x-3 ">
                      <span className="label text-green-500 font-semibold">Phone :</span>
                      <span className="value">{item[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Send;
