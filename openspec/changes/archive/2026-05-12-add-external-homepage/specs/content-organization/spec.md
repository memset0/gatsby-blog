## MODIFIED Requirements

### Requirement: Static Folders Copied Verbatim
The build SHALL copy the contents of `./assets`, `./content/assets`, `./src/images`, and `./homepage` into the output site root as-is, so URLs such as `/img.png` resolve regardless of which folder hosted the source file.

#### Scenario: Asset reachable by URL after build
- **WHEN** `content/assets/diagram.png` exists at build time
- **THEN** `https://<site>/diagram.png` serves that file

#### Scenario: Homepage asset reachable by URL after build
- **WHEN** `homepage/assets/avatar.png` exists at build time
- **THEN** `https://<site>/assets/avatar.png` serves that file (path within `homepage/` is preserved)
