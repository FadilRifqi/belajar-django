# Full-Stack Django & React Project

Welcome to my full-stack project where I am combining the power of Django for the backend and React with Vite for the frontend.

## Project Overview

This project aims to create a robust and scalable web application using the following technologies:

- **Django**: A high-level Python web framework that encourages rapid development and clean, pragmatic design.
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A build tool that aims to provide a faster and leaner development experience for modern web projects.

## Features

- **User Authentication**: Secure user registration and login functionality.
- **RESTful API**: A well-structured API to handle all backend operations.
- **Responsive UI**: A modern and responsive user interface built with React.
- **Real-time Updates**: Implementing real-time features using WebSockets.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.x
- Node.js
- npm or yarn
- Django
- Vite

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/FadilRifqi/belajar-django.git
   cd belajar-django
   ```

2. **Backend Setup**:

   ```sh
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

## Project Structure

```plaintext
yourproject/
├── backend/
│   ├── manage.py
│   ├── yourapp/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
├── README.md
└── ...
```
