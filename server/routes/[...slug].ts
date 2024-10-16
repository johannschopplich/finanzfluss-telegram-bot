export default defineEventHandler((event) => {
  return sendRedirect(event, 'https://t.me/finanzfluss_bot', 302)
})
