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

    // --- LAB 1: URL Inspector Logic ---
    const urlInput = document.getElementById('urlInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultBox = document.getElementById('urlResult');

    if(analyzeBtn && urlInput) {
        analyzeBtn.addEventListener('click', () => {
            const url = urlInput.value.toLowerCase();
            const resProto = document.getElementById('resProto');
            const resDomain = document.getElementById('resDomain');
            const resSub = document.getElementById('resSub');
            const resPath = document.getElementById('resPath');
            const statusTitle = document.getElementById('statusTitle');
            const statusDesc = document.getElementById('statusDesc');

            if(!url) return;

            resultBox.classList.remove('hidden', 'safe', 'danger');
            
            // Simulation Logic (Basic Parsing)
            let isDanger = false;
            let domain = "";
            let protocol = "http";
            let subdomain = "-";

            try {
                // Add http if missing for parsing
                const urlObj = new URL(url.startsWith('http') ? url : 'http://' + url);
                const hostnameParts = urlObj.hostname.split('.');
                
                // Simple logic to guess domain (last 2 parts mainly)
                domain = hostnameParts.slice(-2).join('.'); 
                if(hostnameParts.length > 2) subdomain = hostnameParts.slice(0, -2).join('.');
                
                protocol = urlObj.protocol.replace(':', '');
                
                resProto.textContent = protocol;
                resDomain.textContent = domain;
                resSub.textContent = subdomain;
                resPath.textContent = urlObj.pathname;

                // Check Patterns
                if (protocol === 'http') isDanger = true;
                if (url.includes('-login') || url.includes('.secure') || url.includes('update') || url.includes('verify')) isDanger = true;
                if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlObj.hostname)) isDanger = true; // IP Address

            } catch (e) {
                resDomain.textContent = "Invalid URL";
                isDanger = true;
            }

            if(isDanger) {
                resultBox.classList.add('danger');
                statusTitle.textContent = "⚠️ ความเสี่ยงสูง (High Risk)";
                statusDesc.textContent = "พบสัญญาณผิดปกติ! เช่น การใช้คำว่า login/verify ในชื่อเว็บ, ใช้ HTTP, หรือเป็น IP Address";
            } else {
                resultBox.classList.add('safe');
                statusTitle.textContent = "✅ ดูปลอดภัยในระดับหนึ่ง";
                statusDesc.textContent = "โครงสร้าง URL ดูปกติ แต่ต้องตรวจสอบเนื้อหาหน้าเว็บอีกครั้งเพื่อความแน่ใจ";
            }
        });
    }
});

// --- LAB 2: Quiz Logic (Global Function) ---
function checkQuiz(isReal) {
    const feedback = document.getElementById('quizFeedback');
    feedback.classList.remove('hidden', 'correct', 'wrong');
    
    if (isReal === false) { // คำตอบที่ถูกคือ "ปลอม"
        feedback.textContent = "ถูกต้อง! 🎉 เก่งมากครับ จุดสังเกตคือ: 1. อีเมลผู้ส่งไม่ใช่ @netflix.com 2. การใช้คำขู่ให้รีบ 3. ลิงก์ปุ่มกดไม่ได้พาไปที่เว็บ Netflix จริง";
        feedback.classList.add('correct');
    } else {
        feedback.textContent = "ผิดครับ! ❌ ลองดูที่ช่อง 'From' ดีๆ สิครับ มันมาจาก account-update.com ไม่ใช่ Netflix ของจริงนะ";
        feedback.classList.add('wrong');
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