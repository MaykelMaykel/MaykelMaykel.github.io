// Function to switch between tabs
function showTab(tabId, button) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.tab-menu button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Function to optimize emails (Combo Optimizer)
function optimizeEmails() {
    let input = document.getElementById('inputOptimizer').value;
    let lines = input.split(/\r?\n/);
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let validEmails = lines.filter(line => line.trim() !== "" && emailRegex.test(line.trim()));
    let output = validEmails.join('\n');
    document.getElementById('outputOptimizer').value = output;
}

// Function to count the emails by domain (Email Domain Counter)
function countDomains() {
    let input = document.getElementById('inputCounter').value;
    let lines = input.split(/\r?\n/);
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let domainCounts = {};
    let domainEmails = {};

    lines.forEach(line => {
        let [email, password] = line.split(':').map(part => part.trim());
        if (emailRegex.test(email)) {
            let domain = email.split('@')[1];
            if (!domainCounts[domain]) {
                domainCounts[domain] = 0;
                domainEmails[domain] = [];
            }
            domainCounts[domain]++;
            domainEmails[domain].push(`${email}:${password}`);
        }
    });

    let sortedDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]);
    let domainList = document.getElementById('domainList');
    domainList.innerHTML = '';

    sortedDomains.forEach(([domain, count]) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `<span class="domain" onclick="showEmails('${domain}')">${domain} (${count})</span>`;
        domainList.appendChild(listItem);
    });

    window.domainEmails = domainEmails;
}

// Function to show emails from a selected domain
function showEmails(domain) {
    let emails = window.domainEmails[domain];
    if (emails) {
        document.getElementById('filteredEmails').value = emails.join('\n');
    } else {
        document.getElementById('filteredEmails').value = 'No emails found for this domain.';
    }
}

// Function to copy text to clipboard
function copyToClipboard(textAreaId) {
    let textArea = document.getElementById(textAreaId);
    textArea.select();
    document.execCommand('copy');
    
    // Show success message
    let successMessage = textAreaId === 'outputOptimizer' ? 'optimizerCopySuccess' : 'counterCopySuccess';
    document.getElementById(successMessage).style.display = 'inline';
    setTimeout(() => {
        document.getElementById(successMessage).style.display = 'none';
    }, 2000);
}

// Drag and Drop and File Upload for Combo Optimizer
const optimizerDropArea = document.getElementById('optimizerDropArea');
const optimizerFileInput = document.getElementById('optimizerFileInput');

optimizerDropArea.addEventListener('click', () => optimizerFileInput.click());
optimizerDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    optimizerDropArea.classList.add('drag-over');
});
optimizerDropArea.addEventListener('dragleave', () => optimizerDropArea.classList.remove('drag-over'));
optimizerDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    optimizerDropArea.classList.remove('drag-over');
    handleFileUpload(e.dataTransfer.files[0], 'inputOptimizer');
});
optimizerFileInput.addEventListener('change', () => handleFileUpload(optimizerFileInput.files[0], 'inputOptimizer'));

// Drag and Drop and File Upload for Email Domain Counter
const counterDropArea = document.getElementById('counterDropArea');
const counterFileInput = document.getElementById('counterFileInput');

counterDropArea.addEventListener('click', () => counterFileInput.click());
counterDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    counterDropArea.classList.add('drag-over');
});
counterDropArea.addEventListener('dragleave', () => counterDropArea.classList.remove('drag-over'));
counterDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    counterDropArea.classList.remove('drag-over');
    handleFileUpload(e.dataTransfer.files[0], 'inputCounter');
});
counterFileInput.addEventListener('change', () => handleFileUpload(counterFileInput.files[0], 'inputCounter'));

// Handle File Upload
function handleFileUpload(file, textAreaId) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById(textAreaId).value = e.target.result;
        if (textAreaId === 'inputCounter') {
            countDomains(); // Automatically count domains after file upload
        }
    };
    reader.readAsText(file);
}
