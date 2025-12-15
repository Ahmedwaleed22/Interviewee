# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[security@example.com](mailto:security@example.com)**. You will receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## Security Best Practices

### API Keys
- Never commit API keys or secrets to the repository
- Use environment variables for sensitive configuration
- Rotate API keys regularly
- Use `.env.local` for local development (already in `.gitignore`)

### Dependencies
- Keep dependencies up to date
- Review security advisories for dependencies
- Use `yarn audit` to check for vulnerabilities

### Data Privacy
- Do not store sensitive user data without proper encryption
- Follow GDPR and privacy regulations
- Implement proper authentication and authorization

## Known Security Considerations

- OpenAI API keys must be kept secure
- User input should be sanitized before processing
- API routes should implement rate limiting
- CORS should be properly configured for production

## Security Updates

We recommend:
- Subscribing to GitHub security alerts
- Regularly updating dependencies
- Reviewing security advisories from Next.js and React

