function populateDayDropdown() {
    const daySelect = document.getElementById('daySelect');
    daySelect.innerHTML = '<option value="">-- Chọn thứ --</option>';
    const days = Object.keys(teachingSchedule);
    days.forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        daySelect.appendChild(option);
    });
    // Re-enable session and class selects if they were disabled
    document.getElementById('sessionSelect').disabled = true;
    document.getElementById('classSelect').disabled = true;
}

function populateSessionDropdown() {
    const daySelect = document.getElementById('daySelect');
    const sessionSelect = document.getElementById('sessionSelect');
    const selectedDay = daySelect.value;
    
    sessionSelect.innerHTML = '<option value="">-- Chọn buổi --</option>';
    sessionSelect.disabled = true;
    document.getElementById('classSelect').disabled = true;

    if (selectedDay) {
        const sessions = Object.keys(teachingSchedule[selectedDay]);
        sessions.forEach(session => {
            const option = document.createElement('option');
            option.value = session;
            option.textContent = session;
            sessionSelect.appendChild(option);
        });
        sessionSelect.disabled = false;
    }
    // Reset other fields on day change
    resetFormFields();
}

function populateClassDropdown() {
    const daySelect = document.getElementById('daySelect');
    const sessionSelect = document.getElementById('sessionSelect');
    const classSelect = document.getElementById('classSelect');
    const selectedDay = daySelect.value;
    const selectedSession = sessionSelect.value;
    
    classSelect.innerHTML = '<option value="">-- Chọn lớp/trường --</option>';
    classSelect.disabled = true;

    if (selectedDay && selectedSession) {
        const classes = teachingSchedule[selectedDay][selectedSession];
        // Group classes by school
        const schools = {};
        classes.forEach(lesson => {
            if (!schools[lesson.truong]) {
                schools[lesson.truong] = [];
            }
            schools[lesson.truong].push(lesson);
        });

        // Create options for each school group
        for (const school in schools) {
            const option = document.createElement('option');
            const classNames = schools[school].map(l => l.lop).join(', ');
            const totalStudents = schools[school].reduce((sum, l) => sum + parseInt(l.soLuongHS), 0);
            option.value = JSON.stringify({ truong: school, classes: schools[school] });
            option.textContent = `Lớp ${classNames}, Trường ${school} (${totalStudents} HS)`;
            classSelect.appendChild(option);
        }
        classSelect.disabled = false;
    }
    // Reset other fields on session change
    resetFormFields();
}

function loadScheduleData() {
    const classSelect = document.getElementById('classSelect');
    const selectedValue = classSelect.value;
    if (!selectedValue) return;

    const data = JSON.parse(selectedValue);
    const firstLesson = data.classes[0];
    const schoolName = data.truong;
    const allClasses = data.classes.map(l => l.lop).join(', ');
    const totalStudents = data.classes.reduce((sum, l) => sum + parseInt(l.soLuongHS), 0);
    const studentBreakdown = data.classes.map(l => `Lớp ${l.lop} (${l.soLuongHS})`).join(', ');

    // Populate "Báo cáo buổi dạy" tab
    document.getElementById('tenGV').value = firstLesson.tenGV;
    document.getElementById('tenTG').value = firstLesson.tenTG;
    document.getElementById('phongMay').value = firstLesson.phongMay;
    document.getElementById('soLuongHS').value = `Tổng số: ${totalStudents} HS. Chi tiết: ${studentBreakdown}`;
    
    // Fetch machine count based on the school's name
    const soMayData = getSoMayByTruong(schoolName);
    if (soMayData) {
        document.getElementById('soMayGV').value = soMayData.soMayGV;
        document.getElementById('soMayHS').value = soMayData.soMayHS;
    } else {
        document.getElementById('soMayGV').value = '1';
        document.getElementById('soMayHS').value = '';
    }
    
    // Populate "Báo cáo chuyên môn" tab
    document.getElementById('tenGVCM').value = firstLesson.tenGV;
    document.getElementById('lopCM').value = allClasses;
    document.getElementById('monCM').value = firstLesson.mon;

    saveData();
    calculateTotal();
}

function resetFormFields() {
    // Reset fields in the 'Bao Cao' tab
    document.getElementById('tenGV').value = '';
    document.getElementById('tenTG').value = '';
    document.getElementById('phongMay').value = '';
    document.getElementById('soMayGV').value = '1';
    document.getElementById('soMayHS').value = '';
    document.getElementById('tongSoMay').value = '';
    document.getElementById('soLuongHS').value = '';
    // Reset fields in the 'Chuyen Mon' tab
    document.getElementById('tenGVCM').value = '';
    document.getElementById('lopCM').value = '';
    document.getElementById('monCM').value = 'GS6 Lv1';
    document.getElementById('noiDungCM').value = '';
    document.getElementById('soTietDuKienCM').value = '';
    document.getElementById('soTietDaDayCM').value = '';
    
    calculateTotal();
}

function calculateTotal() {
    const soMayGV = parseInt(document.getElementById('soMayGV').value) || 0;
    const soMayHS = parseInt(document.getElementById('soMayHS').value) || 0;
    const tongSoMay = soMayGV + soMayHS;
    document.getElementById('tongSoMay').value = tongSoMay;
    updatePreviews();
}

function saveData() {
    const baoCaoData = {
        tenGV: document.getElementById('tenGV').value,
        tenTG: document.getElementById('tenTG').value,
        phongMay: document.getElementById('phongMay').value,
        soMayGV: document.getElementById('soMayGV').value,
        soMayHS: document.getElementById('soMayHS').value,
        tongSoMay: document.getElementById('tongSoMay').value,
        soMayLoi: document.getElementById('soMayLoi').value,
        noteMayLoi: document.getElementById('noteMayLoi').value,
        soMayThieu: document.getElementById('soMayThieu').value,
        tinhTrangNetSupport: document.getElementById('tinhTrangNetSupport').value,
        noteNetsupport: document.getElementById('noteNetsupport').value,
        tinhTrangAmThanh: document.getElementById('tinhTrangAmThanh').value,
        noteAmThanh: document.getElementById('noteAmThanh').value,
        tinhTrangDieuHoa: document.getElementById('tinhTrangDieuHoa').value,
        noteDieuHoa: document.getElementById('noteDieuHoa').value,
        tinhTrangVeSinh: document.getElementById('tinhTrangVeSinh').value,
        noteVeSinh: document.getElementById('noteVeSinh').value,
        soLuongHS: document.getElementById('soLuongHS').value,
        tyLeTaiLieu: document.getElementById('tyLeTaiLieu').value,
        thietBiDien: document.getElementById('thietBiDien').value,
        sapXepGhe: document.getElementById('sapXepGhe').value,
        veSinhPhongMay: document.getElementById('veSinhPhongMay').value,
        tuanThuNoiQuy: document.getElementById('tuanThuNoiQuy').value,
        danhSachViPham: document.getElementById('danhSachViPham').value
    };
    localStorage.setItem('baoCaoData', JSON.stringify(baoCaoData));

    const chuyenMonData = {
        tenGVCM: document.getElementById('tenGVCM').value,
        lopCM: document.getElementById('lopCM').value,
        monCM: document.getElementById('monCM').value,
        taiLieuCM: document.getElementById('taiLieuCM').value,
        noiDungCM: document.getElementById('noiDungCM').value,
        soTietDuKienCM: document.getElementById('soTietDuKienCM').value,
        soTietDaDayCM: document.getElementById('soTietDaDayCM').value,
        soLanHoanThanhCM: document.getElementById('soLanHoanThanhCM').value,
        gmt1FlashCM: document.getElementById('gmt1FlashCM').value,
        gmt2FlashCM: document.getElementById('gmt2FlashCM').value,
        ot1FlashCM: document.getElementById('ot1FlashCM').value,
        ot2FlashCM: document.getElementById('ot2FlashCM').value,
        ot3FlashCM: document.getElementById('ot3FlashCM').value,
        gmt1GmetrixCM: document.getElementById('gmt1GmetrixCM').value,
        gmt2GmetrixCM: document.getElementById('gmt2GmetrixCM').value
    };
    localStorage.setItem('chuyenMonData', JSON.stringify(chuyenMonData));
}

function loadData() {
    const savedBaoCaoData = localStorage.getItem('baoCaoData');
    const savedChuyenMonData = localStorage.getItem('chuyenMonData');

    if (savedBaoCaoData) {
        const data = JSON.parse(savedBaoCaoData);
        document.getElementById('tenGV').value = data.tenGV || '';
        document.getElementById('tenTG').value = data.tenTG || '';
        document.getElementById('phongMay').value = data.phongMay || '';
        document.getElementById('soMayGV').value = data.soMayGV || '1';
        document.getElementById('soMayHS').value = data.soMayHS || '';
        document.getElementById('tongSoMay').value = data.tongSoMay || '';
        document.getElementById('soMayLoi').value = data.soMayLoi || '';
        document.getElementById('noteMayLoi').value = data.noteMayLoi || '';
        document.getElementById('soMayThieu').value = data.soMayThieu || '';
        document.getElementById('tinhTrangNetSupport').value = data.tinhTrangNetSupport || 'Tốt';
        document.getElementById('noteNetsupport').value = data.noteNetsupport || '';
        document.getElementById('tinhTrangAmThanh').value = data.tinhTrangAmThanh || 'Tốt';
        document.getElementById('noteAmThanh').value = data.noteAmThanh || '';
        document.getElementById('tinhTrangDieuHoa').value = data.tinhTrangDieuHoa || 'Tốt';
        document.getElementById('noteDieuHoa').value = data.noteDieuHoa || '';
        document.getElementById('tinhTrangVeSinh').value = data.tinhTrangVeSinh || 'Sạch';
        document.getElementById('noteVeSinh').value = data.noteVeSinh || '';
        document.getElementById('soLuongHS').value = data.soLuongHS || '';
        document.getElementById('tyLeTaiLieu').value = data.tyLeTaiLieu || '';
        document.getElementById('thietBiDien').value = data.thietBiDien || 'Rồi';
        document.getElementById('sapXepGhe').value = data.sapXepGhe || 'Rồi';
        document.getElementById('veSinhPhongMay').value = data.veSinhPhongMay || 'Rồi';
        document.getElementById('tuanThuNoiQuy').value = data.tuanThuNoiQuy || 'Tốt';
        document.getElementById('danhSachViPham').value = data.danhSachViPham || '';
        calculateTotal();
        updatePreviews(); // Call updatePreviews after loading data
    }

    if (savedChuyenMonData) {
        const data = JSON.parse(savedChuyenMonData);
        document.getElementById('tenGVCM').value = data.tenGVCM || '';
        document.getElementById('lopCM').value = data.lopCM || '';
        document.getElementById('monCM').value = data.monCM || 'GS6 Lv1';
        document.getElementById('taiLieuCM').value = data.taiLieuCM || 'Tin Học Đại Dương';
        document.getElementById('noiDungCM').value = data.noiDungCM || '';
        document.getElementById('soTietDuKienCM').value = data.soTietDuKienCM || '';
        document.getElementById('soTietDaDayCM').value = data.soTietDaDayCM || '';
        document.getElementById('soLanHoanThanhCM').value = data.soLanHoanThanhCM || '';
        document.getElementById('gmt1FlashCM').value = data.gmt1FlashCM || '';
        document.getElementById('gmt2FlashCM').value = data.gmt2FlashCM || '';
        document.getElementById('ot1FlashCM').value = data.ot1FlashCM || '';
        document.getElementById('ot2FlashCM').value = data.ot2FlashCM || '';
        document.getElementById('ot3FlashCM').value = data.ot3FlashCM || '';
        document.getElementById('gmt1GmetrixCM').value = data.gmt1GmetrixCM || '';
        document.getElementById('gmt2GmetrixCM').value = data.gmt2GmetrixCM || '';
        updatePreviewChuyenMon(); // Call updatePreviewChuyenMon after loading data
    }
}

function updatePreviews() {
    updatePreviewBaoCao();
    updatePreviewCuoiBuoi();
}

function updatePreviewBaoCao() {
    const tenGV = document.getElementById('tenGV').value;
    const tenTG = document.getElementById('tenTG').value;
    const phongMay = document.getElementById('phongMay').value;
    const soMayGV = document.getElementById('soMayGV').value;
    const soMayHS = document.getElementById('soMayHS').value;
    const tongSoMay = document.getElementById('tongSoMay').value;
    const soMayLoi = document.getElementById('soMayLoi').value;
    const soMayThieu = document.getElementById('soMayThieu').value;
    const tinhTrangNetSupport = document.getElementById('tinhTrangNetSupport').value;
    const tinhTrangAmThanh = document.getElementById('tinhTrangAmThanh').value;
    const tinhTrangDieuHoa = document.getElementById('tinhTrangDieuHoa').value;
    const tinhTrangVeSinh = document.getElementById('tinhTrangVeSinh').value;

    const noteMayLoi = document.getElementById('noteMayLoi').value ? ` (${document.getElementById('noteMayLoi').value})` : '';
    const noteNetsupport = document.getElementById('noteNetsupport').value ? ` (${document.getElementById('noteNetsupport').value})` : '';
    const noteAmThanh = document.getElementById('noteAmThanh').value ? ` (${document.getElementById('noteAmThanh').value})` : '';
    const noteDieuHoa = document.getElementById('noteDieuHoa').value ? ` (${document.getElementById('noteDieuHoa').value})` : '';
    const noteVeSinh = document.getElementById('noteVeSinh').value ? ` (${document.getElementById('noteVeSinh').value})` : '';

    const reportText = `BÁO CÁO ĐẦU BUỔI DẠY
- Tên Giáo Viên: ${tenGV}
- Tên Trợ Giảng: ${tenTG}
- Phòng Máy: ${phongMay}
- Tổng số máy: ${tongSoMay} máy (Gồm ${soMayGV} GV + ${soMayHS} HS)
- Tổng số máy bị lỗi: ${soMayLoi} máy${noteMayLoi}
- Số máy còn thiếu cho HS: ${soMayThieu} máy
- Tình trạng Netsupport: ${tinhTrangNetSupport}${noteNetsupport}
- Tình trạng Loa, Âm ly: ${tinhTrangAmThanh}${noteAmThanh}
- Tình trạng máy lạnh, máy quạt: ${tinhTrangDieuHoa}${noteDieuHoa}
- Tình trạng vệ sinh PM: ${tinhTrangVeSinh}${noteVeSinh}`;

    document.getElementById('previewBoxBaoCao').value = reportText;
}

function updatePreviewCuoiBuoi() {
    const tenGV = document.getElementById('tenGV').value;
    const tenTG = document.getElementById('tenTG').value;
    const phongMay = document.getElementById('phongMay').value;
    const soMayGV = document.getElementById('soMayGV').value;
    const soMayHS = document.getElementById('soMayHS').value;
    const tongSoMay = document.getElementById('tongSoMay').value;
    const soMayLoi = document.getElementById('soMayLoi').value;
    const soMayThieu = document.getElementById('soMayThieu').value;
    const tinhTrangNetSupport = document.getElementById('tinhTrangNetSupport').value;
    const tinhTrangAmThanh = document.getElementById('tinhTrangAmThanh').value;
    const tinhTrangDieuHoa = document.getElementById('tinhTrangDieuHoa').value;
    const tinhTrangVeSinh = document.getElementById('tinhTrangVeSinh').value;

    const noteMayLoi = document.getElementById('noteMayLoi').value ? ` (${document.getElementById('noteMayLoi').value})` : '';
    const noteNetsupport = document.getElementById('noteNetsupport').value ? ` (${document.getElementById('noteNetsupport').value})` : '';
    const noteAmThanh = document.getElementById('noteAmThanh').value ? ` (${document.getElementById('noteAmThanh').value})` : '';
    const noteDieuHoa = document.getElementById('noteDieuHoa').value ? ` (${document.getElementById('noteDieuHoa').value})` : '';
    const noteVeSinh = document.getElementById('noteVeSinh').value ? ` (${document.getElementById('noteVeSinh').value})` : '';

    const soLuongHS = document.getElementById('soLuongHS').value;
    const tyLeTaiLieu = document.getElementById('tyLeTaiLieu').value;
    const thietBiDien = document.getElementById('thietBiDien').value;
    const sapXepGhe = document.getElementById('sapXepGhe').value;
    const veSinhPhongMay = document.getElementById('veSinhPhongMay').value;
    const tuanThuNoiQuy = document.getElementById('tuanThuNoiQuy').value;
    const danhSachViPham = document.getElementById('danhSachViPham').value;

    const reportText = `BÁO CÁO CUỐI BUỔI DẠY
- Tên Giáo Viên: ${tenGV}
- Tên Trợ Giảng: ${tenTG}
- Phòng Máy: ${phongMay}
- Tổng số máy: ${tongSoMay} máy (Gồm ${soMayGV} GV + ${soMayHS} HS)
- Số lượng HS: ${soLuongHS}
- Tỷ lệ học sinh có tài liệu: ${tyLeTaiLieu}%
- Tổng số máy bị lỗi: ${soMayLoi} máy${noteMayLoi}
- Số máy còn thiếu cho HS: ${soMayThieu} máy
- Tình trạng Netsupport: ${tinhTrangNetSupport}${noteNetsupport}
- Tình trạng Loa, Âm ly: ${tinhTrangAmThanh}${noteAmThanh}
- Tình trạng máy lạnh, máy quạt: ${tinhTrangDieuHoa}${noteDieuHoa}
- Đã tắt các thiết bị điện chưa: ${thietBiDien}
- HS sắp xếp ghế ngồi gọn gàng: ${sapXepGhe}
- HS vệ sinh phòng máy: ${veSinhPhongMay}
- Tuân thủ nội quy của HS: ${tuanThuNoiQuy}
- Danh sách vi phạm: ${danhSachViPham}`;

    document.getElementById('previewBoxCuoiBuoi').value = reportText;
}

function updatePreviewChuyenMon() {
    const tenGVCM = document.getElementById('tenGVCM').value;
    const lopCM = document.getElementById('lopCM').value;
    const monCM = document.getElementById('monCM').value;
    const taiLieuCM = document.getElementById('taiLieuCM').value;
    const noiDungCM = document.getElementById('noiDungCM').value;
    const soTietDuKienCM = document.getElementById('soTietDuKienCM').value;
    const soTietDaDayCM = document.getElementById('soTietDaDayCM').value;
    const soLanHoanThanhCM = document.getElementById('soLanHoanThanhCM').value;
    const gmt1FlashCM = document.getElementById('gmt1FlashCM').value;
    const gmt2FlashCM = document.getElementById('gmt2FlashCM').value;
    const ot1FlashCM = document.getElementById('ot1FlashCM').value;
    const ot2FlashCM = document.getElementById('ot2FlashCM').value;
    const ot3FlashCM = document.getElementById('ot3FlashCM').value;
    const gmt1GmetrixCM = document.getElementById('gmt1GmetrixCM').value;
    const gmt2GmetrixCM = document.getElementById('gmt2GmetrixCM').value;

    const reportText = `BÁO CÁO CHUYÊN MÔN
- Tên Giáo Viên: ${tenGVCM}
- Lớp: ${lopCM}
- Môn: ${monCM}
- Tài liệu dạy: ${taiLieuCM}
- Nội dung dạy: ${noiDungCM}
- Số tiết dự kiến: ${soTietDuKienCM}
- Số tiết đã dạy: ${soTietDaDayCM}
- Số lần hoàn thành bài tổng hợp: ${soLanHoanThanhCM}
- Tỷ lệ kết quả Flash: GMT 1 (${gmt1FlashCM}%), GMT 2 (${gmt2FlashCM}%)
- Tỷ lệ kết quả Flash OT: OT 1 (${ot1FlashCM}%), OT 2 (${ot2FlashCM}%), OT 3 (${ot3FlashCM}%)
- Tỷ lệ kết quả điểm Gmetrix: GMT 1 (${gmt1GmetrixCM}%), GMT 2 (${gmt2GmetrixCM}%)`;

    document.getElementById('previewBoxChuyenMon').value = reportText;
}

function generateAndCopyReport(reportType) {
    let reportText;
    if (reportType === 'BaoCaoDauBuoi') {
        reportText = document.getElementById('previewBoxBaoCao').value;
    } else if (reportType === 'BaoCaoCuoiBuoi') {
        reportText = document.getElementById('previewBoxCuoiBuoi').value;
    } else if (reportType === 'ChuyenMon') {
        reportText = document.getElementById('previewBoxChuyenMon').value;
    } else {
        return;
    }

    navigator.clipboard.writeText(reportText).then(() => {
        alert('Đã sao chép báo cáo vào clipboard!');
    }).catch(err => {
        console.error('Không thể sao chép văn bản: ', err);
        alert('Không thể sao chép báo cáo. Vui lòng thử lại.');
    });
}

document.getElementById('baoCaoForm').addEventListener('input', () => {
    saveData();
    updatePreviews();
});

document.getElementById('chuyenMonForm').addEventListener('input', () => {
    saveData();
    updatePreviewChuyenMon();
});

document.addEventListener("DOMContentLoaded", function() {
    loadData();
    populateDayDropdown();
});