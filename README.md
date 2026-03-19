# Bank Details QR Code System

A modern, full-stack application that allows users to securely input their bank details, generates a QR code, and allows scanning of the QR code to view the details on a secure, clean webpage with a one-click copy feature.

## Features
- **Modern UI**: Polished glassmorphism dark theme.
- **Auto QR Generation**: Uses `qrcode.js` to create scannable QR codes instantly.
- **Secure Links**: Bank details are saved in MySQL and attached to a unique UUID link.
- **Copy to Clipboard**: Scan page has a one-click button to copy the bank details securely formatted.
- **Responsive**: Fully scalable for mobile and desktop screens.

## Project Structure
```
📂 QR generator
 ├── 📄 schema.sql      (Database setup script)
 ├── 📄 .env.example    (Environment configurations)
 ├── 📄 package.json    (Node.js dependencies)
 ├── 📄 server.js       (Express backend application)
 └── 📂 public          (Frontend Assets)
      ├── 📄 index.html (Main Form and QR generator view)
      ├── 📄 style.css  (Premium Styles)
      ├── 📄 app.js     (Frontend logic for index.html)
      ├── 📄 scan.html  (The page shown when QR is scanned)
      └── 📄 scan.js    (Frontend logic to fetch details inside scan.html)
```

## Step-by-Step Setup Guide

### 1. Requirements
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://dev.mysql.com/downloads/) (Running locally or on a server, e.g., via XAMPP)

### 2. Setup the Database
1. Open your MySQL client (like phpMyAdmin or MySQL Workbench).
2. Copy the contents of `schema.sql`.
3. Run the SQL script to create the `bank_qr_db` database and the `bank_details` table.

### 3. Configure the Project
1. Open terminal inside the project folder (`c:\Users\imtel pro\Desktop\QR generator`).
2. Run `npm install` to install dependencies (already done).
3. Copy the `.env.example` file and rename it to `.env`.
4. Open `.env` and configure your database credentials (e.g., set root password if any).

### 4. Run the Server
1. In the terminal, run the following command:
   ```bash
   npm start
   ```
2. You should see a message stating: `Server running on http://localhost:3000` and `Connected to MySQL database successfully.`

### 5. Using the System
1. **Generate QR**: Open [http://localhost:3000](http://localhost:3000) in your web browser. Fill in the bank details and click "Generate QR Code". You can then download the resulting code.
2. **Scan QR**: Scan the downloaded QR code with your mobile device or navigate directly to the displayed share link.
3. **Copy Details**: On the scanned page, you will see the beautifully formatted details and a single button to "Copy All Details" to your clipboard.

## Customizing the Host URL (For Production / Network Use)
Currently, the QR code encodes a link using `localhost`. 
If you want to scan the QR code with your phone *while on the same Wi-Fi network*, you must run the node server with your local IPv4 address and replace `localhost` in your `.env` or access the site via `http://<YOUR_LOCAL_IP>:3000`. The server dynamically generates the QR link based on the host you used to access the site!
