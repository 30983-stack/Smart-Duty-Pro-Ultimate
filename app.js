/* =====================================================
   SMART DUTY PRO ULTIMATE
   APP.JS - MOBILE WEB VERSION
===================================================== */

const KEY = "smartDutyProUltimate_v2";

/* =====================================================
   DATABASE
===================================================== */

function today() {
    const d = new Date();
    return d.toISOString().split("T")[0];
}

function defaultData() {

    return {
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
}


/* =====================================================
   LOAD DATA
===================================================== */

let data;

try {

    const saved =
        localStorage.getItem(KEY);

    if (saved) {

        data = JSON.parse(saved);

    } else {

        data = defaultData();

    }

} catch (error) {

    console.warn(
        "ข้อมูลเดิมเสียหาย กำลังสร้างข้อมูลใหม่"
    );

    data = defaultData();

    localStorage.removeItem(KEY);
}

save();


/* =====================================================
   SAVE
===================================================== */

function save() {

    try {

        localStorage.setItem(
            KEY,
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            "ไม่สามารถบันทึกข้อมูล",
            error
        );

    }
}


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   STUDENT
===================================================== */

function studentById(id) {

    return data.students.find(
        s => Number(s.id) === Number(id)
    );

}


/* =====================================================
   STATUS
===================================================== */

function statusText(status) {

    if (status === "done")
        return "✓ ทำแล้ว";

    if (status === "bad")
        return "✗ ไม่ทำเวร";

    return "⏳ รอตรวจ";

}


function statusBadge(status) {

    if (status === "done") {

        return `
        <span class="badge badge-done">
            ✓ ทำแล้ว
        </span>
        `;

    }

    if (status === "bad") {

        return `
        <span class="badge badge-bad">
            ✗ ไม่ทำเวร
        </span>
        `;

    }

    return `
    <span class="badge badge-waiting">
        ⏳ รอตรวจ
    </span>
    `;

}


/* =====================================================
   HISTORY
===================================================== */

function addHistory(text) {

    if (!Array.isArray(data.history)) {

        data.history = [];

    }

    data.history.unshift({

        text: text,

        date:
            new Date().toLocaleString("th-TH")

    });

    data.history =
        data.history.slice(0, 100);

    save();

}


/* =====================================================
   LOGIN
===================================================== */

function login() {

    try {

        const username =
            document
                .getElementById("username")
                ?.value
                ?.trim();

        const password =
            document
                .getElementById("password")
                ?.value
                ?.trim();


        if (!username || !password) {

            alert(
                "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"
            );

            return;

        }


        /* DEMO ACCOUNTS */

        const user =
            username.toLowerCase();


        if (
            user !== "teacher" &&
            user !== "leader" &&
            user !== "student"
        ) {

            alert(
                "ชื่อผู้ใช้ไม่ถูกต้อง\n\n" +
                "ทดลองใช้:\n" +
                "teacher / 1234\n" +
                "leader / 1234\n" +
                "student / 1234"
            );

            return;

        }


        if (password !== "1234") {

            alert(
                "รหัสผ่านไม่ถูกต้อง\n\n" +
                "รหัสทดลองคือ 1234"
            );

            return;

        }


        let role = "student";

        let name = "นักเรียน";


        if (user === "teacher") {

            role = "teacher";

            name = "คุณครู";

        }


        else if (user === "leader") {

            role = "leader";

            name = "หัวหน้าเวร";

        }


        else {

            role = "student";

            name =
                data.students[0]?.name ||
                "นักเรียน";

        }


        data.currentUser = {

            username: username,

            name: name,

            role: role

        };


        save();


        /* OPEN APPLICATION */

        const loginScreen =
            document.getElementById(
                "loginScreen"
            );

        const appScreen =
            document.getElementById(
                "appScreen"
            );


        if (loginScreen) {

            loginScreen.classList.add(
                "hidden"
            );

        }


        if (appScreen) {

            appScreen.classList.remove(
                "hidden"
            );

        }


        updateUser();

        updateClock();

        openPage("dashboard");

        renderAll();


        addHistory(
            `เข้าสู่ระบบในฐานะ ${name}`
        );


    } catch (error) {

        console.error(error);

        alert(
            "เกิดข้อผิดพลาดในการเข้าสู่ระบบ\n" +
            "ลองรีเฟรชหน้าเว็บแล้วเข้าสู่ระบบใหม่"
        );

    }

}


/* =====================================================
   START APP
===================================================== */

function startApp() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const appScreen =
        document.getElementById(
            "appScreen"
        );


    if (loginScreen) {

        loginScreen.classList.add(
            "hidden"
        );

    }


    if (appScreen) {

        appScreen.classList.remove(
            "hidden"
        );

    }


    updateUser();

    updateClock();

    openPage("dashboard");

    renderAll();

}


/* =====================================================
   USER
===================================================== */

function updateUser() {

    const user =
        data.currentUser;

    if (!user)
        return;


    const sidebarUser =
        document.getElementById(
            "sidebarUser"
        );

    const sidebarRole =
        document.getElementById(
            "sidebarRole"
        );

    const welcome =
        document.getElementById(
            "welcomeName"
        );


    if (sidebarUser) {

        sidebarUser.textContent =
            user.name;

    }


    if (sidebarRole) {

        if (user.role === "teacher") {

            sidebarRole.textContent =
                "ครู";

        }

        else if (user.role === "leader") {

            sidebarRole.textContent =
                "หัวหน้าเวร";

        }

        else {

            sidebarRole.textContent =
                "นักเรียน";

        }

    }


    if (welcome) {

        welcome.textContent =
            user.name;

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    data.currentUser = null;

    save();

    location.reload();

}


/* =====================================================
   CLOCK
===================================================== */

let clockStarted = false;

function updateClock() {

    const clock =
        document.getElementById(
            "clock"
        );

    const todayText =
        document.getElementById(
            "todayText"
        );


    const now = new Date();


    if (clock) {

        clock.textContent =
            now.toLocaleTimeString(
                "th-TH",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

    }


    if (todayText) {

        todayText.textContent =
            now.toLocaleDateString(
                "th-TH",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    }


    if (!clockStarted) {

        clockStarted = true;

        setInterval(
            updateClock,
            1000
        );

    }

}


/* =====================================================
   SIDEBAR
===================================================== */

function toggleSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    if (sidebar) {

        sidebar.classList.toggle(
            "open"
        );

    }

}


/* =====================================================
   PAGE
===================================================== */

function openPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(
            p =>
                p.classList.add(
                    "hidden"
                )
        );


    const target =
        document.getElementById(
            "page-" + page
        );


    if (target) {

        target.classList.remove(
            "hidden"
        );

    }


    document
        .querySelectorAll(
            ".menu button"
        )
        .forEach(
            b =>
                b.classList.remove(
                    "active"
                )
        );


    const menu =
        document.getElementById(
            "menu" +
            page
                .charAt(0)
                .toUpperCase() +
            page.slice(1)
        );


    if (menu) {

        menu.classList.add(
            "active"
        );

    }


    const titles = {

        dashboard:
            "แดชบอร์ด",

        duties:
            "จัดการเวร",

        check:
            "ตรวจเวร",

        requests:
            "คำขอ",

        students:
            "จัดการนักเรียน",

        reports:
            "รายงาน",

        history:
            "ประวัติการใช้งาน"

    };


    const title =
        document.getElementById(
            "pageTitle"
        );


    if (title) {

        title.textContent =
            titles[page] ||
            "Smart Duty Pro";

    }


    renderAll();

}


/* =====================================================
   RENDER ALL
===================================================== */

function renderAll() {

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

function renderDashboard() {

    const statStudents =
        document.getElementById(
            "statStudents"
        );

    const statDone =
        document.getElementById(
            "statDone"
        );

    const statBad =
        document.getElementById(
            "statBad"
        );

    const statWaiting =
        document.getElementById(
            "statWaiting"
        );


    if (statStudents) {

        statStudents.textContent =
            data.students.length;

    }


    if (statDone) {

        statDone.textContent =
            data.duties.filter(
                d =>
                    d.status === "done"
            ).length;

    }


    if (statBad) {

        statBad.textContent =
            data.duties.filter(
                d =>
                    d.status === "bad"
            ).length;

    }


    if (statWaiting) {

        statWaiting.textContent =
            data.duties.filter(
                d =>
                    d.status === "waiting"
            ).length;

    }


    const box =
        document.getElementById(
            "dashboardDuties"
        );


    if (!box)
        return;


    const duties =
        data.duties
            .filter(
                d =>
                    d.date === today()
            )
            .slice(0, 6);


    if (!duties.length) {

        box.innerHTML = `
        <div class="empty">
            <div class="empty-icon">
                📋
            </div>
            ยังไม่มีเวรวันนี้
        </div>
        `;

        return;

    }


    box.innerHTML =
        duties
            .map(
                d => {

                    const student =
                        studentById(
                            d.studentId
                        );


                    return `
                    <div class="duty-mini">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    student?.name ||
                                    "-"
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    d.task
                                )}
                            </small>

                        </div>

                        ${statusBadge(
                            d.status
                        )}

                    </div>
                    `;

                }
            )
            .join("");

}


/* =====================================================
   DUTIES
===================================================== */

function renderDuties() {

    const table =
        document.getElementById(
            "dutyTable"
        );


    if (!table)
        return;


    const search =
        document
            .getElementById(
                "dutySearch"
            )
            ?.value
            ?.toLowerCase() ||
        "";


    const duties =
        data.duties.filter(
            d => {

                const student =
                    studentById(
                        d.studentId
                    );


                return (
                    String(
                        student?.name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            search
                        )
                    ||
                    String(
                        d.task ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            search
                        )
                );

            }
        );


    if (!duties.length) {

        table.innerHTML = `
        <tr>
            <td colspan="7">
                <div class="empty">
                    ไม่พบข้อมูลเวร
                </div>
            </td>
        </tr>
        `;

        return;

    }


    table.innerHTML =
        duties
            .map(
                d => {

                    const student =
                        studentById(
                            d.studentId
                        );


                    return `
                    <tr>

                        <td>
                            ${escapeHTML(
                                d.date
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student?.id ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student?.name ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                d.task
                            )}
                        </td>

                        <td>
                            ${statusBadge(
                                d.status
                            )}
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

                }
            )
            .join("");

}


/* =====================================================
   CHECK
===================================================== */

function renderCheck() {

    const table =
        document.getElementById(
            "checkTable"
        );


    if (!table)
        return;


    if (!data.duties.length) {

        table.innerHTML = `
        <tr>
            <td colspan="5">
                <div class="empty">
                    ไม่มีข้อมูลเวร
                </div>
            </td>
        </tr>
        `;

        return;

    }


    table.innerHTML =
        data.duties
            .map(
                d => {

                    const student =
                        studentById(
                            d.studentId
                        );


                    return `
                    <tr>

                        <td>
                            ${escapeHTML(
                                student?.name ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                d.task
                            )}
                        </td>

                        <td>
                            ${statusBadge(
                        
