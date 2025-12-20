import { loadNode } from "./core/firebase.js";

document.addEventListener("DOMContentLoaded", async () => {

  const $ = id => document.getElementById(id);

  const inputDate = $("solarDate");
  const inputHour = $("solarHour");
  const btnXem    = $("btnXem");
  const selHuong  = $("huong");

  const setText = (id, v) => {
    const el = $(id);
    if(el) el.textContent = v ?? "--";
  };

  // ================= LOAD DATA =================
  const [
    vanbanAll,
    duongtrachAll,
    cachcucAll,
    longvanAll,
    molongAll,
    thansatAll
  ] = await Promise.all([
    loadNode("huyenkhongphitinh/vanban"),
    loadNode("huyenkhongphitinh/duongtrach"),
    loadNode("huyenkhongphitinh/cachcuc"),
    loadNode("huyenkhongphitinh/longvan"),
    loadNode("huyenkhongphitinh/molong"),
    loadNode("huyenkhongphitinh/thansat")
  ]);

  // ================= CAN CHI =================
  const Can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
  const Chi = ["Tí","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

  const key = s => s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g,"");

  // ================= VẬN BÀN =================
  function loadVanBan(huong){
    const vb = vanbanAll?.[huong];
    if(!vb) return;

    const cung = ["tc","tb","t","d","n","b","db","tn","dn"];

    cung.forEach(c=>{
      [1,2,3].forEach(i=>{
        const id = `${c}${i}`;
        const el = $(id);
        if(!el) return;

        const v = vb[id];
        let color = "#222";
        if(v===9) color="#c62828";
        if(v===1) color="#2e7d32";
        if(v===2) color="#1565c0";

        el.innerHTML = `<strong style="color:${color}">${v ?? "--"}</strong>`;
      });
    });
  }

  // ================= DƯƠNG TRẠCH =================
  function loadDuongTrach(huong){
    const d = duongtrachAll?.[huong];
    if(!d) return;

    setText("sontoa", d.sontoa);
    setText("sonhuong", d.sonhuong);
    setText("cungtoa", d.cungtoa);
    setText("cunghuong", d.cunghuong);
    setText("phuongtoa", d.phuongtoa);
    setText("phuonghuong", d.phuonghuong);
    setText("dotoa", d.dotoa);
    setText("dohuong", d.dohuong);
    setText("longtoa", d.longtoa);
    setText("longhuong", d.longhuong);

    setText("phucduc", d.phucduc);
    setText("monphai", d.monphai);
    setText("montrai", d.montrai);
    setText("batsat", d.batsat);
    setText("tulo", d.tulo);
    setText("kiepsat", d.kiepsat);
  }

  // ================= CÁCH CỤC =================
  function loadCachCuc(huong){
    const c = cachcucAll?.[huong];
    if(!c) return;

    setText("cc1", c.cc1);
    setText("ghichucc1", c.ghichucc1);
    setText("cc2", c.cc2);
    setText("ghichucc2", c.ghichucc2);
    setText("cc3", c.cc3);
    setText("ghichucc3", c.ghichucc3);
  }

  // ================= LONG VẬN =================
// ================= LONG VẬN =================
function loadLongVan(chiNam, huong){
  const id = key(chiNam + huong);  // ID = chiNam + huong
  const lv = longvanAll?.[id];

  if(lv){
    // Tọa
    setText("tenvantoa", lv.tenvantoa);
    setText("thovantoa", lv.thovantoa);
    setText("ynghiatoa", lv.ynghiatoa);

    // Hướng
    setText("tenvanhuong", lv.tenvanhuong);
    setText("thovanhuong", lv.thovanhuong);
    setText("ynghiahuong", lv.ynghiahuong);
  } else {
    // Không tìm thấy
    setText("tenvantoa", "--");
    setText("thovantoa", "--");
    setText("ynghiatoa", "--");

    setText("tenvanhuong", "--");
    setText("thovanhuong", "--");
    setText("ynghiahuong", "--");
  }
}


  // ================= MỘ LONG =================
  function loadMoLong(nam){
    const m = molongAll?.[nam];
    if(!m) return;

    for(let i=1;i<=5;i++){
      setText(`mo${i}`, m[`mo${i}`]);
      setText(`nh${i}`, m[`nh${i}`]);
      setText(`tch${i}`, m[`tch${i}`]);
    }
  }

  // ================= THẦN SÁT =================
  function loadThanSat(nam){
    Object.values(thansatAll||{}).forEach(t=>{
      if(t.namam!==nam) return;

      const idCat  = `ts_${t.huong}_cat`;
      const idHung = `ts_${t.huong}_hung`;

      setText(idCat, t.saocat);
      setText(idHung, t.saohung);
    });
  }

  // ================= CLICK =================
  btnXem.addEventListener("click", () => {

    if(!inputDate.value || !selHuong.value) return;

    const [y,m,d] = inputDate.value.split("-").map(Number);
    const hour = Number(inputHour.value||0);
    const huong = selHuong.value;

    const lunar = convertSolar2Lunar(d,m,y,7);
    const jd = jdFromDate(d,m,y);

    const canNam  = Can[(lunar[2]+6)%10];
    const chiNam  = Chi[(lunar[2]+8)%12];
    const canTh   = Can[(lunar[2]*12+lunar[1]+3)%10];
    const chiTh   = Chi[(lunar[1]+1)%12];
    const canNg   = Can[(jd+9)%10];
    const chiNg   = Chi[(jd+1)%12];
    const chiGio  = Chi[Math.floor((hour+1)/2)%12];
    const canGio  = Can[((Can.indexOf(canNg)*2)+Math.floor((hour+1)/2))%10];

    setText("ngayam", `${lunar[0]}/${lunar[1]}/${lunar[2]}`);

    setText("canchinam", `${canNam} ${chiNam}`);
    setText("canchithang", `${canTh} ${chiTh}`);
    setText("canchingay", `${canNg} ${chiNg}`);
    setText("canchigio", `${canGio} ${chiGio}`);

    // ===== LOAD ALL =====
    loadVanBan(huong);
    loadDuongTrach(huong);
    loadCachCuc(huong);
    loadLongVan(chiNam, huong);
    loadMoLong(lunar[2]);
    loadThanSat(lunar[2]);
  });

  // ===== AUTO LOAD =====
  const t = new Date();
  inputDate.value = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
});
