import { loadNode } from "./core/firebase.js";

document.addEventListener("DOMContentLoaded", () => {

  const selCua = document.getElementById("cua");
  const selToa = document.getElementById("toa");
  const selBep = document.getElementById("bep");
  const btn    = document.getElementById("btnXem");

  function setHTML(id, val){
    const el = document.getElementById(id);
    if(el) el.innerHTML = val ?? "";
  }

  function renderText(v){
    if (!v) return "";
    if (Array.isArray(v)) return v.join("<br>");
    return String(v).replace(/\n/g,"<br>");
  }

  btn.addEventListener("click", async () => {

    if (
      selCua.selectedIndex === 0 ||
      selToa.selectedIndex === 0 ||
      selBep.selectedIndex === 0
    ) {
      alert("Vui lòng chọn đủ Cửa – Tọa – Bếp");
      return;
    }

    const cua = selCua.value;
    const toa = selToa.value;
    const bep = selBep.value;

    const keyCuatoa = cua + toa;
    const keyCuabep = cua + bep;
    const keyToabep = toa + bep;

    console.log("KEY OK:", keyCuatoa, keyCuabep, keyToabep);

    const [cuatoa, cuabep, toabep] = await Promise.all([
      loadNode("duongtrachtamyeu/cuatoa"),
      loadNode("duongtrachtamyeu/cuabep"),
      loadNode("duongtrachtamyeu/toabep")
    ]);

    const dataCuatoa = cuatoa?.[keyCuatoa];
    const dataCuabep = cuabep?.[keyCuabep];
    const dataToabep = toabep?.[keyToabep];

    if (!dataCuatoa || !dataCuabep || !dataToabep) {
      alert("Không có dữ liệu cho tổ hợp này");
      return;
    }

    // ===== TỔNG =====
    setHTML("cucnha", dataCuatoa.cucnha);
    setHTML("chinhbep", dataCuabep.chinhbep);
    setHTML("toanhabep", dataToabep.toanhabep);

    // ===== 1. CỬA – TỌA =====
    setHTML("cucnha_text", dataCuatoa.cucnha);
    setHTML("kieunha", dataCuatoa.kieunha);
    setHTML("diengiai", renderText(dataCuatoa.diengiai));

    // ===== 2. CỬA – BẾP =====
    setHTML("chinhbep_text", dataCuabep.chinhbep);
    setHTML("chugiai", renderText(dataCuabep.chugiai));

    // ===== 3. TỌA – BẾP =====
    setHTML("toanhabep_text", dataToabep.toanhabep);
    setHTML("ynghia", renderText(dataToabep.ynghia));
  });

});
