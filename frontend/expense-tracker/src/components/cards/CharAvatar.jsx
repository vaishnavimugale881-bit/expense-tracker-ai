import React from "react";
import { getInitials } from "../../pages/Dashboard/utils/helper"; // Adjust path to your helper

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`
        ${width || "w-20"}
        ${height || "h-20"}
        rounded-full
        flex
        items-center
        justify-center
        bg-gradient-to-br from-violet-500 via-blue-500 to-teal-400
        text-white
        font-extrabold
        text-2xl
        shadow-lg
        ring-4 ring-white ring-opacity-30
        ${style}
      `}
    >
      {getInitials(fullName) || "?"}
    </div>
  );
};

export default CharAvatar;
