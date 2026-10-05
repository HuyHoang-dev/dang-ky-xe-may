// Hệ thống đăng ký xe máy - HTML/CSS/JS thuần, lưu dữ liệu bằng LocalStorage
const DEFAULT_USERS = [
  { id: 1, cmnd: "001202001234", matkhau: "123456", hoten: "Nguyễn Văn An", ngaysinh: "1995-05-12", quequan: "Hà Nội", sodienthoai: "0912345678", email: "nguyenvanan.hn@gmail.com", imageBase64: "", role: "user" },
  { id: 2, cmnd: "admin", matkhau: "admin123", hoten: "Thiếu tá Vũ Mạnh Cường", ngaysinh: "1985-11-20", quequan: "Hà Nội", sodienthoai: "0909888999", email: "canbo.cuong@csgt.bocongan.gov.vn", imageBase64: "", role: "admin" },
  { id: 3, cmnd: "079201004567", matkhau: "123456", hoten: "Trần Thị Mai", ngaysinh: "1998-08-22", quequan: "TP. Hồ Chí Minh", sodienthoai: "0934567890", email: "maitran98@gmail.com", imageBase64: "", role: "user" },
  { id: 4, cmnd: "048203007890", matkhau: "123456", hoten: "Lê Hoàng Nam", ngaysinh: "2000-02-14", quequan: "Đà Nẵng", sodienthoai: "0987654321", email: "namle.danang@gmail.com", imageBase64: "", role: "user" },
  { id: 5, cmnd: "031201008899", matkhau: "123456", hoten: "Phạm Hải Đăng", ngaysinh: "1997-10-30", quequan: "Hải Phòng", sodienthoai: "0977112233", email: "haidang.hp@gmail.com", imageBase64: "", role: "user" }
];

const DEFAULT_HOSO = [
  { id: "hoso-1", maHoSo: "DKXM-2026-0012", userId: 1, cmnd: "001202001234", hoten: "Nguyễn Văn An", quequan: "Hà Nội", sodienthoai: "0912345678", email: "nguyenvanan.hn@gmail.com", loaiXe: "Xe mô tô 2 bánh", nhanHieu: "Honda", dongXe: "SH 150i ABS", mauXe: "Trắng", dungTich: "156.9 cc", soKhung: "RLHJF8509PY045123", soMay: "JF85E-0089123", ngayNop: "2026-10-02", trangThai: "pending" },
  { id: "hoso-2", maHoSo: "DKXM-2026-0008", userId: 3, cmnd: "079201004567", hoten: "Trần Thị Mai", quequan: "TP. Hồ Chí Minh", sodienthoai: "0934567890", email: "maitran98@gmail.com", loaiXe: "Xe mô tô 2 bánh", nhanHieu: "Yamaha", dongXe: "Grande Hybrid", mauXe: "Đỏ", dungTich: "124.9 cc", soKhung: "RLCUE2100NY012894", soMay: "E32RE-045129", ngayNop: "2026-09-28", trangThai: "approved", bienSo: "59-P1 688.86", ngayDuyet: "2026-09-29", canBoDuyet: "Thiếu tá Vũ Mạnh Cường" },
  { id: "hoso-3", maHoSo: "DKXM-2026-0005", userId: 4, cmnd: "048203007890", hoten: "Lê Hoàng Nam", quequan: "Đà Nẵng", sodienthoai: "0987654321", email: "namle.danang@gmail.com", loaiXe: "Xe mô tô 2 bánh", nhanHieu: "Honda", dongXe: "Wave Alpha", mauXe: "Xanh đen", dungTich: "109.1 cc", soKhung: "RLHJA3900MY781204", soMay: "JA39E-098231", ngayNop: "2026-09-20", trangThai: "approved", bienSo: "43-D1 567.89", ngayDuyet: "2026-09-21", canBoDuyet: "Thiếu tá Vũ Mạnh Cường" },
  { id: "hoso-4", maHoSo: "DKXM-2026-0002", userId: 5, cmnd: "031201008899", hoten: "Phạm Hải Đăng", quequan: "Hải Phòng", sodienthoai: "0977112233", email: "haidang.hp@gmail.com", loaiXe: "Xe gắn máy điện", nhanHieu: "VinFast", dongXe: "Feliz S", mauXe: "Bạc", dungTich: "Động cơ điện 3000W", soKhung: "VF1EV0210NY552199", soMay: "MTR3KW-009182", ngayNop: "2026-09-15", trangThai: "rejected", lyDoTuChoi: "Số khung trên hóa đơn không khớp với phiếu xuất xưởng. Vui lòng đối chiếu và nộp lại.", ngayDuyet: "2026-09-16", canBoDuyet: "Thiếu tá Vũ Mạnh Cường" }
];

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function load(key, def) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) { localStorage.setItem(key, JSON.stringify(def)); return JSON.parse(JSON.stringify(def)); }
    return JSON.parse(raw);
  } catch (e) { return JSON.parse(JSON.stringify(def)); }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch (e) { alert("Không lưu được dữ liệu (bộ nhớ trình duyệt đầy). Hãy dùng ảnh nhỏ hơn."); return false; }
}

// Luôn đảm bảo các tài khoản mẫu tồn tại, kể cả khi LocalStorage còn dữ liệu cũ
function getUsers() {
  const users = load("users", DEFAULT_USERS);
  let changed = false;
  DEFAULT_USERS.forEach((d) => {
    if (!users.some((u) => u.cmnd === d.cmnd)) { users.push(d); changed = true; }
  });
  if (changed) save("users", users);
  return users;
}
const getHoSo = () => load("hoSoList", DEFAULT_HOSO);
const getCurrent = () => { try { return JSON.parse(localStorage.getItem("currentUser") || "null"); } catch (e) { return null; } };

function resetData() {
  if (!confirm("Đặt lại toàn bộ dữ liệu về mẫu ban đầu?")) return;
  localStorage.removeItem("users");
  localStorage.removeItem("hoSoList");
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}
function logout() {
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}

const STATUS = {
  pending: ["Chờ duyệt", "badge-pending"],
  approved: ["Đã duyệt", "badge-approved"],
  rejected: ["Từ chối", "badge-rejected"]
};
const badge = (st) => `<span class="badge ${STATUS[st][1]}">${STATUS[st][0]}</span>`;

function genPlate(province) {
  const p = (province || "").toLowerCase();
  const codes = [["hà nội", "29"], ["hồ chí minh", "59"], ["đà nẵng", "43"], ["hải phòng", "15"], ["cần thơ", "65"], ["bình dương", "61"], ["đồng nai", "60"], ["quảng ninh", "14"], ["thái nguyên", "20"], ["nghệ an", "37"]];
  const prefix = (codes.find(([k]) => p.includes(k)) || [0, "29"])[1];
  const series = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "K1", "M1", "N1", "P1"][Math.floor(Math.random() * 12)];
  const num = `${Math.floor(100 + Math.random() * 900)}.${Math.floor(10 + Math.random() * 90)}`;
  return `${prefix}-${series} ${num}`;
}


// ===== Giấy chứng nhận đăng ký =====
function qrSvg(seed) {
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  s = s || 1;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  const n = 21;
  const finder = (x, y) => {
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      const dx = x - ox, dy = y - oy;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7)
        return (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)) ? 1 : 0;
    }
    return -1;
  };
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const f = finder(x, y);
    if (f >= 0 ? f === 1 : rnd() > 0.5) d += `M${x} ${y}h1v1h-1z`;
  }
  return `<svg viewBox="-1 -1 23 23" shape-rendering="crispEdges"><path d="${d}" fill="#0f172a"/></svg>`;
}

function openCert(h) {
  const f = (label, val, cls = "") => `<div class="${cls}"><span>${label}</span><b>${esc(val)}</b></div>`;
  $("certBody").innerHTML = `
    <div class="cert">
      <div class="cert-head">
        <div class="cert-nation">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="cert-motto">Độc lập - Tự do - Hạnh phúc</div>
        <div class="cert-org">Bộ Công an - Cục Cảnh sát giao thông</div>
        <h2>GIẤY CHỨNG NHẬN ĐĂNG KÝ XE MÔ TÔ, XE GẮN MÁY</h2>
        <div class="cert-code">Mã hồ sơ điện tử: <b>${esc(h.maHoSo)}</b></div>
      </div>
      <div class="cert-plate-wrap"><div class="cert-plate-label">Biển số đăng ký</div><div class="cert-plate">${esc(h.bienSo || "CHƯA CẤP")}</div></div>
      <div class="cert-grid">
        ${f("Chủ xe", h.hoten, "wide")}
        ${f("Số CMND / CCCD", h.cmnd)}
        ${f("Địa chỉ thường trú", h.quequan + ", Việt Nam")}
        ${f("Nhãn hiệu", h.nhanHieu)}
        ${f("Số loại", h.dongXe)}
        ${f("Loại xe", h.loaiXe)}
        ${f("Màu sơn", h.mauXe)}
        ${f("Dung tích / công suất", h.dungTich)}
        ${f("Số khung", h.soKhung, "mono")}
        ${f("Số máy", h.soMay, "mono")}
      </div>
      <div class="cert-foot">
        <div class="cert-qr">${qrSvg(h.maHoSo + h.soKhung)}<small>Quét mã để xác thực trên cơ sở dữ liệu giao thông quốc gia.</small></div>
        <div class="cert-sign">
          <div>Ngày cấp: ${esc(h.ngayDuyet || new Date().toISOString().split("T")[0])}</div>
          <b>TRƯỞNG PHÒNG CSGT</b>
          <img src="sign.png" alt="Con dấu CSGT">
          <b class="cert-officer">${esc(h.canBoDuyet || "Cán bộ CSGT")}</b>
          <small>(Đã ký số điện tử)</small>
        </div>
      </div>
    </div>`;
  $("certDlg").showModal();
}

// ===== a. login.html =====
if ($("loginBtn")) {
  getUsers(); // nạp dữ liệu mẫu
  const doLogin = () => {
    const cmnd = $("cmnd").value.trim();
    const pass = $("password").value.trim();
    const found = getUsers().find((u) => u.cmnd === cmnd && u.matkhau === pass);
    if (!found) { $("loginError").textContent = "Sai số CMND hoặc mật khẩu. Hãy kiểm tra lại."; return; }
    localStorage.setItem("currentUser", JSON.stringify(found));
    location.href = found.role === "admin" ? "index.html" : "user.html";
  };
  document.querySelectorAll(".quick-item").forEach((b) => b.addEventListener("click", () => {
    $("cmnd").value = b.dataset.c; $("password").value = b.dataset.p; doLogin();
  }));
  $("loginBtn").addEventListener("click", doLogin);
  ["cmnd", "password"].forEach((id) => $(id).addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); }));
}

// ===== b. user.html =====
if ($("registerForm")) {
  let cur = getCurrent();
  if (!cur || cur.role === "admin") { location.href = "login.html"; }
  else {
    $("welcomeUser").textContent = "Xin chào, " + cur.hoten;
    $("viewCmnd").textContent = cur.cmnd;
    $("viewHoten").textContent = cur.hoten;
    $("viewNgaysinh").textContent = cur.ngaysinh;
    $("viewQuequan").textContent = cur.quequan;
    $("phone").value = cur.sodienthoai || "";
    $("email").value = cur.email || "";
    if (cur.imageBase64) { $("avatarImg").src = cur.imageBase64; $("avatarImg").style.display = "block"; $("avatarPlaceholder").style.display = "none"; }

    const renderMine = () => {
      const mine = getHoSo().filter((h) => h.userId === cur.id || h.cmnd === cur.cmnd);
      if (!mine.length) { $("statusBox").innerHTML = "Bạn chưa nộp hồ sơ nào. Điền biểu mẫu bên dưới để bắt đầu."; return; }
      $("statusBox").innerHTML = mine.map((h) => {
        let extra = "";
        if (h.trangThai === "approved") extra = `<div>Biển số được cấp: <strong class="plate-text">${esc(h.bienSo)}</strong></div><button class="btn btn-secondary" data-cert="${esc(h.id)}" style="margin-top:8px">Xem giấy đăng ký</button>`;
        if (h.trangThai === "rejected") extra = `<div>Lý do: ${esc(h.lyDoTuChoi)}</div>`;
        return `<div class="hoso-item"><div>${badge(h.trangThai)} <strong>${esc(h.maHoSo)}</strong></div><div>${esc(h.nhanHieu)} ${esc(h.dongXe)} · nộp ngày ${esc(h.ngayNop)}</div>${extra}</div>`;
      }).join("");
    };
    renderMine();
    $("statusBox").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cert]");
      if (!b) return;
      const h = getHoSo().find((x) => x.id === b.dataset.cert);
      if (h) openCert(h);
    });

    $("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const file = $("fileInput").files[0];
      if (!file) { alert("Vui lòng chọn ảnh cá nhân."); return; }
      if (file.size > 2 * 1024 * 1024) { alert("Ảnh phải nhỏ hơn 2MB."); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const list = getHoSo();
        const v = (id) => $(id).value.trim();
        const hoso = {
          id: "hoso-" + Date.now(),
          maHoSo: `DKXM-${new Date().getFullYear()}-${String(list.length + 1).padStart(4, "0")}`,
          userId: cur.id, cmnd: cur.cmnd, hoten: cur.hoten, ngaysinh: cur.ngaysinh, quequan: cur.quequan,
          sodienthoai: v("phone"), email: v("email"), imageBase64: ev.target.result,
          loaiXe: v("loaiXe"), nhanHieu: v("nhanHieu"), dongXe: v("dongXe"), mauXe: v("mauXe"), dungTich: v("dungTich"),
          soKhung: v("soKhung"), soMay: v("soMay"),
          ngayNop: new Date().toISOString().split("T")[0], trangThai: "pending"
        };
        list.unshift(hoso);
        if (!save("hoSoList", list)) return;
        cur = { ...cur, sodienthoai: hoso.sodienthoai, email: hoso.email, imageBase64: hoso.imageBase64 };
        const users = getUsers().map((u) => (u.id === cur.id ? cur : u));
        save("users", users);
        localStorage.setItem("currentUser", JSON.stringify(cur));
        alert("Đã gửi hồ sơ " + hoso.maHoSo + ". Hồ sơ đang chờ cán bộ duyệt.");
        location.reload();
      };
      reader.readAsDataURL(file);
    });
  }
}

// ===== c. index.html (cán bộ) =====
if ($("hosoBody")) {
  const cur = getCurrent();
  if (!cur || cur.role !== "admin") { location.href = "login.html"; }
  else {
    $("welcomeUser").textContent = cur.hoten;

    const render = () => {
      const all = getHoSo();
      $("cntAll").textContent = all.length;
      $("cntPending").textContent = all.filter((h) => h.trangThai === "pending").length;
      $("cntApproved").textContent = all.filter((h) => h.trangThai === "approved").length;
      $("cntRejected").textContent = all.filter((h) => h.trangThai === "rejected").length;

      const q = $("search").value.trim().toLowerCase();
      const f = $("filterStatus").value;
      const list = all.filter((h) =>
        (!f || h.trangThai === f) &&
        (!q || [h.hoten, h.bienSo, h.quequan, h.cmnd, h.maHoSo].some((x) => (x || "").toLowerCase().includes(q)))
      );
      $("hosoBody").innerHTML = list.length ? list.map((h) => `
        <tr>
          <td>${esc(h.maHoSo)}</td>
          <td>${esc(h.hoten)}<br><small>${esc(h.cmnd)}</small></td>
          <td>${esc(h.quequan)}</td>
          <td>${esc(h.nhanHieu)} ${esc(h.dongXe)}</td>
          <td>${esc(h.ngayNop)}</td>
          <td>${badge(h.trangThai)}${h.bienSo ? `<br><span class="plate-text">${esc(h.bienSo)}</span>` : ""}</td>
          <td class="actions">
            <button class="btn btn-secondary" data-act="view" data-id="${esc(h.id)}">Chi tiết</button>
            ${h.trangThai === "pending" ? `<button class="btn btn-success" data-act="approve" data-id="${esc(h.id)}">Duyệt</button><button class="btn btn-danger" data-act="reject" data-id="${esc(h.id)}">Từ chối</button>` : ""}
            ${h.trangThai === "approved" ? `<button class="btn btn-success" data-act="cert" data-id="${esc(h.id)}">Giấy đăng ký</button>` : ""}
          </td>
        </tr>`).join("") : `<tr><td colspan="7" class="empty">Không có hồ sơ phù hợp với bộ lọc.</td></tr>`;
    };

    const update = (id, patch) => {
      const list = getHoSo().map((h) => (h.id === id ? { ...h, ...patch, canBoDuyet: cur.hoten, ngayDuyet: new Date().toISOString().split("T")[0] } : h));
      save("hoSoList", list);
      render();
    };

    $("hosoBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const h = getHoSo().find((x) => x.id === btn.dataset.id);
      if (!h) return;
      if (btn.dataset.act === "approve") {
        const bs = prompt("Biển số cấp cho hồ sơ " + h.maHoSo + ":", genPlate(h.quequan));
        if (bs && bs.trim()) update(h.id, { trangThai: "approved", bienSo: bs.trim(), lyDoTuChoi: "" });
      } else if (btn.dataset.act === "reject") {
        const lydo = prompt("Nhập lý do từ chối:");
        if (lydo && lydo.trim()) update(h.id, { trangThai: "rejected", lyDoTuChoi: lydo.trim() });
      } else if (btn.dataset.act === "cert") {
        openCert(h);
      } else {
        const rows = [["Mã hồ sơ", h.maHoSo], ["Chủ xe", h.hoten], ["CMND/CCCD", h.cmnd], ["Quê quán", h.quequan], ["Điện thoại", h.sodienthoai], ["Email", h.email], ["Loại xe", h.loaiXe], ["Nhãn hiệu", h.nhanHieu], ["Dòng xe", h.dongXe], ["Màu sơn", h.mauXe], ["Dung tích", h.dungTich], ["Số khung", h.soKhung], ["Số máy", h.soMay], ["Ngày nộp", h.ngayNop], ["Biển số", h.bienSo], ["Lý do từ chối", h.lyDoTuChoi]];
        $("detailBody").innerHTML =
          (h.imageBase64 ? `<img src="${h.imageBase64}" alt="Ảnh chủ xe" class="detail-img">` : "") +
          `<dl>${rows.filter((r) => r[1]).map((r) => `<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join("")}</dl>`;
        $("detailDlg").showModal();
      }
    });

    $("search").addEventListener("input", render);
    $("filterStatus").addEventListener("change", render);
    $("closeDlg").addEventListener("click", () => $("detailDlg").close());
    render();
  }
}
