import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
Modal.setAppElement("#root");
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/Cards/EmptyCard.jsx/EmptyCard";
import AddNotesImg from "../../assets/images/add_notes.svg"
import NoDataImg from "../../assets/images/database_off.svg"

// import { data } from "react-router-dom";

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState ({
    isShown: false,
    message: "",
    type: "add",
  })

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);


  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"});
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    })
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

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
  

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id

     try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", 'delete');
        getAllNotes();
      }
    } catch (error) {
      if(
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  }

  // Search for a Note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: {query},
      });

      if(response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update isPinned
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id

    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId, 
        {
          isPinned: !noteData.isPinned,
       }
      );
      
      if(response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };
  // // self added
  // // Handle Add/Edit Modal Open
  // const openModal = (type = "add", data = null) => {
  //   setOpenAddEditModal({isShown: true, type, data});
  // };

  // Handle Add/Edit Modal Close
  const closeModal = () => {
    setOpenAddEditModal({isShown: false, type: "add", data: null});
  };

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch} 
      />

{/* p-6 or container mx-auto */}
      <div className="p-6">  
        <div className="grid grid-cols-3 gap-4 mt-8">
          { allNotes.length > 0 ? (
            allNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))
          ):(
            <EmptyCard 
              imgSrc={isSearch ? NoDataImg : AddNotesImg } 
              message={isSearch ? `No notes found matching your search` :`Start creating your first note! Click the 'Add' button to jot down your
            thoughts, ideas, and reminders.  Let's get started!`} />
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
          getAllNotes = {getAllNotes}
          showToastMessage= {showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />

    </>
  );
};


export default Home;
