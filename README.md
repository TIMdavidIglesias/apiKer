# apiKer - Streamlining API Development with Express.js

[![Documentation](https://img.shields.io/badge/apiKer-Docs-blue)](https://timdevelopers.com)

apiKer is an innovative framework that harnesses the power of Express.js, aiming to streamline the creation of secure endpoints while maintaining a lean and efficient codebase.

## Key Features

- **Flexible Configuration:** Distinguish apiKer with its complete and flexible parametric configuration. Fine-tune and customize the behavior of the API environment based on specific client requirements.

- **Simplicity at its Core:** apiKer stands out as a game-changer due to its inherent simplicity. Creating new endpoints is a straightforward task, requiring nothing more than a controller file and a route definition.

- **Diverse Controllers:** apiKer offers a diverse array of controllers, including the exclusive 'gSix' extension, providing you with various options for handling different aspects of your API.

- **Swagger-UI Integration:** Seamlessly integrate with Swagger-UI to enhance your API's documentation and testing capabilities.

- **Built-in Request Tracing:** Monitor errors or unexpected behaviors within the API environment with apiKer's built-in request tracing system, adding an extra layer of security.

## Getting Started

## First Run/Setup

The initial setup of apiKer is crucial for a smooth development workflow. During the first run, apiKer installs itself, seeking installation data. If not found, it is considered a 'new installation,' and the installation metadata is stored in the database. This information becomes accessible in each subsequent execution, stored in the core of the application like an internal cache.

Once installed, apiKer no longer relies on installation metadata files, except for `_env`, essential for the 'igniter' to function and containing crucial data for the execution and startup of apiKer.

### Getting Started

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/timdevelopersCEO/apiKer
    cd apiKer
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Compile TypeScript (if applicable):**
    ```bash
    npm run build
    ```

4. **Run the Application:**
    ```bash
    npm start
    ```

## kerLocker Auth Client

The KerLocker Auth Client is a tool designed to automatically handle the task of secret token authentication outside the user request execution process. This way, the secret token is managed in the background. This app should work in the Web App Environment.

### kerLocker Args Type:

### kerLocker Args Data Example:

### Run kerLocker Auth Client:

1. **Change directory:**
    ```bash
    cd kerLocker
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Compile TypeScript (if applicable):**
    ```bash
    npm run build
    ```

4. **Run the Application:**
    ```bash
    npm start
    ```

For detailed documentation and usage guidelines, refer to the [apiKer Docs](https://timdevelopers.com).
