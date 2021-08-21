const taskContainer = document.querySelector(".task-container");
const form = document.querySelector("form");
const search = document.querySelector(".search");

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
             <button type="button" class="btn btn-outline-success" id=${id}> <i
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
             <button type="button" class="btn id=${id}btn-outline-primary float-end">Open Task</button>
         </div>
     </div>
 </div>`;

function updateLocalStorage() {
  localStorage.setItem("cards", JSON.stringify(globalStore));
}

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
taskContainer.addEventListener("click", (e) => {
  let parentElement;
  if (
    e.target.tagName === "BUTTON" &&
    e.target.classList.contains("btn-outline-success")
  ) {
    parentElement = e.target.parentNode.parentNode;
  } else if (
    e.target.tagName === "I" &&
    e.target.classList.contains("fa-pencil-alt")
  ) {
    parentElement = e.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];
  taskDescription.setAttribute("contenteditable", "true");
  taskTitle.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEditChanges.apply(this,arguments)");
  submitButton.innerHTML = "Save Changes";
});

const saveEditChanges = (e) => {
  let parentElement;
  if (
    e.target.tagName === "BUTTON" &&
    e.target.classList.contains("btn-outline-success")
  ) {
    parentElement = e.target.parentNode.parentNode;
  } else if (
    e.target.tagName === "I" &&
    e.target.classList.contains("fa-pencil-alt")
  ) {
    parentElement = e.target.parentNode.parentNode.parentNode;
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
  console.log(e.target.id);
  globalStore = globalStore.map((task) => {
    if (e.target.id === task.id)
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    return task;
  });
  updateLocalStorage();
};
//open modal
