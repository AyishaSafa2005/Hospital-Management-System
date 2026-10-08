// =========================================
// HMS DOCTOR PANEL JAVASCRIPT
// UPDATED VERSION
// =========================================


// ================= DATE =================

function updateDate(){

    const date=document.getElementById("date");

    if(date){

        const today=new Date();

        date.innerHTML=today.toLocaleDateString("en-IN",{

            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"

        });

    }

}



// ================= CLOCK =================


function updateClock(){

    const clock=document.getElementById("clock");

    if(clock){

        clock.innerHTML=new Date().toLocaleTimeString();

    }

}


updateDate();

updateClock();


setInterval(updateClock,1000);




// =========================================
// NOTIFICATION DROPDOWN
// =========================================


const bell=document.querySelector(".notification");

const notificationBox=document.querySelector(".notification-box");


if(bell && notificationBox){

    bell.addEventListener("click",(e)=>{

        e.stopPropagation();

        notificationBox.classList.toggle("show");

    });


    document.addEventListener("click",()=>{

        notificationBox.classList.remove("show");

    });

}




// =========================================
// MARK NOTIFICATIONS READ
// =========================================


const markRead=document.getElementById("markRead");

const badge=document.querySelector(".badge");


if(markRead){

    markRead.addEventListener("click",()=>{


        const list=document.querySelector(".notification-list");


        if(list){

            list.innerHTML=
            "<li>✔ No New Notifications</li>";

        }


        if(badge){

            badge.innerHTML="0";

            badge.style.background="#2e7d32";

        }


    });

}




// =========================================
// PATIENT SEARCH
// =========================================


const searchInput=document.getElementById("searchInput");


if(searchInput){


    searchInput.addEventListener("keyup",function(){


        const value=this.value.toUpperCase();


        const rows=document.querySelectorAll(
            "#patientTable tbody tr"
        );


        rows.forEach(row=>{


            const text=row.innerText.toUpperCase();


            if(text.includes(value)){

                row.style.display="";

            }

            else{

                row.style.display="none";

            }


        });


    });


}




// =========================================
// DASHBOARD CARD HOVER
// =========================================


document.querySelectorAll(".card")
.forEach(card=>{


    card.addEventListener("mouseenter",()=>{

        card.style.cursor="pointer";

    });


});





// =========================================
// LOGOUT CONFIRMATION
// =========================================


const logoutLink=
document.querySelector("a[href='index.html']");


if(logoutLink){


    logoutLink.addEventListener("click",(e)=>{


        let confirmLogout=
        confirm(
        "Are you sure you want to logout?"
        );


        if(!confirmLogout){

            e.preventDefault();

        }


    });


}




// =========================================
// BUTTON CLICK ANIMATION
// =========================================


document.querySelectorAll("button")
.forEach(button=>{


    button.addEventListener("click",()=>{


        button.style.transform="scale(.95)";


        setTimeout(()=>{

            button.style.transform="scale(1)";

        },150);


    });


});





// =========================================
// ACTIVE SIDEBAR
// =========================================


document.querySelectorAll(".sidebar a")
.forEach(link=>{


    if(link.href===window.location.href){

        link.parentElement.classList.add("active");

    }


});




// =========================================
// SMOOTH SCROLL
// =========================================


document.documentElement.style.scrollBehavior="smooth";





// =========================================
// DOCTOR PANEL READY
// =========================================


console.log(
"Doctor Panel Loaded Successfully"
);
/* =========================================
   RECORD DETAILS PAGE FUNCTIONS
========================================= */


// View Patient Record

const recordButtons =
document.querySelectorAll(".view-record");


recordButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        const patientId =
        button.getAttribute("data-id");


        if(patientId){

            window.location.href =
            "doctor-record-details.html?id="
            + patientId;

        }

        else{

            window.location.href =
            "doctor-record-details.html";

        }


    });


});





// =========================================
// PRESCRIPTION DETAILS PAGE
// =========================================



const prescriptionButtons =
document.querySelectorAll(".view-prescription");



prescriptionButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        const id =
        button.getAttribute("data-id");


        if(id){

            window.location.href =
            "doctor-prescription-details.html?id="
            + id;

        }

        else{

            window.location.href =
            "doctor-prescription-details.html";

        }


    });


});





// =========================================
// BACK BUTTON
// =========================================



const backButtons =
document.querySelectorAll(".back-btn");



backButtons.forEach(btn=>{


    btn.addEventListener("click",()=>{


        window.history.back();


    });


});





// =========================================
// PRINT PRESCRIPTION
// =========================================



const printButton =
document.querySelector(".print-btn");



if(printButton){


    printButton.addEventListener("click",()=>{


        window.print();


    });


}





// =========================================
// PRESCRIPTION DATE
// =========================================



const prescriptionDate =
document.getElementById("prescriptionDate");



if(prescriptionDate){


    const today=new Date();


    prescriptionDate.innerHTML =
    today.toLocaleDateString("en-IN",{

        day:"numeric",
        month:"long",
        year:"numeric"

    });


}





// =========================================
// PATIENT ID FROM URL
// =========================================



function getPatientId(){


    const params =
    new URLSearchParams(
    window.location.search
    );


    return params.get("id");


}



const patientId=getPatientId();



if(patientId){


    console.log(
    "Patient ID:",
    patientId
    );


}





// =========================================
// MEDICINE ROW ADD
// =========================================



const addMedicine =
document.getElementById("addMedicine");



if(addMedicine){


    addMedicine.addEventListener("click",()=>{


        const table =
        document.querySelector(
        ".medicine-table tbody"
        );


        if(table){


            const row =
            document.createElement("tr");


            row.innerHTML=`

            <td>
            New Medicine
            </td>

            <td>
            1-0-1
            </td>

            <td>
            5 Days
            </td>

            <td>
            After Food
            </td>

            `;


            table.appendChild(row);


        }


    });


}




// =========================================
// REMOVE MEDICINE ROW
// =========================================



document.querySelectorAll(".remove-medicine")
.forEach(btn=>{


    btn.addEventListener("click",()=>{


        btn.closest("tr").remove();


    });


});





// =========================================
// RECORD SECTION TOGGLE
// =========================================



document.querySelectorAll(".history-card h3")
.forEach(title=>{


    title.style.cursor="pointer";


    title.addEventListener("click",()=>{


        const content =
        title.nextElementSibling;


        if(content){


            if(content.style.display==="none"){

                content.style.display="block";

            }

            else{

                content.style.display="none";

            }


        }


    });


});





// =========================================
// AUTO SAVE PRESCRIPTION MESSAGE
// =========================================



const prescriptionForm =
document.querySelector("#prescriptionForm");



if(prescriptionForm){


    prescriptionForm.addEventListener("submit",(e)=>{


        e.preventDefault();


        alert(
        "Prescription saved successfully!"
        );


    });


}




// =========================================
// PAGE LOAD MESSAGE
// =========================================


window.addEventListener("load",()=>{


    const page =
    window.location.pathname;


    if(page.includes("doctor-record-details")){


        console.log(
        "Patient Record Details Loaded"
        );


    }



    if(page.includes("doctor-prescription-details")){


        console.log(
        "Prescription Details Loaded"
        );


    }


});



// =========================================
// END
// =========================================

console.log(
"Doctor Extra Modules Loaded Successfully"
);