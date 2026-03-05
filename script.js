// script.js
function generateLandingPage() {
    const name = document.getElementById('startup-name').value;
    const tagline = document.getElementById('tagline').value;
    const theme = document.getElementById('theme').value;
    const heroImage = document.getElementById('hero-image').value;
    const bgColor = document.getElementById('bg-color').value;
    const textColor = document.getElementById('text-color').value;

    // gather features dynamically
    const featureElements = document.querySelectorAll('.feature-input');
    const features = Array.from(featureElements).map(el => el.value).filter(v => v.trim());

    let featureHtml = '';
    if (features.length) {
        featureHtml = '<section class="features">' +
            features.map(f => `<div>${f}</div>`).join('') +
            '</section>';
    }

    const heroStyle = heroImage ? `background-image:url('${heroImage}');` : '';

    const template = `
<section class="hero" style="${heroStyle}">
    <h1>${name || 'Your Startup'}</h1>
    <p>${tagline || 'A short, catchy tagline here'}</p>
</section>

${featureHtml}`;

    const preview = document.getElementById('preview');
    preview.className = '';
    switch (theme) {
        case 'dark':
            preview.classList.add('theme-dark');
            break;
        case 'gradient':
            preview.classList.add('theme-gradient');
            break;
        case 'minimal':
            preview.classList.add('theme-minimal');
            break;
        default:
            preview.classList.add('theme-light');
    }
    preview.style.backgroundColor = bgColor;
    preview.style.color = textColor;
    preview.innerHTML = template;
}

// wire up buttons and inputs
const inputs = ['startup-name','tagline','hero-image','bg-color','text-color'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', generateLandingPage);
});
document.getElementById('theme').addEventListener('change', generateLandingPage);

// allow adding extra features
const addFeatureBtn = document.getElementById('add-feature-btn');
addFeatureBtn.addEventListener('click', () => {
    const container = addFeatureBtn.parentElement;
    const idx = container.querySelectorAll('.feature-input').length + 1;
    const div = document.createElement('div');
    div.className = 'input-group';
    div.innerHTML = `<label for="feature${idx}">Feature ${idx}</label><input type="text" id="feature${idx}" class="feature-input" placeholder="Feature ${idx}" />`;
    container.insertBefore(div, addFeatureBtn);
    document.getElementById(`feature${idx}`).addEventListener('input', generateLandingPage);
});
document.getElementById('generate-btn').addEventListener('click', generateLandingPage);

document.getElementById('download-btn').addEventListener('click', () => {
    const preview = document.getElementById('preview').innerHTML;
    const theme = document.getElementById('theme').value;
    const bgColor = document.getElementById('bg-color').value;
    const textColor = document.getElementById('text-color').value;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <style>
        body { margin:0; font-family: 'Roboto', sans-serif; background:${bgColor}; color:${textColor}; }
        .hero { text-align:center; padding:60px 20px; background-size:cover; background-position:center; }
        .hero h1 { font-size:2.5rem; margin-bottom:12px; }
        .hero p { font-size:1.25rem; }
        .features { display:flex; justify-content:space-around; padding:40px 20px; }
        .features div { background:rgba(255,255,255,0.8); padding:20px; border-radius:6px; flex:1 1 30%; margin:0 10px; text-align:center; }
        /* theme styles */
        .theme-light { background:#fff; color:#333; }
        .theme-dark { background:#2c2c2c; color:#f4f4f4; }
        .theme-gradient { background:linear-gradient(135deg,#ff7e5f,#feb47b); color:#fff; }
        .theme-minimal { background:#fff; color:#000; font-family:Arial,sans-serif; }
    </style>
</head>
<body class="${theme ? 'theme-'+theme : 'theme-light'}">
    ${preview}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    a.click();
    URL.revokeObjectURL(url);
});

// copy html button
const copyBtn = document.getElementById('copy-btn');
copyBtn.addEventListener('click', () => {
    const previewHtml = document.getElementById('preview').innerHTML;
    navigator.clipboard.writeText(previewHtml).then(() => {
        alert('HTML copied to clipboard');
    }).catch(err => {
        console.error('Copy failed', err);
    });
});
