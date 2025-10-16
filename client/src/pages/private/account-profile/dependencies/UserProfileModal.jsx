import { useState } from "react";
import {
  FaDiscord,
  FaSpotify,
  FaTwitch,
  FaSteam,
  FaPlaystation,
  FaXbox,
  FaYoutube,
} from "react-icons/fa";
import { MdEdit, MdMoreHoriz } from "react-icons/md";

export default function UserProfileModal({ user, onClose }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#2f3136] w-[850px] rounded-2xl flex overflow-hidden shadow-2xl">
        {/* LEFT SIDE - Profile Info */}
        <div className="w-[45%] bg-[#232428] p-6 flex flex-col items-center text-white relative">
          {/* Banner + Avatar */}
          <div className="w-full h-24 bg-[#1e1f22] rounded-lg mb-12 relative">
            <img
              src={user.banner || "https://via.placeholder.com/600x200"}
              alt="Banner"
              className="w-full h-full object-cover rounded-lg"
            />
            <img
              src={user.avatar || "https://via.placeholder.com/100"}
              alt="Avatar"
              className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-[6px] border-[#232428] object-cover"
            />
          </div>

          {/* Name + Status */}
          <div className="w-full mt-4">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-400 text-sm">@{user.handle}</p>
            <p className="mt-3 text-sm text-gray-300">
              {user.bio || "No bio provided."}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#5865f2] hover:bg-[#4752c4] px-3 py-1 rounded-lg text-sm font-medium"
            >
              <MdEdit className="inline mr-1" /> Edit Profile
            </button>
            <button className="bg-[#3a3c42] hover:bg-[#4b4d53] px-3 py-1 rounded-lg text-sm">
              <MdMoreHoriz />
            </button>
          </div>

          {/* Info Section */}
          <div className="w-full mt-6 text-sm text-gray-300 space-y-3">
            <div>
              <span className="text-gray-400">Member Since:</span>
              <p>{user.memberSince}</p>
            </div>
            <div>
              <span className="text-gray-400">Connections:</span>
              <div className="flex gap-2 mt-1">
                <FaDiscord className="text-[#5865F2]" />
                <FaSpotify className="text-[#1DB954]" />
                <FaTwitch className="text-[#9146FF]" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Activity Section */}
        <div className="flex-1 p-6 bg-[#2b2d31] text-white">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">
            Activity
          </h3>

          <div className="flex flex-col items-center justify-center text-center text-gray-400 h-full">
            <p className="mb-3 text-sm">You don’t have any activity here</p>
            <p className="text-xs max-w-[300px] mb-6">
              Connect your accounts to share your in-game status and activity.
              You’re in control of what you share.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6 text-2xl">
              <FaSteam />
              <FaPlaystation />
              <FaXbox />
              <FaTwitch />
              <FaDiscord />
              <FaYoutube />
              <FaSpotify />
            </div>

            <div className="flex gap-3">
              <button className="bg-[#3a3c42] hover:bg-[#4b4d53] px-4 py-1.5 rounded-lg text-sm">
                Connect Accounts
              </button>
              <button className="bg-[#3a3c42] hover:bg-[#4b4d53] px-4 py-1.5 rounded-lg text-sm">
                Add Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CLOSE OVERLAY CLICK */}
      <button
        onClick={onClose}
        className="absolute top-0 left-0 w-full h-full cursor-default"
      ></button>
    </div>
  );
}
