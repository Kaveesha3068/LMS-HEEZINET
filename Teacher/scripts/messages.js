// Messages Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-hidden');
            mainContent.classList.toggle('mobile-full');

            // Update toggle button text
            if (sidebar.classList.contains('mobile-hidden')) {
                this.textContent = '☰';
            } else {
                this.textContent = '✕';
            }
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(event.target) && 
                !mobileMenuToggle.contains(event.target) && 
                !sidebar.classList.contains('mobile-hidden')) {
                sidebar.classList.add('mobile-hidden');
                mainContent.classList.add('mobile-full');
                mobileMenuToggle.textContent = '☰';
            }
        }
    });

    // Chat functionality
    const chatItems = document.querySelectorAll('.chat-item');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.getElementById('chatMessages');
    const attachmentBtn = document.querySelector('.attachment-btn');

    // Sample chat data
    const chatData = {
        'Emma Johnson': {
            avatar: '../../frontend/assets/images/student.png',
            status: 'online',
            messages: [
                { type: 'received', content: 'Hey Jude wanted to check if the assignment for next week is still due on Friday?', time: '8:30 AM' },
                { type: 'sent', content: 'Hi Emma! Yes, the assignment is still due on Friday. Make sure to submit it before 11:59 PM.', time: '8:32 AM' },
                { type: 'received', content: 'Great! Thanks for confirming. I\'m almost done with it.', time: '8:35 AM' }
            ]
        },
        'Michael Brown': {
            avatar: '../../frontend/assets/images/instructor.png',
            status: 'last seen recently',
            messages: [
                { type: 'received', content: 'The webinar was insightful! Thanks for organizing it.', time: '8:56 AM' },
                { type: 'sent', content: 'You\'re welcome! I\'m glad you found it helpful. We\'ll have another one next month.', time: '9:00 AM' }
            ]
        },
        'Daniella Jung': {
            avatar: '../../frontend/assets/images/student.png',
            status: 'last seen recently',
            messages: [
                { type: 'received', content: 'Hey, I\'m facing login issues. Any help?', time: '1:01 PM' },
                { type: 'sent', content: 'Hi Daniel! Could you specify the issue? Are you getting an error message?', time: '1:01 PM' },
                { type: 'received', content: 'Yeah, it says "Invalid Credentials" even though my password is correct.', time: '1:03 PM' },
                { type: 'sent', content: 'Have you tried resetting your password?', time: '1:04 PM' },
                { type: 'received', content: 'Not yet, I\'ll try that now.', time: '1:05 PM' },
                { type: 'sent', content: 'Great! If it still doesn\'t work, let me know and I\'ll escalate the issue for support.', time: '1:05 PM' }
            ]
        }
    };

    // Chat item click handler
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            chatItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');

            // Get chat name
            const chatName = this.querySelector('.chat-name').textContent;
            const chatData = getChatData(chatName);

            // Update chat window
            updateChatWindow(chatData);
        });
    });

    // Get chat data function
    function getChatData(name) {
        const defaultData = {
            name: name,
            avatar: '../../frontend/assets/images/student.png',
            status: 'last seen recently',
            messages: []
        };

        if (window.chatData && window.chatData[name]) {
            return {
                name: name,
                avatar: window.chatData[name].avatar,
                status: window.chatData[name].status,
                messages: window.chatData[name].messages
            };
        }

        return defaultData;
    }

    // Update chat window
    function updateChatWindow(chatData) {
        // Update header
        const contactName = document.querySelector('.contact-name');
        const contactStatus = document.querySelector('.contact-status');
        const contactAvatar = document.querySelector('.contact-avatar img');

        if (contactName) contactName.textContent = chatData.name;
        if (contactStatus) contactStatus.textContent = chatData.status;
        if (contactAvatar) contactAvatar.src = chatData.avatar;

        // Update messages
        updateMessages(chatData.messages);
    }

    // Update messages function
    function updateMessages(messages) {
        if (!chatMessages) return;

        chatMessages.innerHTML = `
            <div class="message-group">
                <div class="message-date">March 8, 2024</div>
                ${messages.map(msg => `
                    <div class="message ${msg.type}">
                        <div class="message-content">${msg.content}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message function
    function sendMessage() {
        if (!chatInput || !chatInput.value.trim()) return;

        const messageContent = chatInput.value.trim();
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.innerHTML = `
            <div class="message-content">${messageContent}</div>
            <div class="message-time">${currentTime}</div>
        `;

        // Add to chat messages
        const messageGroup = chatMessages.querySelector('.message-group');
        if (messageGroup) {
            messageGroup.appendChild(messageElement);
        }

        // Clear input
        chatInput.value = '';

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate typing indicator and response (optional)
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                addAutoResponse();
            }, 2000);
        }, 500);
    }

    // Send button click handler
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Enter key handler for chat input
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize input
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    // Attachment button handler
    if (attachmentBtn) {
        attachmentBtn.addEventListener('click', function() {
            // Create hidden file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,document/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleFileAttachment(file);
                }
            });
            
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        });
    }

    // Handle file attachment
    function handleFileAttachment(file) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Create attachment message
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        if (file.type.startsWith('image/')) {
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="attachment-preview">
                        <img src="${URL.createObjectURL(file)}" alt="${file.name}" style="max-width: 200px; border-radius: 8px;">
                        <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">${file.name}</div>
                    </div>
                </div>
                <div class="message-time">${currentTime}</div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="attachment-file">
                        <span style="font-size: 20px;">📄</span>
                        <div style="margin-left: 8px;">
                            <div style="font-weight: 600;">${file.name}</div>
                            <div style="font-size: 12px; opacity: 0.8;">${formatFileSize(file.size)}</div>
                        </div>
                    </div>
                </div>
                <div class="message-time">${currentTime}</div>
            `;
        }

        // Add to chat messages
        const messageGroup = chatMessages.querySelector('.message-group');
        if (messageGroup) {
            messageGroup.appendChild(messageElement);
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        const messageGroup = chatMessages.querySelector('.message-group');
        if (messageGroup) {
            messageGroup.appendChild(typingElement);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Add auto response
    function addAutoResponse() {
        const responses = [
            "Thank you for your message! I'll get back to you soon.",
            "I understand your concern. Let me look into this for you.",
            "Thanks for reaching out! I'll review this and respond shortly.",
            "Got it! I'll check on this and update you soon."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageElement = document.createElement('div');
        messageElement.className = 'message received';
        messageElement.innerHTML = `
            <div class="message-content">${randomResponse}</div>
            <div class="message-time">${currentTime}</div>
        `;

        const messageGroup = chatMessages.querySelector('.message-group');
        if (messageGroup) {
            messageGroup.appendChild(messageElement);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Search functionality
    const chatSearchInput = document.querySelector('.chat-search-input');
    if (chatSearchInput) {
        chatSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const chatItems = document.querySelectorAll('.chat-item');

            chatItems.forEach(item => {
                const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
                const chatPreview = item.querySelector('.chat-preview').textContent.toLowerCase();

                if (chatName.includes(searchTerm) || chatPreview.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // New message button
    const newMessageBtn = document.querySelector('.new-message-btn');
    if (newMessageBtn) {
        newMessageBtn.addEventListener('click', function() {
            alert('New message functionality would be implemented here!');
        });
    }

    // Action buttons (call, video)
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isCall = this.textContent.includes('📞');
            const isVideo = this.textContent.includes('📹');
            
            if (isCall) {
                alert('Voice call functionality would be implemented here!');
            } else if (isVideo) {
                alert('Video call functionality would be implemented here!');
            }
        });
    });

    // Initialize with default chat data
    window.chatData = chatData;

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-hidden');
            mainContent.classList.remove('mobile-full');
            if (mobileMenuToggle) {
                mobileMenuToggle.textContent = '☰';
            }
        } else {
            if (!sidebar.classList.contains('mobile-hidden')) {
                sidebar.classList.add('mobile-hidden');
                mainContent.classList.add('mobile-full');
            }
        }
    });

    // Initialize mobile state on page load
    if (window.innerWidth <= 768) {
        sidebar.classList.add('mobile-hidden');
        mainContent.classList.add('mobile-full');
    }

    // Touch-friendly interactions for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.nav-item, .chat-item, .action-btn').forEach(item => {
            item.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            item.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // Add online status indicators
    function updateOnlineStatus() {
        const avatars = document.querySelectorAll('.chat-avatar, .contact-avatar');
        avatars.forEach(avatar => {
            // Randomly assign online status for demo
            if (Math.random() > 0.5) {
                const indicator = document.createElement('div');
                indicator.className = 'online-indicator';
                indicator.style.cssText = `
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 12px;
                    height: 12px;
                    background: #10b981;
                    border: 2px solid white;
                    border-radius: 50%;
                `;
                avatar.style.position = 'relative';
                avatar.appendChild(indicator);
            }
        });
    }

    // Initialize online status
    setTimeout(updateOnlineStatus, 100);

    console.log('Messages page initialized successfully!');
});

// Utility functions
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
}

function formatMessageTime(date) {
    if (isToday(date)) {
        return formatTime(date);
    } else {
        return date.toLocaleDateString();
    }
}
