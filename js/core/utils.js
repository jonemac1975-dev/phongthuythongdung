// ===============================
// utils.js – helper dùng chung TOÀN DỰ ÁN
// ===============================

/**
 * Chuẩn hóa chuỗi tiếng Việt:
 * - bỏ dấu
 * - viết thường
 * - bỏ khoảng trắng
 * VD: "Giáp Tí" → "giapti"
 */
export function normalizeKey(str = "") {
    return str
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
}

/**
 * Chuẩn hóa chi / can (bỏ dấu, viết thường)
 * VD: "Dần" → "dan"
 */
export function normalizeChiCan(str = "") {
    return str
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Tìm phần tử theo ID (object dạng { id: {...} })
 */
export function findById(obj, id) {
    if (!obj || !id) return null;
    return obj[id] || null;
}

/**
 * Tìm trong mảng theo field
 */
export function findInArray(arr = [], field, value) {
    if (!Array.isArray(arr)) return null;
    return arr.find(item => item?.[field] === value) || null;
}
