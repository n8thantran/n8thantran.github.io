// Boot sequence
window.onload = function() {
    // Start loading animation
    animateLoadingText();

    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);

    setTimeout(() => {
        document.getElementById('bootScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
    }, 3000);

    document.querySelector('.start-button').addEventListener('click', function() {
        startClickCount++;
        
        clearTimeout(startClickTimer);
        startClickTimer = setTimeout(() => {
            startClickCount = 0;
        }, 1000);

        if (startClickCount === 5) {
            startBouncingBalls();
            startClickCount = 0;
        }
    });

    // Handle Spotify redirect if needed
    if (window.location.hash.includes('access_token')) {
        handleSpotifyRedirect();
    }
};

function login() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('desktop').style.display = 'block';
}

// Window management
let zIndex = 1000;
const openWindows = new Set(); // Track which windows are currently open

function openWindow(type) {
    if (openWindows.has(type)) {
        const existingWindow = document.querySelector(`[data-window-type="${type}"]`);
        if (existingWindow) {
            existingWindow.style.display = 'block';
            existingWindow.style.zIndex = zIndex++;
            document.querySelector(`.taskbar-item[data-window-type="${type}"]`).classList.remove('minimized');
            return;
        }
    }

    // Create new window
    const window = document.createElement('div');
    window.className = 'window';
    window.setAttribute('data-window-type', type);
    window.style.zIndex = zIndex++;
    window.style.left = '60px';
    window.style.top = '60px';

    // Set different default sizes based on window type
    if (type === 'spotify') {
        window.style.width = '500px';
        window.style.height = '600px';
    } else {
        window.style.width = '400px';
        window.style.height = '280px';
    }

    const content = getWindowContent(type);
    
    window.innerHTML = `
        <div class="window-header">
            <span>${content.title}</span>
            <div>
                <button class="window-button" onclick="minimizeWindow(this)">_</button>
                <button class="window-button" onclick="maximizeWindow(this)">□</button>
                <button class="window-button" onclick="closeWindow(this)">×</button>
            </div>
        </div>
        <div class="window-content">
            ${content.html}
        </div>
    `;

    // Make window draggable
    makeDraggable(window);
    
    document.getElementById('desktop').appendChild(window);
    openWindows.add(type);
    addTaskbarItem(type, content.title); // Add taskbar item when window opens

    if (type === 'spotify') {
        // Clear any existing timer
        if (updateTimer) {
            clearInterval(updateTimer);
        }
        
        // Initial update
        updateMusicStatus();
        
        // Set up periodic updates
        updateTimer = setInterval(updateMusicStatus, UPDATE_INTERVAL);
    }
}

function getWindowContent(type) {
    const contents = {
        hackathons: {
            title: 'Hackathons',
            html: `
                <h2>Hackathon Projects</h2>
                
                <div class="content-section">
                    <h3>Stanford XR Hacks: Immerse the Bay 2024 👑</h3>
                    <p class="date">November 2024 - Stanford, California</p>
                    <p class="awards">🏆 Best Use of Amazon AWS & Best Integration of AI</p>
                    <p>Dreamscapes - VR sandbox with voice-commanded 3D model generation</p>
                    <ul>
                        <li>Created an AI pipeline using FLUX.1-schelle and TripoSR models for text-to-3D mesh conversion</li>
                        <li>Implemented Redis vector search for asset caching and AWS S3 for model storage</li>
                        <li><a href="https://devpost.com/software/stellar-horizons" target="_blank">Devpost</a> | 
                            <a href="https://github.com/banyar-shin/DreamScapes" target="_blank">GitHub</a></li>
                    </ul>
                </div>

                <div class="content-section">
                    <h3>CalHacks 2024</h3>
                    <p class="date">October 2024 - San Francisco, California</p>
                    <p>NutriLens - AR nutrition tracking with Snap Spectacles</p>
                    <ul>
                        <li>Built AR application for nutritional information and recipe suggestions</li>
                        <li>Integrated USDA nutrition data and AI-powered image recognition</li>
                        <li><a href="https://devpost.com/software/nutrilens-1u9jo4" target="_blank">Devpost</a></li>
                    </ul>
                </div>
            `
        },
        experience: {
            title: 'Work Experience',
            html: `
                <h2>Professional Experience</h2>
                
                <div class="content-section">
                    <h3>Ego (YC W24)</h3>
                    <p class="position">Software Engineering Intern</p>
                    <p class="date">November 2024 - Present</p>
                    <ul>
                        <li>Optimized LLM integration for enhanced user interactions</li>
                        <li>Improved backend efficiency through FastAPI optimizations</li>
                        <li>Researched automated QA testing solutions</li>
                    </ul>
                </div>

                <div class="content-section">
                    <h3>Software and Computer Engineering Society</h3>
                    <p class="position">Software Engineering Intern</p>
                    <p class="date">September 2024 - Present</p>
                    <ul>
                        <li>Developed Discord bot with LLM integration using FastAPI and LangChain</li>
                        <li>Implemented natural language queries for club services</li>
                    </ul>
                </div>

                <div class="content-section">
                    <h3>Software and Computer Engineering Society</h3>
                    <p class="position">AI & ML Officer</p>
                    <p class="date">September 2024 - Present</p>
                    <ul>
                        <li>Led weekly workshops on machine learning projects</li>
                        <li>Guided members through data analysis and model development</li>
                    </ul>
                </div>
            `
        },
        education: {
            title: 'Education',
            html: `
                <h2>Education</h2>
                <div class="content-section">
                    <h3>San Jose State University</h3>
                    <p class="position">B.S. Computer Science</p>
                    <p class="date">2024 - 2027</p>
                    <ul>
                        <li>Expected Graduation: Spring 2027</li>
                    </ul>
                </div>
            `
        },
        about: {
            title: 'About Me',
            html: `
                <h2>About Me</h2>
                <div class="content-section">
                    <p>Computer Science student at San Jose State University with a passion for AI/ML and software development.</p>
                    <p style="margin-top: 20px;">Currently working on:</p>
                    <ul>
                        <li>LLM integrations and AI applications</li>
                        <li>Full-stack development</li>
                    </ul>
                </div>
            `
        },
        links: {
            title: 'Links',
            html: `
                <h2>Important Links</h2>
                <div class="content-section">
                    <ul>
                        <li><a href="https://linkedin.com/in/nthntrn" target="_blank">LinkedIn</a></li>
                        <li><a href="https://github.com/n8thantran" target="_blank">GitHub</a></li>
                        <li><a href="mailto:nathan.tran04@sjsu.edu">Email Me!</a></li>
                    </ul>
                </div>
            `
        },
        spotify: {
            title: 'My Music',
            html: `
                <h2>Currently Listening To</h2>
                <div class="content-section">
                    <div id="music-container" class="music-container">
                        <div class="music-loading">Loading music status...</div>
                    </div>
                </div>
            `
        }
    };
    return contents[type];
}

// Window controls
function closeWindow(button) {
    const window = button.closest('.window');
    const type = window.getAttribute('data-window-type');
    
    if (type === 'spotify' && updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
    }

    // Remove taskbar item
    const taskbarItem = document.querySelector(`.taskbar-item[data-window-type="${type}"]`);
    if (taskbarItem) {
        taskbarItem.remove();
    }
    
    openWindows.delete(type);
    window.remove();
}

function minimizeWindow(button) {
    const window = button.closest('.window');
    const type = window.getAttribute('data-window-type');
    window.style.display = 'none';
    
    // Update taskbar item to show minimized state
    const taskbarItem = document.querySelector(`.taskbar-item[data-window-type="${type}"]`);
    taskbarItem.classList.add('minimized');
}

function maximizeWindow(button) {
    const window = button.closest('.window');
    if (window.style.width === '100%') {
        window.style.width = '400px';
        window.style.height = '280px';
        window.style.top = '60px';
        window.style.left = '60px';
    } else {
        window.style.width = '100%';
        window.style.height = 'calc(100vh - 35px)';
        window.style.top = '0';
        window.style.left = '0';
    }
}

// Make windows draggable
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');
    header.onmousedown = dragMouseDown;

    // Add resize handles
    const handles = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'].map(dir => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${dir}`;
        element.appendChild(handle);
        return handle;
    });

    handles.forEach(handle => {
        handle.onmousedown = initResize;
    });

    function initResize(e) {
        e.preventDefault();
        e.stopPropagation();

        const direction = e.target.className.split(' ')[1];
        const initialWidth = element.offsetWidth;
        const initialHeight = element.offsetHeight;
        const initialX = element.offsetLeft;
        const initialY = element.offsetTop;
        const startX = e.clientX;
        const startY = e.clientY;

        document.onmousemove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Minimum size constraints
            const minWidth = 400;
            const minHeight = 280;

            if (direction.includes('e')) {
                const newWidth = Math.max(initialWidth + dx, minWidth);
                element.style.width = newWidth + 'px';
            }
            if (direction.includes('w')) {
                const newWidth = Math.max(initialWidth - dx, minWidth);
                if (newWidth > minWidth) {
                    element.style.width = newWidth + 'px';
                    element.style.left = initialX + dx + 'px';
                }
            }
            if (direction.includes('s')) {
                const newHeight = Math.max(initialHeight + dy, minHeight);
                element.style.height = newHeight + 'px';
            }
            if (direction.includes('n')) {
                const newHeight = Math.max(initialHeight - dy, minHeight);
                if (newHeight > minHeight) {
                    element.style.height = newHeight + 'px';
                    element.style.top = initialY + dy + 'px';
                }
            }
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }

    // Original drag functionality remains the same
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        element.style.zIndex = zIndex++;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Add this after the boot sequence code
function updateTime() {
    const timeElement = document.getElementById('taskbar-time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}

let startClickCount = 0;
let startClickTimer;
let animationId = null;

function startBouncingBalls() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bouncingCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    
    document.querySelector('.desktop').appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    const balls = [];
    const colors = [
        '#FF6B6B',   // Coral
        '#4ECDC4',   // Turquoise
        '#45B7D1',   // Sky Blue
        '#96CEB4',   // Sage
        '#FFEEAD',   // Light Yellow
        '#D4A5A5'    // Rose
    ];
    
    class Ball {
        constructor() {
            this.radius = Math.random() * 20 + 10;
            this.x = -this.radius;
            this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
            this.dx = Math.random() * 3 + 2;
            this.dy = (Math.random() - 0.5) * 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;

            // Bounce off top and bottom
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }

            // Reset position when ball goes off screen
            if (this.x - this.radius > canvas.width) {
                this.x = -this.radius;
                this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    // Create initial balls
    for (let i = 0; i < 15; i++) {
        balls.push(new Ball());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        balls.forEach(ball => {
            ball.update();
            ball.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Stop any existing animation
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Remove old canvas if it exists
    const oldCanvas = document.querySelector('#bouncingCanvas');
    if (oldCanvas && oldCanvas !== canvas) {
        oldCanvas.remove();
    }

    animate();
}

// Add this function for the loading animation
function animateLoadingText() {
    const loadingText = document.querySelector('.boot-screen p');
    let dots = 0;
    
    function updateDots() {
        dots = (dots + 1) % 4;
        loadingText.textContent = 'Loading' + '.'.repeat(dots);
    }
    
    // Start the animation
    const loadingInterval = setInterval(updateDots, 500);
    
    // Clear the interval when moving to login screen
    setTimeout(() => {
        clearInterval(loadingInterval);
        document.getElementById('bootScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
    }, 3000);
}

// Update the addTaskbarItem function
function addTaskbarItem(type, title) {
    const taskbar = document.querySelector('.taskbar');
    const taskbarItems = taskbar.querySelector('.taskbar-items') || createTaskbarItemsContainer(taskbar);
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item';
    taskbarItem.setAttribute('data-window-type', type);
    taskbarItem.innerHTML = `
        <i class="fa-solid ${getIconClass(type)}"></i>
        <span>${title}</span>
    `;
    
    // Always append to the taskbar-items container
    taskbarItems.appendChild(taskbarItem);
    
    // Click handler to toggle window
    taskbarItem.addEventListener('click', () => {
        const window = document.querySelector(`.window[data-window-type="${type}"]`);
        if (window.style.display === 'none') {
            window.style.display = 'block';
            taskbarItem.classList.remove('minimized');
        } else {
            window.style.zIndex = zIndex++;
        }
    });
}

// Helper function to create taskbar-items container if it doesn't exist
function createTaskbarItemsContainer(taskbar) {
    const container = document.createElement('div');
    container.className = 'taskbar-items';
    
    // Insert immediately after start button with no extra wrapper elements
    const startButton = taskbar.querySelector('.start-button');
    startButton.insertAdjacentElement('afterend', container);
    
    return container;
}

// Helper function to get icon class based on window type
function getIconClass(type) {
    const iconMap = {
        hackathons: 'fa-trophy',
        experience: 'fa-briefcase',
        education: 'fa-graduation-cap',
        about: 'fa-user',
        links: 'fa-link',
        spotify: 'fa-spotify'
    };
    return iconMap[type];
}

// Replace the Spotify-related constants
const LASTFM_API_KEY = '4d946e5ceb43d98491dcfafbffc18255'; // You'll need to get this from Last.fm
const LASTFM_USERNAME = 'yxnv'; // Your Last.fm username
const UPDATE_INTERVAL = 10000; // Check every 10 seconds
let updateTimer = null;

// Replace all Spotify-related functions with this simplified version
async function updateMusicStatus() {
    const container = document.getElementById('music-container');
    if (!container) return;

    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
        );
        
        const data = await response.json();
        const track = data.recenttracks.track[0];
        
        if (track) {
            const isPlaying = track['@attr']?.nowplaying === 'true';
            const albumArt = track.image[3]['#text'] || 'path/to/default-album-art.png';

            const titleBarContent = `
                <div class="music-title-bar" style="text-align: center;">
                    <div class="ticker-wrap" style="display: flex; justify-content: center;">
                        <div class="ticker" style="text-align: center;">
                            <div class="ticker-item" style="text-align: center;">
                                ${isPlaying ? '▶' : '⏵'} ${track.name} - ${track.artist['#text']}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = `
                <div class="music-card win98-container" style="display: flex; justify-content: center;">
                    <div class="music-content" style="text-align: center;">
                        <div class="album-container" style="display: flex; flex-direction: column; align-items: center;">
                            <img src="${albumArt}" 
                                 alt="Album Art" 
                                 class="music-album-art"
                                 style="margin: 0 auto;">
                            ${isPlaying ? `
                                <div class="now-playing-badge" style="text-align: center;">
                                    <span class="blink">NOW PLAYING</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="music-info" style="text-align: center;">
                            ${titleBarContent}
                            <div class="music-details" style="display: flex; flex-direction: column; align-items: center;">
                                <div class="detail-row" style="text-align: center;">
                                    <span class="label">Track:</span>
                                    <span class="value">${track.name}</span>
                                </div>
                                <div class="detail-row" style="text-align: center;">
                                    <span class="label">Artist:</span>
                                    <span class="value">${track.artist['#text']}</span>
                                </div>
                                <div class="detail-row" style="text-align: center;">
                                    <span class="label">Album:</span>
                                    <span class="value">${track.album['#text']}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="music-card win98-container">
                    <div class="music-not-playing">
                        <img src="https://win98icons.alexmeub.com/icons/png/windows_media_player-4.png" alt="Media Player">
                        <p>No music playing</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error updating music status:', error);
        container.innerHTML = `
            <div class="music-card win98-container">
                <div class="music-error">
                    <img src="https://win98icons.alexmeub.com/icons/png/error-0.png" alt="Error">
                    <p>Error loading music status</p>
                </div>
            </div>
        `;
    }
} 