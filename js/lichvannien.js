import { loadNode } from "./core/firebase.js";

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("inputDate");
    const inputHour = document.getElementById("inputHour");
    const btn = document.getElementById("btnXem");
    if (!input || !btn) return;

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // NẠP ÂM
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

    btn.addEventListener("click", async () => {
        const [y,m,d] = input.value.split("-").map(Number);
        const hour = Number(inputHour.value || 0);
        const lunar = convertSolar2Lunar(d,m,y,7);
        const thangAm = lunar[1];
        const jd = jdFromDate(d,m,y);

        // Load tất cả JSON từ Fire
        const [
            data12truc,
            data24tiet,
            data28sao,
            dataBachThan,
            dataDongCong,
            dataGioHoangDao,
            dataGioHacDao,
            dataSaoTot,
            dataSaoXau,
            dataGioThaiAt,
	    dataHyTai,          // 🔽 THÊM
            dataNgayXungTuoi    // 🔽 THÊM
        ] = await Promise.all([
            loadNode("lichvannien/12truc"),
            loadNode("lichvannien/24tiet"),
            loadNode("lichvannien/28sao"),
            loadNode("lichvannien/bachthan"),
            loadNode("lichvannien/dongcong"),
            loadNode("lichvannien/giohoangdao"),
            loadNode("lichvannien/giohacdao"),
            loadNode("lichvannien/saotot"),
            loadNode("lichvannien/saoxau"),
            loadNode("lichvannien/giothaiat"),
            loadNode("lichvannien/hytai"),        // 🔽 THÊM
            loadNode("lichvannien/ngayxungtuoi")  // 🔽 THÊM
        ]);

        // NGÀY ÂM
        setText("ngayam", `${lunar[0]}/${lunar[1]}${lunar[3]?" (nhuận)":""}/${lunar[2]}`);
        setText("am-date", lunar[0]);
        setText("am-month", lunar[1]+(lunar[3]?" (nhuận)":""));
        setText("am-year", lunar[2]);

        // CAN CHI
        const Can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
        const Chi = ["Tí","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
        const canNam   = Can[(lunar[2]+6)%10];
        const chiNam   = Chi[(lunar[2]+8)%12];
        const canThang = Can[(lunar[2]*12+lunar[1]+3)%10];
        const chiThang = Chi[(lunar[1]+1)%12];
        const canNgay  = Can[(jd+9)%10];
        const chiNgay  = Chi[(jd+1)%12];
        const chiGioIndex = Math.floor((hour+1)/2)%12;
        const chiGio = Chi[chiGioIndex];
        const canGioTyIndex = (Can.indexOf(canNgay)*2+10)%10;
        const canGio = Can[(canGioTyIndex+chiGioIndex)%10];


// ===== KEY CHUẨN (KHỚP JSON) =====
const CAN_KEY = ["giap","at","binh","dinh","mau","ky","canh","tan","nham","quy"];
const CHI_KEY = ["ti","suu","dan","mao","thin","ty","ngo","mui","than","dau","tuat","hoi"];

const canNgayKey = CAN_KEY[(jd + 9) % 10];
const chiNgayKey = CHI_KEY[(jd + 1) % 12];

// DÙNG CHO ngayxungtuoi (ví dụ: atsuu)
const napAmNgayKey = canNgayKey + chiNgayKey;



        setText("canamnam", canNam); setText("chinamnam", chiNam);
        setText("canamthang", canThang); setText("chiamthang", chiThang);
        setText("canamngay", canNgay); setText("chiamngay", chiNgay);
        setText("canamgio", canGio); setText("chiamgio", chiGio);

        // NẠP ÂM
        const napAmNgayFull = `${canNgay} ${chiNgay}`;
        setText("napamnam", napAm[`${canNam} ${chiNam}`]||"");
        setText("napamthang", napAm[`${canThang} ${chiThang}`]||"");
        setText("napamngay", napAm[napAmNgayFull]||"");
        setText("napamgio", napAm[`${canGio} ${chiGio}`]||"");


// ================== NGÀY XUNG TUỔI ==================
const ngayXung = dataNgayXungTuoi?.[napAmNgayKey];
setText("tuoixung", ngayXung?.tuoixung || "--");

// ================== HỶ – TÀI ==================
const hyTai = dataHyTai?.[canNgayKey];

setText("hythan",   hyTai?.hythan   || "--");
setText("taithan",  hyTai?.taithan  || "--");
setText("loc",      hyTai?.loc      || "--");
setText("quyam",    hyTai?.quyam    || "--");
setText("quyduong", hyTai?.quyduong || "--");




        // 12 TRỰC
        const chiThangNorm = chiThang.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
        const chiNgayNorm = chiNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
        const trucID = chiThangNorm + chiNgayNorm;
        const trucData = data12truc?.["12truc"]?.[trucID] || null;
        setText("truc", trucData?.truc||"--");
        setText("truc_nen", trucData?.nen||"--");
        setText("truc_khongnen", trucData?.khongnen||"--");

        // 24 TIẾT KHÍ
        function load24TietChiTiet(jd, data24tiet){
            if(!data24tiet?.["24tiet"]) return "--";
            const JSON_EPOCH = 2415021;
            const offset = jd - JSON_EPOCH;
            for(const key in data24tiet["24tiet"]){
                const t = data24tiet["24tiet"][key];
                if(offset>=t.batdau && offset<=t.ketthuc) return t.ten;
            }
            return "--";
        }
        setText("tiet", load24TietChiTiet(jd,data24tiet));

        // 28 SAO
        const epoch = jdFromDate(1,1,2020);
        const diff = jd - epoch;
        const saoID = ((diff%28)+28)%28;
        const saoData = data28sao?.["28sao"]?.[saoID] || null;
        setText("sao_ten", saoData?.Ten||"--");
        setText("sao_nguhanh", saoData?.nguhanh||"--");
        setText("sao_cathung", saoData?.cathung||"--");
        setText("sao_nen", saoData?.nen||"--");
        setText("sao_khongnen", saoData?.khongnen||"--");
        setText("sao_ngoaile", saoData?.ngoaile||"--");

        // ĐỒNG CÔNG
        let dongCongText = "--";
        if(dataDongCong && thangAm && chiNgay && trucData?.truc){
            const chiNorm = chiNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            const trucNorm = trucData.truc.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            const dongCongID = `${thangAm}${chiNorm}${trucNorm}`;
            const dongCongData = dataDongCong?.dongcong?.[dongCongID] || null;
            dongCongText = dongCongData?.noidung || "--";
        }
        setText("dongcong_noidung", dongCongText);

        // GIỜ HOÀNG – HẮC
        if(chiNgay && dataGioHoangDao && dataGioHacDao){
            const chiNorm = chiNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            const hd = dataGioHoangDao?.giohoangdao?.[chiNorm] || null;
            const xd = dataGioHacDao?.giohacdao?.[chiNorm] || null;
            const tbody = document.getElementById("gio_list");
            if(tbody){
                tbody.innerHTML="";
                for(let i=1;i<=6;i++){
                    const tenHD=hd?hd[`tengio${i}`]||"":""; const gioHD=hd?hd[`gio${i}`]||"":""; 
                    const tenXD=xd?xd[`tengio${i}`]||"":""; const gioXD=xd?xd[`gio${i}`]||"":""; 
                    tbody.innerHTML+=`<tr><td>${tenHD} (${gioHD})</td><td>${tenXD} (${gioXD})</td></tr>`;
                }
            }
        }

        // ================== BÁCH THẦN ==================
        function loadBachThan(napAmNgay, dataBachThan){
            if(!napAmNgay || !dataBachThan?.bachthan) return;
            const key = napAmNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/ /g,"");
            const info = dataBachThan.bachthan[key];
            if(!info){
                console.warn(`Bách Thần không tìm thấy key: ${key}`);
                setText("bachthan_noingu","--");
                setText("bachthan_dongtho","--");
                setText("bachthan_ynghia","--");
                return;
            }
            setText("bachthan_noingu",info.noingu||"--");
            setText("bachthan_dongtho",info.dongtho||"--");
            setText("bachthan_ynghia",info.ynghia||"--");
        }

        // ================== GIỜ THÁI ẤT ==================
        function loadGioThaiAt(canNgay,dataGioThaiAt){
            if(!canNgay || !dataGioThaiAt?.giothaiat){
                setText("thaivat_can",canNgay||"--");
                setText("giothaiat","--");
                return;
            }
            const key = canNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d");
            const gio = dataGioThaiAt.giothaiat[key]?.gio || "--";
            setText("thaivat_can",canNgay);
            setText("giothaiat",gio);
        }

        // ================== SAO TỐT ==================
        if(dataSaoTot?.saotot){
            const tbody = document.getElementById("saotot_chitiet"); if(tbody) tbody.innerHTML="";
            const canNorm = canNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            const chiNorm = chiNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            Object.values(dataSaoTot.saotot).forEach(item=>{
                if(Number(item.thangam)===Number(thangAm)&&(item.canamngay===canNorm||item.chiamngay===chiNorm)){
                    for(let i=1;i<=7;i++){
                        if(item[`sao${i}`]) tbody.innerHTML+=`<tr><td>${item[`sao${i}`]}</td><td>${item[`ghichusao${i}`]||""}</td></tr>`;
                    }
                }
            });
        }

        // ================== SAO XẤU ==================
        if(dataSaoXau?.saoxau){
            const tbody = document.getElementById("saoxau_chitiet"); if(tbody) tbody.innerHTML="";
            const canNorm = canNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            const chiNorm = chiNgay.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
            Object.values(dataSaoXau.saoxau).forEach(item=>{
                if(Number(item.thangam)===Number(thangAm)&&(item.canamngay===canNorm||item.chiamngay===chiNorm)){
                    for(let i=1;i<=9;i++){
                        if(item[`sao${i}`]) tbody.innerHTML+=`<tr><td>${item[`sao${i}`]}</td><td>${item[`ghichusao${i}`]||""}</td></tr>`;
                    }
                }
            });
        }

        // ================== GỌI MODULE EXTRA ==================
        loadBachThan(napAmNgayFull,dataBachThan);
        loadGioThaiAt(canNgay,dataGioThaiAt);

    });

    // Auto fill ngày hôm nay
    const t=new Date();
    input.value=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
    btn.click();

});
