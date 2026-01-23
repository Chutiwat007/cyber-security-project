document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if(hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- 2. LAB 1: Password Strength Checker ---
    const checkInput = document.getElementById('checkInput');
    const toggleCheck = document.getElementById('toggleCheck');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const crackTime = document.getElementById('crackTime');
    const entropyVal = document.getElementById('entropyVal');

    if (checkInput) {
        toggleCheck.addEventListener('click', () => {
            const type = checkInput.getAttribute('type') === 'password' ? 'text' : 'password';
            checkInput.setAttribute('type', type);
            toggleCheck.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        checkInput.addEventListener('input', () => {
            const result = calculateStrength(checkInput.value);
            strengthBar.style.width = result.score + '%';
            strengthBar.style.backgroundColor = result.color;
            strengthText.textContent = result.label;
            crackTime.textContent = result.time;
            if(entropyVal) entropyVal.textContent = Math.floor(result.entropy) + ' bits';
        });
    }

    function calculateStrength(password) {
        if (!password) return { score: 0, color: '#334155', label: '---', time: '---', entropy: 0 };
        
        let poolSize = 0;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

        // สูตรคำนวณ Entropy: L * log2(R)
        const entropy = password.length * Math.log2(poolSize || 1);
        
        let score = 0, color = '#ef4444', label = 'อ่อนแอ', time = 'ทันที';

        if (entropy > 35) { score = 40; color = '#facc15'; label = 'พอใช้'; time = 'นาที/ชั่วโมง'; }
        if (entropy > 50) { score = 60; color = '#f59e0b'; label = 'ปานกลาง'; time = 'หลายวัน'; }
        if (entropy > 70) { score = 80; color = '#10b981'; label = 'แข็งแกร่ง'; time = 'หลายปี'; }
        if (entropy > 90) { score = 100; color = '#3b82f6'; label = 'สุดยอด'; time = 'ศตวรรษ'; }

        return { score, color, label, time, entropy };
    }

    // --- 3. LAB 2: Password Generator ---
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        const genOutput = document.getElementById('genOutput');
        const lengthRange = document.getElementById('lengthRange');
        const lengthVal = document.getElementById('lengthVal');
        const copyBtn = document.getElementById('copyBtn');

        lengthRange.addEventListener('input', () => { lengthVal.textContent = lengthRange.value; });

        generateBtn.addEventListener('click', () => {
            const length = lengthRange.value;
            const hasUpper = document.getElementById('chkUpper').checked;
            const hasLower = document.getElementById('chkLower').checked;
            const hasNumber = document.getElementById('chkNumber').checked;
            const hasSymbol = document.getElementById('chkSymbol').checked;

            const chars = {
                upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                lower: "abcdefghijklmnopqrstuvwxyz",
                number: "0123456789",
                symbol: "!@#$%^&*()_+~`|}{[]:;?><,./-="
            };

            let charPool = "";
            if (hasUpper) charPool += chars.upper;
            if (hasLower) charPool += chars.lower;
            if (hasNumber) charPool += chars.number;
            if (hasSymbol) charPool += chars.symbol;

            if (!charPool) return alert("กรุณาเลือกตัวอักษรอย่างน้อย 1 ประเภท");

            let password = "";
            // ใช้ Crypto API เพื่อความปลอดภัยสูงสุด (Random จริงๆ)
            const randomValues = new Uint32Array(length);
            window.crypto.getRandomValues(randomValues);
            
            for (let i = 0; i < length; i++) {
                password += charPool[randomValues[i] % charPool.length];
            }
            genOutput.textContent = password;
            genOutput.style.color = "#10b981";
        });

        copyBtn.addEventListener('click', () => {
            if(genOutput.textContent === "Click Generate") return;
            navigator.clipboard.writeText(genOutput.textContent);
            alert("คัดลอกรหัสผ่านแล้ว!");
        });
    }

    // --- 4. LAB 3: TOTP Simulator ---
    const totpDisplay = document.getElementById('totpDisplay');
    const totpBar = document.getElementById('totpBar');
    const secLeft = document.getElementById('secLeft');

    if (totpDisplay) {
        let timeLeft = 30;
        function generateOTP() {
            const num = Math.floor(100000 + Math.random() * 900000);
            return num.toString().replace(/(\d{3})(\d{3})/, '$1 $2');
        }
        function updateTimer() {
            const percentage = (timeLeft / 30) * 100;
            if(totpBar) {
                totpBar.style.width = percentage + '%';
                if (timeLeft <= 5) totpBar.style.backgroundColor = '#ef4444';
                else totpBar.style.backgroundColor = '#10b981';
            }
            if(secLeft) secLeft.textContent = timeLeft;

            if (timeLeft === 0) {
                timeLeft = 30;
                totpDisplay.textContent = generateOTP();
                totpDisplay.style.color = '#fff';
                setTimeout(() => { totpDisplay.style.color = '#10b981'; }, 200);
            } else {
                timeLeft--;
            }
        }
        totpDisplay.textContent = generateOTP();
        setInterval(updateTimer, 1000);
    }

    // --- 5. Active TOC ---
    window.addEventListener('scroll', () => {
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
});
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
// --- [Quiz System] ระบบตรวจข้อสอบ 10 ข้อ (Chapter 2 Theme) ---
function checkQuizResult() {
    // เฉลยคำตอบ
    const answers = {
        q1: 'c',  // Length is King
        q2: 'b',  // Password Reuse -> Credential Stuffing
        q3: 'c',  // Salting -> Prevent Rainbow Table
        q4: 'c',  // NIST -> No Expiration
        q5: 'c',  // Zero-Knowledge -> No Key
        q6: 'b',  // TOTP -> Time based
        q7: 'c',  // FIDO2 -> Anti-Phishing
        q8: 'c',  // Biometrics -> Cannot change
        q9: 'c',  // Backup Codes -> Offline
        q10: 'b'  // Rainbow Table -> Pre-computed
    };

    let score = 0;
    const total = 10;
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');

    // รีเซ็ตสีเก่า (ถ้ามี)
    const allLabels = form.querySelectorAll('label');
    allLabels.forEach(label => {
        label.classList.remove('correct-answer', 'wrong-answer');
        const icon = label.querySelector('i');
        if(icon) icon.remove();
    });

    // เริ่มตรวจ
    for (let key in answers) {
        if(form.elements[key]) {
            const userRadios = form.elements[key];
            
            for (let i = 0; i < userRadios.length; i++) {
                const radio = userRadios[i];
                const label = radio.parentElement;

                if (radio.checked) {
                    if (radio.value === answers[key]) {
                        // ถูก
                        score++;
                        label.classList.add('correct-answer');
                        label.innerHTML += ' <i class="fas fa-check-circle" style="margin-left:auto;"></i>';
                    } else {
                        // ผิด
                        label.classList.add('wrong-answer');
                        label.innerHTML += ' <i class="fas fa-times-circle" style="margin-left:auto;"></i>';
                    }
                }
            }
        }
    }

    // แสดงผลคะแนน (Theme สีเขียว Emerald)
    resultDiv.style.display = 'block';
    
    if (score >= 8) {
        resultDiv.innerHTML = `<i class="fas fa-shield-alt" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ยอดเยี่ยม!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(บัญชีของคุณปลอดภัยหายห่วงแน่นอน)</span>`;
        resultDiv.style.background = "#ecfdf5";
        resultDiv.style.color = "#047857";
        resultDiv.style.border = "2px solid #10b981";
    } else if (score >= 5) {
        resultDiv.innerHTML = `<i class="fas fa-user-shield" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ทำได้ดี!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(ทบทวนเรื่อง 2FA อีกนิดจะสมบูรณ์แบบครับ)</span>`;
        resultDiv.style.background = "#fffbeb";
        resultDiv.style.color = "#b45309";
        resultDiv.style.border = "2px solid #f59e0b";
    } else {
        resultDiv.innerHTML = `<i class="fas fa-lock-open" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ต้องระวัง!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(แนะนำให้อ่านบทที่ 2 ทบทวนเพื่อความปลอดภัยครับ)</span>`;
        resultDiv.style.background = "#fef2f2";
        resultDiv.style.color = "#b91c1c";
        resultDiv.style.border = "2px solid #ef4444";
    }

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