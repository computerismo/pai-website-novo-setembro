# Mobile Responsiveness Report

**Date:** January 7, 2026  
**Viewport Tested:** 375px × 812px (iPhone X/11/12/13)

---

## Executive Summary

This report identifies mobile responsiveness issues across all accessible pages of the website. The main problems are **oversized headings**, **insufficient horizontal padding**, **sticky header overlap**, and **text overflow** in certain sections.

---

## Global Issues (Affecting All Pages)

### 1. Navigation & Header

| Issue                  | Description                                                       | Solution                                           |
| ---------------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| Header Height          | Navbar is too tall on mobile, causing page content overlap        | Reduce vertical padding on mobile: `py-2 md:py-4`  |
| Sticky Header Overlap  | When navigating via anchor links, content lands behind the header | Add `scroll-mt-24` to all section elements         |
| Mobile Menu Background | Menu backdrop is too transparent against busy backgrounds         | Increase opacity: `bg-white/95` or use solid white |

### 2. Typography

| Issue        | Description                                                    | Solution                                                   |
| ------------ | -------------------------------------------------------------- | ---------------------------------------------------------- |
| H1 Font Size | Main headings (`text-5xl`, `text-6xl`) are too large for 375px | Use responsive classes: `text-3xl md:text-5xl lg:text-6xl` |
| H2 Font Size | Section headings (`text-4xl`) cause overflow                   | Use responsive classes: `text-2xl md:text-4xl`             |

### 3. Container Padding

| Issue        | Description                                      | Solution                              |
| ------------ | ------------------------------------------------ | ------------------------------------- |
| Edge Touch   | Content touches screen edges in many sections    | Increase padding: `px-6 md:px-4`      |
| Card Margins | Cards have thin margins relative to screen width | Add `mx-2` or use `px-6` on container |

---

## Page-Specific Issues

### Home Page (`/`)

#### Hero Section

| Element     | Issue                            | Current                            | Fix                                            |
| ----------- | -------------------------------- | ---------------------------------- | ---------------------------------------------- |
| H1 Title    | Too large, pushes CTA below fold | `text-4xl md:text-5xl lg:text-6xl` | `text-2xl sm:text-3xl md:text-5xl lg:text-6xl` |
| CTA Buttons | Inconsistent width on mobile     | -                                  | Add `w-full sm:w-auto`                         |
| Container   | Negative margin causes issues    | `-m-8`                             | Remove or use `mx-0` on mobile                 |

#### Symptoms Section

| Element       | Issue                     | Current | Fix                               |
| ------------- | ------------------------- | ------- | --------------------------------- |
| Description   | Text nearly touches edges | `px-4`  | `px-6`                            |
| Symptom Cards | Thin margins              | `gap-6` | Add `mx-2` to cards or use `px-6` |

#### Warning Card

| Element          | Issue                     | Current | Fix                                       |
| ---------------- | ------------------------- | ------- | ----------------------------------------- |
| Internal Padding | Too tight for mobile      | `p-6`   | `p-4 sm:p-6` but increase to `p-6 sm:p-6` |
| Icon Container   | Could be larger on mobile | -       | Maintain current                          |

#### Treatment Cards

| Element   | Issue                              | Current | Fix                          |
| --------- | ---------------------------------- | ------- | ---------------------------- |
| Card Text | Dense text causes poor readability | -       | Consider `text-sm` on mobile |

#### Final CTA Section

| Element                   | Issue                              | Current                | Fix                                |
| ------------------------- | ---------------------------------- | ---------------------- | ---------------------------------- |
| H2 "Está sofrendo..."     | Text may overflow on small screens | `text-4xl md:text-5xl` | `text-2xl sm:text-4xl md:text-5xl` |
| Badge "Consulta Gratuita" | Good size                          | -                      | OK                                 |

---

### Sobre Page (`/sobre`)

#### Hero Section

| Element                        | Issue               | Current                | Fix                                |
| ------------------------------ | ------------------- | ---------------------- | ---------------------------------- |
| H1 "Excelência em Odontologia" | Nearly edge-to-edge | `text-5xl md:text-6xl` | `text-3xl md:text-5xl lg:text-6xl` |

#### Team Section

| Element       | Issue                        | Current    | Fix                        |
| ------------- | ---------------------------- | ---------- | -------------------------- |
| Team Cards    | Horizontal layout too narrow | `flex-row` | Use `flex-col sm:flex-row` |
| Section Title | Too large                    | `text-4xl` | `text-2xl md:text-4xl`     |

#### Differentials Section

| Element                        | Issue                          | Critical   | Fix                               |
| ------------------------------ | ------------------------------ | ---------- | --------------------------------- |
| H2 "Diferenciais que Fazem..." | **Causes horizontal overflow** | `text-4xl` | `text-xl sm:text-2xl md:text-4xl` |
| Container                      | Insufficient padding           | `px-4`     | `px-6`                            |

#### Infrastructure Section

| Element       | Issue                  | Current    | Fix                             |
| ------------- | ---------------------- | ---------- | ------------------------------- |
| Section Title | Oversized              | `text-4xl` | `text-2xl md:text-4xl`          |
| Card Spacing  | Tight vertical spacing | -          | Increase `gap-y-6` to `gap-y-8` |

#### CTA Section

| Element                         | Issue                             | Critical               | Fix                                |
| ------------------------------- | --------------------------------- | ---------------------- | ---------------------------------- |
| H2 "Pronto para Transformar..." | **CRITICAL: Wider than viewport** | `text-4xl md:text-5xl` | `text-2xl sm:text-3xl md:text-5xl` |
| Description Text                | Awkward word wrap                 | -                      | Use `max-w-sm mx-auto` on mobile   |
| Button                          | Lacks side margins                | `w-full`               | Add `mx-4` to container            |

---

### Blog Page (`/blog`)

#### Featured Posts Section

| Element                  | Issue            | Current                         | Fix                    |
| ------------------------ | ---------------- | ------------------------------- | ---------------------- |
| H2 "Artigos em Destaque" | May overflow     | `text-4xl`                      | `text-2xl md:text-4xl` |
| Blog Cards Grid          | Stacks correctly | `md:grid-cols-2 lg:grid-cols-3` | OK                     |

#### Newsletter Section

| Element                     | Issue             | Current                | Fix                                |
| --------------------------- | ----------------- | ---------------------- | ---------------------------------- |
| H2 "Receba Nossas Dicas..." | Too wide          | `text-4xl md:text-5xl` | `text-2xl sm:text-3xl md:text-5xl` |
| Email Input + Button        | Layout correct    | `flex-col sm:flex-row` | OK                                 |
| Form Container              | Card padding good | `p-8`                  | OK                                 |

---

### Contato Page (`/contato`)

#### Hero Section

| Element           | Issue          | Current                | Fix                             |
| ----------------- | -------------- | ---------------------- | ------------------------------- |
| H1 "Fale Conosco" | Large but fits | `text-5xl md:text-6xl` | Consider `text-4xl md:text-6xl` |

#### Contact Information Cards

| Element       | Issue                        | Current                         | Fix                          |
| ------------- | ---------------------------- | ------------------------------- | ---------------------------- |
| 4-Column Grid | Stacks on mobile             | `md:grid-cols-2 lg:grid-cols-4` | OK                           |
| Card Content  | Email addresses may overflow | Long emails                     | Use `break-all` or `text-sm` |

#### Contact Form Section

| Element                   | Issue               | Current          | Fix                     |
| ------------------------- | ------------------- | ---------------- | ----------------------- |
| 2-Column Grid Inside Form | May stack awkwardly | `md:grid-cols-2` | Check form field widths |
| Privacy Policy Box        | Good padding        | -                | OK                      |

#### Location Section

| Element         | Issue           | Current | Fix           |
| --------------- | --------------- | ------- | ------------- |
| Map Placeholder | Height is fixed | `h-80`  | OK for mobile |
| Direction Cards | Good stacking   | -       | OK            |

#### WhatsApp Section

| Element       | Issue            | Current          | Fix |
| ------------- | ---------------- | ---------------- | --- |
| 3-Column Grid | Stacks on mobile | `md:grid-cols-3` | OK  |
| Cards         | Good padding     | -                | OK  |

#### Emergency Section

| Element                        | Issue      | Current    | Fix                    |
| ------------------------------ | ---------- | ---------- | ---------------------- |
| H2 "Atendimento de Emergência" | Long title | `text-4xl` | `text-2xl md:text-4xl` |

#### Final CTA Section

| Element                    | Issue           | Current                | Fix                                |
| -------------------------- | --------------- | ---------------------- | ---------------------------------- |
| H2 "Pronto para Cuidar..." | May be too wide | `text-4xl md:text-5xl` | `text-2xl sm:text-3xl md:text-5xl` |

---

### Footer (All Pages)

| Element          | Issue                     | Current          | Fix                            |
| ---------------- | ------------------------- | ---------------- | ------------------------------ |
| 3-Column Grid    | Stacks correctly          | `md:grid-cols-3` | OK                             |
| Company Name     | Large on mobile           | `text-2xl`       | Consider `text-xl md:text-2xl` |
| Social Icons     | Alignment could be better | -                | Use `justify-start`            |
| Vertical Spacing | Needs more separation     | `gap-8`          | Consider `gap-y-10` on mobile  |

---

## Priority Fixes

### Critical (Causes Horizontal Scroll)

1. **Sobre Page CTA heading** - `text-4xl md:text-5xl` → `text-2xl sm:text-3xl md:text-5xl`
2. **Sobre Page Differentials heading** - `text-4xl` → `text-xl sm:text-2xl md:text-4xl`

### High Priority

3. All `text-4xl` section headings (H2) should be `text-2xl md:text-4xl`
4. All `text-5xl md:text-6xl` page titles (H1) should be `text-3xl md:text-5xl lg:text-6xl`
5. Container padding should be `px-6` minimum on all sections

### Medium Priority

6. Sticky header scroll margin: Add `scroll-mt-24` to sections
7. Team cards on Sobre page: Use `flex-col sm:flex-row`
8. Hero CTA buttons: Add `w-full sm:w-auto`

### Low Priority

9. Footer company name size
10. Card vertical spacing adjustments

---

## Recommended Global CSS Changes

Add to `globals.css`:

```css
/* Mobile-first responsive headings */
@layer components {
  .heading-page {
    @apply text-3xl md:text-5xl lg:text-6xl;
  }

  .heading-section {
    @apply text-2xl md:text-4xl;
  }

  .heading-card {
    @apply text-lg md:text-xl;
  }
}

/* Scroll margin for sticky header */
section[id] {
  scroll-margin-top: 6rem;
}

/* Prevent horizontal overflow */
html,
body {
  overflow-x: hidden;
}
```

---

## Testing Recommendations

After implementing fixes, test on:

- iPhone SE (320px) - smallest common viewport
- iPhone 12/13/14 (390px)
- Android typical (360px)
- Android large (412px)

Use Chrome DevTools device emulation for consistent testing.
