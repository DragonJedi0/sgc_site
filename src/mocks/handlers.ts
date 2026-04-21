import { http, HttpResponse } from 'msw';
import { mockPersonnel } from '../lib/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const handlers = [
  http.get(`${supabaseUrl}/rest/v1/personnel`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); // 'id' => 'eq.{id}'
    const index = id ? Number(id.slice(3)) - 1 : 0;

    if(id) return HttpResponse.json(mockPersonnel[index]);

    return HttpResponse.json(mockPersonnel);
  }),

  http.delete(`${supabaseUrl}/rest/v1/personnel`, () =>{
    return HttpResponse.json({});
  }),
];