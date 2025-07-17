// Poll data structure
let pollData = {
  question: "Where should we go for our post-intern adventure?",
  options: [
    { id: 'opt-1', text: 'Sunway Lagoon', icon: 'fas fa-water', votes: 0 },
    { id: 'opt-2', text: 'Gamuda Cove SplashMania', icon: 'fas fa-swimming-pool', votes: 0 },
    { id: 'opt-3', text: 'Melaka Wonderland Theme Park', icon: 'fas fa-mountain', votes: 0 },
    { id: 'opt-4', text: 'Genting SkyWorlds Theme Park', icon: 'fas fa-cloud', votes: 0 }
  ],
  totalVotes: 0
};

// Park details data
const parkDetails = {
  sunway: {
    title: "Sunway Lagoon Theme Park",
    location: "Bandar Sunway, Selangor",
    hours: "Daily, 10:00 AM – 6:00 PM",
    price: `
      <ul>
        <li><strong>Malaysian:</strong> RM155 (adult), RM130 (child/senior)</li>
        <li><strong>International:</strong> RM180 (adult), RM155 (child/senior)</li>
        <li><em>Online offers may be cheaper</em></li>
      </ul>
    `,
    description: "Sunway Lagoon is a multi-park attraction offering 6 different parks including Water Park, Amusement Park, Wildlife Park, Extreme Park, Scream Park, and Nickelodeon Lost Lagoon. It's packed with thrilling rides, water slides, and animal encounters — great for a full-day fun outing. Perfect for groups looking for variety and excitement close to KL."
  },
  splashmania: {
    title: "Gamuda Cove SplashMania",
    location: "Gamuda Cove, Banting, Selangor",
    hours: "Daily, 10:00 AM – 6:00 PM",
    price: `
      <ul>
        <li><strong>Malaysian:</strong> RM120 (adult), RM100 (child/senior)</li>
        <li><strong>International:</strong> RM140 (adult), RM120 (child/senior)</li>
        <li><em>Early bird discounts available</em></li>
      </ul>
    `,
    description: "SplashMania is Malaysia's newest water park featuring over 40 attractions including the longest lazy river in Southeast Asia, thrilling water slides, wave pools, and family-friendly attractions. Located in the scenic Gamuda Cove development, it offers a perfect blend of adventure and relaxation for all ages."
  },
  melaka: {
    title: "Melaka Wonderland Theme Park",
    location: "Ayer Keroh, Melaka",
    hours: "Daily, 10:00 AM – 7:00 PM",
    price: `
      <ul>
        <li><strong>Malaysian:</strong> RM80 (adult), RM60 (child/senior)</li>
        <li><strong>International:</strong> RM100 (adult), RM80 (child/senior)</li>
        <li><em>Combo tickets with other Melaka attractions available</em></li>
      </ul>
    `,
    description: "Melaka Wonderland combines water park fun with cultural elements, featuring water slides, wave pools, and family attractions. The park also includes a mini zoo and cultural shows, making it a great destination for families looking to combine entertainment with a Melaka heritage experience."
  },
  genting: {
    title: "Genting SkyWorlds Theme Park",
    location: "Genting Highlands, Pahang",
    hours: "Daily, 11:00 AM – 6:00 PM",
    price: `
      <ul>
        <li><strong>Malaysian:</strong> RM180 (adult), RM150 (child/senior)</li>
        <li><strong>International:</strong> RM200 (adult), RM170 (child/senior)</li>
        <li><em>Package deals with hotel stays available</em></li>
      </ul>
    `,
    description: "Genting SkyWorlds is Malaysia's premier indoor theme park featuring world-class attractions, thrilling rides, and entertainment shows. Located in the cool highlands, it offers a unique combination of adrenaline-pumping rides and family entertainment, perfect for escaping the heat while having fun."
  }
};

// Global variables for vote management
let selectedOption = null;
let isVoteSubmitted = false;

// Popup functions
function showParkDetails(parkId) {
  const park = parkDetails[parkId];
  if (!park) return;

  const popup = document.getElementById('parkDetailsPopup');
  const title = popup.querySelector('.park-title');
  const location = document.getElementById('location');
  const hours = document.getElementById('hours');
  const price = document.getElementById('price');
  const description = document.getElementById('description');

  title.textContent = park.title;
  location.textContent = park.location;
  hours.textContent = park.hours;
  price.innerHTML = park.price;
  description.textContent = park.description;

  popup.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const popup = document.getElementById('parkDetailsPopup');
  popup.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
  const popup = document.getElementById('parkDetailsPopup');
  if (e.target === popup) {
    closePopup();
  }
  
  // Deselect poll option when clicking outside
  const pollArea = document.querySelector('.poll-area');
  const isClickingPollOption = e.target.closest('.poll-option');
  const isClickingDetailsLink = e.target.closest('.details-link');
  
  if (!isClickingPollOption && !isClickingDetailsLink && selectedOption) {
    clearSelections();
    selectedOption = null;
    updateSubmitButton();
  }
});

// Load existing data from localStorage
function loadPollData() {
  const saved = localStorage.getItem('pollData');
  if (saved) {
    pollData = JSON.parse(saved);
  }
  updatePollDisplay();
}

// Save data to localStorage
function savePollData() {
  localStorage.setItem('pollData', JSON.stringify(pollData));
}

// Calculate percentages
function calculatePercentages() {
  pollData.options.forEach(option => {
    if (pollData.totalVotes > 0) {
      option.percentage = Math.round((option.votes / pollData.totalVotes) * 100);
    } else {
      option.percentage = 0;
    }
  });
}

// Update the display
function updatePollDisplay() {
  calculatePercentages();
  
  pollData.options.forEach((option, index) => {
    const pollOption = document.querySelector(`.poll-option[data-option="${option.id}"]`);
    if (pollOption) {
      // Update text and icon
      const textSpan = pollOption.querySelector('.text');
      textSpan.innerHTML = `<i class="${option.icon}"></i>${option.text}`;
      
      // Update percentage (hidden until vote submitted)
      const percentSpan = pollOption.querySelector('.percent');
      percentSpan.textContent = `${option.percentage}%`;
      
      // Update progress bar (hidden until vote submitted)
      const progressBar = pollOption.querySelector('.progress');
      progressBar.style.setProperty('--w', option.percentage);
      
      // Update vote count display (hidden until vote submitted)
      const voteCount = pollOption.querySelector('.vote-count') || document.createElement('span');
      voteCount.className = 'vote-count';
      voteCount.textContent = `${option.votes} votes`;
      voteCount.style.cssText = 'font-size: 12px; color: #6b7280; margin-top: 4px;';
      
      if (!pollOption.querySelector('.vote-count')) {
        pollOption.appendChild(voteCount);
      }
    }
  });
  
  // Update total votes display (hidden until vote submitted)
  updateTotalVotes();
}

// Update total votes display
function updateTotalVotes() {
  let totalDisplay = document.querySelector('.total-votes');
  if (!totalDisplay) {
    totalDisplay = document.createElement('div');
    totalDisplay.className = 'total-votes';
    totalDisplay.style.cssText = 'text-align: center; margin-top: 16px; padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px; color: #667eea; font-weight: 500; opacity: 0; transition: opacity 0.3s ease;';
    document.querySelector('.poll-area').appendChild(totalDisplay);
  }
  totalDisplay.textContent = `Total Votes: ${pollData.totalVotes}`;
}

// Handle vote submission
function submitVote(optionId) {
  const option = pollData.options.find(opt => opt.id === optionId);
  if (option) {
    option.votes++;
    pollData.totalVotes++;
    savePollData();
    updatePollDisplay();
    
    // Show success message
    showMessage('Vote submitted successfully!', 'success');
    
    // Reset selection state
    selectedOption = null;
    isVoteSubmitted = false;
    updateSubmitButton();
    clearSelections();
    
    // Show progress bars and vote counts after vote is submitted
    const options = document.querySelectorAll(".poll-option");
    for (let k = 0; k < options.length; k++) {
      options[k].classList.add("selectall");
      setTimeout(() => {
        const progressElement = options[k].querySelector('.progress');
        const percentElement = options[k].querySelector('.percent');
        const voteCountElement = options[k].querySelector('.vote-count');
        const totalVotesElement = document.querySelector('.total-votes');
        
        if (progressElement) progressElement.style.opacity = '1';
        if (percentElement) percentElement.style.opacity = '1';
        if (voteCountElement) voteCountElement.style.opacity = '1';
        if (totalVotesElement) totalVotesElement.style.opacity = '1';
      }, k * 100);
    }
  }
}

// Show message function
function showMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    background: ${type === 'success' ? '#10b981' : '#667eea'};
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Reset poll function
function resetPoll() {
  pollData.options.forEach(option => {
    option.votes = 0;
  });
  pollData.totalVotes = 0;
  savePollData();
  updatePollDisplay();
  showMessage('Poll reset successfully!', 'success');
}

// Clear all selections
function clearSelections() {
  const options = document.querySelectorAll('.poll-area .poll-option');
  options.forEach(option => {
    option.classList.remove('selected');
    option.style.transform = 'translateY(0) scale(1)';
  });
}

// Update submit button state
function updateSubmitButton() {
  const submitBtn = document.querySelector('.submit-vote-btn');
  if (submitBtn) {
    if (selectedOption && !isVoteSubmitted) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      submitBtn.style.cursor = 'not-allowed';
    }
  }
}

// Add submit button
function addSubmitButton() {
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit Vote';
  submitBtn.className = 'submit-vote-btn';
  submitBtn.style.cssText = `
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: not-allowed;
    font-weight: 600;
    margin-top: 16px;
    transition: all 0.3s ease;
    opacity: 0.5;
    font-size: 16px;
  `;
  
  submitBtn.addEventListener('click', () => {
    if (selectedOption && !isVoteSubmitted) {
      submitVote(selectedOption);
    }
  });
  
  submitBtn.addEventListener('mouseenter', () => {
    if (!submitBtn.disabled) {
      submitBtn.style.transform = 'translateY(-2px)';
      submitBtn.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
    }
  });
  
  submitBtn.addEventListener('mouseleave', () => {
    submitBtn.style.transform = 'translateY(0)';
    submitBtn.style.boxShadow = 'none';
  });
  
  document.querySelector('.footer').appendChild(submitBtn);
}

// Add reset button
function addResetButton() {
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset Poll';
  resetBtn.className = 'reset-btn';
  resetBtn.style.cssText = `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    margin-top: 16px;
    margin-left: 12px;
    transition: all 0.3s ease;
  `;
  
  resetBtn.addEventListener('click', resetPoll);
  resetBtn.addEventListener('mouseenter', () => {
    resetBtn.style.transform = 'translateY(-2px)';
    resetBtn.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
  });
  resetBtn.addEventListener('mouseleave', () => {
    resetBtn.style.transform = 'translateY(0)';
    resetBtn.style.boxShadow = 'none';
  });
  
  document.querySelector('.footer').appendChild(resetBtn);
}

// Initialize poll
document.addEventListener('DOMContentLoaded', () => {
  loadPollData();
  addSubmitButton();
  addResetButton();
  
  // Update header with dynamic question
  const header = document.querySelector('header');
  header.innerHTML = `<i class="fas fa-map-marker-alt"></i>${pollData.question}`;
  
  // Setup event listeners after DOM is loaded
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  const options = document.querySelectorAll(".poll-option");
  const detailsLinks = document.querySelectorAll(".details-link");
  
  console.log('Found poll options:', options.length); // Debug log
  
  // Add ripple effect to all options
  options.forEach(option => {
    option.addEventListener('click', createRipple);
  });
  
  // Enhanced click handler for poll selection (without details)
  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", (e)=>{
      // Don't trigger if clicking on details link
      if (e.target.closest('.details-link')) {
        return;
      }
      
      console.log('Option clicked:', options[i].getAttribute('data-option')); // Debug log
      
      // Add click sound effect (optional)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Ignore if audio fails
      
      // Get the option ID
      const optionId = options[i].getAttribute("data-option");
      
      // Check if this option is already selected
      const isCurrentlySelected = selectedOption === optionId;
      
      // Always clear previous selection first
      clearSelections();
      selectedOption = null;
      
      // Handle selection
      if (isCurrentlySelected) {
        // If clicking the same option, keep it deselected
        selectedOption = null;
      } else {
        // Select new option
        selectedOption = optionId;
        options[i].classList.add("selected");
        options[i].style.transform = 'translateY(-4px) scale(1.02)';
      }
      
      // Update submit button
      updateSubmitButton();
      
      // Don't show progress bars until vote is submitted
      // Progress bars will only show after submitting a vote
    });
  }

  // Separate click handler for details links
  detailsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the poll option click
      
      const parkId = link.getAttribute('data-park');
      if (parkId) {
        showParkDetails(parkId);
      }
    });
  });
  
  // Add hover sound effect (optional)
  options.forEach(option => {
    option.addEventListener('mouseenter', () => {
      option.style.cursor = 'pointer';
    });
  });
}

// Add ripple effect function
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add CSS for ripple effect and animations
const style = document.createElement('style');
style.textContent = `
  .poll-area .poll-option {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .progress {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .percent {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);