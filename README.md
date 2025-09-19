# Strategickhaos — AI-run nonprofit DAO

> Personal GitHub Pages site for Strategickhaos DAO LLC, compliance repos, and SNHU capstone projects.

## Overview

This repository contains the source code for a dark-mode responsive portfolio website showcasing the work of Strategickhaos, an AI-run nonprofit DAO. The site demonstrates expertise in automation, cybersecurity, compliance, and self-audit capabilities through a modern, accessible web interface.

## Features

### Design & UX
- **Dark Mode Theme**: Professional dark color scheme optimized for readability
- **Responsive Design**: Mobile-first approach ensuring optimal viewing on all devices
- **Sticky Navigation**: Smooth scrolling navigation with active section highlighting
- **Interactive Elements**: Hover effects, transitions, and scroll-triggered animations
- **Accessibility**: WCAG compliant with keyboard navigation support

### Sections
1. **Hero**: Introduction to Strategickhaos with call-to-action buttons
2. **Highlights**: Core competencies in Automation, Cybersecurity, Compliance, and Self-Audit
3. **Evidence Grid**: Tabbed interface showcasing repository links, live sites, and CI artifacts
4. **Timeline**: Project milestones and development progress
5. **Capstone Outcomes**: SNHU capstone project results and achievements
6. **Footer**: Disclaimer and additional information

### Technical Implementation
- **Static HTML/CSS/JS**: No external dependencies or frameworks
- **JSON Data Management**: Dynamic content loading for evidence links
- **SVG Assets**: Scalable vector graphics for icons and logos
- **GitHub Pages Compatible**: Optimized for GitHub Pages deployment

## File Structure

```
Me10101-01.github.io/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet with dark mode theme
│   ├── js/
│   │   └── main.js           # Interactive functionality
│   └── svg/
│       └── logo.svg          # Site logo and icons
├── data/
│   └── evidence.json         # Evidence grid data
├── README.md                 # This documentation
└── LICENSE                   # MIT License
```

## Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Optional: Local web server for development

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Me10101-01/Me10101-01.github.io.git
   cd Me10101-01.github.io
   ```

2. Open `index.html` in your browser or serve via a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000` to view the site locally

### GitHub Pages Deployment
The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. Visit: https://me10101-01.github.io

## Customization

### Updating Content
- **Evidence Links**: Modify `data/evidence.json` to update repository links, live sites, and CI artifacts
- **Timeline**: Edit the timeline section in `index.html` to reflect current project milestones
- **Capstone Outcomes**: Update the capstone section with specific achievements and results

### Styling
- **Colors**: Modify CSS custom properties in `:root` to change the color scheme
- **Typography**: Update font families and sizes in the CSS variables
- **Layout**: Adjust grid layouts and spacing using CSS Grid and Flexbox

### Functionality
- **Navigation**: Customize scroll behavior and active link detection in `main.js`
- **Animations**: Modify intersection observer settings for scroll-triggered animations
- **Evidence Grid**: Update the tab functionality and content loading logic

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance

- **Lighthouse Score**: Optimized for 90+ scores in all categories
- **Core Web Vitals**: Meets Google's performance standards
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Semantic HTML and meta tags for search optimization

## Contributing

This is a personal portfolio site, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **GitHub**: [@Me10101-01](https://github.com/Me10101-01)
- **Website**: [https://me10101-01.github.io](https://me10101-01.github.io)

## Acknowledgments

- Built as part of SNHU capstone project requirements
- Demonstrates practical application of web development best practices
- Showcases integration of academic learning with real-world implementation

---

**Disclaimer**: This site serves as a portfolio demonstration for academic purposes. All projects and implementations are part of educational coursework and professional development. The information presented reflects ongoing learning and skill development in cybersecurity, automation, and compliance domains.