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
            // Encode data client-side (Serverless)
            const payload = {
                n: formData.full_name,
                b: formData.bank_name,
                a: formData.account_number,
                r: formData.branch,
                c: formData.contact_info
            };

            // base64url encode the JSON string safely supporting unicode
            const jsonStr = JSON.stringify(payload);
            const encodedData = btoa(unescape(encodeURIComponent(jsonStr)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            // Construct the scan URL relative to the current folder
            const scanUrl = getScanUrl(encodedData);

            // Success! Generate QR code
            generateQRCode(scanUrl);
            
            // Update UI
            qrPlaceholder.style.display = 'none';
            qrResult.style.display = 'block';
            shareLink.href = scanUrl;
            shareLink.textContent = scanUrl;

            formMessage.textContent = 'QR Code generated successfully!';
            formMessage.className = 'message success';

        } catch (error) {
            console.error('Generation error:', error);
            formMessage.textContent = 'Failed to generate QR Code. Please check your inputs.';
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

    function getScanUrl(encodedData) {
        const loc = window.location;
        // Determine the base path of the current page
        let basePath = loc.pathname;
        if (!basePath.endsWith('/')) {
            const lastSegment = basePath.substring(basePath.lastIndexOf('/') + 1);
            if (lastSegment.includes('.')) {
                basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
            } else {
                basePath = basePath + '/';
            }
        }
        return `${loc.origin}${basePath}scan.html?data=${encodedData}`;
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
