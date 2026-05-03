# Automated LaTeX Resume Builder

A streamlined, modular system for generating a professional LaTeX-based resume. This project automates the process of injecting dynamic content into a static LaTeX template, decoupling the resume data from its presentation.

## Features

- **Content-Presentation Decoupling:** Manage all your resume content in a simple `data.json` file without ever having to touch raw LaTeX code for updates.
- **Node.js & EJS Build System:** Uses an EJS-based templating engine via a custom Node script (`builder.js`) to compile the JSON data into a `.tex` file.
- **Automatic LaTeX Escaping:** Automatically handles special LaTeX characters in your JSON data to prevent compilation errors.
- **Asset Management:** Ensures that local assets (like profile photos) are correctly managed and included for easy portability and compilation in services like Overleaf.

## Usage

1. **Install Dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Update Content:**
   Edit the `data.json` file with your latest experience, education, and skills.

3. **Build the Resume:**
   Run the build script to generate the final LaTeX file (`build/resume.tex`):
   ```bash
   node builder.js
   ```

4. **Compile:**
   Take the output from the `build/` directory and compile it using your preferred LaTeX compiler (e.g., pdfLaTeX, XeLaTeX) or simply upload it to Overleaf along with any referenced assets (like photos in the `media/` directory).
