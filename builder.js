const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { execSync } = require('child_process');

function buildResume() {
    console.log("Loading data.json...");
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // Automatically escape & and % so LaTeX doesn't crash
    function escapeLatex(obj) {
        if (typeof obj === 'string') {
            return obj.replace(/(?<!\\)&/g, '\\&').replace(/(?<!\\)%/g, '\\%');
        } else if (Array.isArray(obj)) {
            return obj.map(escapeLatex);
        } else if (typeof obj === 'object' && obj !== null) {
            const newObj = {};
            for (const key in obj) {
                newObj[key] = escapeLatex(obj[key]);
            }
            return newObj;
        }
        return obj;
    }
    
    data = escapeLatex(data);

    const buildDir = path.join(__dirname, 'build');
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }

    // Check if the photo exists
    if (data.personal && data.personal.photo) {
        // Resolve the source photo path relative to the root directory
        const sourcePhotoPath = path.resolve(__dirname, data.personal.photo);
        
        if (!fs.existsSync(sourcePhotoPath)) {
            console.log(`Warning: Photo file not found locally at: ${sourcePhotoPath}`);
            console.log("The file wasn't copied, but the LaTeX code will still be generated for Overleaf.");
            data.personal.photo = path.basename(sourcePhotoPath); // Keep just the filename for LaTeX
        } else {
            // Copy the photo to the build directory
            const photoFileName = path.basename(sourcePhotoPath);
            const destPhotoPath = path.join(buildDir, photoFileName);
            fs.copyFileSync(sourcePhotoPath, destPhotoPath);
            console.log(`Copied photo to ${destPhotoPath}`);
            
            // Update the data so the LaTeX template uses the local filename
            data.personal.photo = photoFileName;
            console.log("Photo found! It will be included in the resume.");
        }
    }

    console.log("Loading template...");
    const templateStr = fs.readFileSync('resume_template.tex', 'utf8');

    console.log("Rendering template with EJS...");
    const renderedLatex = ejs.render(templateStr, data);



    const texPath = path.join(buildDir, 'resume.tex');
    fs.writeFileSync(texPath, renderedLatex, 'utf8');
    console.log(`Rendered LaTeX saved to ${texPath}`);

    console.log("Compiling PDF...");
    try {
        // Run pdflatex. Note that the command runs with cwd set to the build directory.
        // We pass 'resume.tex' which is the filename inside the build directory.
        execSync('pdflatex -interaction=nonstopmode resume.tex', {
            cwd: buildDir,
            stdio: 'inherit'
        });
        console.log("PDF compiled successfully! Check build/resume.pdf");
    } catch (err) {
        console.log("Warning: pdflatex command failed or was not found.");
        console.log("The resume.tex file was generated successfully in the build/ directory.");
        console.log("If you do not have LaTeX installed on your system, you can upload build/resume.tex to Overleaf to compile it.");
    }
}

buildResume();
