import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
// import { data } from "react-router-dom";

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);


  const navigate = useNavigate();

  // Get User Info
  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    getUserInfo();
    return () => {};
  },[getUserInfo]);

  // Get all notes
  const getAllNotes = useCallback(async () => {
    try {
      const response  = await axiosInstance.get("/get-all-notes");
      if(response.data?.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Failed to fetch notes.", error);
    }
  },[]);

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  },[getAllNotes, getUserInfo]);
  
  // self added
  // Handle Add/Edit Modal Open
  const openModal = (type = "add", data = null) => {
    setOpenAddEditModal({isShown: true, type, data});
  };

  // Handle Add/Edit Modal Close
  const closeModal = () => {
    setOpenAddEditModal({isShown: false, type: "add", data: null});
  };

  return (
    <>
      <Navbar userInfo={userInfo} />
{/* p-6 or container mx-auto */}
      <div className="p-6">  
        <div className="grid grid-cols-3 gap-4 mt-8">
          { allNotes.length > 0 ? (
            allNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => openModal("edit", note)}
                onDelete={() => {}}
                onPinNote={() => {}}
              />
            ))
          ):(
            <p>No notes found.</p>
          )}
        </div>
      </div>


      <button 
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" 
        onClick={() =>{
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}  
      >
        <MdAdd className="text-[32px] text-white" /> 
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal} //
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Note Modal"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >

        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={closeModal}  //
        />
      </Modal>

    </>
  );
};


export default Home;
