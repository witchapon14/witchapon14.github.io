document.addEventListener('DOMContentLoaded', () => {
    fetch('database.json')
        .then(response => response.json())
        .then(data => {
            populatePage(data);
            setupEventListeners();
            initCanvasAnimation();
        });
});

function populatePage(data) {
    // Personal Info
    document.getElementById('greeting').textContent = data.personalInfo.greeting;
    document.getElementById('name').textContent = data.personalInfo.name;
    document.getElementById('title').textContent = data.personalInfo.title;
    document.getElementById('bio-intro').innerHTML = data.personalInfo.bio_intro;
    document.getElementById('profile-pic').src = data.personalInfo.profileImage;
    document.getElementById('contact-link').href = `mailto:${data.personalInfo.email}`;
    document.getElementById('contact-link-mobile').href = `mailto:${data.personalInfo.email}`;
    document.getElementById('footer-name').textContent = `Designed & Built by ${data.personalInfo.name}`;
    document.getElementById('github-footer').href = data.personalInfo.socials.github;
    document.getElementById('linkedin-footer').href = data.personalInfo.socials.linkedin;
    document.getElementById('twitter-footer').href = data.personalInfo.socials.twitter;

    // About Me
    const aboutContainer = document.getElementById('about-paragraphs');
    aboutContainer.innerHTML = data.about.paragraphs.map(p => `<p>${p}</p>`).join('');

    // Experience
    const experienceContainer = document.getElementById('experience-timeline');
    const icons = {
        internship: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>`,
        award: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>`
    };

    experienceContainer.innerHTML = data.experience.map((item, index) => {
        const detailsList = item.details.map(detail => `<li>${detail}</li>`).join('');
        const icon = icons[item.type] || '';
        const companyColor = item.type === 'award' ? 'text-yellow-300' : 'text-purple-300';

        return `
        <div class="timeline-item">
            <div class="timeline-icon-container">
                <div class="timeline-icon">
                    ${icon}
                </div>
            </div>
            <div class="timeline-card">
                <div class="timeline-card-header">
                    <h4 class="text-xl font-bold text-gray-100">${item.title}</h4>
                    <p class="${companyColor} font-medium">${item.company}</p>
                    <p class="text-gray-500 text-sm">${item.year}</p>
                </div>
                <div class="p-6 pt-4">
                    <ul class="list-disc list-inside text-gray-400 space-y-2">${detailsList}</ul>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Projects
    const projectsContainer = document.getElementById('projects-grid');
    projectsContainer.innerHTML = data.projects.map(project => {
        const tags = project.tags.map(tag => `<span class="inline-block bg-purple-500/20 text-purple-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${tag}</span>`).join('');
        return `
            <div class="project-card rounded-lg overflow-hidden flex flex-col">
                <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
                <div class="p-6 flex flex-col flex-grow">
                    <h4 class="text-xl font-bold text-gray-100 mb-2">${project.title}</h4>
                    <p class="text-gray-400 mb-4 flex-grow">${project.description}</p>
                    <div class="mb-4">${tags}</div>
                    <div class="mt-auto">
                        <a href="${project.github}" class="text-purple-400 hover:underline mr-4">GitHub</a>
                        <a href="${project.pitchdeck}" class="text-purple-400 hover:underline mr-4">Pitchdeck</a>
                    </div>
                </div>
            </div>`;
    }).join('');

    // Publications
    const publicationsContainer = document.getElementById('publications-list');
    publicationsContainer.innerHTML = data.publications.map(pub => {
        const tags = pub.tags.map(tag => `<span class="inline-block bg-gray-500/20 text-gray-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${tag}</span>`).join('');
        return `
            <div class="project-card rounded-lg overflow-hidden flex flex-col md:flex-row items-center">
                <img src="${pub.image}" alt="${pub.title}" class="w-full md:w-1/3 h-48 md:h-full object-cover">
                <div class="p-6 flex flex-col flex-grow">
                    <h4 class="text-xl font-bold text-gray-100 mb-2">${pub.title}</h4>
                    <p class="text-gray-400 mb-4 flex-grow">${pub.description}</p>
                    <div class="mb-4">${tags}</div>
                    <div class="mt-auto">
                        <a href="${pub.link}" target="_blank" class="text-purple-400 hover:underline font-bold">View Publication ↗</a>
                    </div>
                </div>
            </div>`;
    }).join('');

    // Skills
    const skillsContainer = document.getElementById('skills-grid');
    skillsContainer.innerHTML = data.skills.map(skill => `
        <div class="flex flex-col items-center">
            <div class="text-4xl mb-2">${skill.icon || ''}</div>
            <h4 class="text-lg font-bold text-gray-200">${skill.name}</h4>
            <p class="text-gray-400 text-sm">${skill.items}</p>
        </div>`).join('');
}

function setupEventListeners() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#mobile-menu a, nav a');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.getAttribute('href').startsWith('#')) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Header shadow on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg', 'bg-[#0A192F]/80');
        } else {
            header.classList.remove('shadow-lg', 'bg-[#0A192F]/80');
        }
    });
}

function initCanvasAnimation() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        if (numberOfParticles > 150) numberOfParticles = 150;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            let color = 'rgba(167, 139, 250, 0.8)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    init();
    animate();
}