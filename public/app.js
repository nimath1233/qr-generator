document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bankForm');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('span');
    const btnLoader = document.getElementById('btnLoader');
    const formMessage = document.getElementById('formMessage');
    
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const qrResult = document.getElementById('qrResult');
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareLink = document.getElementById('shareLink');

    let qrCodeInstance = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset UI
        formMessage.textContent = '';
        formMessage.className = 'message';
        setLoading(true);

        // Gather data
        const formData = {
            full_name: document.getElementById('fullName').value.trim(),
            bank_name: document.getElementById('bankName').value.trim(),
            account_number: document.getElementById('accountNumber').value.trim(),
            branch: document.getElementById('branch').value.trim(),
            contact_info: document.getElementById('contactInfo').value.trim()
        };

        try {
            // Send to backend
            const response = await fetch('/api/bank-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate QR Code');
            }

            // Success! Generate QR code
            generateQRCode(result.scanUrl);
            
            // Update UI
            qrPlaceholder.style.display = 'none';
            qrResult.style.display = 'block';
            shareLink.href = result.scanUrl;
            shareLink.textContent = result.scanUrl;

            formMessage.textContent = 'Details saved successfully!';
            formMessage.className = 'message success';

        } catch (error) {
            console.error('Submission error:', error);
            formMessage.textContent = error.message;
            formMessage.className = 'message error';
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            qrResult.style.display = 'none';
            qrPlaceholder.style.display = 'block';
        } else {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    }

    function generateQRCode(url) {
        // Clear previous QR code if exists
        qrcodeContainer.innerHTML = '';
        
        // Generate new QR Code
        qrCodeInstance = new QRCode(qrcodeContainer, {
            text: url,
            width: 250,
            height: 250,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    // Download QR Code functionality
    downloadBtn.addEventListener('click', () => {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (canvas) {
            const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let link = document.createElement('a');
            link.download = 'bank-details-qr.png';
            link.href = image;
            link.click();
        } else {
            // Sometimes it renders as img on older browsers
            const img = qrcodeContainer.querySelector('img');
            if (img && img.src) {
                let link = document.createElement('a');
                link.download = 'bank-details-qr.png';
                link.href = img.src;
                link.click();
            }
        }
    });
});
