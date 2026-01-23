document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 2. Active TOC
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

  // --- LAB 1: HTTPS Simulator Logic (เวอร์ชันภาษาไทย) ---
    const sendDataBtn = document.getElementById('sendDataBtn');
    if(sendDataBtn) {
        sendDataBtn.addEventListener('click', () => {
            // ถ้าไม่พิมอะไรมา ให้ใช้คำว่า "รหัสลับ" แทน SECRET
            const input = document.getElementById('dataInput').value || "รหัสลับ";
            const isHttps = document.querySelector('input[name="proto"]:checked').value === 'https';
            const packet = document.getElementById('dataPacket');
            const hackerScreen = document.getElementById('hackerView');

            // 1. RESET: เตรียมเริ่มใหม่
            packet.style.transition = 'none'; 
            packet.style.left = '10%';        
            packet.style.opacity = '1';
            packet.className = 'packet';      
            
            // [แปลไทย] รีเซ็ตหน้าจอ Hacker เป็น "กำลังดักจับ..."
            hackerScreen.textContent = "กำลังดักจับ...";
            hackerScreen.style.color = "#0f0"; // สีเขียว

            void packet.offsetWidth; // Force Reflow

            // 2. SET CONTENT: ตั้งค่าข้อความในกล่องที่วิ่ง
            if(isHttps) {
                packet.textContent = "🔒 #&%*$@"; // ข้อความที่ถูกเข้ารหัส
                packet.classList.add('encrypted');
            } else {
                packet.textContent = input; // ข้อความปกติ
            }

            // 3. START ANIMATION: เริ่มวิ่ง
            packet.style.transition = 'left 1.5s linear, opacity 0.5s'; 
            packet.style.left = '50%';

            // 4. HACKER INTERCEPT: เมื่อวิ่งถึงโจร
            setTimeout(() => {
                if(isHttps) {
                    // [แปลไทย] กรณีมี HTTPS -> โจรเซ็ง
                    hackerScreen.textContent = "ล้มเหลว: อ่านไม่ออก (ติดรหัส)";
                    hackerScreen.style.color = "#ef4444"; // สีแดง
                } else {
                    // [แปลไทย] กรณีไม่มี HTTPS -> โจรยิ้ม
                    hackerScreen.textContent = "เสร็จโจร: " + input;
                    hackerScreen.style.color = "#facc15"; // สีเหลือง
                }
                
                // วิ่งต่อไป Server
                packet.style.left = '90%';
            }, 1500);

            // 5. FINISH: จบการทำงาน
            setTimeout(() => {
                packet.style.opacity = '0';
            }, 3000);
        });
    }

    // --- LAB 2: Profile Inspector Logic ---
    const checkProfileBtn = document.getElementById('checkProfileBtn');
    if(checkProfileBtn) {
        checkProfileBtn.addEventListener('click', () => {
            const chk1 = document.getElementById('c1').checked;
            const chk2 = document.getElementById('c2').checked;
            const chk3 = document.getElementById('c3').checked;
            const chk4 = document.getElementById('c4').checked;
            const result = document.getElementById('profileResult');

            result.classList.remove('hidden', 'correct', 'wrong');

            if (chk1 && chk2 && chk3 && chk4) {
                result.textContent = "สุดยอด! 🎉 คุณตาไวมาก บัญชีนี้มีครบทุกสัญญาณอันตราย: เพื่อนน้อย, เพิ่งสมัคร, รูปปลอม และชวนลงทุน";
                result.classList.add('correct');
                result.style.display = 'block';
            } else if (chk1 || chk2 || chk3 || chk4) {
                result.textContent = "เกือบครบแล้ว! 🤔 ทุกข้อที่คุณเห็นเป็นสัญญาณอันตรายทั้งหมด ลองหาให้ครบนะครับ";
                result.classList.add('wrong');
                result.style.display = 'block';
            } else {
                result.textContent = "ลองสังเกตใหม่นะครับ 🧐 บัญชีนี้ไม่น่าไว้ใจเลยสักนิด!";
                result.classList.add('wrong');
                result.style.display = 'block';
            }
        });
    }

    // --- [Lesson Animation] ระบบอนิเมชั่นหน้าบทเรียนอัตโนมัติ ---
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

// --- [Quiz System] ระบบตรวจข้อสอบ 10 ข้อ (Chapter 4 Theme) ---
function checkQuiz() {
    // เฉลยคำตอบ
    const answers = {
        q1: 'b', q2: 'b', q3: 'c', q4: 'a', q5: 'b',
        q6: 'c', q7: 'c', q8: 'b', q9: 'b', q10: 'a'
    };

    let score = 0;
    const total = 10;
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');

    // รีเซ็ตสีเก่าก่อนตรวจใหม่ (เผื่อกดซ้ำ)
    const allLabels = form.querySelectorAll('label');
    allLabels.forEach(label => {
        label.classList.remove('correct-answer', 'wrong-answer');
    });

    // เริ่มตรวจ
    for (let key in answers) {
        if(form.elements[key]) {
            const userRadios = form.elements[key];
            let answered = false;

            // วนลูปเช็คแต่ละตัวเลือกในข้อนั้น
            for (let i = 0; i < userRadios.length; i++) {
                const radio = userRadios[i];
                const label = radio.parentElement; // จับตัว Label ที่หุ้มอยู่

                if (radio.checked) {
                    answered = true;
                    if (radio.value === answers[key]) {
                        // ตอบถูก: ได้คะแนน + สีเขียว
                        score++;
                        label.classList.add('correct-answer');
                        label.innerHTML += ' <i class="fas fa-check-circle" style="margin-left:auto;"></i>';
                    } else {
                        // ตอบผิด: สีแดง
                        label.classList.add('wrong-answer');
                        label.innerHTML += ' <i class="fas fa-times-circle" style="margin-left:auto;"></i>';
                    }
                }
            }
        }
    }

    // แสดงผลคะแนน
    resultDiv.style.display = 'block';
    
    // ข้อความตามคะแนน
    if (score >= 8) {
        resultDiv.innerHTML = `<i class="fas fa-trophy" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>สุดยอด!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(คุณคือผู้เชี่ยวชาญด้านความปลอดภัยตัวจริง)</span>`;
        resultDiv.style.background = "#dcfce7";
        resultDiv.style.color = "#166534";
        resultDiv.style.border = "2px solid #22c55e";
    } else if (score >= 5) {
        resultDiv.innerHTML = `<i class="fas fa-thumbs-up" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ผ่านเกณฑ์!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(ทบทวนอีกนิดรับรองเป๊ะแน่นอน)</span>`;
        resultDiv.style.background = "#fffbeb";
        resultDiv.style.color = "#92400e";
        resultDiv.style.border = "2px solid #f59e0b";
    } else {
        resultDiv.innerHTML = `<i class="fas fa-book-reader" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>พยายามอีกนิด!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(ลองกลับไปอ่านบทที่ 4 ใหม่อีกรอบนะครับ)</span>`;
        resultDiv.style.background = "#fef2f2";
        resultDiv.style.color = "#991b1b";
        resultDiv.style.border = "2px solid #ef4444";
    }

    // Scroll ไปหาผลคะแนน (เพื่อให้เห็นทันที)
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // ล็อกปุ่มส่ง
    const btn = document.querySelector('.btn-submit-quiz');
    if(btn) {
        btn.textContent = "ตรวจเรียบร้อยแล้ว";
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";
        btn.style.background = "#94a3b8"; // สีเทา
        btn.style.boxShadow = "none";
    }
}