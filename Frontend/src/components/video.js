// VideoPopup.js
import React from "react";
const Video = ({ videoUrl, onClose }) => {
  // console.log(videoUrl);
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close text-3xl cursor-pointer " onClick={onClose}>&times;</span>
        <iframe
          className="video-frame"
          title="Video Preview"
          src={videoUrl}
          allowFullScreen
          width="800"  // Adjust the width to make the video larger
          height="450" // Adjust the height to make the video larger
        ></iframe>
      </div>
    </div>
  );
};

export default Video;
