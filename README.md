## Hack4Good-2025

### Muhammadiyah Welfare Home (MWH) System 
![MWH logo](https://mwh.muhammadiyah.org.sg/wp-content/uploads/2021/06/MWHLOGO-2021-01.png)

#### Inspiration 
This project was inspired by the growing need for efficient e-commerce solutions that cater to both customers and administrators. By focusing on a community-based system, we aimed to create a platform that ensures equitable access to resources while providing administrators with comprehensive tools to manage inventory and sales effectively.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Getting started](#getting-started)
4. [Next steps](#next-steps)

## Overview
This project is designed to empower the residents of Muhammadiyah Welfare Home and streamline its operations. It consists of two main components: a Backend for managing data and a Frontend for user interaction.


## Features

- **Frontend Development:** Created with HTML, CSS, JavaScript and React, ensuring a responsive and intuitive design. Bootstrap was used to streamline styling and ensure consistency.
- **Backend Development:**  Python Flask acted as the backbone, pulling and pushing data between the user interfaces and the SQL database.
- **Database Management:** The SQL database housed tables for inventory, orders, admin actions, resident accounts, and coupons. Supabase facilitated authentication and synced user data with SQL.
- **Features Implementation:** Shopping functionality was linked with dynamic cart updates, while admin functionalities included user and inventory management, along with reporting and analytics features.


---

## Getting started
Follow these steps to set up the project on your local machine. 

Clone the Repository
Start by cloning the repository to your local device:

git clone <repository-url>

Replace with the URL of your Git repository.


## Backend
Run the following command to install all dependencies:
```bash
pip install -r requirements.txt
```
The backend is built using Flask and requires the following structure:
```bash
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import base64
from app import database  # Imports database.py for data management

app = Flask(__name__)
CORS(app)
```



## Frontend 

#### `npm start`

Run cd C:\Hack4Good-2025\frontend to change the file directory to frontend folder.
Run npm install
Run npm start 
Run y for yes to run in a separate browser if prompted.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Run cd C:\Hack4Good-2025\management to change the file directory to management folder.
Run npm install
Run npm start 
Run y for yes to run in a separate browser if prompted.
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

##### Other information 

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## Next steps
- Mobile App Development: Expanding the platform to include a mobile application for even greater accessibility and convenience.
- Enhanced Analytics: Implementing AI-driven insights to provide predictive analytics on stock trends and customer purchasing behavior.
- Gamification Features: Introducing features like reward points or badges for frequent shoppers to increase user engagement.
- Scalability Improvements: Optimizing the platform to handle a larger volume of users and data as the user base grows.
- Community Feedback Integration: Actively seeking feedback from users to iterate and improve the platform further.
- Expanded Features: Adding support for promotions, coupon management, and loyalty programs to provide a more engaging shopping experience.