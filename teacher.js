const classId = localStorage.getItem("classId");
if (!classId) window.location.href = "index.html";

const dbRef = firebase.firestore().collection("classes").doc(classId);
document.getElementById("classTitle").innerText = classId.replaceAll("_", " ");

function logout() {
  localStorage.removeItem("classId");
  window.location.href = "index.html";
}

function fetchStudents() {
  dbRef.get().then(doc => {
    const data = doc.data();
    const students = data.students || [];
    const list = document.getElementById("studentsList");
    list.innerHTML = "";

    students.forEach((s, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${s.name}</strong> (${s.birthday})<br>
        حضور: ${s.attendance?.length || 0} | غياب: ${s.absence?.length || 0}<br>
        ملاحظات الافتقاد: ${s.visitNotes || 'لا يوجد'}<br>
        <button onclick="markAttendance(${i}, true)">✅ حاضر</button>
        <button onclick="markAttendance(${i}, false)">❌ غائب</button>
        <button onclick="deleteStudent(${i})">🗑 حذف</button>
      `;
      list.appendChild(li);
    });
  });
}

function addStudent() {
  const name = document.getElementById("studentName").value;
  const birthday = document.getElementById("studentBirthday").value;
  const visitNotes = document.getElementById("visitNote").value;

  if (!name || !birthday) {
    alert("يرجى إدخال الاسم وتاريخ الميلاد");
    return;
  }

  dbRef.get().then(doc => {
    const data = doc.data();
    const students = data.students || [];

    students.push({
      name,
      birthday,
      visitNotes,
      attendance: [],
      absence: []
    });

    dbRef.update({ students }).then(() => {
      document.getElementById("studentName").value = "";
      document.getElementById("studentBirthday").value = "";
      document.getElementById("visitNote").value = "";
      fetchStudents();
    });
  });
}

function deleteStudent(index) {
  if (!confirm("هل أنت متأكد من حذف هذا المخدوم؟")) return;

  dbRef.get().then(doc => {
    const students = doc.data().students;
    students.splice(index, 1);
    dbRef.update({ students }).then(fetchStudents);
  });
}

function markAttendance(index, isPresent) {
  dbRef.get().then(doc => {
    const students = doc.data().students;
    const today = new Date().toISOString().split("T")[0];

    if (isPresent) {
      students[index].attendance = students[index].attendance || [];
      if (!students[index].attendance.includes(today)) {
        students[index].attendance.push(today);
      }
    } else {
      students[index].absence = students[index].absence || [];
      if (!students[index].absence.includes(today)) {
        students[index].absence.push(today);
      }
    }

    dbRef.update({ students }).then(fetchStudents);
  });
}

// تحميل القائمة عند فتح الصفحة
window.onload = fetchStudents;
