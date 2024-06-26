const pending_lis = JSON.parse(localStorage.getItem("pending")) || []; 
const succeed_lis = JSON.parse(localStorage.getItem("succeed")) || [];
const failed_lis = JSON.parse(localStorage.getItem("failed")) || [];


single_edit = false;


generate_failed()
generate_pending()
generate_succeed()



function warning() {
  
  document.getElementById("body_cover").style.display = "block";
  del_bod = document.getElementById("body_cover");
  del_bod.innerHTML = null;
  del_bod.innerHTML += `
  <div class="box warn p-5" style="text-align: center; align-content: center; " onclick = disappear()>
        <h1 class="title is-2 mb-4">Please enter your input in the "Add" section</h1>
        <h2 class="subtitle is-6">Click anywhere to continue</h2>
      </div>
      `;
}

function submit() {
  if (!check_edit()) {
    return;
  }
  const task_name = document.getElementById("task_name");
  const task_dl = document.getElementById("task_dl");
  const task_importance = document.getElementById("taks_importance");

  if (task_name.value == "" || task_dl.value == "") {
    warning();
    return;
  }

  let task = {
    name: task_name.value,
    dl: task_dl.value,
    importance: task_importance.value,
  };
  if (task.importance == "Important") {
    pending_lis.unshift(task);
  } else {
    pending_lis.push(task);
  }
  generate_pending();

  sort();
  task_name.value = "";
  task_dl.value = "";
}

function trigger_edit(i) {
  const but = document.getElementById(`but_edit_${i}`);
  const name = document.getElementById(`task_name_${i}`);
  const dl = document.getElementById(`task_dl_${i}`);
  if (but.innerText == "Edit") {
    if (single_edit) {
      alert("Zuvhun 1 task edit hiine u");
      return;
    }
    single_edit = true;
    name.disabled = false;
    dl.disabled = false;
    but.innerText = "Accept";
  } else {
    single_edit = false;
    if (confirm("Are you sure?")) {
      pending_lis[i].name = name.value;
      pending_lis[i].dl = dl.value;
      generate_pending();
    }
  }
}

function done(i) {
  if (!check_edit()) {
    return;
  }
  succeed_lis.push(pending_lis[i]);
  pending_lis.splice(i, 1);
  generate_pending();
  generate_succeed();
}

function un_done(i) {
  if (!check_edit()) {
    return;
  }
  if (succeed_lis[i].importance == "Important") {
    pending_lis.unshift(succeed_lis[i]);
  } else {
    pending_lis.push(succeed_lis[i]);
  }
  succeed_lis.splice(i, 1);
  sort();
  generate_pending();
  generate_succeed();
}

function fail(i) {
  if (!check_edit()) {
    return;
  }
  failed_lis.push(pending_lis[i]);
  pending_lis.splice(i, 1);

  generate_pending();
  generate_failed();
}
function try_again(i) {
  if (!check_edit()) {
    return;
  }
  if (failed_lis[i].importance == "Important") {
    pending_lis.unshift(failed_lis[i]);
  } else {
    pending_lis.push(failed_lis[i]);
  }
  failed_lis.splice(i, 1);
  sort();
  generate_pending();
  generate_failed();
}

function del(i) {
  document.getElementById("body_cover").style.display = "block";
  del_bod = document.getElementById("body_cover");
  del_bod.innerHTML = null;
  del_bod.innerHTML += `
  <div class="box warn p-6" style="text-align: center; align-content: center;">
        <h1 class="title is-2 mb-6">Are your sure want to delete the task?</h1>

        <button class="button mr-6" onclick="disappear()">Cancel</button>
        <button class="button is-danger" onclick="remove(${i})">Delete</button>
      </div>
      `;
}
function disappear() {
  document.getElementById("body_cover").style.display = "none";
}
function remove(i) {
  failed_lis.splice(i, 1);
  disappear();
  generate_failed();
}

function generate_failed() {
  const failed_tasks = document.getElementById("failed_lis");
  failed_tasks.innerHTML = null;
  localStorage.setItem("failed", JSON.stringify(failed_lis))
  for (i = 0; i < failed_lis.length; i++) {
    failed_tasks.innerHTML += `<div class="box is-flex is-flex-direction-column" style="gap: 1em;" id="task_${i}">
                <div class="is-flex" style="gap :1em">
                <input
                    type="text"
                    class="input has-text-danger is-danger"
                    value="${failed_lis[i].name}"
                    disabled
                    id="task_name_${i}"
                />
                <input
                    type="date"
                    class="input has-text-danger is-danger"
                    disabled
                    value="${failed_lis[i].dl}"
                    style="width: 160px"
                    id="task_dl_${i}"
                />
                </div>

                <div class="buttons">
                <button class="button is-danger" onclick = "try_again(${i})">Try Again</button>
                <button class="button is-danger" onclick = "del(${i})">Delete</button>
                </div>
            </div>`;
  }
}
function remove_done(i) {
  succeed_lis.splice(i, 1);
  generate_succeed();
}
function generate_succeed() {
  const succeed_tasks = document.getElementById("succeed_lis");
  succeed_tasks.innerHTML = null;
  localStorage.setItem("succeed", JSON.stringify(succeed_lis))
  for (i = 0; i < succeed_lis.length; i++) {
    succeed_tasks.innerHTML += `<div class="box is-flex is-flex-direction-column" style="gap: 1em;" id="task_${i}">
                <div class="is-flex" style="gap :1em">
                <input
                    type="text"
                    class="input has-text-success is-success"
                    value="${succeed_lis[i].name}"
                    disabled
                    id="task_name_${i}"
                />
                <input
                    type="date"
                    class="input has-text-success is-success"
                    disabled
                    value="${succeed_lis[i].dl}"
                    style="width: 160px"
                    id="task_dl_${i}"
                />
                </div>

                <div class="buttons">
                <button class="button is-success" onclick = "un_done(${i})">Undone</button>
                <button class="button is-danger" onclick = "remove_done(${i})">Delete</button>
                </div>
            </div>`;
  }
}

function generate_pending() {
  sort();
  const pending_tasks = document.getElementById("pending_lis");
  pending_tasks.innerHTML = null;
  localStorage.setItem("pending", JSON.stringify(pending_lis))
  for (i = 0; i < pending_lis.length; i++) {
    if (pending_lis[i].importance == "Important") {
      pending_tasks.innerHTML += `<div class="box is-flex is-flex-direction-column" style="gap: 1em;" id="task_${i}">
                <div class="is-flex" style="gap :1em">
                <input
                    type="text"
                    class="input has-text-danger-light is-danger-light"
                    value="${pending_lis[i].name}"
                    disabled
                    id="task_name_${i}"
                />
                <input
                    type="date"
                    class="input has-text-danger-light is-danger-light"
                    disabled
                    value="${pending_lis[i].dl}"
                    style="width: 160px"
                    id="task_dl_${i}"
                />
                </div>

                <div class="buttons">
                <button class="button is-link" id = "but_edit_${i}" onclick = "trigger_edit(${i})">Edit</button>
                <button class="button is-success" onclick = "done(${i})">Done</button>
                <button class="button is-danger" onclick= "fail(${i})">Failed</button>
                </div>
            </div>`;
    } else {
      pending_tasks.innerHTML += `<div class="box is-flex is-flex-direction-column" style="gap: 1em;" id="task_${i}">
        <div class="is-flex" style="gap :1em">
          <input
            type="text"
            class="input has-text-warning is-warning"
            value="${pending_lis[i].name}"
            disabled
            id="task_name_${i}"
          />
          <input
            type="date"
            class="input has-text-warning is-warning"
            value="${pending_lis[i].dl}"
            disabled
            style="width: 160px"
            id="task_dl_${i}"
          />
        </div>

        <div class="buttons">
          <button class="button is-link" id = "but_edit_${i}" onclick = "trigger_edit(${i})">Edit</button>
          <button class="button is-success" id = "but_done_${i}" onclick = "done(${i})">Done</button>
          <button class="button is-danger" onclick="fail(${i})">Failed</button>
        </div>
      </div>`;
    }
  }
}

function check_edit() {
  if (single_edit == true) {
    if (!confirm("Do you want to undo your edit?")) {
      return;
    }
  }
  single_edit = false;
  return true;
}

function sort() {
  i = 0;
  if (pending_lis.length < 2) {
    return;
  }
  while (
    pending_lis[i].importance == "Important" &&
    pending_lis[i + 1] == "Important"
  ) {
    if (i == pending_lis.length - 1) {
      break;
    }
    if (pending_lis[i].dl > pending_lis[i + 1].dl) {
      let bag = pending_lis[i];
      pending_lis[i] = pending_lis[i + 1];
      pending_lis[i + 1] = bag;
    }
    i++;
  }
  while (i < pending_lis.length - 1) {
    if (pending_lis[i].dl > pending_lis[i + 1].dl) {
      let bag = pending_lis[i];
      pending_lis[i] = pending_lis[i + 1];
      pending_lis[i + 1] = bag;
    }
    i++;
  }
}
