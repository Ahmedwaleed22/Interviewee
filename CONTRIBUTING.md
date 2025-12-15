# Contributing to Interviewee Frontend

Thank you for your interest in contributing to Interviewee Frontend! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the Issues section
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - A clear description of the feature
   - Use cases and examples
   - Potential implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   yarn dev
   ```
   - Test manually in the browser
   - Ensure no console errors
   - Check responsive design on different screen sizes

4. **Commit your changes**:
   ```bash
   git commit -m "Add: descriptive commit message"
   ```
   - Use clear, descriptive commit messages
   - Follow conventional commit format when possible

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

1. Fork and clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Create `.env.local` with your API keys:
   ```bash
   OPENAI_API_KEY=your_api_key_here
   ```
5. Run the development server:
   ```bash
   yarn dev
   ```

## Code Style Guidelines

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Keep components small and focused
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow the existing code formatting (Prettier)

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable React components
- `/public` - Static assets

## Questions?

Feel free to open an issue for any questions about contributing!

