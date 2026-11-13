# MetaRang Frontend Project

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Contribution](#contribution)
- [Development Rules](#development-rules)
- [Code Quality and Security Checks](#code-quality-and-security-checks)
- [FAQ](#faq)

## Introduction

This project is designed as part of the national Iranian metaverse known as **MetaRang**. The goal is to develop a frontend platform that provides users with access to the features of the Iranian national metaverse through an optimized and user-friendly interface. This project is part of the Behesht Supply Chain and aims to create a unique and innovative user experience in virtual and parallel worlds.

## Installation

### 1. Clone the Repository

First, clone the repository to your system:

```bash
git clone https://github.com/iranpsc/Metaverse-Rang-Front-React.git
```

### 2. Navigate to the Project Directory

```bash
cd Metaverse-Rang-Front-React
```

### 3. Install Dependencies

```bash
npm install
```

## Running the Project

### 4. Run the Project

To start the project in development mode:

```bash
npm run dev
```

## Contribution

We welcome contributions that improve the project. Please follow these steps:

1. **Fork the Project:** Fork the repository and work on your own copy.
2. **Create a New Branch:** Create a separate branch for each feature or bug fix:

   ```bash
   git checkout -b feature-name
   ```

3. **Regular Commits:** Use clear, descriptive commit messages:

   ```bash
   git commit -m "Complete explanation of the change"
   ```

4. **Submit a Pull Request:** Submit a pull request for review after checking your changes and following the project quality requirements.

## Development Rules

All contributors are expected to follow these guidelines:

1. **Use Separate Branches:** Implement each feature or bug fix in a separate branch. The branch name should describe the change (for example, `feature-branch`).
2. **Regular and Clear Commits:** Keep commits focused and use descriptive messages.
3. **Review and Approval:** Pull requests must be reviewed by the development team before merging.
4. **Adherence to Coding Standards:** Follow the project's configured linting and code-quality rules.
5. **Code Cleanup:** Do not leave unnecessary, temporary, or test-only code in the project.

## Code Quality and Security Checks

Every pull request targeting `main` is checked by the automated **Code Quality** GitHub Actions workflow. It runs seven independent jobs: ESLint, Knip, jscpd, Semgrep, production build, Gitleaks, and OSV-Scanner. A failure in one job does not stop the others, but **all required jobs must pass for the workflow to pass**.

See **[CODE_QUALITY.md](./CODE_QUALITY.md)** for the complete contributor guide, including each scanner's scope, exact CI command and thresholds, pass/fail criteria, how to interpret findings, local execution instructions, and remediation guidance.

## FAQ

If you encounter any problems or have questions, open an issue in the repository's GitHub Issues section and include the relevant error details.
