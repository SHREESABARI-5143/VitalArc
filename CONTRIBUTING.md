# Contributing to VitalArc

Thank you for your interest in contributing to **VitalArc**! We welcome contributions from developers, machine learning practitioners, and medical AI researchers.

---

## 🧭 Code of Conduct

Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) to keep this project a welcoming, respectful environment.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/your-username/VitalArc.git
   cd VitalArc
   ```
3. **Create a topic branch**:
   ```bash
   git checkout -b feat/enhance-gradcam-overlay
   ```

---

## 🛠️ Development Standards

### Frontend (TypeScript / React)
- Follow strict typing: Avoid using `any` whenever possible.
- Use functional React components and custom hooks for shared state or side-effects.
- Verify styling consistency with Tailwind CSS utility tokens.
- Run typecheck and linting:
  ```bash
  npm run typecheck
  npm run lint
  ```

### Backend & ML (Python)
- Follow **PEP 8** style guidelines.
- Use explicit type hints (`from typing import Optional, List, Dict`).
- Keep controllers thin and place domain/inference logic in service modules.
- Ensure all new endpoints have matching `pytest` unit tests:
  ```bash
  pytest backend/tests/
  ```

---

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Adds a new feature (e.g., `feat: integrate SegFormer lesion segmentation`)
- `fix:` Fixes a bug (e.g., `fix: handle missing base64 header on image upload`)
- `docs:` Documentation only changes
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests or correcting existing tests
- `perf:` A code change that improves performance

---

## 📬 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feat/enhance-gradcam-overlay
   ```
2. Open a Pull Request on GitHub against the `main` branch.
3. Fill out all sections in the [PR template](.github/PULL_REQUEST_TEMPLATE.md).
4. Verify all automated CI checks pass.
