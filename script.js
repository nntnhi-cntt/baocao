

    function openTab(evt, tabName) {
        const tabcontent = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        const tabbuttons = document.getElementsByClassName("tab-button");
        for (let i = 0; i < tabbuttons.length; i++) {
            tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    function calculateTotal() {
        const soMayGV = parseInt(document.getElementById('soMayGV').value) || 0;
        const soMayHS = parseInt(document.getElementById('soMayHS').value) || 0;
        const tongSoMay = soMayGV + soMayHS;
        document.getElementById('tongSoMay').value = tongSoMay;
        saveData();
        updatePreview();
    }

    function saveData() {
        const data = {
            tenGV: document.getElementById('tenGV').value,
            tenTG: document.getElementById('tenTG').value,
            phongMay: document.getElementById('phongMay').value,
            soMayGV: document.getElementById('soMayGV').value,
            soMayHS: document.getElementById('soMayHS').value,
            soMayLoi: document.getElementById('soMayLoi').value,
            noteMayLoi: document.getElementById('noteMayLoi').value, // Thêm trường ghi chú mới
            soMayThieu: document.getElementById('soMayThieu').value,
            tinhTrangNetSupport: document.getElementById('tinhTrangNetSupport').value,
            noteNetsupport: document.getElementById('noteNetsupport').value, // Thêm trường ghi chú mới
            tinhTrangAmThanh: document.getElementById('tinhTrangAmThanh').value,
            noteAmThanh: document.getElementById('noteAmThanh').value, // Thêm trường ghi chú mới
            tinhTrangDieuHoa: document.getElementById('tinhTrangDieuHoa').value,
            noteDieuHoa: document.getElementById('noteDieuHoa').value, // Thêm trường ghi chú mới
            tinhTrangVeSinh: document.getElementById('tinhTrangVeSinh').value,
            noteVeSinh: document.getElementById('noteVeSinh').value // Thêm trường ghi chú mới
        };
        localStorage.setItem('baoCaoData', JSON.stringify(data));
    }

    function loadData() {
        const savedData = localStorage.getItem('baoCaoData');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('tenGV').value = data.tenGV || '';
            document.getElementById('tenTG').value = data.tenTG || '';
            document.getElementById('phongMay').value = data.phongMay || '';
            document.getElementById('soMayGV').value = data.soMayGV || '1';
            document.getElementById('soMayHS').value = data.soMayHS || '';
            document.getElementById('soMayLoi').value = data.soMayLoi || '';
            document.getElementById('noteMayLoi').value = data.noteMayLoi || ''; // Tải ghi chú
            document.getElementById('soMayThieu').value = data.soMayThieu || '';
            document.getElementById('tinhTrangNetSupport').value = data.tinhTrangNetSupport || 'Tốt';
            document.getElementById('noteNetsupport').value = data.noteNetsupport || ''; // Tải ghi chú
            document.getElementById('tinhTrangAmThanh').value = data.tinhTrangAmThanh || 'Tốt';
            document.getElementById('noteAmThanh').value = data.noteAmThanh || ''; // Tải ghi chú
            document.getElementById('tinhTrangDieuHoa').value = data.tinhTrangDieuHoa || 'Tốt';
            document.getElementById('noteDieuHoa').value = data.noteDieuHoa || ''; // Tải ghi chú
            document.getElementById('tinhTrangVeSinh').value = data.tinhTrangVeSinh || 'Sạch';
            document.getElementById('noteVeSinh').value = data.noteVeSinh || ''; // Tải ghi chú

            calculateTotal();
        }
    }

    function updatePreview() {
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

        // Lấy nội dung ghi chú
        const noteMayLoi = document.getElementById('noteMayLoi').value ? ` (${document.getElementById('noteMayLoi').value})` : '';
        const noteNetsupport = document.getElementById('noteNetsupport').value ? ` (${document.getElementById('noteNetsupport').value})` : '';
        const noteAmThanh = document.getElementById('noteAmThanh').value ? ` (${document.getElementById('noteAmThanh').value})` : '';
        const noteDieuHoa = document.getElementById('noteDieuHoa').value ? ` (${document.getElementById('noteDieuHoa').value})` : '';
        const noteVeSinh = document.getElementById('noteVeSinh').value ? ` (${document.getElementById('noteVeSinh').value})` : '';

        const reportText = `BÁO CÁO ĐẦU BUỔI DẠY
- Tên Giáo Viên: ${tenGV}
- Tên Trợ Giảng: ${tenTG}
- Phòng Máy: ${phongMay}
- Tổng số máy: ${tongSoMay} máy (Gồm ${soMayGV} GV + ${soMayHS} HS).
- Tổng số máy bị lỗi: ${soMayLoi} máy${noteMayLoi}.
- Số máy còn thiếu cho HS: ${soMayThieu} máy.
- Tình trạng Netsupport: ${tinhTrangNetSupport}${noteNetsupport}
- Tình trạng Loa, Âm ly: ${tinhTrangAmThanh}${noteAmThanh}
- Tình trạng máy lạnh, máy quạt: ${tinhTrangDieuHoa}${noteDieuHoa}
- Tình trạng vệ sinh PM: ${tinhTrangVeSinh}${noteVeSinh}`;

        document.getElementById('previewBox').value = reportText;
    }

    function generateAndCopyReport() {
        const reportText = document.getElementById('previewBox').value;

        navigator.clipboard.writeText(reportText).then(() => {
            alert('Đã sao chép báo cáo vào clipboard!');
        }).catch(err => {
            console.error('Không thể sao chép văn bản: ', err);
            alert('Không thể sao chép báo cáo. Vui lòng thử lại.');
        });
    }

    document.getElementById('baoCaoForm').addEventListener('input', () => {
        saveData();
        updatePreview();
    });

    document.addEventListener("DOMContentLoaded", function() {
        openTab({ currentTarget: document.querySelector('.tab-button') }, 'BaoCao');
        loadData();
    });
