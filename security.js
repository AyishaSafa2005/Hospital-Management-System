/* =====================================================
   HOSPITAL MANAGEMENT SYSTEM
   SECURITY.JS

   Includes:
   1. Session timeout
   2. Visible session countdown
   3. Automatic logout
   4. Data masking
   5. Phone masking
   6. Email masking

   SESSION RULES:

   ADMIN
   - No session timeout
   - No countdown

   DOCTOR
   - 15 minute inactivity timeout

   NURSE
   - 15 minute inactivity timeout

   PATIENT
   - 15 minute inactivity timeout

   PHARMACIST
   - 15 minute inactivity timeout
===================================================== */


/* =====================================================
   SESSION TIMEOUT
===================================================== */

/*
   15 minutes of inactivity.

   DO NOT change this unless you want
   to change the timeout duration.
*/

const SESSION_TIMEOUT = 30*60 * 1000;


/*
   Timer used for the visible countdown.
*/

let countdownTimer = null;


/* =====================================================
   PUBLIC PAGES
===================================================== */

const PUBLIC_PAGES = [
    "index.html",
    "role-selection.html",
    "login.html",
    "register.html",
    "forgot-password.html",
    "otp-verification.html"
];


/* =====================================================
   GET CURRENT ROLE
===================================================== */

function getCurrentRole() {

    return sessionStorage.getItem(
        "userRole"
    );

}


/* =====================================================
   CHECK WHETHER ROLE NEEDS TIMEOUT
===================================================== */

function roleNeedsTimeout() {

    const role =
        getCurrentRole();


    /*
       ADMIN DOES NOT HAVE
       SESSION TIMEOUT.
    */

    if (
        role === "admin"
    ) {

        return false;

    }


    /*
       These four roles have
       session timeout.
    */

    if (
        role === "doctor" ||
        role === "nurse" ||
        role === "patient" ||
        role === "pharmacist"
    ) {

        return true;

    }


    /*
       If role is unknown,
       don't start timeout.
    */

    return false;

}


/* =====================================================
   UPDATE ACTIVITY
===================================================== */

function updateActivity() {

    /*
       Check whether user is logged in.
    */

    if (
        sessionStorage.getItem(
            "loggedIn"
        ) !== "true"
    ) {

        return;

    }


    /*
       Get current role.
    */

    const role =
        getCurrentRole();


    /*
       ADMIN HAS NO TIMEOUT.
    */

    if (
        role === "admin"
    ) {

        return;

    }


    /*
       Only Doctor, Nurse, Patient
       and Pharmacist use timeout.
    */

    if (
        !roleNeedsTimeout()
    ) {

        return;

    }


    /*
       Store latest activity time.
    */

    sessionStorage.setItem(
        "lastActivity",
        Date.now().toString()
    );


    /*
       Restart countdown.
    */

    startCountdown();

}


/* =====================================================
   START SESSION
===================================================== */

/*
   Called after successful OTP verification.
*/

function startSession() {

    /*
       Mark user as logged in.
    */

    sessionStorage.setItem(
        "loggedIn",
        "true"
    );


    /*
       Get current role.
    */

    const role =
        getCurrentRole();


    /*
       ADMIN:
       No timeout.
       No lastActivity needed.
       No countdown.
    */

    if (
        role === "admin"
    ) {

        sessionStorage.removeItem(
            "lastActivity"
        );

        removeCountdown();

        return;

    }


    /*
       Doctor / Nurse / Patient /
       Pharmacist use timeout.
    */

    if (
        roleNeedsTimeout()
    ) {

        sessionStorage.setItem(
            "lastActivity",
            Date.now().toString()
        );


        /*
           Start countdown.
        */

        createCountdownDisplay();

        startCountdown();

    }

}


/* =====================================================
   CHECK SESSION TIMEOUT
===================================================== */

function checkSessionTimeout() {

    /*
       Check login status.
    */

    const loggedIn =
        sessionStorage.getItem(
            "loggedIn"
        );


    if (
        loggedIn !== "true"
    ) {

        return;

    }


    /*
       Get role.
    */

    const role =
        getCurrentRole();


    /*
       ADMIN:
       NEVER TIME OUT.
    */

    if (
        role === "admin"
    ) {

        removeCountdown();

        return;

    }


    /*
       Only timeout-enabled roles
       continue below.
    */

    if (
        !roleNeedsTimeout()
    ) {

        return;

    }


    /*
       Get last activity.
    */

    const lastActivity =
        parseInt(
            sessionStorage.getItem(
                "lastActivity"
            )
        );


    /*
       If there is no activity time,
       create one.
    */

    if (
        !lastActivity
    ) {

        sessionStorage.setItem(
            "lastActivity",
            Date.now().toString()
        );

        return;

    }


    /*
       Current time.
    */

    const currentTime =
        Date.now();


    /*
       Calculate inactivity.
    */

    const inactiveTime =
        currentTime -
        lastActivity;


    /*
       TIMEOUT REACHED.
    */

    if (
        inactiveTime >=
        SESSION_TIMEOUT
    ) {

        logoutUser(
            "Your session has expired due to inactivity."
        );

    }

}


/* =====================================================
   START COUNTDOWN
===================================================== */

function startCountdown() {

    /*
       Admin should never have countdown.
    */

    if (
        getCurrentRole() === "admin"
    ) {

        removeCountdown();

        return;

    }


    /*
       Make sure this role needs timeout.
    */

    if (
        !roleNeedsTimeout()
    ) {

        return;

    }


    /*
       Stop existing countdown.
    */

    clearInterval(
        countdownTimer
    );


    /*
       Update immediately.
    */

    updateCountdown();


    /*
       Update every second.
    */

    countdownTimer =
        setInterval(
            updateCountdown,
            1000
        );

}


/* =====================================================
   UPDATE COUNTDOWN
===================================================== */

function updateCountdown() {

    /*
       Check login.
    */

    const loggedIn =
        sessionStorage.getItem(
            "loggedIn"
        );


    /*
       If not logged in,
       remove timer.
    */

    if (
        loggedIn !== "true"
    ) {

        removeCountdown();

        return;

    }


    /*
       Admin should NEVER see
       the countdown.
    */

    if (
        getCurrentRole() === "admin"
    ) {

        removeCountdown();

        return;

    }


    /*
       Only timeout roles.
    */

    if (
        !roleNeedsTimeout()
    ) {

        removeCountdown();

        return;

    }


    /*
       Get last activity.
    */

    const lastActivity =
        parseInt(
            sessionStorage.getItem(
                "lastActivity"
            )
        );


    if (
        !lastActivity
    ) {

        return;

    }


    /*
       Calculate elapsed time.
    */

    const elapsed =
        Date.now() -
        lastActivity;


    /*
       Calculate remaining time.
    */

    let remaining =
        SESSION_TIMEOUT -
        elapsed;


    /*
       Never show negative time.
    */

    if (
        remaining < 0
    ) {

        remaining = 0;

    }


    /*
       Convert milliseconds
       to seconds.
    */

    const totalSeconds =
        Math.ceil(
            remaining / 1000
        );


    /*
       Convert to minutes.
    */

    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    /*
       Remaining seconds.
    */

    const seconds =
        totalSeconds % 60;


    /*
       Format:

       15:00
       14:59
       14:58
       ...
       00:01
       00:00
    */

    const formattedTime =
        String(minutes).padStart(
            2,
            "0"
        )
        +
        ":"
        +
        String(seconds).padStart(
            2,
            "0"
        );


    /*
       Find countdown element.
    */

    const timerElement =
        document.getElementById(
            "sessionCountdown"
        );


    /*
       Update countdown.
    */

    if (
        timerElement
    ) {

        timerElement.textContent =
            formattedTime;

    }


    /*
       If time reaches zero,
       logout.
    */

    if (
        remaining <= 0
    ) {

        logoutUser(
            "Your session has expired due to inactivity."
        );

    }

}


/* =====================================================
   CREATE COUNTDOWN DISPLAY
===================================================== */

function createCountdownDisplay() {

    /*
       ADMIN:
       No countdown.
    */

    if (
        getCurrentRole() === "admin"
    ) {

        return;

    }


    /*
       Don't create duplicate timer.
    */

    if (
        document.getElementById(
            "sessionCountdownContainer"
        )
    ) {

        return;

    }


    /*
       Create countdown container.
    */

    const container =
        document.createElement(
            "div"
        );


    container.id =
        "sessionCountdownContainer";


    container.innerHTML = `

        <span class="session-lock-icon">
            🔐
        </span>

        <span class="session-label">
            Session expires in:
        </span>

        <strong id="sessionCountdown">
            15:00
        </strong>

    `;


    document.body.appendChild(
        container
    );


    /*
       Create timer styling.
    */

    const style =
        document.createElement(
            "style"
        );


    style.id =
        "sessionCountdownStyle";


    style.textContent = `

        #sessionCountdownContainer {

            position: fixed;

            top: 82px;

            right: 20px;

            z-index: 9999;

            background: white;

            color: #0b5d7a;

            padding: 10px 16px;

            border-radius: 8px;

            box-shadow:
                0 4px 15px
                rgba(0, 0, 0, 0.12);

            font-size: 14px;

            display: flex;

            align-items: center;

            gap: 7px;

        }


        #sessionCountdown {

            font-size: 16px;

            min-width: 42px;

            color: #d35400;

        }


        .session-lock-icon {

            font-size: 17px;

        }


        .session-label {

            color: #455a64;

        }


        @media (max-width: 600px) {

            #sessionCountdownContainer {

                top: 75px;

                right: 10px;

                font-size: 12px;

                padding: 8px 10px;

            }


            #sessionCountdown {

                font-size: 14px;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    /*
       Start countdown.
    */

    startCountdown();

}


/* =====================================================
   REMOVE COUNTDOWN
===================================================== */

function removeCountdown() {

    /*
       Stop countdown interval.
    */

    clearInterval(
        countdownTimer
    );


    countdownTimer =
        null;


    /*
       Remove countdown element.
    */

    const container =
        document.getElementById(
            "sessionCountdownContainer"
        );


    if (
        container
    ) {

        container.remove();

    }


    /*
       Remove countdown style.
    */

    const style =
        document.getElementById(
            "sessionCountdownStyle"
        );


    if (
        style
    ) {

        style.remove();

    }

}


/* =====================================================
   LOGOUT USER
===================================================== */

function logoutUser(message) {

    /*
       Stop countdown.
    */

    clearInterval(
        countdownTimer
    );


    countdownTimer =
        null;


    /*
       Remove session information.
    */

    sessionStorage.removeItem(
        "loggedIn"
    );

    sessionStorage.removeItem(
        "userRole"
    );

    sessionStorage.removeItem(
        "userPhone"
    );

    sessionStorage.removeItem(
        "lastActivity"
    );

    sessionStorage.removeItem(
        "currentPatient"
    );

    sessionStorage.removeItem(
        "loginVerified"
    );

    sessionStorage.removeItem(
        "pendingLogin"
    );


    /*
       Remove countdown.
    */

    removeCountdown();


    /*
       Show message.
    */

    if (
        message
    ) {

        alert(
            message
        );

    }


    /*
       Return to role selection.

       security.js is inside the main
       project folder and dashboards
       are inside pages/.
    */

    window.location.href =
        "role-selection.html";

}


/* =====================================================
   GLOBAL ACTIVITY EVENTS
===================================================== */

[
    "click",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart"
].forEach(
    function(eventName) {

        document.addEventListener(
            eventName,
            updateActivity
        );

    }
);


/* =====================================================
   GLOBAL LOGOUT
===================================================== */

function logout() {

    logoutUser();

}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           Check whether user is logged in.
        */

        if (
            sessionStorage.getItem(
                "loggedIn"
            ) !== "true"
        ) {

            return;

        }


        /*
           Get current role.
        */

        const role =
            getCurrentRole();


        /*
           ADMIN:
           No countdown.
           No timeout.
        */

        if (
            role === "admin"
        ) {

            removeCountdown();

            return;

        }


        /*
           Other four roles:
           Start countdown.
        */

        if (
            roleNeedsTimeout()
        ) {

            /*
               If last activity doesn't exist,
               start it now.
            */

            if (
                !sessionStorage.getItem(
                    "lastActivity"
                )
            ) {

                sessionStorage.setItem(
                    "lastActivity",
                    Date.now().toString()
                );

            }


            createCountdownDisplay();

            checkSessionTimeout();

        }

    }
);


/* =====================================================
   SESSION CHECK
===================================================== */

/*
   Check every second so the countdown
   and timeout stay accurate.
*/

setInterval(
    checkSessionTimeout,
    1000
);


/* =====================================================
   DATA MASKING
===================================================== */


/* =====================================================
   MASK PHONE NUMBER
===================================================== */

/*
   Example:

   9876543210
   ↓
   ******3210
*/

function maskPhone(phone) {

    if (
        !phone
    ) {

        return "Not Available";

    }


    const value =
        String(phone);


    /*
       If four or fewer digits,
       mask everything.
    */

    if (
        value.length <= 4
    ) {

        return "****";

    }


    /*
       Show only final four digits.
    */

    const lastFour =
        value.slice(-4);


    return (
        "******"
        +
        lastFour
    );

}


/* =====================================================
   MASK EMAIL
===================================================== */

/*
   Example:

   example@gmail.com
   ↓
   e*****@gmail.com
*/

function maskEmail(email) {

    if (
        !email
    ) {

        return "Not Available";

    }


    const value =
        String(email);


    const parts =
        value.split("@");


    if (
        parts.length !== 2
    ) {

        return "********";

    }


    const username =
        parts[0];


    const domain =
        parts[1];


    if (
        username.length <= 1
    ) {

        return (
            "*@"
            +
            domain
        );

    }


    return (
        username.charAt(0)
        +
        "*****@"
        +
        domain
    );

}


/* =====================================================
   MASK GENERAL SENSITIVE DATA
===================================================== */

function maskSensitiveData(
    value,
    visibleCharacters = 4
) {

    if (
        !value
    ) {

        return "Not Available";

    }


    const text =
        String(value);


    /*
       If the value is shorter than
       visible characters, mask all.
    */

    if (
        text.length <=
        visibleCharacters
    ) {

        return "*".repeat(
            text.length
        );

    }


    const maskedLength =
        text.length -
        visibleCharacters;


    return (
        "*".repeat(
            maskedLength
        )
        +
        text.slice(
            -visibleCharacters
        )
    );

}


/* =====================================================
   SESSION STATUS
===================================================== */

function isLoggedIn() {

    return (
        sessionStorage.getItem(
            "loggedIn"
        ) === "true"
    );

}


/* =====================================================
   END OF SECURITY.JS
===================================================== */