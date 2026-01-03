# Contributing to SikshaBuddy

Thank you for your interest in contributing to SikshaBuddy! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Siksha_buddy.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## 📋 Development Guidelines

### Code Style

- **Backend**: Follow Node.js/Express conventions
- **Frontend**: Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Structure

- Keep routes in `server/routes/`
- Business logic in `server/services/`
- Utilities in `server/utils/`
- React components in `client/src/components/`
- Pages in `client/src/pages/`

### Database Changes

- Always create migration files for schema changes
- Test migrations on a copy of production data
- Document breaking changes

### API Changes

- Update `API_DOCUMENTATION.md` for any API changes
- Maintain backward compatibility when possible
- Version APIs if breaking changes are necessary

## 🧪 Testing

Before submitting:

1. Test all affected features
2. Test error cases
3. Test edge cases
4. Verify database queries work correctly
5. Check for console errors
6. Test on different browsers (if frontend changes)

## 📝 Commit Messages

Use clear, descriptive commit messages:

- `Add: Feature description`
- `Fix: Bug description`
- `Update: Change description`
- `Refactor: Refactoring description`
- `Docs: Documentation update`

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (OS, Node version, etc.)

## 💡 Feature Requests

For feature requests:

1. Check if it's already planned or exists
2. Describe the feature clearly
3. Explain the use case
4. Suggest implementation approach (optional)

## 🔒 Security

- Never commit API keys or secrets
- Report security vulnerabilities privately
- Follow secure coding practices
- Validate all user inputs

## 📚 Documentation

- Update README.md for major changes
- Update API_DOCUMENTATION.md for API changes
- Add code comments for complex logic
- Update SETUP.md for setup changes

## ✅ Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] No linting errors
- [ ] Commits are clear and descriptive
- [ ] Branch is up to date with main

## 🎯 Priority Areas

We're especially interested in contributions for:

- [ ] Audio lesson generation
- [ ] PDF export functionality
- [ ] Advanced RAG implementation
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations
- [ ] Additional language support
- [ ] Test coverage
- [ ] Documentation improvements

## 📞 Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing to SikshaBuddy! 🎓

