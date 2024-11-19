## Prerequisites:
1. **Visual Studio 2019+**
2. **Git**
3. **Visual Studio Code**
4. **Android SDK**
5. **Node.js** ([Download Node.js](https://nodejs.org/en))
6. **Chocolatey** ([Install Chocolatey](https://chocolatey.org/install#individual))

## Installation Steps

1. Install Visual Studio Work Tools:
   ```bash
   choco upgrade -y visualstudio2019-workload-vctools
   ```
2. Clone the project repository:
   ```
   git clone https://git.cs.kent.ac.uk/dw341/dominik-przeywozny-51.git
   ```
3. Install npm:
   ```
   npm install -g npm
   ```
4. Install yarn:
   ```
   npm install -g yarn
   ```
5. Navigate to Planup's root directory and initialize expo:
   ```
   yarn add expo
   ```
6. Navigate to Planup's backend directory and install bcrypt:
   ```
   npm install bcrypt
   ```

## Running Planup
1. Start the backend server:
   ```
   npm run dev
   ```
2. Start the frontend using Expo Go:
   ```
   npx expo start
   ```
## Notes
- For Android development, ensure the Android SDK is set up and configured in your environment.
  
