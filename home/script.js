document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. จัดการเมนู Hamburger ---
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // เปลี่ยนไอคอน Hamburger <-> X
            const icon = hamburger.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // ปิดเมนูเมื่อคลิกพื้นที่ว่าง
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- 2. ระบบค้นหา (Search) ---
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.course-card');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const searchText = e.target.value.toLowerCase();
            cards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                const text = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(searchText) || text.includes(searchText)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- 3. Scroll Animation (ทำให้เว็บขยับได้) ---
    const itemsToAnimate = document.querySelectorAll('.course-card, .section-header, footer, .category-title');
    
    itemsToAnimate.forEach(item => {
        item.classList.add('scroll-hidden');
    });

    const checkScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        itemsToAnimate.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('scroll-show');
            }
        });
        
        // Header Shadow Effect
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // เรียกใช้งานทันทีตอนเปิดเว็บ
});