export const AUTH_COOKIES = {
  ACCESS: "token",
  REFRESH: "refreshToken",
  LOGGED_IN: "bt_logged_in",
} as const;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const ENDPOINTS = {
  SEND_CODE: "/auth/send-code",
  VERIFY_CODE: "/auth/verify-code",
  SIGN_OUT: "/auth/signout",

  ABOUT: "/pages/about",

  ARTICLES: "/articles",
  ADMIN_ARTICLES: "/articles/admin",

  CATEGORIES: "/categories",
  CATEGORY_TREE: "/categories/tree",
  ADMIN_CATEGORIES: "/categories/admin",

  PRODUCTS: "/products",
  ADMIN_PRODUCTS: "/products/admin",

  MENU: "/menu",
  ADMIN_MENU: "/menu/admin",

  CART: "/cart",
  CART_ITEMS: "/cart/items",
  CART_SYNC: "/cart/sync",
  CART_DISCOUNT: "/cart/discount",
  ADMIN_CARTS: "/cart/admin",

  WISHLIST: "/wishlist",
  WISHLIST_TOGGLE: "/wishlist/toggle",

  ORDERS: "/orders",
  MY_ORDERS: "/orders/me",
  MY_ORDERS_CANCEL: "/orders/me/cancel",
  MY_ORDERS_DELIVERED: "/orders/me/delivered",
  ADMIN_ORDERS: "/orders/admin",
  ORDERS_SHIP: "/orders/ship",
  ORDERS_CANCEL: "/orders/cancel",
  ORDERS_CANCEL_ITEM: "/orders/cancel-item",

  COMMENTS: "/comments",
  LATEST_COMMENTS: "/comments/latest",
  MY_COMMENTS: "/comments/me",
  ADMIN_COMMENTS: "/comments/admin",
  COMMENTS_ACCEPT: "/comments/accept",
  COMMENTS_REJECT: "/comments/reject",
  COMMENTS_REPLY: "/comments/reply",

  CONTACTS: "/contacts",
  MY_CONTACTS: "/contacts/me",
  ADMIN_CONTACTS: "/contacts/admin",
  CONTACTS_REPLY: "/contacts/reply",

  RESERVATIONS: "/reservations",
  MY_RESERVATIONS: "/reservations/me",
  MY_RESERVATIONS_CANCEL: "/reservations/me/cancel",
  ADMIN_RESERVATIONS: "/reservations/admin",
  RESERVATIONS_CANCEL: "/reservations/cancel",

  TICKETS: "/tickets",
  MY_TICKETS: "/tickets/me",
  ADMIN_TICKETS: "/tickets/admin",
  ADMIN_TICKET_STATS: "/tickets/admin/stats",
  TICKETS_REPLY: "/tickets/reply",

  MY_NOTIFICATIONS: "/notifications/me",
  ADMIN_NOTIFICATIONS: "/notifications/admin",
  NOTIFICATIONS_READ: "/notifications/read",

  MY_DASHBOARD: "/dashboard/me",
  ADMIN_DASHBOARD: "/dashboard/admin",

  USERS: "/users",
  USERS_BANNED: "/users/banned",
  USERS_BAN: "/users/ban",
  USERS_UNBAN: "/users/unban",
  PROFILE: "/users/profile",
} as const;

export const ARTICLES_PER_PAGE = 9;
export const WISHLIST_PER_PAGE = 12;
export const PRODUCTS_PER_PAGE = 12;
export const HOME_PRODUCTS = 12;
export const COMMENTS_PER_PAGE = 5;
export const ADMIN_PER_PAGE = 20;
export const ACCOUNT_PER_PAGE = 10;

export const GUEST_CART_KEY = "bluetea_guest_cart";

export const ROUTES = {
  LOGIN: "/login-register",
  CART: "/cart",
  PAYMENT_RESULT: "/checkout/result",
  ACCOUNT: "/account",
  ADMIN: "/p-admin",
  HOME: "/",
} as const;