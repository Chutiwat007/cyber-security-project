document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle (ส่วนที่แก้ไข) ---
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu'); // แก้จาก nav-links เป็น nav-menu ให้ตรงกับ HTML

    if(hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // สลับคลาส active เพื่อเลื่อนเมนูเข้า/ออก
            navMenu.classList.toggle('active');
            
            // เปลี่ยนไอคอนจาก 3 ขีด เป็น กากบาท (X)
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // เสริม: กดลิงก์ในเมนูแล้วให้เมนูหุบเก็บอัตโนมัติ (สะดวกบนมือถือ)
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(window.innerWidth <= 768) { // ทำเฉพาะบนมือถือ
                    navMenu.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- 2. Navbar Scroll Effect (เงามืดตอนเลื่อนลง) ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.4)';
        } else {
            navbar.style.background = 'rgba(254, 254, 254, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.2)';
        }
    });

    // --- 3. Progress Bar ---
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        if(progressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }
        
        // Active TOC Logic (ไฮไลท์สารบัญ)
        const sections = document.querySelectorAll('section.chapter');
        const tocLinks = document.querySelectorAll('#toc-list a');
        
        let currentSection = '';
        sections.forEach(section => {
            if (pageYOffset >= (section.offsetTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
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
// --- [Quiz System] ระบบตรวจข้อสอบ 10 ข้อ (Chapter 1 Theme) ---
function checkQuizResult() {
    // เฉลยคำตอบ
    const answers = {
        q1: 'c',  // State-Sponsored
        q2: 'b',  // Integrity (Defacement)
        q3: 'b',  // Authorization (สิทธิ์)
        q4: 'd',  // Worm (Auto spread)
        q5: 'c',  // Baiting (USB)
        q6: 'b',  // Weaponization (Build payload)
        q7: 'c',  // Zero-Day (No patch)
        q8: 'd',  // Recover (Backup)
        q9: 'c',  // App Security (Coding)
        q10: 'b'  // Fileless (RAM)
    };

    let score = 0;
    const total = 10;
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');

    // รีเซ็ตสีเก่า
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

    // แสดงผลคะแนน (Theme สีฟ้าน้ำเงิน Navy/Cyan)
    resultDiv.style.display = 'block';
    
    if (score >= 8) {
        resultDiv.innerHTML = `<i class="fas fa-award" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ยอดเยี่ยม!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(คุณมีความรู้พื้นฐานด้านความปลอดภัยที่แน่นปึ้ก!)</span>`;
        resultDiv.style.background = "#ecfeff"; // ฟ้าอ่อน
        resultDiv.style.color = "#0e7490";
        resultDiv.style.border = "2px solid #06b6d4";
    } else if (score >= 5) {
        resultDiv.innerHTML = `<i class="fas fa-user-graduate" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>ผ่านเกณฑ์!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(ทบทวนเรื่องประเภทมัลแวร์อีกนิด จะสมบูรณ์แบบครับ)</span>`;
        resultDiv.style.background = "#fffbeb"; 
        resultDiv.style.color = "#b45309";
        resultDiv.style.border = "2px solid #f59e0b";
    } else {
        resultDiv.innerHTML = `<i class="fas fa-book-reader" style="font-size:3rem; margin-bottom:10px;"></i><br><strong>พยายามอีกนิด!</strong><br>คุณได้ ${score} / ${total} คะแนน <br><span style="font-size:1rem; opacity:0.8;">(ลองอ่านทบทวนบทที่ 1 ใหม่อีกรอบนะครับ)</span>`;
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