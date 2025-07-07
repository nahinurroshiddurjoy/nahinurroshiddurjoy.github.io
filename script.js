document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    const codeInput = document.getElementById('codeInput');
    const stdInput = document.getElementById('stdInput');
    const runButton = document.getElementById('runButton');
    const outputArea = document.getElementById('outputArea');
    const previewArea = document.getElementById('previewArea');
    const previewContainer = previewArea.parentElement; // Get the container of the iframe

    // Function to toggle visibility of preview and input areas
    function toggleAreas(language) {
        if (language === 'html' || language === 'css' || language === 'javascript') {
            previewContainer.style.display = 'block';
            stdInput.parentElement.style.display = 'none'; // Hide stdin for client-side
            outputArea.parentElement.style.display = 'none'; // Hide output for client-side initially
        } else {
            previewContainer.style.display = 'none';
            stdInput.parentElement.style.display = 'block'; // Show stdin for server-side
            outputArea.parentElement.style.display = 'block'; // Show output for server-side
        }
    }

    // Initial setup based on default selected language
    toggleAreas(languageSelect.value);

    languageSelect.addEventListener('change', () => {
        const selectedLanguage = languageSelect.value;
        toggleAreas(selectedLanguage);
        // Clear areas on language change
        codeInput.value = '';
        stdInput.value = '';
        outputArea.textContent = '';
        previewArea.srcdoc = ''; // Clear iframe
        if (selectedLanguage === 'html') {
            codeInput.placeholder = 'Enter HTML code...';
        } else if (selectedLanguage === 'css') {
            codeInput.placeholder = 'Enter CSS code...';
        } else if (selectedLanguage === 'javascript') {
            codeInput.placeholder = 'Enter JavaScript code... \n// Use console.log() for output, it will appear in browser console';
        } else {
            codeInput.placeholder = 'Enter your code here...';
        }
    });

    runButton.addEventListener('click', async () => {
        const language = languageSelect.value;
        const code = codeInput.value;
        const input = stdInput.value;

        outputArea.textContent = 'Running...'; // Show loading state

        if (language === 'html' || language === 'css' || language === 'javascript') {
            // Client-side execution for HTML/CSS/JS
            if (language === 'html') {
                previewArea.srcdoc = code;
                outputArea.textContent = 'HTML rendered in preview.';
            } else if (language === 'css') {
                // For CSS, we assume it's applied to some HTML.
                // A simple way is to inject it into a style tag within the preview iframe.
                // For a standalone CSS preview, this might need to be combined with sample HTML.
                previewArea.srcdoc = `<style>${code}</style><div>Previewing CSS. Add HTML to see it in action.</div>`;
                outputArea.textContent = 'CSS applied in preview. (Best viewed with HTML)';
            } else if (language === 'javascript') {
                try {
                    // For security and isolation, it's better to run JS in the iframe too.
                    // This also allows the script to interact with the iframe's document.
                    previewArea.srcdoc = `<script>${code}<\/script>`; // Escaping </script> is important
                    outputArea.textContent = 'JavaScript executed in preview. Check browser console for logs.';
                } catch (e) {
                    outputArea.textContent = `Error: ${e.message}`;
                }
            }
        } else {
            // Server-side execution for other languages
            try {
                const response = await fetch('compile.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        language: language,
                        code: code,
                        input: input
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
                }

                const result = await response.json();

                if (result.error) {
                    outputArea.textContent = `Error:\n${result.error}`;
                } else {
                    outputArea.textContent = result.output;
                }
            } catch (error) {
                outputArea.textContent = `Failed to run code: ${error.message}`;
                console.error("Fetch error:", error);
            }
        }
    });

    // Basic live preview for HTML, CSS, JS (runs on code input change)
    // More sophisticated live preview would debounce this.
    codeInput.addEventListener('input', () => {
        const language = languageSelect.value;
        const code = codeInput.value;
        if (language === 'html') {
            previewArea.srcdoc = code;
        } else if (language === 'css') {
            // Basic live update for CSS: assumes some HTML context might be needed
            // This example just injects the CSS. For full live editing,
            // you might want to combine HTML and CSS from separate textareas.
            previewArea.srcdoc = `<style>${code}</style><div>Previewing CSS. Type HTML in another editor or load a base HTML structure.</div>`;
        }
        // Live preview for JS is trickier due to execution context and potential errors.
        // For now, JS live preview is triggered by the run button.
    });
});
