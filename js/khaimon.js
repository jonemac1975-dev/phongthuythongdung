/* ===============================
   IMPORT
================================ */
import { db } from "./core/firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ===============================
   PHẦN 1 – CỬU VẬN
================================ */

function initCuuVanDropdown() {
  const namSel = document.getElementById("namSelect");
  const thangSel = document.getElementById("thangSelect");
  if (!namSel || !thangSel) return;

  namSel.innerHTML = "";
  thangSel.innerHTML = "";

  for (let y = 2024; y <= 2043; y++) {
    namSel.add(new Option(y, y));
  }
  for (let m = 1; m <= 12; m++) {
    thangSel.add(new Option(m, m));
  }

  namSel.value = 2024;
  thangSel.value = 1;

  namSel.addEventListener("change", () =>
    loadCuuVan(namSel.value, thangSel.value)
  );
  thangSel.addEventListener("change", () =>
    loadCuuVan(namSel.value, thangSel.value)
  );
}

async function loadCuuVan(nam, thang) {
  const key = `${nam}${String(thang).padStart(2, "0")}`;
  const snap = await get(ref(db, `khaimon/cuuvan/${key}`));
  if (!snap.exists()) return;

  const data = snap.val();
  Object.keys(data).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = data[id] ?? "";
  });
}

/* ===============================
   PHẦN 2 – KHAI MÔN
================================ */

const HOA_GIAP = [
  ["Giáp Tý","giapti"], ["Ất Sửu","atsuu"], ["Bính Dần","binhdan"],
  ["Đinh Mão","dinhmao"], ["Mậu Thìn","mauthin"], ["Kỷ Tỵ","kyty"],
  ["Canh Ngọ","canhngo"], ["Tân Mùi","tanmui"], ["Nhâm Thân","nhamthan"],
  ["Quý Dậu","quydau"],

  ["Giáp Tuất","giaptuat"], ["Ất Hợi","athoi"], ["Bính Tý","binhti"],
  ["Đinh Sửu","dinhsuu"], ["Mậu Dần","maudan"], ["Kỷ Mão","kymao"],
  ["Canh Thìn","canhthin"], ["Tân Tỵ","tanty"], ["Nhâm Ngọ","nhamngo"],
  ["Quý Mùi","quymui"],

  ["Giáp Thân","giapthan"], ["Ất Dậu","atdau"], ["Bính Tuất","binhtuat"],
  ["Đinh Hợi","dinhhoi"], ["Mậu Tý","mauti"], ["Kỷ Sửu","kysuu"],
  ["Canh Dần","canhdan"], ["Tân Mão","tanmao"], ["Nhâm Thìn","nhamthin"],
  ["Quý Tỵ","quyty"],

  ["Giáp Ngọ","giapngo"], ["Ất Mùi","atmui"], ["Bính Thân","binhthan"],
  ["Đinh Dậu","dinhdau"], ["Mậu Tuất","mautuat"], ["Kỷ Hợi","kyhoi"],
  ["Canh Tý","canhti"], ["Tân Sửu","tansuu"], ["Nhâm Dần","nhamdan"],
  ["Quý Mão","quymao"],

  ["Giáp Thìn","giapthin"], ["Ất Tỵ","atty"], ["Bính Ngọ","binhngo"],
  ["Đinh Mùi","dinhmui"], ["Mậu Thân","mauthan"], ["Kỷ Dậu","kydau"],
  ["Canh Tuất","canhtuat"], ["Tân Hợi","tanhoi"],
  ["Nhâm Tý","nhamti"], ["Quý Sửu","quysuu"],
  ["Giáp Dần","giapdan"], ["Ất Mão","atmao"],
["Bính Thìn","binhthin"], ["Đinh Tỵ","dinhty"],
["Mậu Ngọ","maungo"], ["Kỷ Mùi","kymui"],
["Canh Tuất","canhtuat"], ["Tân Dậu","tandau"],
["Nhâm Tuất","nhamtuat"], ["Quý Hợi","quyhoi"]
];


function initKhaiMonDropdown() {
  const toaSel = document.getElementById("toaSelect");
  const cuaSel = document.getElementById("cuaSelect");
  if (!toaSel || !cuaSel) return;

  toaSel.innerHTML = "";
  cuaSel.innerHTML = "";

  HOA_GIAP.forEach(([label, val]) => {
    toaSel.add(new Option(label, val));
    cuaSel.add(new Option(label, val));
  });

  toaSel.selectedIndex = 0;
  cuaSel.selectedIndex = 0;

  toaSel.addEventListener("change", loadKhaiMon);
  cuaSel.addEventListener("change", loadKhaiMon);

  // ✅ GỌI Ở ĐÂY – ĐÚNG THỜI ĐIỂM
  loadKhaiMon();
}


async function loadKhaiMon() {
  const toa = document.getElementById("toaSelect").value;
  const cua = document.getElementById("cuaSelect").value;
  const key = `${toa}${cua}`;

  const snap = await get(ref(db, `khaimon/khaimon/${key}`));
  if (!snap.exists()) {
    clearKhaiMon();
    return;
  }

  const d = snap.val();
  ["can","kham","cans","chan","ton","ly","khon","doai","trung"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = d[id] ?? "";
    });
}

function clearKhaiMon() {
  ["can","kham","cans","chan","ton","ly","khon","doai","trung"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
}

/* ===============================
   START – DUY NHẤT 1 CHỖ
================================ */
document.addEventListener("DOMContentLoaded", () => {
  initCuuVanDropdown();
  initKhaiMonDropdown();

  loadCuuVan(2024, 1);
});
