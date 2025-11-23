# 🏥 GoodDoctor - Healthcare Review Platform

A simple, lightweight, and independent platform for reviewing doctors, hospitals, and laboratories. Similar to Glassdoor/AmbitionBox but focused on healthcare professionals and facilities.

## ✨ Features

- **Review Healthcare Providers**: Share your experience with doctors, hospitals, and laboratories
- **Verified Reviews**: All reviews require proof of visit (OP ID, prescription, bill, medical report, appointment card)
- **Create Profiles**: Add new healthcare provider profiles if they don't exist
- **Search & Filter**: Find healthcare providers by name, location, department, or specialization
- **Detailed Ratings**: Rate specific aspects like behavior/attitude, wait time, and cleanliness
- **Anonymous Reviews**: Option to post reviews anonymously or with your name
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Independent Platform**: No external influence - genuine patient reviews only

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MidhunGopi/GoodDoctor.git
cd GoodDoctor
```

2. Open `index.html` in your web browser, or serve it with a local web server:

**Using Python:**
```bash
python3 -m http.server 8080
```

**Using Node.js:**
```bash
npx http-server -p 8080
```

3. Navigate to `http://localhost:8080` in your browser

## 📱 Usage

### Adding a Healthcare Provider Profile

1. Click on **"Add Profile"** in the navigation
2. Select the type (Doctor, Hospital, or Laboratory)
3. Fill in the required information:
   - For Doctors: Name, specialization, qualification, experience, department, location
   - For Hospitals: Name, type, bed capacity, departments, location
   - For Labs: Name, services, accreditation, location
4. Click **"Create Profile"**

### Submitting a Review

1. Click on **"Add Review"** in the navigation
2. Select the review type (Doctor, Hospital, or Lab)
3. Choose the provider from the dropdown
4. Rate your overall experience (1-5 stars)
5. Provide the visit date and review details
6. Rate specific aspects (behavior, wait time, cleanliness)
7. **Important**: Provide proof of visit:
   - OP/Patient ID
   - Prescription
   - Bill/Receipt
   - Appointment Card
   - Medical Report
8. Optionally add your name (or remain anonymous)
9. Click **"Submit Review"**

### Searching for Providers

1. Click on **"Search Reviews"** in the navigation
2. Enter search terms (name, location, department, etc.)
3. Use the filter to narrow by type (All, Doctors, Hospitals, Labs)
4. Click **"Search"** or press Enter
5. View detailed profiles and click **"View Reviews"** to see all reviews

## 🏗️ Architecture

### Technology Stack

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with modern flexbox and grid layouts
- **Vanilla JavaScript**: No frameworks or dependencies
- **localStorage**: Client-side data persistence

### File Structure

```
GoodDoctor/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Application logic and data management
└── README.md           # Documentation
```

### Key Components

1. **Navigation System**: Tab-based navigation between sections
2. **Profile Management**: Create and store healthcare provider profiles
3. **Review System**: Submit and display verified reviews
4. **Search Engine**: Filter and find healthcare providers
5. **Storage Layer**: LocalStorage for data persistence

## 🔒 Security

- **XSS Protection**: All user input is HTML-escaped before rendering
- **Data Validation**: Form validation on both client-side
- **Proof Verification**: Reviews require proof of visit documentation
- **Anonymous Options**: Users can choose to remain anonymous

## 📊 Sample Data

The application comes pre-loaded with sample data including:
- 1 Doctor profile (Dr. Sarah Johnson - Cardiologist)
- 1 Hospital profile (City General Hospital)
- 1 Lab profile (HealthCare Diagnostics)
- 4 Sample reviews with different ratings and feedback

This helps users understand how the platform works before adding their own content.

## 🎨 Design Philosophy

- **Lightweight**: No external dependencies or frameworks
- **Fast Loading**: Minimal CSS and JavaScript
- **User-Friendly**: Intuitive interface with clear navigation
- **Responsive**: Mobile-first design approach
- **Accessible**: Semantic HTML and proper ARIA labels

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📝 License

This project is open source and available for educational and non-commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Support

For issues or questions, please open an issue on GitHub.

## 🙏 Acknowledgments

Built with the goal of empowering patients with transparent, genuine reviews of healthcare providers.
