import React from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const UniversityCard = ({ university, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border hover:shadow-md transition">
      <img
        src={university.imageUrl}
        alt={university.title}
        className="w-full h-48 object-contain bg-gray-100 p-4"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold">{university.title}</h3>
        <p className="text-sm text-gray-600">{university.description}</p>
        <div className="flex justify-between text-sm mt-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            🎖 {university.badge}
          </span>
          <span className="text-gray-500">👨‍🎓 {university.students} students</span>
          <span className="text-gray-500">👨‍🏫 {university.faculty} faculty</span>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
