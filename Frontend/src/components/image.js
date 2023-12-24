import React from "react";
const ImagePopup = ({ imageUrl, onClose }) => {
  // console.log(imageUrl);
  return (
    <div className="relative max-w-[500px] h-[300px]">
      <span className="close text-3xl cursor-pointer top-0 right-0" onClick={onClose}>
        &times;
      </span>
      <div className="">
      <img src={imageUrl} alt="Preview" className="w-full h-[400px]" />
      </div>
    </div>
  );
};
export default ImagePopup;
