/* =====================================================
   SMART DUTY PRO ULTIMATE
   APP.JS
===================================================== */

const KEY = "smartDutyProUltimate";

let data = JSON.parse(localStorage.getItem(KEY)) || {
    currentUser: null,

    students: [
        {
            id: 1,
            name: "สมชาย ใจดี",
            className: "ม.3/1",
            points: 100
        },
        {
            id: 2,
            name: "สมหญิง รักเรียน",
            className: "ม.3/1",
            points: 100
        },
        {
            id: 3,
            name: "กิตติพงษ์ ตั้งใจ",
            className: "ม.3/1",
            points: 100
        },
        {
            id: 4,
            name: "นภัสสร เรียนดี",
            className: "ม.3/1",
            points: 100
        }
    ],

    duties: [
        {
            id: 1,
            date: today(),
            studentId: 1,
            task: "กวาดห้องเรียน",
            status: "waiting"
        },
        {
            id: 2,
            date: today(),
            studentId: 2,
            task: "เช็ดกระดาน",
            status: "done"
        },
        {
            id: 3,
            date: today(),
            studentId: 3,
            task: "เก็บขยะ",
            status: "bad"
        }
    ],

    requests: [],

    history: [
        {
            text: "เริ่มต้นระบบ Smart Duty Pro",
            date: new Date().toLocaleString("th-TH")
        }
    ]
};

save();

/* =====================================================
   BASIC FUNCTIONS
===================================================== */

function today(){

    const d = new Date();

    return d.toISOString().split("T")[0];

}

function save(){

    localStorage.setItem(
        KEY,
        JSON.stringify(data)
    );

}

function studentById(id){

    return data.students.find(
        s => Number(s.id) === Number(id)
    );

}

function statusText(status){

    if(status === "done")
        return "✓ ทำแล้ว";

    if(status === "bad")
        return "✗ ไม่ทำเวร";

    return "⏳ รอตรวจ";

}

function statusBadge(status){

    if(status === "done")
        return `<span class="badge badge-done">✓ ทำแล้ว</span>`;

    if(status === "bad")
        return `<span class="badge badge-bad">✗ ไม่ทำเวร</span>`;

    return `<span class="badge badge-waiting">⏳ รอตรวจ</span>`;

}

function requestBadge(status){

    if(status === "approved")
        return `<span class="badge badge-approved">✓ อนุมัติ</span>`;

    if(status === "rejected")
        return `<span class="badge badge-rejected">✗ ไม่อนุมัติ</span>`;

    return `<span class="badge badge-pending">⏳ รอตรวจสอบ</span>`;

}

function addHistory(text){

    data.history.unshift({
        text:text,
        date:new Date().toLocaleString("th-TH")
    });

    data.history =
        data.history.slice(0,100);

    save();

}

/* =====================================================
   LOGIN
===================================================== */

function login(){

    const username =
        document
        .getElementById("username")
        ?.value
        .trim();

    const password =
        document
        .getElementById("password")
        ?.value
        .trim();

    if(!username || !password){

        alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");

        return;

    }

    let role = "student";
    let name = username;

    if(username.toLowerCase() === "teacher"){

        role = "teacher";
        name = "คุณครู";

    }

    else if(username.toLowerCase() === "leader"){

        role = "leader";
        name = "หัวหน้าเวร";

    }

    else{

        const student =
            data.students.find(
                s =>
                    s.name.includes(username) ||
                    String(s.id) === username
            );

        if(student){

            name = student.name;

        }

    }

    data.currentUser = {
        username,
        name,
        role
    };

    save();

    startApp();

}

/* =====================================================
   START APP
===================================================== */

function startApp(){

    const loginScreen =
        document.getElementById("loginScreen");

    const appScreen =
        document.getElementById("appScreen");

    if(loginScreen)
        loginScreen.classList.add("hidden");

    if(appScreen)
        appScreen.classList.remove("hidden");

    updateUser();

    updateClock();

    setInterval(updateClock,1000);

    openPage("dashboard");

    renderAll();

}

/* =====================================================
   USER
===================================================== */

function updateUser(){

    const user = data.currentUser;

    if(!user)
        return;

    const name =
        document.getElementById("sidebarUser");

    const role =
        document.getElementById("sidebarRole");

    const welcome =
        document.getElementById("welcomeName");

    if(name)
        name.textContent = user.name;

    if(role){

        if(user.role === "teacher")
            role.textContent = "ครู";

        else if(user.role === "leader")
            role.textContent = "หัวหน้าเวร";

        else
            role.textContent = "นักเรียน";

    }

    if(welcome)
        welcome.textContent = user.name;

}

/* =====================================================
   LOGOUT
===================================================== */

function logout(){

    data.currentUser = null;

    save();

    location.reload();

}

/* =====================================================
   CLOCK
===================================================== */

function updateClock(){

    const clock =
        document.getElementById("clock");

    const todayText =
        document.getElementById("todayText");

    const now = new Date();

    if(clock){

        clock.textContent =
            now.toLocaleTimeString(
                "th-TH",
                {
                    hour:"2-digit",
                    minute:"2-digit",
                    second:"2-digit"
                }
            );

    }

    if(todayText){

        todayText.textContent =
            now.toLocaleDateString(
                "th-TH",
                {
                    weekday:"long",
                    year:"numeric",
                    month:"long",
                    day:"numeric"
                }
            );

    }

}

/* =====================================================
   SIDEBAR
===================================================== */

function toggleSidebar(){

    const sidebar =
        document.getElementById("sidebar");

    if(sidebar)
        sidebar.classList.toggle("open");

}

/* =====================================================
   PAGE
===================================================== */

function openPage(page){

    document
        .querySelectorAll(".page")
        .forEach(p => p.classList.add("hidden"));

    const target =
        document.getElementById(
            "page-" + page
        );

    if(target)
        target.classList.remove("hidden");

    document
        .querySelectorAll(".menu button")
        .forEach(b =>
            b.classList.remove("active")
        );

    const menu =
        document.getElementById(
            "menu" +
            page.charAt(0).toUpperCase() +
            page.slice(1)
        );

    if(menu)
        menu.classList.add("active");

    const titles = {

        dashboard:"แดชบอร์ด",

        duties:"จัดการเวร",

        check:"ตรวจเวร",

        requests:"คำขอ",

        students:"จัดการนักเรียน",

        reports:"รายงาน",

        history:"ประวัติการใช้งาน"

    };

    const title =
        document.getElementById("pageTitle");

    if(title)
        title.textContent =
            titles[page] || "Smart Duty Pro";

    renderAll();

}

/* =====================================================
   RENDER ALL
===================================================== */

function renderAll(){

    renderDashboard();

    renderDuties();

    renderCheck();

    renderRequests();

    renderStudents();

    renderReports();

    renderHistory();

}

/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard(){

    const statStudents =
        document.getElementById("statStudents");

    const statDone =
        document.getElementById("statDone");

    const statBad =
        document.getElementById("statBad");

    const statWaiting =
        document.getElementById("statWaiting");

    if(statStudents)
        statStudents.textContent =
            data.students.length;

    if(statDone)
        statDone.textContent =
            data.duties.filter(
                d => d.status === "done"
            ).length;

    if(statBad)
        statBad.textContent =
            data.duties.filter(
                d => d.status === "bad"
            ).length;

    if(statWaiting)
        statWaiting.textContent =
            data.duties.filter(
                d => d.status === "waiting"
            ).length;

    const box =
        document.getElementById(
            "dashboardDuties"
        );

    if(box){

        const duties =
            data.duties
            .filter(d => d.date === today())
            .slice(0,6);

        if(!duties.length){

            box.innerHTML =
                `<div class="empty">
                    <div class="empty-icon">📋</div>
                    ยังไม่มีเวรวันนี้
                </div>`;

        }

        else{

            box.innerHTML =
                duties.map(d => {

                    const s =
                        studentById(d.studentId);

                    return `
                    <div class="duty-mini">

                        <div>
                            <strong>
                                ${escapeHTML(s?.name || "-")}
                            </strong>

                            <small>
                                ${escapeHTML(d.task)}
                            </small>
                        </div>

                        ${statusBadge(d.status)}

                    </div>
                    `;

                }).join("");

        }

    }

    renderNotifications();

}

/* =====================================================
   NOTIFICATIONS
===================================================== */

function renderNotifications(){

    const box =
        document.getElementById(
            "notifications"
        );

    if(!box)
        return;

    const waiting =
        data.duties.filter(
            d => d.status === "waiting"
        ).length;

    const pending =
        data.requests.filter(
            r => r.status === "pending"
        ).length;

    let html = "";

    if(waiting){

        html += `
        <div class="notification">

            <strong>⏳ มีเวรรอตรวจ</strong>

            <small>
                มี ${waiting} รายการที่รอหัวหน้าเวรตรวจ
            </small>

        </div>
        `;

    }

    if(pending){

        html += `
        <div class="notification">

            <strong>📩 มีคำขอใหม่</strong>

            <small>
                มี ${pending} คำขอรอการอนุมัติ
            </small>

        </div>
        `;

    }

    if(!html){

        html = `
        <div class="notification">

            <strong>✅ ระบบปกติ</strong>

            <small>
                ไม่มีรายการเร่งด่วน
            </small>

        </div>
        `;

    }

    box.innerHTML = html;

}

/* =====================================================
   DUTIES
===================================================== */

function renderDuties(){

    const table =
        document.getElementById("dutyTable");

    if(!table)
        return;

    const search =
        document.getElementById("dutySearch")
        ?.value
        .toLowerCase() || "";

    let duties =
        data.duties.filter(d => {

            const s =
                studentById(d.studentId);

            return (
                (s?.name || "")
                .toLowerCase()
                .includes(search)
                ||
                d.task
                .toLowerCase()
                .includes(search)
            );

        });

    if(!duties.length){

        table.innerHTML =
            `<tr>
                <td colspan="7">
                    <div class="empty">
                        ไม่พบข้อมูลเวร
                    </div>
                </td>
            </tr>`;

        return;

    }

    table.innerHTML =
        duties.map(d => {

            const s =
                studentById(d.studentId);

            return `
            <tr>

                <td>${d.date}</td>

                <td>
                    ${escapeHTML(s?.name || "-")}
                </td>

                <td>
                    ${escapeHTML(s?.className || "-")}
                </td>

                <td>
                    ${escapeHTML(d.task)}
                </td>

                <td>
                    ${statusBadge(d.status)}
                </td>

                <td>

                    <button
                        class="btn btn-success"
                        onclick="setDutyStatus(${d.id},'done')">
                        ✓
                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="setDutyStatus(${d.id},'bad')">
                        ✗
                    </button>

                    <button
                        class="btn btn-warning"
                        onclick="setDutyStatus(${d.id},'waiting')">
                        ⏳
                    </button>

                </td>

            </tr>
            `;

        }).join("");

}

/* =====================================================
   CHECK
===================================================== */

function renderCheck(){

    const table =
        document.getElementById("checkTable");

    if(!table)
        return;

    if(!data.duties.length){

        table.innerHTML =
            `<tr>
                <td colspan="6">
                    <div class="empty">
                        ไม่มีข้อมูล
                    </div>
                </td>
            </tr>`;

        return;

    }

    table.innerHTML =
        data.duties.map(d => {

            const s =
                studentById(d.studentId);

            return `
            <tr>

                <td>${d.date}</td>

                <td>
                    ${escapeHTML(s?.name || "-")}
                </td>

                <td>
                    ${escapeHTML(d.task)}
                </td>

                <td>
                    ${statusBadge(d.status)}
                </td>

                <td>

                    <button
                        class="btn btn-success"
                        onclick="setDutyStatus(${d.id},'done')">
                        ✓ ทำแล้ว
                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="setDutyStatus(${d.id},'bad')">
                        ✗ ไม่ทำ
                    </button>

                </td>

            </tr>
            `;

        }).join("");

}

/* =====================================================
   DUTY STATUS
===================================================== */

function setDutyStatus(id,status){

    const duty =
        data.duties.find(
            d => Number(d.id) === Number(id)
        );

    if(!duty)
        return;

    const old =
        duty.status;

    duty.status = status;

    const student =
        studentById(duty.studentId);

    if(
        status === "bad" &&
        old !== "bad"
    ){

        alert(
            "บันทึกว่าไม่ทำเวรแล้ว\n" +
            "ครูสามารถตรวจสอบและหักคะแนนได้"
        );

    }

    addHistory(
        `เปลี่ยนสถานะเวร ${student?.name || ""} เป็น ${statusText(status)}`
    );

    save();

    renderAll();

}

/* =====================================================
   ADD DUTY
===================================================== */

function openDutyForm(){

    openModal(
        "เพิ่มเวรใหม่",
        `
        <div class="form-grid">

            <div>
                <label>วันที่</label>

                <input
                    id="newDutyDate"
                    type="date"
                    value="${today()}">
            </div>

            <div>
                <label>นักเรียน</label>

                <select id="newDutyStudent">

                    ${data.students.map(s => `
                        <option value="${s.id}">
                            ${escapeHTML(s.name)}
                        </option>
                    `).join("")}

                </select>

            </div>

            <div class="full">

                <label>งานที่รับผิดชอบ</label>

                <input
                    id="newDutyTask"
                    placeholder="เช่น กวาดห้องเรียน">

            </div>

        </div>

        <button
            class="btn btn-primary btn-full"
            onclick="addDuty()">
            ➕ เพิ่มเวร
        </button>
        `
    );

}

function addDuty(){

    const date =
        document.getElementById(
            "newDutyDate"
        )?.value;

    const studentId =
        Number(
            document.getElementById(
                "newDutyStudent"
            )?.value
        );

    const task =
        document.getElementById(
            "newDutyTask"
        )?.value.trim();

    if(!date || !studentId || !task){

        alert("กรุณากรอกข้อมูลให้ครบ");

        return;

    }

    data.duties.push({

        id:Date.now(),

        date,

        studentId,

        task,

        status:"waiting"

    });

    addHistory(
        `เพิ่มเวร ${task}`
    );

    save();

    closeModal();

    renderAll();

}

/* =====================================================
   REQUESTS
===================================================== */

function sendRequest(){

    const type =
        document.getElementById(
            "requestType"
        )?.value;

    const date =
        document.getElementById(
            "requestDate"
        )?.value;

    const reason =
        document.getElementById(
            "requestReason"
        )?.value.trim();

    if(!date || !reason){

        alert("กรุณากรอกข้อมูลให้ครบ");

        return;

    }

    const student =
        data.currentUser?.role === "student"
        ? data.students.find(
            s =>
                s.name ===
                data.currentUser.name
        )
        : data.students[0];

    data.requests.push({

        id:Date.now(),

        studentId:
            student?.id || 1,

        type,

        date,

        reason,

        status:"pending",

        created:
            new Date().toLocaleString("th-TH")

    });

    addHistory(
        `ส่งคำขอ${type === "leave" ? "หยุดเวร" : "สลับเวร"}`
    );

    save();

    alert("ส่งคำขอเรียบร้อยแล้ว");

    renderAll();

}

/* =====================================================
   RENDER REQUESTS
===================================================== */

function renderRequests(){

    const box =
        document.getElementById(
            "requestList"
        );

    if(!box)
        return;

    let requests =
        data.requests;

    if(
        data.currentUser &&
        data.currentUser.role === "student"
    ){

        const student =
            data.students.find(
                s =>
                    s.name ===
                    data.currentUser.name
            );

        requests =
            requests.filter(
                r =>
                    r.studentId ===
                    student?.id
            );

    }

    if(!requests.length){

        box.innerHTML =
            `<div class="empty">

                <div class="empty-icon">📩</div>

              
