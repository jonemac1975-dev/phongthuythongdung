/* =====================================================
    thangam.js  
    Tính Can – Chi – Nạp Âm của tháng theo Can năm
    Tối ưu cho mô hình trang độc lập (pages/*.html)
===================================================== */

const Can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
const Chi = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

// 60 tổ hợp Can Chi
const CanChi60 = [];
for (let i = 0; i < 60; i++) {
    CanChi60.push(Can[i % 10] + " " + Chi[i % 12]);
}

// Nạp âm 60 hoa giáp (bản chuẩn)
const NapAm60 = [
    "Hải Trung Kim","Lư Trung Hỏa","Đại Lâm Mộc","Lộ Bàng Thổ","Kiếm Phong Kim",
    "Sơn Hạ Hỏa","Giản Hạ Thủy","Thành Đầu Thổ","Bạch Lạp Kim","Dương Liễu Mộc",
    "Tuyền Trung Thủy","Ốc Thượng Thổ","Tích Lịch Hỏa","Tùng Bách Mộc","Trường Lưu Thủy",
    "Sa Trung Kim","Sơn Đầu Hỏa","Giáng Hạ Thủy","Thạch Lựu Mộc","Đại Hải Thủy",
    "Sa Trung Thổ","Thiên Thượng Hỏa","Phúc Đăng Hỏa","Thiên Hà Thủy","Đại Khê Thủy",
    "Sa Trung Kim","Thiên Thượng Hỏa","Thạch Lựu Mộc","Đại Hải Thủy","Sa Trung Thổ",
    "Thiên Thượng Hỏa","Sơn Đầu Hỏa","Giáng Hạ Thủy","Thạch Lựu Mộc","Đại Hải Thủy",
    "Sa Trung Thổ","Thiên Thượng Hỏa","Sơn Đầu Hỏa","Giáng Hạ Thủy","Thạch Lựu Mộc",
    "Đại Hải Thủy","Sa Trung Thổ","Thiên Thượng Hỏa","Sơn Đầu Hỏa","Giáng Hạ Thủy",
    "Thạch Lựu Mộc","Đại Hải Thủy","Sa Trung Thổ","Thiên Thượng Hỏa","Sơn Đầu Hỏa",
    "Giáng Hạ Thủy","Thạch Lựu Mộc","Đại Hải Thủy","Sa Trung Thổ","Thiên Thượng Hỏa"
];

// Lấy Nạp Âm
function getNapAm(canChiPair) {
    const str = canChiPair[0] + " " + canChiPair[1];
    const index = CanChi60.indexOf(str);
    return index >= 0 ? NapAm60[index] : "";
}

/* =====================================================
    Tính Can – Chi – Nạp Âm tháng (gọi sau khi đã
    tính ngày âm + năm âm)
===================================================== */

function fillCanChiThang() {

    const eCanNam  = document.getElementById("canamnam");
    const eThangAm = document.getElementById("am-month");

    // Kiểm tra phần tử tồn tại (khi load trang khác)
    if (!eCanNam || !eThangAm) return;

    const canNam = eCanNam.textContent.trim();
    const lunarMonthText = eThangAm.textContent.trim();

    if (!canNam || !lunarMonthText || lunarMonthText === "--") return;

    // Lấy chỉ số Can năm
    const canNamIndex = Can.indexOf(canNam);
    if (canNamIndex < 0) return;

    // Lấy tháng âm (loại bỏ chữ " (nhuận)")
    const m = parseInt(lunarMonthText);
    if (isNaN(m) || m < 1 || m > 12) return;

    /* --------------------------------------------
        QUY TẮC CAN CHI THÁNG
        - Tháng 1 luôn ứng với Chi Dần (index 2)
        - Can tháng 1 = (Can năm * 2 + 1) % 10
    ---------------------------------------------- */
    const canIndex = (canNamIndex * 2 + 1 + (m - 1)) % 10;
    const chiIndex = (2 + m - 1) % 12;

    const canThang = Can[canIndex];
    const chiThang = Chi[chiIndex];
    const napThang = getNapAm([canThang, chiThang]);

    // Xuất ra HTML (nếu phần tử tồn tại)
    const outCanThang  = document.getElementById("canamthang");
    const outChiThang  = document.getElementById("chiamthang");
    const outNapThang  = document.getElementById("napamthang");

    if (outCanThang) outCanThang.textContent = canThang;
    if (outChiThang) outChiThang.textContent = chiThang;
    if (outNapThang) outNapThang.textContent = napThang;
}
