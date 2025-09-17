---
title: Home
layout: default
---

<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
// Transform fenced ```mermaid code blocks into <div class="mermaid"> for client-side rendering
document.addEventListener('DOMContentLoaded', () => {
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    document.querySelectorAll('pre > code.language-mermaid').forEach(code => {
      const pre = code.parentElement;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code.textContent;
      pre.replaceWith(div);
    });
    mermaid.init();
  }
});
</script>

# This page discourages search indexing. It is not access control.
<meta name="robots" content="noindex,nofollow">

# YFP Credit Evaluation Docs

Welcome! This site serves the project documentation from the `docs/` folder.

- Start here: [Functional Specification (Section-by-Section)](./specification.md)
- System view: [Architecture & Implementation Notes](./ARCHITECTURE.md)

Tips
- Mermaid diagrams are rendered in your browser via the script above.
- For best readability, open in a wide browser window.
