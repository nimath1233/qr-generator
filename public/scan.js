document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const loaderState = document.getElementById('loaderState');
    const errorState = document.getElementById('errorState');
    const detailsState = document.getElementById('detailsState');
    const errorMsg = document.getElementById('errorMsg');
    const detailsList = document.getElementById('detailsList');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const copySuccessToast = document.getElementById('copySuccessToast');

    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bankId = urlParams.get('id');

    if (!bankId) {
        showError("Invalid link format. No ID provided.");
        return;
    }

    try {
        // Fetch details from API
        const response = await fetch(`/api/bank-details/${bankId}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to retrieve bank details.");
        }

        const data = result.data;

        // Render Data
        renderDetails(data);

        // Show Details State
        loaderState.style.display = 'none';
        detailsState.style.display = 'block';

        // Setup Copy Functionality
        setupCopy(data);

    } catch (error) {
        console.error('Error fetched data:', error);
        showError(error.message);
    }

    function showError(message) {
        loaderState.style.display = 'none';
        errorState.style.display = 'block';
        if(message) {
            errorMsg.textContent = message;
        }
    }

    function renderDetails(data) {
        // Define fields to display based on requirement
        const fields = [
            { label: 'Account Holder Name', value: data.full_name },
            { label: 'Bank Name', value: data.bank_name },
            { label: 'Account Number', value: data.account_number },
            { label: 'Branch / IFSC', value: data.branch }
        ];

        // Add optional info if present
        if (data.contact_info) {
            fields.push({ label: 'Contact Info', value: data.contact_info });
        }

        let html = '';
        fields.forEach(field => {
            html += `
                <div class="detail-item">
                    <div class="detail-label">${field.label}</div>
                    <div class="detail-value">${field.value}</div>
                </div>
            `;
        });

        detailsList.innerHTML = html;
    }

    function setupCopy(data) {
        copyAllBtn.addEventListener('click', () => {
            let copyText = `Name: ${data.full_name}\n`;
            copyText += `Bank: ${data.bank_name}\n`;
            copyText += `Account No: ${data.account_number}\n`;
            copyText += `Branch: ${data.branch}\n`;
            
            if (data.contact_info) {
                copyText += `Contact: ${data.contact_info}\n`;
            }

            navigator.clipboard.writeText(copyText).then(() => {
                showToast();
            }).catch(err => {
                console.error('Failed to copy', err);
                alert("Failed to copy to clipboard");
            });
        });
    }

    function showToast() {
        copySuccessToast.classList.add('show');
        setTimeout(() => {
            copySuccessToast.classList.remove('show');
        }, 3000);
    }
});
