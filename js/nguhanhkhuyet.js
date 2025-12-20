import { loadNode } from "./core/firebase.js";

document.addEventListener("DOMContentLoaded", () => {

  const inputDate = document.getElementById("solarDate");
  const inputHour = document.getElementById("solarHour");
  const btnXem    = document.getElementById("btnXem");
  const gioitinh  = document.getElementById("gioitinh");

  function setText(id, value){
    const el = document.getElementById(id);
    if(el) el.textContent = value ?? "--";
  }

  // ===== BẢNG NẠP ÂM 60 HOA GIÁP =====
  const napAm = {
    "Giáp Tí":"Hải Trung Kim","Ất Sửu":"Hải Trung Kim",
    "Bính Dần":"Lư Trung Hỏa","Đinh Mão":"Lư Trung Hỏa",
    "Mậu Thìn":"Đại Lâm Mộc","Kỷ Tỵ":"Đại Lâm Mộc",
    "Canh Ngọ":"Lộ Bàng Thổ","Tân Mùi":"Lộ Bàng Thổ",
    "Nhâm Thân":"Kiếm Phong Kim","Quý Dậu":"Kiếm Phong Kim",
    "Giáp Tuất":"Sơn Đầu Hỏa","Ất Hợi":"Sơn Đầu Hỏa",
    "Bính Tí":"Giản Hạ Thủy","Đinh Sửu":"Giản Hạ Thủy",
    "Mậu Dần":"Thành Đầu Thổ","Kỷ Mão":"Thành Đầu Thổ",
    "Canh Thìn":"Bạch Lạp Kim","Tân Tỵ":"Bạch Lạp Kim",
    "Nhâm Ngọ":"Dương Liễu Mộc","Quý Mùi":"Dương Liễu Mộc",
    "Giáp Thân":"Tuyền Trung Thủy","Ất Dậu":"Tuyền Trung Thủy",
    "Bính Tuất":"Ốc Thượng Thổ","Đinh Hợi":"Ốc Thượng Thổ",
    "Mậu Tí":"Tích Lịch Hỏa","Kỷ Sửu":"Tích Lịch Hỏa",
    "Canh Dần":"Tùng Bách Mộc","Tân Mão":"Tùng Bách Mộc",
    "Nhâm Thìn":"Trường Lưu Thủy","Quý Tỵ":"Trường Lưu Thủy",
    "Giáp Ngọ":"Sa Trung Kim","Ất Mùi":"Sa Trung Kim",
    "Bính Thân":"Sơn Hạ Hỏa","Đinh Dậu":"Sơn Hạ Hỏa",
    "Mậu Tuất":"Bình Địa Mộc","Kỷ Hợi":"Bình Địa Mộc",
    "Canh Tí":"Bích Thượng Thổ","Tân Sửu":"Bích Thượng Thổ",
    "Nhâm Dần":"Kim Bạch Kim","Quý Mão":"Kim Bạch Kim",
    "Giáp Thìn":"Phúc Đăng Hỏa","Ất Tỵ":"Phúc Đăng Hỏa",
    "Bính Ngọ":"Thiên Hà Thủy","Đinh Mùi":"Thiên Hà Thủy",
    "Mậu Thân":"Đại Dịch Thổ","Kỷ Dậu":"Đại Dịch Thổ",
    "Canh Tuất":"Thoa Xuyến Kim","Tân Hợi":"Thoa Xuyến Kim",
    "Nhâm Tí":"Tang Đố Mộc","Quý Sửu":"Tang Đố Mộc",
    "Giáp Dần":"Đại Khê Thủy","Ất Mão":"Đại Khê Thủy",
    "Bính Thìn":"Sa Trung Thổ","Đinh Tỵ":"Sa Trung Thổ",
    "Mậu Ngọ":"Thiên Thượng Hỏa","Kỷ Mùi":"Thiên Thượng Hỏa",
    "Canh Thân":"Thạch Lựu Mộc","Tân Dậu":"Thạch Lựu Mộc",
    "Nhâm Tuất":"Đại Hải Thủy","Quý Hợi":"Đại Hải Thủy"
  };

  const Can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
  const Chi = ["Tí","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

  const key = s => s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g,"");

  btnXem.addEventListener("click", async () => {

    if(!inputDate.value) return;

    const [y,m,d] = inputDate.value.split("-").map(Number);
    const hour = Number(inputHour.value || 0);

    const lunar = convertSolar2Lunar(d,m,y,7);
    const jd = jdFromDate(d,m,y);

    const canNam   = Can[(lunar[2]+6)%10];
    const chiNam   = Chi[(lunar[2]+8)%12];
    const canThang = Can[(lunar[2]*12+lunar[1]+3)%10];
    const chiThang = Chi[(lunar[1]+1)%12];
    const canNgay  = Can[(jd+9)%10];
    const chiNgay  = Chi[(jd+1)%12];
    const chiGio   = Chi[Math.floor((hour+1)/2)%12];
    const canGio   = Can[((Can.indexOf(canNgay)*2)+Math.floor((hour+1)/2))%10];

    // ===== TỨ TRỤ =====
    setText("canchinam", `${canNam} ${chiNam}`);
    setText("canchithang", `${canThang} ${chiThang}`);
    setText("canchingay", `${canNgay} ${chiNgay}`);
    setText("canchigio", `${canGio} ${chiGio}`);

    // ===== NẠP ÂM =====
    setText("napamnam", napAm[`${canNam} ${chiNam}`]);
    setText("napamthang", napAm[`${canThang} ${chiThang}`]);
    setText("napamngay", napAm[`${canNgay} ${chiNgay}`]);
    setText("napamgio", napAm[`${canGio} ${chiGio}`]);

    // ===== LOAD FIREBASE =====
    const [
      nhNam, nhThang, nhNgay, nhGio,
      locNam, locNgay,
      menhNam, menhNu
    ] = await Promise.all([
      loadNode("nguhanhkhuyet/nguhanhkhuyetnam"),
      loadNode("nguhanhkhuyet/nguhanhkhuyetthang"),
      loadNode("nguhanhkhuyet/nguhanhkhuyetngay"),
      loadNode("nguhanhkhuyet/nguhanhkhuyetgio"),
      loadNode("nguhanhkhuyet/locmaquynhannam"),
      loadNode("nguhanhkhuyet/locmaquynhanngay"),
      loadNode("nguhanhkhuyet/menhquainam"),
      loadNode("nguhanhkhuyet/menhquainu")
    ]);

    // ===== MỆNH QUÁI + BÁT TRẠCH =====
    const menhData = (gioitinh.value==="nam" ? menhNam : menhNu)?.[lunar[2]] || {};
    setText("menh", menhData.menh);
    setText("nguhanh", menhData.nguhanh);
    setText("phuong", menhData.phuong);
    setText("so", menhData.so);

    ["taybac","bac","dongbac","dong","dongnam","nam","taynam","tay"]
      .forEach(f=>setText(f, menhData[f]));

    // ===== HÀM GIÚP CHUYỂN CHUỖI =====
const key = s => s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g,"");

// ===== HÀM GET KEY CAN + CHI =====
function getKey(c, ch) {
  return key(`${c} ${ch}`);
}

// ===== LỘC – MÃ – QUÝ – VĂN XƯƠNG – ĐÀO HOA =====
const ln = locNam?.[key(canNam)] || {};
const ld = locNgay?.[key(canNgay)] || {};

// Lộc
setText("locnam", ln.loc);     
setText("locngay", ld.loc);

// Mã (chỉ theo chi năm / chi ngày)
setText("manam",  locNam?.[key(chiNam)]?.ma || "--");
setText("mangay", locNgay?.[key(chiNgay)]?.ma || "--");

// Quý – Văn Xương – Đào Hoa
setText("quyamnam", ln.quyam); setText("quyamngay", ld.quyam);
setText("quyduongnam", ln.quyduong); setText("quyduongngay", ld.quyduong);
setText("vanxuongnam", ln.vanxuong); setText("vanxuongngay", ld.vanxuong);
setText("daohoanam", ln.daohoa); setText("daohoangay", ld.daohoa);

// ===== TÍNH NGŨ HÀNH =====
const hanhList = ["kim","thuy","moc","hoa","tho"];
const tong = { kim:0, thuy:0, moc:0, hoa:0, tho:0 };

function addHanh(src, k){
  if(!src || !src[k]) return;
  hanhList.forEach(h=>{
    tong[h] += Number(src[k][h] || 0);
  });
}

addHanh(nhNam,   getKey(canNam, chiNam));
addHanh(nhThang, getKey(canThang, chiThang));
addHanh(nhNgay,  getKey(canNgay, chiNgay));
addHanh(nhGio,   getKey(canGio, chiGio));

const total = Object.values(tong).reduce((a,b)=>a+b,0) || 1;

const colors = {
  kim:"#999",
  thuy:"#000000",
  moc:"#2e8b57",
  hoa:"#dc143c",
  tho:"#daa520"
};

hanhList.forEach(h=>{
  const percent = ((tong[h]/total)*100).toFixed(1);

  const bar = document.getElementById("bar"+h.charAt(0).toUpperCase()+h.slice(1));
  const pct = document.getElementById("percent"+h.charAt(0).toUpperCase()+h.slice(1));

  if(bar){
    bar.style.height = (percent*2) + "px";
    bar.style.backgroundColor = colors[h];
  }
  if(pct){
    pct.textContent = percent + "%";
  }
});




  });

  const t = new Date();
  inputDate.value = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
  btnXem.click();
});
