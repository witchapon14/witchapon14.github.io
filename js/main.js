document.addEventListener('DOMContentLoaded', () => {
    fetch('database.json')
        .then(response => response.json())
        .then(data => {
            populatePage(data);
            setupEventListeners(data);
            initAnimations(data);
        });
});

function populatePage(data) {
    // ... (keep existing personal info, about, experience population)
    // Personal Info & Hero
    document.getElementById('name').textContent = data.personalInfo.name;
    document.getElementById('bio-intro').innerHTML = data.personalInfo.bio_intro;
    document.getElementById('profile-pic').src = data.personalInfo.profileImage;
    document.getElementById('about-pic').src = data.personalInfo.profileImage;

    // Social Links
    const socialLinksContainer = document.getElementById('social-links');
    socialLinksContainer.innerHTML = `
        <a href="${data.personalInfo.socials.github}" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#00a3e1] text-[#00a3e1] hover:bg-[#00a3e1] hover:text-white transition-all"><i class="fab fa-github"></i></a>
        <a href="${data.personalInfo.socials.linkedin}" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#00a3e1] text-[#00a3e1] hover:bg-[#00a3e1] hover:text-white transition-all"><i class="fab fa-linkedin-in"></i></a>
        <a href="${data.personalInfo.socials.twitter}" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#00a3e1] text-[#00a3e1] hover:bg-[#00a3e1] hover:text-white transition-all"><i class="fab fa-medium"></i></a>
    `;

    // About Me
    const aboutContainer = document.getElementById('about-paragraphs');
    aboutContainer.innerHTML = data.about.paragraphs.map(p => `<p>${p}</p>`).join('');

    // Experience
    const experienceContainer = document.querySelector('.experience-timeline');
    if (experienceContainer) {
        experienceContainer.innerHTML = data.experience.map(item => {
            const detailsList = item.details.map(detail => `<li>${detail}</li>`).join('');
            const techStackHTML = item.tech_stack.map(tag => `<span class="tech-tag">${tag}</span>`).join('');

            return `
                <div class="timeline-item">
                    <div class="timeline-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <img src="${item.logo}" alt="${item.company} Logo" class="company-logo">
                            <div class="company-info">
                                <h3 class="job-title">${item.title}</h3>
                                <h4 class="company-name">${item.company}</h4>
                                <span class="job-duration"><i class="far fa-calendar-alt"></i> ${item.duration}</span>
                                <p class="company-location"><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                            </div>
                        </div>
                        <div class="job-description">
                            <ul>${detailsList}</ul>
                        </div>
                        <div class="experience-tech-stack">
                            <h5>Tech Stack:</h5>
                            <div class="tech-tags">${techStackHTML}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Projects
    const projectsContainer = document.getElementById('projects-grid');
    const filtersContainer = document.getElementById('project-filters');
    const allProjects = data.projects;

    // Create filter buttons
    const projectCategories = ['All', ...new Set(allProjects.map(p => p.category))];
    filtersContainer.innerHTML = projectCategories.map(cat => {
        let catName = cat === 'All' ? 'All' :
                      cat === 'dsml' ? 'Data Science & ML' :
                      cat === 'llm' ? 'Large Language Model' :
                      cat === 'cybersecurity' ? 'Cyber Security' :
                      'Software Development';
        return `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat}">${catName}</button>`;
    }).join('');
    
    // Populate project cards
    projectsContainer.innerHTML = allProjects.map(project => {
        const techStackHTML = project.tech_stack.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
        let linksHTML = '';
        if (project.links.github) {
            linksHTML += `<a href="${project.links.github}" target="_blank" class="project-link"><i class="fab fa-github"></i> GitHub</a>`;
        }
        if (project.links.pitchdeck) {
            linksHTML += `<a href="${project.links.pitchdeck}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Pitchdeck</a>`;
        }

        return `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech-stack">${techStackHTML}</div>
                    <div class="project-links">${linksHTML}</div>
                </div>
            </div>`;
    }).join('');
    
    // ... (keep existing publications, skills, contact, footer population)
    // Publications
    const publicationsData = data.publications;
    const publicationsContainer = document.getElementById('publications-grid');
    const publicationsHeading = document.getElementById('publications-heading');

    if (publicationsHeading) {
        publicationsHeading.innerHTML = `My <span class="text-[#00a3e1]">Publications</span> (${publicationsData.length})`;
    }

    if (publicationsContainer) {
        publicationsContainer.innerHTML = publicationsData.map(pub => {
            const tagsHTML = pub.tags.map(tag => `<span class="pub-tag">${tag}</span>`).join('');
            return `
                <div class="pub-card">
                    <div class="pub-badge"><i class="far fa-file-alt"></i></div>
                    <div class="pub-info">
                        <h3 class="pub-title">${pub.title}</h3>
                        <div class="pub-meta">
                            <p class="pub-authors">${pub.authors}</p>
                            <p class="pub-venue">${pub.venue}</p>
                            <p class="pub-date"><i class="far fa-calendar-alt"></i> ${pub.date}</p>
                        </div>
                        <div class="pub-tags">${tagsHTML}</div>
                        <p class="pub-abstract">${pub.abstract}</p>
                        <div class="pub-links">
                            <a href="${pub.links.view}" target="_blank" class="text-white hover:text-[#00a3e1]"><i class="fas fa-external-link-alt"></i> View</a>
                            <a href="${pub.links.pdf}" target="_blank" class="text-white hover:text-[#00a3e1]"><i class="fas fa-file-pdf"></i> PDF</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Skills
    const skillsData = data.skills;

    function hexToRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length == 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    let levelStyles = '';
    Object.entries(skillsData.levels).forEach(([level, color]) => {
        levelStyles += `
            .skill-tag[data-level="${level}"] {
                color: ${color};
                border-color: ${color};
                background-color: ${hexToRgba(color, 0.1)};
            }
            .legend-dot.${level.toLowerCase()} {
                background-color: ${color};
            }
        `;
    });
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = levelStyles;
    document.head.appendChild(styleSheet);

    const legendContainer = document.getElementById('skills-legend');
    let legendHTML = '';
    Object.entries(skillsData.levels).forEach(([level, color]) => {
        legendHTML += `
            <div class="legend-item">
                <div class="legend-dot ${level.toLowerCase()}"></div>
                <span>${level}</span>
            </div>
        `;
    });
    legendContainer.innerHTML = legendHTML;

    const contentContainer = document.getElementById('skills-content');
    let contentHTML = '';
    skillsData.groups.forEach(group => {
        contentHTML += `
            <div class="skills-category">
                <div class="category-header">
                    <div class="category-icon">
                        <i class="${group.category_icon}"></i>
                    </div>
                    <h3>${group.name}</h3>
                </div>
                <div class="skills-tag-cloud">
                    ${group.skills.map(skill => `
                        <span class="skill-tag" data-level="${skill.level}">
                            <i class="${skill.icon}"></i>${skill.name}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    });
    contentContainer.innerHTML = contentHTML;

    // Contact
    document.getElementById('email-link').href = `mailto:${data.personalInfo.email}`;

    // Footer
    document.getElementById('footer-text').textContent = `Copyright \u00a9 2025 by ${data.personalInfo.name} | All Rights Reserved.`;
    document.getElementById('github-footer').href = data.personalInfo.socials.github;
    document.getElementById('linkedin-footer').href = data.personalInfo.socials.linkedin;
    document.getElementById('twitter-footer').href = data.personalInfo.socials.twitter;
}

function setupEventListeners(data) {
    // --- New Navbar Logic ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Dropdown Logic
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            // Close other open dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
            // Close dropdowns as well
            dropdowns.forEach(d => d.classList.remove('active'));
        });
    });

    // Header shadow on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }    
    });

    // Active link highlighting on scroll (Scrollspy)
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // --- Project Logic (from previous step) ---
    const filtersContainer = document.getElementById('project-filters');
    const projectCards = document.querySelectorAll('.project-card');

    if (filtersContainer) {
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filtersContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const filter = e.target.dataset.filter;

                projectCards.forEach(card => {
                    if (filter === 'All' || card.dataset.category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }

    const scrollWrapper = document.getElementById('horizontal-scroll-wrapper');
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');

    if (scrollWrapper) {
        const updateArrows = () => {
            const maxScrollLeft = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
            prevArrow.classList.toggle('hidden', scrollWrapper.scrollLeft <= 0);
            nextArrow.classList.toggle('hidden', scrollWrapper.scrollLeft >= maxScrollLeft - 5); // 5px buffer
        };

        nextArrow.addEventListener('click', () => {
            scrollWrapper.scrollBy({ left: 360, behavior: 'smooth' });
        });

        prevArrow.addEventListener('click', () => {
            scrollWrapper.scrollBy({ left: -360, behavior: 'smooth' });
        });

        scrollWrapper.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }
}

function initAnimations(data) {
    // ... (keep existing animations)
    // Typed.js Animation
    const typed = new Typed('#typed-text', {
        strings: [data.personalInfo.title, ' Data scientist.', ' Machine learning Engineer.'],
        typeSpeed: 70,
        backSpeed: 70,
        backDelay: 1000,
        loop: true
    });

    // ScrollReveal Animations
    const sr = ScrollReveal({
        distance: '80px',
        duration: 2000,
        delay: 200,
        reset: true
    });

    sr.reveal('#home .grid > div:first-child, #about-pic', { origin: 'left' });
    sr.reveal('#home .grid > div:last-child, #about div:last-child', { origin: 'right' });
    sr.reveal('#experience, #projects, #skills, #publications, #contact', { origin: 'bottom' });
}
