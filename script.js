gsap.registerPlugin(ScrollTrigger);

// 检测设备类型
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// 1. 开场动画
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    // 移动端logo缩小
    if (isMobile) {
        gsap.set(".intro-logo", { width: "200px" });
    }
    
    tl.to(".intro-logo", {
        scale: 1.5,
        duration: 1.5,
        ease: "power2.out"
    })
    .to(".loader", {
        opacity: 0,
        display: "none",
        duration: 1,
        ease: "power2.inOut"
    });
});

// 2. 无缝纵向滚动逻辑
const sections = gsap.utils.toArray(".panel");

const scrollTween = gsap.to(sections, {
    yPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: ".horizontal-container",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + document.querySelector(".horizontal-container").offsetHeight
    }
});

// 3. 视差效果 (Parallax) - 移动端禁用以提升性能
if (!isMobile) {
    gsap.utils.toArray(".item-parallax").forEach(item => {
        gsap.to(item, {
            y: -50,
            scrollTrigger: {
                trigger: item,
                containerAnimation: scrollTween,
                scrub: true
            }
        });
    });
}

// 4. 更新进度条
gsap.to(".progress-bar", {
    height: "90%",
    width: "2px",
    scrollTrigger: {
        trigger: ".horizontal-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// 5. 导航点击事件
const navLinks = document.querySelectorAll('.nav-links li');
navLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
        const targetSection = index * 100;
        gsap.to(window, {
            scrollTo: {
                y: targetSection * window.innerHeight / 100,
                container: ".horizontal-container",
                autoKill: false
            },
            duration: 1,
            ease: "power2.inOut"
        });
    });
});

// 6. 滚动时高亮当前导航项
ScrollTrigger.create({
    trigger: ".horizontal-container",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
        const progress = self.progress;
        const sectionIndex = Math.floor(progress * sections.length);
        
        // 移除所有导航项的高亮
        navLinks.forEach(link => {
            link.style.color = '';
        });
        
        // 高亮当前导航项
        if (navLinks[sectionIndex]) {
            navLinks[sectionIndex].style.color = 'var(--accent-color)';
        }
    }
});