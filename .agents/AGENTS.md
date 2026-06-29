# Rules & Guidelines

## Browser Agent Invocations
* **Do NOT use browser_subagent for simple changes**: If a change involves only basic business logic, text updates, constants, or backend configurations, do NOT launch the browser subagent.
* **Preferred Verification**: Use direct code inspection, TypeScript type-checking, or standard terminal build scripts (e.g., `npm run build`) to verify changes.
* **Allowed Browser Agent Scopes**: Only use the browser subagent when:
  1. Specifically requested by the user.
  2. Debugging complex visual layouts, CSS issues, responsive behavior, or touch area issues.
  3. Troubleshooting interactive front-end flows that cannot be verified statically.
