//loadTasks();
var uid = new ShortUniqueId();
let body = document.querySelector("body");
let addbtn = document.querySelector(".add");
let grid = document.querySelector(".grid");
let delebtn = document.querySelector(".delete");
let priority = ["pink", "green", "blue", "black"];
let deleteMode = false;

if (localStorage.getItem("AllTicket") == undefined) {
    let AllTicket = {};

    localStorage.setItem("AllTicket", JSON.stringify(AllTicket));
}
loadTasks();
delebtn.addEventListener("click", function (e) {

    if (e.currentTarget.classList.contains("delete-select")) {
        e.currentTarget.classList.remove("delete-select");
        deleteMode = false;
    }
    else {
        e.currentTarget.classList.add("delete-select");
        deleteMode = true;
    }


})
let colorfilters = document.querySelectorAll(".filter div");
let filter = document.querySelectorAll(".filter");
let filterMode = [false, false, false, false];
for (let i = 0; i < colorfilters.length; i++) {
    colorfilters[i].addEventListener("click", function (e) {
       
        let filtercolor;
        if (filterMode[i] == false) {

            for (j = 0; j < filterMode.length; j++) {
                filterMode[j] = false;
                filter[j].classList.remove("filter-select");

            }
            filterMode[i] = true;
            filter[i].classList.add("filter-select");
            filtercolor = e.currentTarget.classList[0];
        }
        else {
            filter[i].classList.remove("filter-select");
            filterMode[i] = false;

        }
        
        loadTasks(filtercolor);

    })
}

addbtn.addEventListener("click", function () {
    let existmodal = document.querySelector(".modal");
    delebtn.classList.remove("delete-select");
    deleteMode = false;
    if (existmodal != null) {
        return;
    }
    let div = document.createElement("div");
    div.innerHTML = `<div class="modal">
    <div class="text-section">
        <div class="text-inner-container" contenteditable="true"></div>
    </div>
    <div class="priority-section">
        <div class="priority-inner-container">
            <div class="modal-priority pink"></div>
            <div class="modal-priority green"></div>
            <div class="modal-priority blue"></div>
            <div class="modal-priority black selected"></div>


        </div>
    </div>
</div>`;
    body.append(div);

    let ticketColor = "black";
    let allModalPriority = div.querySelectorAll(".modal-priority");
    for (let i = 0; i < allModalPriority.length; i++) {
        allModalPriority[i].addEventListener("click", function (e) {
            for (let j = 0; j < allModalPriority.length; j++) {
                allModalPriority[j].classList.remove("selected");
            }
            e.currentTarget.classList.add("selected");
            ticketColor = e.currentTarget.classList[1];
        })
    }

    let id = uid();

    let taskinnercontainer = div.querySelector(".text-inner-container");
    taskinnercontainer.addEventListener("keypress", function (e) {
        let ticketdiv = document.createElement("div");
        ticketdiv.classList.add("ticket");
        ticketdiv.setAttribute("dataId", id);
        ticketdiv.innerHTML = ` <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="actual-task" contenteditable="true">${taskinnercontainer.innerText}</div>`

        let ticketColorDiv = ticketdiv.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click", function (e) {
            let currcolor = e.currentTarget.classList[1];
            let index = -1;
            for (let i = 0; i < priority.length; i++) {
                if (priority[i] == currcolor) {
                    index = i;

                }
            }
            index++;
            index = index % 4;
            let newcolor = priority[index];
            ticketColorDiv.classList.remove(currcolor)
            ticketColorDiv.classList.add(newcolor);
            let currid = ticketdiv.getAttribute("dataId");
            let allticket = JSON.parse(localStorage.getItem("AllTicket"));
            allticket[currid].color = newcolor;
            localStorage.setItem("AllTicket", JSON.stringify(allticket));
        })
        let actualTask = ticketdiv.querySelector(".actual-task");
        actualTask.setAttribute("dataId", id);
        actualTask.addEventListener("input", function (e) {
            let updatedTask = e.currentTarget.innerText;
            let currid = e.currentTarget.getAttribute("dataId");
            let allticket = JSON.parse(localStorage.getItem("AllTicket"));
            allticket[currid].task = updatedTask;
            localStorage.setItem("AllTicket", JSON.stringify(allticket));
        })
        ticketdiv.addEventListener("click", function (e) {
            if (deleteMode) {
                let currid = e.currentTarget.getAttribute("dataId");
                let allticket = JSON.parse(localStorage.getItem("AllTicket"));
                delete allticket[currid];
                localStorage.setItem("AllTicket", JSON.stringify(allticket));
                e.currentTarget.remove();

            }
        })
        if (e.key == "Enter") {
            div.remove();
            grid.append(ticketdiv);

            //ticket is created here we have to store in allticket object
            //1- fetch all the data of local storage


            let allticket = JSON.parse(localStorage.getItem("AllTicket"));
            //2-updatethat
            let ticketobj = {
                color: ticketColor,
                taskValue: (taskinnercontainer.innerText),
            }
            allticket[id] = ticketobj;
            //3-place updated data into local storage
            localStorage.setItem("AllTicket", JSON.stringify(allticket));
        }

    })



})
function loadTasks(color) {
    let ticketOnUi = document.querySelectorAll(".ticket")
    for (let i = 0; i < ticketOnUi.length; i++) {
        ticketOnUi[i].remove();
    }
    //fetch all ticket data
    let allticket = JSON.parse(localStorage.getItem("AllTicket"));
    //create ticket
    for (x in allticket) {

        let currTicketId = x;
        let currTicketObj = allticket[x];
        if (color && color != currTicketObj.color) {
            continue;
        }
        let ticketdiv = document.createElement("div");
        ticketdiv.classList.add("ticket");
        ticketdiv.setAttribute("dataId", currTicketId);
        ticketdiv.innerHTML = ` <div class="ticket-color ${currTicketObj.color}"></div>
        <div class="ticket-id">${currTicketId}</div>
        <div class="actual-task" contenteditable="true">${currTicketObj.taskValue}</div>`
        let ticketColorDiv = ticketdiv.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click", function (e) {
            let currcolor = e.currentTarget.classList[1];
            let index = -1;
            for (let i = 0; i < priority.length; i++) {
                if (priority[i] == currcolor) {
                    index = i;

                }
            }
            index++;
            index = index % 4;
            let newcolor = priority[index];
            ticketColorDiv.classList.remove(currcolor)
            ticketColorDiv.classList.add(newcolor);
            let currid = ticketdiv.getAttribute("dataId");
            let allticket = JSON.parse(localStorage.getItem("AllTicket"));
            allticket[currid].color = newcolor;
            localStorage.setItem("AllTicket", JSON.stringify(allticket));
        })
        let actualTask = ticketdiv.querySelector(".actual-task");
        actualTask.setAttribute("dataId", currTicketId);
        actualTask.addEventListener("input", function (e) {
            let updatedTask = e.currentTarget.innerText;
            let currid = e.currentTarget.getAttribute("dataId");
            let allticket = JSON.parse(localStorage.getItem("AllTicket"));
            allticket[currid].task = updatedTask;
            localStorage.setItem("AllTicket", JSON.stringify(allticket));
        });
        ticketdiv.addEventListener("click", function (e) {
            if (deleteMode) {
                let currid = e.currentTarget.getAttribute("dataId");
                let allticket = JSON.parse(localStorage.getItem("AllTicket"));
                delete allticket[currid];
                localStorage.setItem("AllTicket", JSON.stringify(allticket));
                e.currentTarget.remove();

            }
        })
        grid.append(ticketdiv);

    }


}