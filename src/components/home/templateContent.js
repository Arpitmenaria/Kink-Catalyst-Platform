import { createId } from './sectionTemplates';

/* Pre-designed starter content for the "Templates" tab — pure frontend
   feature, no backend involvement.

   Templates are CATEGORY × THEME: each category defines the copy/structure
   (what sections exist, what they say), each theme defines the color
   palette (dark-section background/text/accent). Combining them gives real
   visual variety without hand-writing N unique full templates — swapping
   the theme on "Portfolio" gives a genuinely different-looking site, not
   just a different label on the same one.

   buildSections(theme) is a factory (not a static array) so every use gets
   fresh section ids — same reasoning as createStarterSections(): ids only
   need to be unique within one site, but two sites sharing literal id
   strings invites confusing bugs later. Nav/footer links are wired to the
   real sections built alongside them. */

export const THEMES = [
  { key: 'midnight', name: 'Midnight', swatch: ['#0f172a', '#3b82f6', '#f1f5f9'], dark: '#0f172a', darkText: '#f1f5f9', accent: '#3b82f6', accent2: '#60a5fa' },
  { key: 'sunset',   name: 'Sunset',   swatch: ['#7c2d12', '#f97316', '#fff7ed'], dark: '#7c2d12', darkText: '#fff7ed', accent: '#f97316', accent2: '#fb923c' },
  { key: 'minimal',  name: 'Minimal',  swatch: ['#111111', '#525252', '#ffffff'], dark: '#111111', darkText: '#ffffff', accent: '#111111', accent2: '#525252' },
  { key: 'forest',   name: 'Forest',   swatch: ['#14532d', '#22c55e', '#f0fdf4'], dark: '#14532d', darkText: '#f0fdf4', accent: '#22c55e', accent2: '#4ade80' },
  { key: 'royal',    name: 'Royal',    swatch: ['#312e81', '#8b5cf6', '#f5f3ff'], dark: '#312e81', darkText: '#f5f3ff', accent: '#8b5cf6', accent2: '#a78bfa' },
];

export const DEFAULT_THEME = THEMES[0];

function lightStyle(theme, overrides = {}) {
  return {
    background: '#ffffff', backgroundImage: '', overlayOpacity: 0.4,
    textColor: '#1f2937', accentColor: theme.accent,
    paddingTop: 60, paddingBottom: 60, align: 'center',
    borderRadius: 0, buttonRadius: 8, contentWidth: 'full',
    ...overrides,
  };
}

function darkStyle(theme, overrides = {}) {
  return lightStyle(theme, { background: theme.dark, textColor: theme.darkText, accentColor: theme.accent2, ...overrides });
}

function section(type, name, icon, content, styleObj) {
  return {
    id: createId(), type, name, icon, content, style: styleObj,
    visibleOnDesktop: true, visibleOnMobile: true,
  };
}

// ── Portfolio ──────────────────────────────────────────────────────────
function buildPortfolio(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '👋', headline: "Hi, I'm Your Name",
    subheadline: 'A short tagline about what you do and who you help.',
    primaryButtonText: 'View My Work', primaryButtonLink: '',
    secondaryButtonText: 'Get In Touch', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 100, paddingBottom: 100 }));

  const about = section('text', 'About', '📝', {
    icon: '🙋', headline: 'About Me',
    body: "Write a couple of sentences about your background, what you're great at, and what kind of work you're looking for. Keep it short — this is a summary, not a resume.",
  }, lightStyle(theme));

  const skills = section('grid', 'Skills', '⚙️', {
    headline: 'What I Do',
    items: [
      { icon: '🎨', title: 'Skill One', description: 'A short description of this skill or service.' },
      { icon: '💻', title: 'Skill Two', description: 'A short description of this skill or service.' },
      { icon: '📱', title: 'Skill Three', description: 'A short description of this skill or service.' },
      { icon: '🚀', title: 'Skill Four', description: 'A short description of this skill or service.' },
    ],
  }, lightStyle(theme));

  const work = section('gallery', 'Work', '🖼️', {
    headline: 'Selected Work',
    items: [
      { image: '', caption: 'Project One' }, { image: '', caption: 'Project Two' },
      { image: '', caption: 'Project Three' }, { image: '', caption: 'Project Four' },
    ],
  }, lightStyle(theme));

  const testimonials = section('testimonial', 'Testimonials', '💬', {
    headline: 'What People Say',
    items: [
      { quote: 'Add a short quote from someone you worked with here.', author: 'Client Name', role: 'Their Role' },
      { quote: 'Add another quote — social proof goes a long way.', author: 'Client Name', role: 'Their Role' },
    ],
  }, lightStyle(theme));

  const contact = section('form', 'Contact', '📧', {
    headline: "Let's Work Together", subheadline: "Send a message and I'll get back to you soon.",
    fields: [{ label: 'Your Name', type: 'text' }, { label: 'Your Email', type: 'email' }, { label: 'Your Message', type: 'textarea' }],
    submitButtonText: 'Send Message',
  }, lightStyle(theme));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Name. All rights reserved.`,
    links: [{ label: 'Home', url: `#${hero.id}` }, { label: 'About', url: `#${about.id}` }, { label: 'Contact', url: `#${contact.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${work.id}`;
  hero.content.secondaryButtonLink = `#${contact.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Your Name',
    links: [
      { label: 'Home', url: `#${hero.id}` }, { label: 'About', url: `#${about.id}` },
      { label: 'Work', url: `#${work.id}` }, { label: 'Contact', url: `#${contact.id}` },
    ],
    ctaText: 'Hire Me', ctaLink: `#${contact.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, about, skills, work, testimonials, contact, footer];
}

// ── Landing Page (SaaS) ───────────────────────────────────────────────
function buildLandingPage(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '🚀', headline: 'Your Product, Solved Simply',
    subheadline: "A one-sentence explanation of the problem you solve and who it's for.",
    primaryButtonText: 'Get Started', primaryButtonLink: '',
    secondaryButtonText: 'See Features', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 100, paddingBottom: 100 }));

  const features = section('grid', 'Features', '⚙️', {
    headline: 'Everything You Need',
    items: [
      { icon: '⚡', title: 'Feature One', description: 'Describe the benefit, not just the feature.' },
      { icon: '🔒', title: 'Feature Two', description: 'Describe the benefit, not just the feature.' },
      { icon: '📊', title: 'Feature Three', description: 'Describe the benefit, not just the feature.' },
      { icon: '🤝', title: 'Feature Four', description: 'Describe the benefit, not just the feature.' },
      { icon: '🔌', title: 'Feature Five', description: 'Describe the benefit, not just the feature.' },
      { icon: '📈', title: 'Feature Six', description: 'Describe the benefit, not just the feature.' },
    ],
  }, lightStyle(theme));

  const why = section('text', 'Why Us', '📝', {
    icon: '💡', headline: 'Why teams choose us',
    body: 'A couple of sentences on what makes this different from alternatives — the thing you\'d say if someone asked "why not just use X?"',
  }, lightStyle(theme));

  const testimonials = section('testimonial', 'Testimonials', '💬', {
    headline: 'Trusted by teams like yours',
    items: [
      { quote: 'Replace this with a real customer quote once you have one.', author: 'Customer Name', role: 'Title, Company' },
      { quote: 'Two quotes is usually enough to feel credible.', author: 'Customer Name', role: 'Title, Company' },
    ],
  }, lightStyle(theme));

  const cta = section('cta', 'CTA', '📣', {
    headline: 'Ready to get started?',
    subheadline: 'Add a line about how easy/fast signup is, or mention a free trial.',
    buttonText: 'Start Free Trial', buttonLink: '',
  }, darkStyle(theme, { paddingTop: 80, paddingBottom: 80 }));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
    links: [{ label: 'Features', url: `#${features.id}` }, { label: 'Contact', url: `#${cta.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${cta.id}`;
  hero.content.secondaryButtonLink = `#${features.id}`;
  cta.content.buttonLink = `#${cta.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Product Name',
    links: [{ label: 'Features', url: `#${features.id}` }, { label: 'Why Us', url: `#${why.id}` }, { label: 'Contact', url: `#${cta.id}` }],
    ctaText: 'Get Started', ctaLink: `#${cta.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, features, why, testimonials, cta, footer];
}

// ── Blog ───────────────────────────────────────────────────────────────
function buildBlog(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '✍️', headline: 'Welcome to Your Blog',
    subheadline: "A one-line description of what you write about and who it's for.",
    primaryButtonText: 'Read Latest', primaryButtonLink: '',
    secondaryButtonText: 'About Me', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 90, paddingBottom: 90 }));

  const about = section('text', 'About', '📝', {
    icon: '📖', headline: 'About This Blog',
    body: 'A short paragraph about why you started writing, what topics you cover, and how often you post. Personal and specific reads better than generic.',
  }, lightStyle(theme));

  const topics = section('grid', 'Topics', '⚙️', {
    headline: 'What I Write About',
    items: [
      { icon: '💭', title: 'Topic One', description: 'A short description of this category.' },
      { icon: '🛠️', title: 'Topic Two', description: 'A short description of this category.' },
      { icon: '🌱', title: 'Topic Three', description: 'A short description of this category.' },
    ],
  }, lightStyle(theme));

  const featured = section('gallery', 'Featured Posts', '🖼️', {
    headline: 'Featured Posts',
    items: [
      { image: '', caption: 'Post Title One' }, { image: '', caption: 'Post Title Two' },
      { image: '', caption: 'Post Title Three' }, { image: '', caption: 'Post Title Four' },
    ],
  }, lightStyle(theme));

  const subscribe = section('form', 'Subscribe', '📧', {
    headline: 'Get New Posts by Email', subheadline: "No spam — just a note whenever something new goes up.",
    fields: [{ label: 'Your Email', type: 'email' }], submitButtonText: 'Subscribe',
  }, lightStyle(theme));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Blog. All rights reserved.`,
    links: [{ label: 'Home', url: `#${hero.id}` }, { label: 'About', url: `#${about.id}` }, { label: 'Subscribe', url: `#${subscribe.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${featured.id}`;
  hero.content.secondaryButtonLink = `#${about.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Blog Name',
    links: [{ label: 'Home', url: `#${hero.id}` }, { label: 'Articles', url: `#${featured.id}` }, { label: 'About', url: `#${about.id}` }],
    ctaText: 'Subscribe', ctaLink: `#${subscribe.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, about, topics, featured, subscribe, footer];
}

// ── Event Page ─────────────────────────────────────────────────────────
function buildEventPage(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '🎉', headline: 'Your Event Name — Month Day, Year',
    subheadline: 'A short line about what the event is and why people should come.',
    primaryButtonText: 'Register Now', primaryButtonLink: '',
    secondaryButtonText: 'View Schedule', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 100, paddingBottom: 100 }));

  const about = section('text', 'About', '📝', {
    icon: 'ℹ️', headline: 'About the Event',
    body: "A paragraph describing the event — who it's for, what they'll get out of it, and what makes it worth attending.",
  }, lightStyle(theme));

  const schedule = section('grid', 'Schedule', '⚙️', {
    headline: 'Schedule Highlights',
    items: [
      { icon: '🕘', title: '9:00 AM — Opening', description: 'Welcome and introductions.' },
      { icon: '🎤', title: '11:00 AM — Keynote', description: 'Main stage session.' },
      { icon: '🍽️', title: '1:00 PM — Lunch', description: 'Networking break.' },
      { icon: '🎊', title: '4:00 PM — Closing', description: 'Wrap-up and thank yous.' },
    ],
  }, lightStyle(theme));

  const gallery = section('gallery', 'Venue', '🖼️', {
    headline: 'The Venue',
    items: [
      { image: '', caption: 'Main Hall' }, { image: '', caption: 'Networking Area' },
      { image: '', caption: 'Stage' }, { image: '', caption: 'Outdoor Space' },
    ],
  }, lightStyle(theme));

  const cta = section('cta', 'CTA', '📣', {
    headline: 'Seats are limited — register today.',
    subheadline: 'Add a line about pricing, deadlines, or early-bird discounts.',
    buttonText: 'Register Now', buttonLink: '',
  }, darkStyle(theme, { paddingTop: 80, paddingBottom: 80 }));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Event. All rights reserved.`,
    links: [{ label: 'About', url: `#${about.id}` }, { label: 'Schedule', url: `#${schedule.id}` }, { label: 'Register', url: `#${cta.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${cta.id}`;
  hero.content.secondaryButtonLink = `#${schedule.id}`;
  cta.content.buttonLink = `#${cta.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Event Name',
    links: [{ label: 'About', url: `#${about.id}` }, { label: 'Schedule', url: `#${schedule.id}` }, { label: 'Venue', url: `#${gallery.id}` }],
    ctaText: 'Register', ctaLink: `#${cta.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, about, schedule, gallery, cta, footer];
}

// ── Restaurant / Café ─────────────────────────────────────────────────
function buildRestaurant(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '🍽️', headline: 'Your Restaurant Name',
    subheadline: 'A short line about your food, atmosphere, or what makes you worth a visit.',
    primaryButtonText: 'View Menu', primaryButtonLink: '',
    secondaryButtonText: 'Reserve a Table', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 100, paddingBottom: 100 }));

  const about = section('text', 'Our Story', '📝', {
    icon: '🌿', headline: 'Our Story',
    body: 'A paragraph about how the restaurant started, your philosophy on food and ingredients, and what guests can expect when they visit.',
  }, lightStyle(theme));

  const menu = section('grid', 'Menu Highlights', '⚙️', {
    headline: 'Menu Highlights',
    items: [
      { icon: '🥗', title: 'Starter', description: 'Name and short description of a signature starter.' },
      { icon: '🍝', title: 'Main Course', description: 'Name and short description of a signature main.' },
      { icon: '🍰', title: 'Dessert', description: 'Name and short description of a signature dessert.' },
      { icon: '🍷', title: 'Drinks', description: 'A note about your wine list or drinks menu.' },
    ],
  }, lightStyle(theme));

  const gallery = section('gallery', 'Gallery', '🖼️', {
    headline: 'A Look Inside',
    items: [
      { image: '', caption: 'The Dining Room' }, { image: '', caption: 'Signature Dish' },
      { image: '', caption: 'The Bar' }, { image: '', caption: 'Private Dining' },
    ],
  }, lightStyle(theme));

  const testimonials = section('testimonial', 'Reviews', '💬', {
    headline: 'What Guests Say',
    items: [
      { quote: 'Swap in a real review once you have one.', author: 'Guest Name', role: 'Diner' },
      { quote: 'A second quote adds credibility.', author: 'Guest Name', role: 'Diner' },
    ],
  }, lightStyle(theme));

  const cta = section('cta', 'CTA', '📣', {
    headline: 'Tables fill up fast — reserve ahead.',
    subheadline: 'Add your booking phone number, hours, or a link to reservations.',
    buttonText: 'Reserve Now', buttonLink: '',
  }, darkStyle(theme, { paddingTop: 80, paddingBottom: 80 }));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Restaurant. All rights reserved.`,
    links: [{ label: 'Menu', url: `#${menu.id}` }, { label: 'Reserve', url: `#${cta.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${menu.id}`;
  hero.content.secondaryButtonLink = `#${cta.id}`;
  cta.content.buttonLink = `#${cta.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Restaurant Name',
    links: [{ label: 'Menu', url: `#${menu.id}` }, { label: 'Gallery', url: `#${gallery.id}` }, { label: 'Reviews', url: `#${testimonials.id}` }],
    ctaText: 'Reserve', ctaLink: `#${cta.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, about, menu, gallery, testimonials, cta, footer];
}

// ── Fitness / Coach ────────────────────────────────────────────────────
function buildFitness(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '💪', headline: 'Real Results, No Shortcuts',
    subheadline: '1-on-1 coaching built around your life, not a generic template.',
    primaryButtonText: 'Book Free Consult', primaryButtonLink: '',
    secondaryButtonText: 'See Results', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 100, paddingBottom: 100 }));

  const about = section('text', 'About', '📝', {
    icon: '🏋️', headline: 'Meet Your Coach',
    body: 'A couple of sentences about your certifications, experience, and coaching philosophy — what makes your approach different.',
  }, lightStyle(theme));

  const programs = section('grid', 'Programs', '⚙️', {
    headline: 'Programs',
    items: [
      { icon: '🏋️‍♂️', title: 'Strength Training', description: 'Short description of this program.' },
      { icon: '🥦', title: 'Nutrition Coaching', description: 'Short description of this program.' },
      { icon: '💻', title: 'Online Coaching', description: 'Short description of this program.' },
      { icon: '👥', title: 'Group Classes', description: 'Short description of this program.' },
    ],
  }, lightStyle(theme));

  const results = section('gallery', 'Results', '🖼️', {
    headline: 'Real Transformations',
    items: [
      { image: '', caption: 'Client — 12 Weeks' }, { image: '', caption: 'Client — 6 Months' },
      { image: '', caption: 'Client — 1 Year' }, { image: '', caption: 'Client — 16 Weeks' },
    ],
  }, lightStyle(theme));

  const testimonials = section('testimonial', 'Testimonials', '💬', {
    headline: 'Client Success Stories',
    items: [
      { quote: 'Swap in a real client quote once you have one.', author: 'Client Name', role: 'Client' },
      { quote: 'A second quote builds trust fast.', author: 'Client Name', role: 'Client' },
    ],
  }, lightStyle(theme));

  const contact = section('form', 'Contact', '📧', {
    headline: 'Book Your Free Consultation', subheadline: "Tell us about your goals and we'll follow up within 24 hours.",
    fields: [{ label: 'Your Name', type: 'text' }, { label: 'Your Email', type: 'email' }, { label: 'Your Goal', type: 'textarea' }],
    submitButtonText: 'Request Consult',
  }, lightStyle(theme));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Coaching Business. All rights reserved.`,
    links: [{ label: 'Programs', url: `#${programs.id}` }, { label: 'Contact', url: `#${contact.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${contact.id}`;
  hero.content.secondaryButtonLink = `#${results.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Coach Name',
    links: [{ label: 'Programs', url: `#${programs.id}` }, { label: 'Results', url: `#${results.id}` }, { label: 'About', url: `#${about.id}` }],
    ctaText: 'Book Free Consult', ctaLink: `#${contact.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, about, programs, results, testimonials, contact, footer];
}

// ── Photography ────────────────────────────────────────────────────────
function buildPhotography(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '📷', headline: 'Timeless Photography, Told Honestly',
    subheadline: 'Wedding, portrait, and editorial photography for people who want their story told well.',
    primaryButtonText: 'View Portfolio', primaryButtonLink: '',
    secondaryButtonText: 'Book a Session', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 110, paddingBottom: 110 }));

  const about = section('text', 'About', '📝', {
    icon: '🖤', headline: 'About the Studio',
    body: 'A paragraph about your background, how long you\'ve been shooting, and your style — natural light, documentary, editorial, whatever fits.',
  }, lightStyle(theme));

  const portfolio = section('gallery', 'Portfolio', '🖼️', {
    headline: 'Selected Work',
    items: [
      { image: '', caption: 'Wedding Series' }, { image: '', caption: 'Portrait Series' },
      { image: '', caption: 'Editorial Feature' }, { image: '', caption: 'Event Coverage' },
    ],
  }, lightStyle(theme));

  const services = section('grid', 'Services', '⚙️', {
    headline: 'Services',
    items: [
      { icon: '💍', title: 'Weddings', description: 'Full-day coverage, online gallery.' },
      { icon: '🧑‍🎨', title: 'Portraits', description: 'Studio or on-location sessions.' },
      { icon: '🎤', title: 'Events', description: 'Corporate events and private parties.' },
    ],
  }, lightStyle(theme));

  const testimonials = section('testimonial', 'Reviews', '💬', {
    headline: 'Kind Words',
    items: [
      { quote: 'Swap in a client testimonial once you have one.', author: 'Client Name', role: 'Client' },
      { quote: 'A second quote adds credibility.', author: 'Client Name', role: 'Client' },
    ],
  }, lightStyle(theme));

  const cta = section('cta', 'CTA', '📣', {
    headline: "Let's tell your story.",
    subheadline: 'Dates book up fast — inquire early.',
    buttonText: 'Check Availability', buttonLink: '',
  }, darkStyle(theme, { paddingTop: 80, paddingBottom: 80 }));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Studio. All rights reserved.`,
    links: [{ label: 'Portfolio', url: `#${portfolio.id}` }, { label: 'Contact', url: `#${cta.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${portfolio.id}`;
  hero.content.secondaryButtonLink = `#${cta.id}`;
  cta.content.buttonLink = `#${cta.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Studio Name',
    links: [{ label: 'Portfolio', url: `#${portfolio.id}` }, { label: 'Services', url: `#${services.id}` }, { label: 'About', url: `#${about.id}` }],
    ctaText: 'Book a Session', ctaLink: `#${cta.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, about, portfolio, services, testimonials, cta, footer];
}

// ── Agency / Business ──────────────────────────────────────────────────
function buildAgency(theme) {
  const hero = section('hero', 'Hero', '🎯', {
    icon: '💼', headline: 'We Help Businesses Grow',
    subheadline: 'A one-line summary of who you help and the outcome you deliver.',
    primaryButtonText: 'Start a Project', primaryButtonLink: '',
    secondaryButtonText: 'Our Work', secondaryButtonLink: '', image: '',
  }, darkStyle(theme, { align: 'left', paddingTop: 100, paddingBottom: 100 }));

  const services = section('grid', 'Services', '⚙️', {
    headline: 'What We Do',
    items: [
      { icon: '🎨', title: 'Service One', description: 'Short description of this service.' },
      { icon: '💻', title: 'Service Two', description: 'Short description of this service.' },
      { icon: '📈', title: 'Service Three', description: 'Short description of this service.' },
      { icon: '🤝', title: 'Service Four', description: 'Short description of this service.' },
    ],
  }, lightStyle(theme));

  const about = section('text', 'About', '📝', {
    icon: '🏢', headline: 'About Us',
    body: 'A paragraph about your team, how long you\'ve been in business, and the kind of clients you work best with.',
  }, lightStyle(theme));

  const work = section('gallery', 'Our Work', '🖼️', {
    headline: 'Recent Work',
    items: [
      { image: '', caption: 'Client Project One' }, { image: '', caption: 'Client Project Two' },
      { image: '', caption: 'Client Project Three' }, { image: '', caption: 'Client Project Four' },
    ],
  }, lightStyle(theme));

  const testimonials = section('testimonial', 'Testimonials', '💬', {
    headline: 'What Clients Say',
    items: [
      { quote: 'Swap in a real client quote once you have one.', author: 'Client Name', role: 'Title, Company' },
      { quote: 'A second quote builds credibility fast.', author: 'Client Name', role: 'Title, Company' },
    ],
  }, lightStyle(theme));

  const contact = section('form', 'Contact', '📧', {
    headline: "Let's Talk", subheadline: 'Tell us a bit about your project and we\'ll be in touch.',
    fields: [{ label: 'Your Name', type: 'text' }, { label: 'Work Email', type: 'email' }, { label: 'Project Details', type: 'textarea' }],
    submitButtonText: 'Send Inquiry',
  }, lightStyle(theme));

  const footer = section('footer', 'Footer', '🔗', {
    text: `© ${new Date().getFullYear()} Your Agency. All rights reserved.`,
    links: [{ label: 'Services', url: `#${services.id}` }, { label: 'Work', url: `#${work.id}` }, { label: 'Contact', url: `#${contact.id}` }],
  }, darkStyle(theme, { paddingTop: 40, paddingBottom: 40 }));

  hero.content.primaryButtonLink = `#${contact.id}`;
  hero.content.secondaryButtonLink = `#${work.id}`;

  const navbar = section('navbar', 'Navbar', '🧭', {
    logoText: 'Agency Name',
    links: [{ label: 'Services', url: `#${services.id}` }, { label: 'Work', url: `#${work.id}` }, { label: 'About', url: `#${about.id}` }],
    ctaText: 'Start a Project', ctaLink: `#${contact.id}`,
  }, darkStyle(theme, { paddingTop: 18, paddingBottom: 18, align: 'left' }));

  return [navbar, hero, services, about, work, testimonials, contact, footer];
}

export const CATEGORIES = [
  { key: 'portfolio',     name: 'Portfolio',     description: 'Showcase your work, skills, and contact info.',            buildSections: buildPortfolio },
  { key: 'landing-page',  name: 'Landing Page',  description: 'Product/SaaS page with features, testimonials, and a CTA.', buildSections: buildLandingPage },
  { key: 'blog',          name: 'Blog',          description: 'A blog front page with featured posts and a subscribe form.', buildSections: buildBlog },
  { key: 'event-page',    name: 'Event Page',    description: 'Event announcement with schedule, venue, and registration.', buildSections: buildEventPage },
  { key: 'restaurant',    name: 'Restaurant',    description: 'Menu, gallery, reviews, and reservations for a restaurant or café.', buildSections: buildRestaurant },
  { key: 'fitness',       name: 'Fitness / Coach', description: '1-on-1 coaching page with programs, results, and booking.', buildSections: buildFitness },
  { key: 'photography',   name: 'Photography',   description: 'Studio portfolio with gallery, services, and inquiries.',   buildSections: buildPhotography },
  { key: 'agency',        name: 'Agency / Business', description: 'Services, work samples, and a contact form for a studio or agency.', buildSections: buildAgency },
];

// Flat, ready-to-render list for the Templates tab. Each card gets a
// different default theme (cycling through THEMES) purely so the grid reads
// as visually varied out of the box — every card also carries the full
// theme list so the UI can offer "try a different look" without needing a
// separate category-then-theme flow.
export const SITE_TEMPLATES = CATEGORIES.map((c, i) => {
  const defaultTheme = THEMES[i % THEMES.length];
  return {
    ...c,
    theme: defaultTheme,
    themes: THEMES,
    buildSections: (theme = defaultTheme) => c.buildSections(theme),
  };
});
