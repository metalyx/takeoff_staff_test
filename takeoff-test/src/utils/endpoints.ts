export const POST_LOGIN = 'http://localhost:8000/auth/login';
export const GET_USERS = 'http://localhost:8000/users';
export const POST_USERS = 'http://localhost:8000/users';
export const PUT_USER = (id: number) => `http://localhost:8000/users/${id}`;
export const DELETE_USER = (id: number) => `http://localhost:8000/users/${id}`;
