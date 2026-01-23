document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu ---
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- 2. Active TOC ---
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        if(progressBar) progressBar.style.width = scrolled + '%';
        
        const sections = document.querySelectorAll('section.chapter');
        const tocLinks = document.querySelectorAll('#toc-list a');
        let currentSection = '';
        sections.forEach(section => {
            if (pageYOffset >= (section.offsetTop - 150)) currentSection = section.getAttribute('id');
        });
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) link.classList.add('active');
        });
    });

   // --- LAB 1: Malware Scanner Logic ---
    const startScanBtn = document.getElementById('startScanBtn');
    if(startScanBtn) {
        startScanBtn.addEventListener('click', () => {
            const selectedFile = document.querySelector('input[name="file"]:checked');
            if(!selectedFile) return;

            const scanBar = document.getElementById('scanBar');
            const result = document.getElementById('scanResult');
            const status = document.getElementById('avStatus');
            
            result.className = 'scan-result hidden';
            scanBar.style.width = '0%';
            startScanBtn.disabled = true;
            status.textContent = 'กำลังสแกน...';
            status.style.color = '#fbbf24';

            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                scanBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    startScanBtn.disabled = false;
                    status.textContent = 'สแกนเสร็จสิ้น';
                    status.style.color = 'white';
                    result.classList.remove('hidden');

                    const val = selectedFile.value;
                    
                    if (val === 'clean') {
                        result.textContent = "✅ ปลอดภัย: ไม่พบภัยคุกคามในไฟล์นี้";
                        result.classList.add('clean');
                    } else if (val === 'trojan') {
                        result.innerHTML = "🚨 ตรวจพบ: Trojan.Win32.Agent<br>การดำเนินการ: กักกันไฟล์เรียบร้อยแล้ว";
                        result.classList.add('infected');
                    } else if (val === 'ransom') {
                        result.innerHTML = "☣️ อันตรายสูง: Ransomware.WannaCry.js<br>การดำเนินการ: บล็อกและลบไฟล์ทันที";
                        result.classList.add('infected');
                    } else if (val === 'rootkit') {
                        result.innerHTML = "👻 ตรวจพบ: Rootkit.Kernel.Hook<br>การดำเนินการ: จำเป็นต้องรีสตาร์ทเครื่องเพื่อกำจัด";
                        result.classList.add('infected');
                    }
                }
            }, 50);
        });
    }
}); 
// ▲▲ จบส่วน DOMContentLoaded ตรงนี้ (อย่าลืมวงเล็บปิดนี้!) ▲▲


// --- LAB 2: Ransomware Simulator Logic (อยู่นอกสุด ทำงานได้แน่นอน) ---

// ฟังก์ชันเริ่มการโจมตี
function triggerRansomware() {
    const ransomScreen = document.getElementById('ransomScreen');
    const fileGrid = document.getElementById('fileGrid');
    const files = fileGrid.querySelectorAll('.file-item:not(.virus-file)'); 
    const status = document.getElementById('backupStatus');

    // 1. เปลี่ยนไอคอนไฟล์
    files.forEach(file => {
        const icon = file.querySelector('i');
        const brTag = file.querySelector('br');
        
        file.classList.add('encrypted');
        if(icon) icon.className = 'fas fa-lock file-icon'; 
        if(brTag && brTag.nextSibling) {
            brTag.nextSibling.textContent = "ENCRYPTED.lock";
        }
    });

    // 2. แสดงหน้าจอเรียกค่าไถ่
    setTimeout(() => {
        if(ransomScreen) ransomScreen.classList.remove('hidden');
        if(status) {
            status.textContent = "Status: ⚠️ SYSTEM COMPROMISED";
            status.style.color = "red";
        }
    }, 800);
}

// ฟังก์ชันกู้คืนไฟล์
function restoreFiles() {
    const ransomScreen = document.getElementById('ransomScreen');
    const fileGrid = document.getElementById('fileGrid');
    const files = fileGrid.querySelectorAll('.file-item:not(.virus-file)');
    const status = document.getElementById('backupStatus');
    const btnRestore = document.querySelector('.btn-restore');

    if(btnRestore) btnRestore.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังกู้คืนข้อมูล...';

    setTimeout(() => {
        // 1. ปิดหน้าจอ
        if(ransomScreen) ransomScreen.classList.add('hidden');

        // 2. คืนค่าไฟล์
        const originalNames = ["Family_Photo.jpg", "Thesis_Final.docx", "Salary_2025.xlsx"];
        const originalIcons = ["fa-file-image", "fa-file-word", "fa-file-excel"];

        files.forEach((file, index) => {
            const icon = file.querySelector('i');
            const brTag = file.querySelector('br');

            file.classList.remove('encrypted');
            if(icon) icon.className = `fas ${originalIcons[index]} file-icon`;
            if(brTag && brTag.nextSibling) {
                brTag.nextSibling.textContent = originalNames[index];
            }
        });

        // 3. แจ้งเตือนสำเร็จ
        if(status) {
            status.textContent = "Status: ✅ Restored from Backup";
            status.style.color = "green";
        }
        alert("🎉 ยอดเยี่ยม! คุณรอดมาได้เพราะมี Backup ข้อมูลเอาไว้");
        
        if(btnRestore) btnRestore.textContent = "💾 กู้คืนจาก Backup (Offline)";
    }, 2000);
}
// --- [Quiz System] ระบบตรวจข้อสอบ 10 ข้อ (Chapter 5 : Card Style) ---
function checkQuiz() {
    // เฉลยคำตอบ
    const answers = {
        q1: 'b', q2: 'a', q3: 'c', q4: 'd', q5: 'b',
        q6: 'c', q7: 'b', q8: 'b', q9: 'd', q10: 'a'
    };

    let score = 0;
    const total = 10;
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');

    // 1. รีเซ็ตสีเก่าออกก่อน (เผื่อกดตรวจซ้ำ)
    const allLabels = form.querySelectorAll('label');
    allLabels.forEach(label => {
        label.classList.remove('correct-answer', 'wrong-answer');
        // ลบไอคอนเก่าออก (ถ้ามี)
        const icon = label.querySelector('i');
        if(icon) icon.remove();
    });

    // 2. เริ่มตรวจคำตอบ
    for (let key in answers) {
        if (form.elements[key]) {
            const userRadios = form.elements[key];
            
            for (let i = 0; i < userRadios.length; i++) {
                const radio = userRadios[i];
                const label = radio.parentElement; // จับตัวกล่อง Label

                if (radio.checked) {
                    if (radio.value === answers[key]) {
                        // ตอบถูก: บวกคะแนน + ถมสีเขียว + ติ๊กถูก
                        score++;
                        label.classList.add('correct-answer');
                        label.innerHTML += ' <i class="fas fa-check-circle" style="margin-left:auto; color:#15803d;"></i>';
                    } else {
                        // ตอบผิด: ถมสีแดง + กากบาท
                        label.classList.add('wrong-answer');
                        label.innerHTML += ' <i class="fas fa-times-circle" style="margin-left:auto; color:#b91c1c;"></i>';
                    }
                }
            }
        }
    }

    // 3. แสดงผลคะแนน
    resultDiv.style.display = 'block';
    
    if (score >= 8) {
        resultDiv.innerHTML = `<i class="fas fa-trophy" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ยอดเยี่ยม!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(คุณคือผู้เชี่ยวชาญด้านการป้องกันมัลแวร์)</span>`;
        resultDiv.style.background = "#dcfce7"; // พื้นเขียวอ่อน
        resultDiv.style.color = "#166534";
        resultDiv.style.border = "2px solid #22c55e";
    } else if (score >= 5) {
        resultDiv.innerHTML = `<i class="fas fa-thumbs-up" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ทำได้ดี!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(ทบทวนอีกนิด ปลอดภัยแน่นอน)</span>`;
        resultDiv.style.background = "#fffbeb"; // พื้นเหลืองอ่อน
        resultDiv.style.color = "#92400e";
        resultDiv.style.border = "2px solid #f59e0b";
    } else {
        resultDiv.innerHTML = `<i class="fas fa-book-reader" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>พยายามอีกนิด!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(ลองอ่านทบทวนเนื้อหาบทนี้ใหม่นะครับ)</span>`;
        resultDiv.style.background = "#fef2f2"; // พื้นแดงอ่อน
        resultDiv.style.color = "#991b1b";
        resultDiv.style.border = "2px solid #ef4444";
    }

    // เลื่อนหน้าจอลงมาที่ผลคะแนน
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // ล็อกปุ่ม
    const btn = document.querySelector('.btn-submit-quiz');
    if(btn) {
        btn.textContent = "ตรวจเรียบร้อยแล้ว";
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";
    }
}