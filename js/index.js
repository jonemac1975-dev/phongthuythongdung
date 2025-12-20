document.addEventListener("DOMContentLoaded", () => {

    /* =================================
       MENU LOAD PAGE
    ================================= */
    const menuItems = document.querySelectorAll("#menu li");

    menuItems.forEach(li => {
        li.addEventListener("click", () => {
            const page = li.getAttribute("data-page");
            if (!page) return;

            window.location.href = `pages/${page}.html`;
        });
    });

    /* =================================
       ADMIN LOCK (LIGHT – HASH)
    ================================= */

    const ADMIN_HASH = "78f6b8a09ee8992699d8cdae9a8f1d3f3a1c6ac2bfebc9ea555ccadca8dbb130"; 
    // 🔴 THAY BẰNG HASH THẬT CỦA BẠN

    async function sha256(text) {
        const buffer = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(text)
        );
        return [...new Uint8Array(buffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    const lockBtn = document.getElementById("admin-lock");

    if (lockBtn) {
        lockBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const pass = prompt("Nhập mật khẩu quản trị:");
            if (!pass) return;

            const hash = await sha256(pass);

            if (hash === ADMIN_HASH) {
                sessionStorage.setItem("admin_ok", "1");
                window.location.href = "./admin.html"; // ✅ cùng cấp với index.html

            } else {
                alert("❌ Sai mật khẩu");
            }
        });
    }

});
