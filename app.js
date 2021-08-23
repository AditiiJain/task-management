const taskContainer = document.querySelector(".task-container");
const form = document.querySelector("form");
const search = document.querySelector(".search");
const taskModal = document.querySelector(".task-modal-body");

//globalStore array
let globalStore = [];

const loadInitialCards = () => {
  //access localstorage
  const getInitialData = localStorage.getItem("cards");
  if (!getInitialData) return;
  //converting stringified-array to array
  const cards = JSON.parse(getInitialData);
  //generating HTML card to inject on DOM
  cards.forEach((card) => {
    const createNewCard = newCard(card);
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    globalStore.push(card); //beacause if we not do so after every load globalStore array vanishes and it will render nothing
  });
};

// inserting new card
const newCard = ({
  id,
  imageUrl,
  taskTitle,
  taskType,
  taskDescription,
}) => `<div class="col-md-6 col-lg-4 mt-4" id=${id}>
     <div class="card">
         <div class="card-header d-flex justify-content-end gap-2">
             <button type="button" class="btn btn-outline-success" id=${id} onclick="editCard.apply(this, arguments)"> <i
                     class="fas fa-pencil-alt" id=${id}></i></button>
             <button type="button" class="btn btn-outline-danger" id=${id}><i class="fas fa-trash" id=${id}></i></button>

         </div>
         <div class="card-img-container p-3">
             <img src="${imageUrl}"  class="card-img-top img-card" alt="...">
         </div>
         <div class="card-body pt-0">
             <h5 class="card-title">${taskTitle}</h5>
             <p class="card-text text-muted">${taskDescription}
             </p>
             <span class="badge bg-primary p-2">${taskType}</span>
         </div>
         <div class="card-footer">
         <button
         type="button"
         class="btn btn-outline-primary float-right"
         data-bs-toggle="modal"
         data-bs-target="#showTask"
         onclick="openTask.apply(this, arguments)"
         id=${id}
       >Open Task</button>
         </div>
     </div>
 </div>`;

function updateLocalStorage() {
  localStorage.setItem("cards", JSON.stringify(globalStore));
}

const htmlModalContent = ({ id, taskTitle, taskDescription, imageUrl }) => {
  const date = new Date(parseInt(id));
  return ` <div id=${id} class="d-flex flex-column">
  <div style="width:100%;height:300px;">
  <img style="width:100%;height:100%;object-fit:cover;"
  src=${
    imageUrl ||
    `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`
  }
  alt="bg image"
  class="img-fluid place__holder__image mb-3"
  />
  </div>
  <strong class="text-sm mt-2 text-muted">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${taskTitle}</h2>
  <p class="lead">
  ${taskDescription}
  </p></div>
  
  `;
};

const openTask = (e) => {
  if (!e) e = window.event;
  const getTask = globalStore.filter(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask[0]);
};

const saveChanges = () => {
  const taskData = {
    id: `${Date.now()}`, //unique number for card id
    imageUrl: document.getElementById("imageurl").value,
    taskTitle: document.getElementById("tasktitle").value,
    taskType: document.getElementById("tasktype").value,
    taskDescription: document.getElementById("description").value,
  };

  if (
    taskData.imageUrl !== "" &&
    taskData.taskTitle !== "" &&
    taskData.taskType !== "" &&
    taskData.taskDescription !== ""
  ) {
    globalStore.push(taskData);
    form.reset();
    updateLocalStorage();
    const createNewCard = newCard(taskData);
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    //refresh after every card inserted in the DOM.
    location.reload();
  } else {
    alert("All the fields are required.");
  }
};

//deleting card by clicking trash button
taskContainer.addEventListener("click", (e) => {
  if (
    (e.target.tagName === "BUTTON" || e.target.tagName === "I") &&
    (e.target.classList.contains("btn-outline-danger") ||
      e.target.classList.contains("fa-trash"))
  ) {
    const cardID = e.target.id;
    Array.from(taskContainer.children).forEach((child) => {
      if (child.getAttribute("id") === cardID) {
        child.remove();
        globalStore = globalStore.filter((element) => element.id !== cardID);
        updateLocalStorage();
      }
    });
  }
});

//search
const filterTasks = (term) => {
  Array.from(taskContainer.children)
    .filter((task) => {
      return !task.children[0].children[2].children[0].textContent
        .toLowerCase()
        .includes(term);
    })
    .forEach((task) => {
      task.classList.add("filtered");
    });
  Array.from(taskContainer.children)
    .filter((task) => {
      return task.children[0].children[2].children[0].textContent
        .toLowerCase()
        .includes(term);
    })
    .forEach((task) => {
      task.classList.remove("filtered");
    });
};
search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  filterTasks(term);
});

//edit task
const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;
  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute(
    "onclick",
    "saveEditchanges.apply(this, arguments)"
  );
  submitButton.removeAttribute("data-bs-target")
  submitButton.innerHTML = "Save Changes";
};

const saveEditchanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  console.log(targetID);
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskType: taskType.innerHTML,
    taskDescription: taskDescription.innerHTML,
  };

  globalStore = globalStore.map((task) => {
    if (task.id === targetID) {
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    }
    return task;
  });
  alert('Task successfully edited!')
  updateLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.removeAttribute("onclick");
  submitButton.innerHTML = "Open Task";
  submitButton.setAttribute("data-bs-target","#showTask");
  location.reload();
};
