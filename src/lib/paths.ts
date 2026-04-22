export const PATHS = {
    HOME: '/',
    PERSONNEL_LIST: '/',
    PERSONNEL_DETAIL: (id: string) => `/personnel/${id}`,
    PERSONNEL_NEW: '/personnel/new',
    PERSONNEL_EDIT: (id: string) => `/personnel/${id}/edit`,
};

export const ROUTES = {
    PERSONNEL_DETAIL: "/personnel/:id",
    PERSONNEL_EDIT: "/personnel/:id/edit",
}

export const PERSONNEL_EDIT_PATH = "/personnel/:id/edit";

export const PERSONNEL_LIST = "/";
export const PERSONNEL_DETAIL = "/personnel/:id"
export const PERSONNEL_FORM = "/personnel/new";