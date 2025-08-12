const Url = "https://vamshidevnotesapi.onrender.com";
// "http://192.168.1.2:3000"

const API_URL = `${Url}/api/notes`;

// Get DOM elements
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");
const button = document.getElementById("submitBtn");


// Handle form submission to add a new note
const addNoteHandler = async (e) => {
    e.preventDefault();

    const newNote = {
        title: titleInput.value,
        content: contentInput.value
    };

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newNote)
        });

        if(response.status == 401){
            alert("Unauthorized! please login again.")
            window.location.href = "login.html";
        }

        const addedNote = await response.json();
        titleInput.value = "";
        contentInput.value = "";
        console.log("Adding");
        fetchNotes(); // Refresh the notes list
    } catch (err) {
        console.error("Error adding note", err);
    }
};

// Add event listener for the form submission
noteForm.addEventListener("submit", addNoteHandler);

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html"; // 👈 redirect to login page
    }
  });
  


// Fetch and display all notes
const fetchNotes = async () => {
    try {
        const token = localStorage.getItem("token"); 
        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if(response.status == 401){
            alert("Unathorized! please login again.");
            window.location.href = "login.html";
        }
        const notes = await response.json();
        displayNotes(notes); 
    } catch(err) {
        console.error("Error fetching notes", err);
    }
};

// Display notes on the page 
const displayNotes = (notes) => {
    notesList.innerHTML = ""; //clear existing notes
    notes.forEach(note => {
        const noteElement = document.createElement("div");
        noteElement.classList.add('note');
        noteElement.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <button id="del" onClick="deleteNote('${note._id}')">Delete</button>
        <button id="edi" onClick="editNote('${note._id}', '${note.title}', '${note.content}') ">Edit</button>
        `;
        notesList.appendChild(noteElement);
    });
};


const deleteNote = async (id) => {
    try{
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if(response.status == 401){
            alert("Unauthorized! please login again.");
        }
        fetchNotes(); //refresh the notes list
    } catch(err){
        console.error("Error Deleting the note", err);
    }
};

//Edit a note
const editNote = (id, title, content) => {
    titleInput.value = title;
    contentInput.value = content;

    //Temporarily change the button name to update
    button.innerText = "Update Note";
    button.classList.add("color");

    //Temporarily change form to update note
    noteForm.removeEventListener("submit", addNoteHandler);
    noteForm.addEventListener("submit", updateNoteHandler);

    async function updateNoteHandler(e) {
        e.preventDefault();

        const updatedNote= {
            title: titleInput.value,
            content: contentInput.value
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedNote)
            });

            if(response.status == 401){
                alert("Unauthorized! please login again.");
                window.location.href = "login.html";
            }
            titleInput.value = "";
            contentInput.value = "";
            console.log("updating");
            fetchNotes();
            noteForm.removeEventListener("submit", updateNoteHandler);
            noteForm.addEventListener("submit", addNoteHandler);
            button.classList.remove("color");

            button.innerText = "Add Note";
        } catch(err){
            console.error("Error updating Notes", err);
        }
    }
}

// logout function
function logout(){
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

fetchNotes();