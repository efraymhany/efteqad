const members = [];
const verses = [
  "الرب نوري وخلاصي ممن أخاف؟ (مز 27: 1)",
  "كل الأشياء تعمل معاً للخير (رو 8: 28)",
  "استطيع كل شيء في المسيح الذي يقويني (في 4: 13)"
];

// آية اليوم
document.getElementById("verseOfDay").innerText = verses[new Date().getDate() % verses.length];

// عرض الفورم
function showAddForm() {
  document.getElementById("formContainer").style.display = "block";
}

// إضافة مخدوم
function addMember() {
  const name = document.getElementById("name").value;
  const visitDate = document.getElementById("visitDate").value;

  if (name && visitDate) {
    members.push({ name, visitDate, present: null });
    renderList();
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("visitDate").value = "";
  } else {
    alert("يرجى ملء جميع الحقول");
  }
}

// عرض القائمة
function renderList() {
  const list = document.getElementById("membersList");
  list.innerHTML = "";
  members.forEach((m, index) => {
    list.innerHTML += `
      <li>
        ${m.name} - افتقاد: ${m.visitDate} 
        ${m.present !== null ? (m.present ? "✅ حاضر" : "❌ غائب") : ""}
      </li>`;
  });
}

// تسجيل الحضور
function markAttendance() {
  members.forEach((m, i) => {
    const present = confirm(`هل حضر ${m.name}؟`);
    members[i].present = present;
  });
  renderList();
}
