# Contributing to SVG Converter MCP Server

Thank you for your interest in contributing to SVG Converter MCP Server! We welcome contributions from the community to help improve and expand this project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/yourusername/mcp-svg-converter.git
   cd mcp-svg-converter
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Create a new branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes
2. Build and test locally
   ```bash
   npm run build
   npm run test:build
   ```
3. Commit your changes with a descriptive commit message
4. Push to your fork
5. Submit a pull request to the main repository

## Pull Request Guidelines

- Ensure your code follows the project's coding style
- Include tests for any new functionality
- Update documentation as needed
- Keep pull requests focused on addressing a single concern
- Reference any relevant issues in your PR description

## Code Style

This project uses TypeScript with the following conventions:
- Use 2 spaces for indentation
- Use camelCase for variable and function names
- Use PascalCase for class names
- Use explicit types instead of `any` where possible

## Testing

Before submitting your PR, make sure all tests pass:

```bash
npm run test:build
```

## Reporting Issues

When reporting issues, please include:
- A clear description of the issue
- Steps to reproduce the problem
- Expected and actual behavior
- Version information for Node.js, npm, and the project
- Any relevant error messages or logs

## Feature Requests

Feature requests are welcome! Please provide:
- A clear description of the feature
- Any relevant use cases
- How the feature would benefit the project

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
