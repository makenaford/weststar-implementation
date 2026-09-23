export const logo = () => `<span class="ws-logo" aria-hidden="true">${[1, 2, 3, 4, 5, 6].map((n) => `<img src="logo/v${n}.svg" alt="">`).join('')}</span>`;

export const appHeader = ({ active = 'Home', items = ['Home', 'Projects', 'Fleet', 'Messages', 'Billing', 'Documents'], unread = true } = {}) => `
<header class="ws-app-header" style="position:relative">
  <a class="ws-app-header__logo" href="#" aria-label="West Star Aviation home">${logo()}</a>
  <nav class="ws-navbar ws-navbar--inverted" aria-label="Main">
    ${items.map((i) => `<a class="ws-navbar__item" href="#"${i === active ? ' aria-current="page"' : ''}>${i}</a>`).join('')}
  </nav>
  <div class="ws-app-header__utility ws-navbar ws-navbar--inverted">
    <a class="ws-navbar__item ws-app-header__notifications" href="#">Notifications${unread ? '<img class="ws-app-header__dot" src="icons-extra/notification-dot.svg" alt=""><span class="ws-sr-only"> (unread)</span>' : ''}</a>
    <img class="ws-app-header__avatar" src="images/avatar-john.png" alt="John Carter">
  </div>
</header>`;

export default {
  title: 'Components/App header',
  excludeStories: /^[a-z]/,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Figma: Customer Dashboard "Primary Nav" (17986:1657). The portal top bar: WSA logo (six Figma vectors in assets/logo), Navigation Bar (Bar style, inverted), notifications with an unread dot, and the avatar. Sticky at the top of the page; wraps the nav onto its own scrolling row below 1100px.' } } },
  render: (args) => appHeader(args),
  argTypes: { active: { control: 'select', options: ['Home', 'Projects', 'Fleet', 'Messages', 'Billing', 'Documents'] } },
  args: { active: 'Home', unread: true },
};

export const Playground = {};
