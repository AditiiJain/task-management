const taskContainer = document.querySelector(".task-container");
const form = document.querySelector("form");
const deleteButton = document.getElementById("delete-button");

//globalStore array
const globalStore = [];

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
    globalStore.push(card);
  });
};

// inserting new card
const newCard = ({
  id,
  imageUrl,
  taskTitle,
  taskType,
  taskDescription,
}) => `<div class="col-md-6 col-lg-4" id=${id}>
     <div class="card">
         <div class="card-header d-flex justify-content-end gap-2">
             <button type="button" class="btn btn-outline-success"> <i
                     class="fas fa-pencil-alt"></i></button>
             <button type="button" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>

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
             <button type="button" class="btn btn-outline-primary float-end">Open Task</button>
         </div>
     </div>
 </div>`;

const saveChanges = () => {
  const taskData = {
    id: `${Date.now()}`, //unique number for card id
    imageUrl: document.getElementById("imageurl").value,
    taskTitle: document.getElementById("tasktitle").value,
    taskType: document.getElementById("tasktype").value,
    taskDescription: document.getElementById("description").value,
  };

  globalStore.push(taskData);
  form.reset();
  localStorage.setItem("cards", JSON.stringify(globalStore));
  const createNewCard = newCard(taskData);
  taskContainer.insertAdjacentHTML("beforeend", createNewCard);
};
