var uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
let colors =['lightpink','lightgreen','lightblue','black'];
let modalPriorityColor =colors[colors.length-1];
let textAreaCont = document.querySelector(".textarea-cont");
const mainCount = document.querySelector(".main-count");
let ticketsArr =[];
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let removeBtn  = document.querySelector(".remove-btn");
let toolBoxColors = document.querySelectorAll(".color"); 
// to open close modal container
let isMoadalPresent = false;
addBtn.addEventListener('click', function(){
    if(!isMoadalPresent){
        modalCont.style.display = "flex"; 
        //moadl add hote h screen p
    }
    else{
        modalCont.style.display ="none";
    }
    isMoadalPresent =!isMoadalPresent;
})

const allPriorityColors = document.querySelectorAll(".priority-color");
// to remove and add active class from each priority color of modal container
allPriorityColors.forEach(function(colorElement){
    colorElement.addEventListener("click",function(){
        allPriorityColors.forEach(function(priorityColorElem){
             priorityColorElem.classList.remove(".active");
            
        })
        colorElement.classList.add("active");
        modalPriorityColor = colorElement.classList[0];
    });
});

// to generate and display a ticket
modalCont.addEventListener("keydown",function(e){
    let key = e.key;
    if(key == "Shift"){
       
        createTicket(modalPriorityColor,textAreaCont.value);
        modalCont.style.display="none";
        isMoadalPresent = false;
        textAreaCont.value="";
        allPriorityColors.forEach(function(colorElem){
            colorElem.classList.remove("active");
        })
       
    }
})

// function to create a new ticket
function  createTicket(ticketColor,data,ticketid){
    let id = ticketid || uid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`
        <div class="ticket-color ${ticketColor} "></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
        <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
    `;
    mainCount.appendChild(ticketCont);
    handleRemoval(ticketCont,id);
    handleColor(ticketCont,id);
    handleLock(ticketCont,id);
    // if ticket is being created for the first time , then ticketid would be undefined
    if(!ticketid){
    ticketsArr.push({ ticketColor,data,ticketid :id});
    localStorage.setItem("tickets",JSON.stringify(ticketsArr));
}
}

// get all tickets from local Storage 
if(localStorage.getItem("tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketid);
    })
}

// filter tickets on the basis of ticketcolor
for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",function(){
        let curToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter(function(ticketObj){
            return curToolBoxColor == ticketObj.ticketColor;
        });

        // remove all the tickets 
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }

        // display filtered tickets 
        filteredTickets.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketid);
        })
    })
    toolBoxColors[i].addEventListener("dblclick",function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }
        // display all the tickets 
        ticketsArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketid);
        })
    })


}

// on clicking removebtn, make color red and make color white in cliking again
let removeBtnActive  = false;
removeBtn.addEventListener("click",function(){
    if(removeBtnActive){
        removeBtn.style.color ="white"; 
    }
    else{
        removeBtn.style.color = "red"
    }
    removeBtnActive =!removeBtnActive;
})

function handleRemoval(ticket,id){
    ticket.addEventListener("click",function(){
        if(!removeBtnActive) return;
        // local storage remove
        // ->get idx of the ticket to be deleted
        let idx = getTicketIdx(id);
        ticketsArr.splice(idx,1);
        // removed from browser stroage and set updated arr
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));

        // frontend remove
        ticket.remove();
    })
}
function getTicketIdx(id){
   let ticketIdx = ticketsArr.findIndex(function(ticketObj){
    return ticketObj.ticketid ==id;
   })
    return ticketIdx;
   }
        
   
//change priority color of the tickets
function handleColor(ticket,id){
    let ticketColorStrip = ticket.querySelector(".ticket-color");
    ticketColorStrip.addEventListener("click",function(){
        let currTicketColor = ticketColorStrip.classList[1]; //lightpink

        let currTicketColorIdx = colors.indexOf(currTicketColor);

        let newTicketColorIdx = currTicketColorIdx +1;

        newTicketColorIdx = newTicketColorIdx %colors.length; //1
        let newTicketColor = colors[newTicketColorIdx];//lightgreen

        ticketColorStrip.classList.remove(currTicketColor);//lightpink [ticket-color]
        ticketColorStrip.classList.add(newTicketColor);

        // local storage update
        let ticketIdx = getTicketIdx(id);
        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));
    })
} 
// lock and unlock to make content editable true or false
function handleLock(ticket,id){
    // icons ko append in ticket
    let ticketLockEle = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockEle.children[0];
    // console.log(ticketLock);
    let ticketTaskArea = ticket.querySelector(".task-area");

    // toggle of icons and contenteditable property
    ticketLock.addEventListener("click",function(){
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }
        ticketsArr[ticketIdx].data = ticketTaskArea.innerText;
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));

    })
}




