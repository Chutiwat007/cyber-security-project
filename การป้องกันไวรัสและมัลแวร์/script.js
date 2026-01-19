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
// --- Quiz System Logic (20 ข้อ) ---
function checkQuiz() {
    // 1. เฉลยและคำอธิบาย
    const answers = {
        q1: { correct: 'b', explain: "✅ ถูกต้อง! CIA คือ Confidentiality (ความลับ), Integrity (ความถูกต้อง), Availability (ความพร้อมใช้)" },
        q2: { correct: 'c', explain: "✅ ถูกต้อง! รหัสผ่านที่ดีต้องยาว เดายาก และซับซ้อน (ผสมตัวอักษรหลายแบบ)" },
        q3: { correct: 'b', explain: "✅ ถูกต้อง! 2FA เป็นปราการด่านที่ 2 ต่อให้รหัสผ่านหลุด แฮกเกอร์ก็เข้าไม่ได้ถ้าไม่มี OTP หรือ App ยืนยัน" },
        q4: { correct: 'b', explain: "✅ ถูกต้อง! Phishing คือการ 'ตกเหยื่อ' ด้วยอีเมล/เว็บปลอม" },
        q5: { correct: 'c', explain: "✅ ถูกต้อง! HTTPS หมายถึงมีการเข้ารหัสข้อมูลระหว่างเรากับเซิร์ฟเวอร์ (แต่ไม่ได้การันตีว่าเว็บนั้นไม่โกงนะ แค่ดักฟังไม่ได้)" },
        q6: { correct: 'b', explain: "✅ ถูกต้อง! Wi-Fi สาธารณะเสี่ยงต่อการถูกดักข้อมูล (Man-in-the-Middle) ได้ง่ายมาก" },
        q7: { correct: 'a', explain: "✅ ถูกต้อง! Digital Footprint คือร่องรอยที่เราทิ้งไว้ เช่น โพสต์ คอมเมนต์ ประวัติการค้นหา" },
        q8: { correct: 'b', explain: "✅ ถูกต้อง! บัตรประชาชนและตั๋วเดินทางมีข้อมูลส่วนตัวสำคัญที่ใช้สวมรอยได้" },
        q9: { correct: 'c', explain: "✅ ถูกต้อง! Ransomware จะล็อกไฟล์เราเพื่อเรียกค่าไถ่" },
        q10: { correct: 'b', explain: "✅ ถูกต้อง! Double Extortion คือการขู่ 2 ชั้น: 1.จ่ายค่าปลดล็อก 2.จ่ายค่าปิดปาก (ไม่ให้ปล่อยข้อมูลหลุด)" },
        q11: { correct: 'a', explain: "✅ ถูกต้อง! Rootkit ฝังตัวลึกระดับราก (Kernel) เพื่อซ่อน Process ของตัวเอง" },
        q12: { correct: 'b', explain: "✅ ถูกต้อง! Zero Trust คือไม่เชื่อใจใครเลย ต้อง Verify ทุกครั้ง" },
        q13: { correct: 'a', explain: "✅ ถูกต้อง! กฎ 3-2-1: 3 สำเนา, 2 สื่อจัดเก็บ, 1 ที่ต่างถิ่น (หรือ Offline)" },
        q14: { correct: 'b', explain: "✅ ถูกต้อง! อย่าคลิกลิงก์ในอีเมล ให้โทรเช็คกับธนาคารโดยตรงเสมอ" },
        q15: { correct: 'b', explain: "✅ ถูกต้อง! การอัปเดต (Patch) คือการปิดประตูหลังบ้านที่แฮกเกอร์อาจแอบเข้า" },
        q16: { correct: 'b', explain: "✅ ถูกต้อง! Social Engineering คือการหลอกคน (Human Hacking) ไม่ได้แฮกที่ระบบโดยตรง" },
        q17: { correct: 'a', explain: "✅ ถูกต้อง! แอปดูดเงินมักขอสิทธิ์ Accessibility เพื่อกดหน้าจอแทนเรา" },
        q18: { correct: 'b', explain: "✅ ถูกต้อง! VirusTotal เป็นแหล่งรวม Antivirus ทั่วโลกไว้สแกนไฟล์/เว็บฟรี" },
        q19: { correct: 'b', explain: "✅ ถูกต้อง! ต้อง Log out และลบ History/Cookies เพื่อไม่ให้คนมาใช้ต่อเข้าบัญชีเราได้" },
        q20: { correct: 'b', explain: "✅ ถูกต้อง! สติและการตั้งค่า Privacy คือเกราะป้องกันที่ดีที่สุด" }
    };

    let score = 0;
    const total = 20;

    // 2. วนลูปตรวจทีละข้อ
    for (let i = 1; i <= total; i++) {
        const qId = 'q' + i;
        const selected = document.querySelector(`input[name="${qId}"]:checked`);
        const feedback = document.querySelector(`#${qId} .feedback`);
        const options = document.querySelectorAll(`#${qId} .options label`);

        // รีเซ็ตสีเก่า
        options.forEach(opt => opt.className = '');

        if (selected) {
            const val = selected.value;
            if (val === answers[qId].correct) {
                score++;
                selected.parentElement.classList.add('correct');
                feedback.innerHTML = `<i class="fas fa-check-circle"></i> ${answers[qId].explain}`;
                feedback.style.borderColor = "#22c55e"; 
                feedback.style.backgroundColor = "#dcfce7";
                feedback.style.color = "#166534";
            } else {
                selected.parentElement.classList.add('wrong');
                // ไฮไลท์ข้อที่ถูก
                const correctInput = document.querySelector(`input[name="${qId}"][value="${answers[qId].correct}"]`);
                if(correctInput) correctInput.parentElement.classList.add('correct');
                
                feedback.innerHTML = `<i class="fas fa-times-circle"></i> <strong>ผิดครับ!</strong> คำตอบที่ถูกคือข้อ ${answers[qId].correct.toUpperCase()}<br>${answers[qId].explain}`;
                feedback.style.borderColor = "#ef4444"; 
                feedback.style.backgroundColor = "#fee2e2";
                feedback.style.color = "#991b1b";
            }
            feedback.classList.add('show');
        }
    }

    // 3. แสดงผลคะแนน
    const resultBox = document.getElementById('quizResult');
    const scoreText = document.getElementById('scoreText');
    const scoreMsg = document.getElementById('scoreMsg');

    resultBox.classList.remove('hidden');
    scoreText.textContent = `${score}/${total}`;

    // เกณฑ์ผ่านคือ 15/20 (75%)
    if (score >= 15) {
        scoreMsg.innerHTML = "🎉 สุดยอด! คุณเป็นผู้เชี่ยวชาญด้านความปลอดภัยไซเบอร์แล้ว";
        scoreMsg.style.color = "green";
    } else {
        scoreMsg.innerHTML = "😅 ยังไม่ผ่านเกณฑ์ (ต้องได้ 15 คะแนนขึ้นไป) ลองทบทวนเนื้อหาแล้วทำใหม่อีกครั้งนะครับ";
        scoreMsg.style.color = "red";
    }

    // ล็อกปุ่ม
    const btn = document.querySelector('.btn-submit-quiz');
    if(btn) {
        btn.disabled = true;
        btn.textContent = "ตรวจเรียบร้อย";
    }
}
// --- [Lesson Animation] ระบบอนิเมชั่นหน้าบทเรียนอัตโนมัติ ---
document.addEventListener('DOMContentLoaded', () => {
    // เลือกองค์ประกอบในหน้าบทเรียนที่จะให้ขยับ (ย่อหน้า, รูป, หัวข้อ, รายการ, วิดีโอ)
    // หมายเหตุ: เราเจาะจงเฉพาะใน .content-area เพื่อไม่ให้กระทบเมนู
    const lessonItems = document.querySelectorAll('.content-area p, .content-area h2, .content-area h3, .content-area li, .content-area img, .video-wrapper, .quiz-item');

    if (lessonItems.length > 0) {
        // 1. ซ่อนทุกอย่างก่อน
        lessonItems.forEach(item => {
            item.classList.add('lesson-fade-hidden');
        });

        // 2. ฟังก์ชันตรวจสอบการเลื่อนหน้าจอ
        const checkLessonScroll = () => {
            const triggerBottom = window.innerHeight * 0.9; // ให้แสดงเมื่อเลื่อนมาถึง 90% ของจอ

            lessonItems.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                
                if (itemTop < triggerBottom) {
                    item.classList.add('lesson-fade-show');
                }
            });
        };

        // 3. เริ่มทำงาน
        window.addEventListener('scroll', checkLessonScroll);
        checkLessonScroll(); // เรียกครั้งแรกทันที
    }
});