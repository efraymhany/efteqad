function updateGrades() {
  const stage = document.getElementById("stage").value;
  const gradeSelect = document.getElementById("grade");
  gradeSelect.innerHTML = "<option value=''>-- اختر السنة --</option>";

  const grades = {
    "ابتدائي": ["أولى", "ثانية", "ثالثة", "رابعة", "خامسة", "سادسة"],
    "إعدادي": ["أولى", "ثانية", "ثالثة"],
    "ثانوي": ["أولى", "ثانية", "ثالثة"]
  };

  if (grades[stage]) {
    grades[stage].forEach(g => {
      const opt = document.createElement("option");
      opt.value = g;
      opt.text = g;
      gradeSelect.appendChild(opt);
    });
  }
}

function login() {
  const stage = document.getElementById("stage").value;
  const grade = document.getElementById("grade").value;
  const teacherName = document.getElementById("teacherName").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!stage || !grade || !teacherName || !password) {
    alert("يرجى ملء جميع الحقول");
    return;
  }

  const classId = `${stage}_${grade}_${teacherName}`;

  db.collection("classes").doc(classId).get().then(doc => {
    if (doc.exists) {
      if (doc.data().password === password) {
        // ✅ دخول ناجح
        localStorage.setItem("classId", classId);
        window.location.href = "teacher.html"; // انتقل لصفحة الفصل
      } else {
        alert("كلمة السر غير صحيحة");
      }
    } else {
      // لو الفصل غير موجود، أنشئه
      db.collection("classes").doc(classId).set({
        stage,
        grade,
        teacherName,
        password,
        students: []
      }).then(() => {
        localStorage.setItem("classId", classId);
        window.location.href = "teacher.html";
      });
    }
  });
}
